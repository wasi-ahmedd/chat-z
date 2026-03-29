import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'vibechat-secret-change-in-production'
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://127.0.0.1:5173'
const SESSION_COOKIE = 'vibechat_session'
const SESSION_TTL_MS = 24 * 60 * 60 * 1000
const VALID_GENDERS = ['male', 'female', 'other']
const VALID_FILTER_GENDERS = ['male', 'female', 'both']
const VALID_INTEREST_TIMEOUTS = [5, 10, 15]
const MAX_INTERESTS = 5
const MAX_INTEREST_LENGTH = 32
const MAX_MESSAGE_LENGTH = 2000

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true
  }
})

app.use(cors({ origin: CORS_ORIGIN, credentials: true }))
app.use(express.json())

const users = new Map()
const matchQueue = []
const activeMatches = new Map()
const friendThreads = new Map()
const socketIdsByUserId = new Map()
const analytics = {
  totalUsers: 0,
  totalChats: 0,
  totalMessages: 0,
  premiumUsers: 0,
  revenue: 0,
  dailyStats: {},
  chatsByHour: new Array(24).fill(0),
  usersByCountry: {},
  activeNow: 0
}

function generateAnonymousName() {
  const adjectives = [
    'Cosmic', 'Silent', 'Neon', 'Pixel', 'Lunar', 'Frost',
    'Echo', 'Velvet', 'Wild', 'Crystal', 'Dark', 'Golden',
    'Azure', 'Phantom', 'Silver', 'Blaze', 'Mystic', 'Radiant',
    'Serene', 'Vivid', 'Dreamy', 'Electric', 'Twilight', 'Stellar'
  ]
  const nouns = [
    'Wanderer', 'Wave', 'Fox', 'Dancer', 'Shadow', 'Storm',
    'Sky', 'Spark', 'Edge', 'Bloom', 'Drift', 'Wind',
    'Rain', 'Spirit', 'Flame', 'Whisper', 'River', 'Phoenix',
    'Comet', 'Star', 'Falcon', 'Aurora', 'Ember', 'Breeze'
  ]

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adj} ${noun}`
}

function createToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' })
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((accumulator, entry) => {
      const separatorIndex = entry.indexOf('=')
      if (separatorIndex === -1) {
        return accumulator
      }

      const key = decodeURIComponent(entry.slice(0, separatorIndex).trim())
      const value = decodeURIComponent(entry.slice(separatorIndex + 1).trim())
      accumulator[key] = value
      return accumulator
    }, {})
}

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length)
  }

  const cookies = parseCookies(req.headers.cookie)
  return cookies[SESSION_COOKIE] || null
}

function getAuthenticatedUserId(req) {
  const decoded = verifyToken(getTokenFromRequest(req))
  return decoded?.userId || null
}

function issueSessionCookie(res, userId) {
  res.cookie(SESSION_COOKIE, createToken(userId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_MS,
    path: '/'
  })
}

function stripTags(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, '')
    .trim()
}

function sanitizeInterests(interests) {
  if (!Array.isArray(interests)) {
    return []
  }

  return [...new Set(interests
    .map((interest) => stripTags(interest).slice(0, MAX_INTEREST_LENGTH))
    .filter(Boolean))]
    .slice(0, MAX_INTERESTS)
}

function sanitizeGender(gender) {
  const normalized = String(gender ?? '').toLowerCase().trim()
  return VALID_GENDERS.includes(normalized) ? normalized : null
}

function sanitizeFilterGender(filterGender) {
  const normalized = String(filterGender ?? '').toLowerCase().trim()
  return VALID_FILTER_GENDERS.includes(normalized) ? normalized : 'both'
}

function sanitizeInterestTimeoutSeconds(rawValue) {
  if (rawValue === 'forever' || rawValue === null) {
    return null
  }

  const numericValue = Number(rawValue)
  return VALID_INTEREST_TIMEOUTS.includes(numericValue) ? numericValue : 10
}

function todayKey() {
  return new Date().toISOString().split('T')[0]
}

function updateDailyStats(field) {
  const day = todayKey()
  if (!analytics.dailyStats[day]) {
    analytics.dailyStats[day] = { users: 0, chats: 0, messages: 0, revenue: 0 }
  }

  analytics.dailyStats[day][field] += 1
}

function createUser(userId) {
  return {
    id: userId,
    username: generateAnonymousName(),
    gender: null,
    isPremium: false,
    subscription: null,
    matchPreferences: {
      withInterests: true,
      genderFilter: 'both',
      interestTimeout: 10
    },
    badges: [],
    createdAt: new Date().toISOString(),
    incomingFollowRequests: [],
    outgoingFollowRequests: [],
    friends: [],
    notifications: []
  }
}

function getUser(userId) {
  return users.get(userId) || null
}

function buildClientUser(userId) {
  const user = getUser(userId)
  if (!user) {
    return null
  }

  return {
    id: user.id,
    username: user.username,
    gender: user.gender,
    isPremium: user.isPremium,
    subscription: user.subscription,
    matchPreferences: user.matchPreferences,
    badges: user.badges,
    createdAt: user.createdAt
  }
}

function registerSocket(userId, socketId) {
  if (!socketIdsByUserId.has(userId)) {
    socketIdsByUserId.set(userId, new Set())
  }

  socketIdsByUserId.get(userId).add(socketId)
}

function unregisterSocket(userId, socketId) {
  const socketIds = socketIdsByUserId.get(userId)
  if (!socketIds) {
    return
  }

  socketIds.delete(socketId)
  if (socketIds.size === 0) {
    socketIdsByUserId.delete(userId)
  }
}

function emitToUser(userId, eventName, payload) {
  const socketIds = socketIdsByUserId.get(userId)
  if (!socketIds) {
    return
  }

  for (const socketId of socketIds) {
    io.to(socketId).emit(eventName, payload)
  }
}

function removeFromQueue(userId) {
  const queueIndex = matchQueue.findIndex((entry) => entry.userId === userId)
  if (queueIndex >= 0) {
    matchQueue.splice(queueIndex, 1)
    return true
  }

  return false
}

function isParticipant(match, userId) {
  return match.user1.userId === userId || match.user2.userId === userId
}

function getPartnerEntry(match, userId) {
  return match.user1.userId === userId ? match.user2 : match.user1
}

function getPartnerSocket(match, userId) {
  const partnerEntry = getPartnerEntry(match, userId)
  return io.sockets.sockets.get(partnerEntry.socketId) || null
}

function getPublicUserData(userId, fallbackGender = null) {
  const user = getUser(userId)
  return {
    id: userId,
    username: user?.username || 'Stranger',
    gender: user?.gender || fallbackGender,
    isPremium: Boolean(user?.isPremium)
  }
}

function serializeMatchForUser(matchId, match, userId) {
  if (!isParticipant(match, userId)) {
    return null
  }

  const partnerEntry = getPartnerEntry(match, userId)
  return {
    matchId,
    partner: getPublicUserData(partnerEntry.userId, partnerEntry.gender),
    sharedInterests: match.sharedInterests,
    startedAt: match.startedAt,
    messages: match.messages.map((message) => ({
      id: message.id,
      text: message.text,
      timestamp: message.timestamp,
      fromSelf: message.sender === userId
    }))
  }
}

function endMatch(matchId, disconnectingUserId = null) {
  const match = activeMatches.get(matchId)
  if (!match) {
    return false
  }

  activeMatches.delete(matchId)

  const participantSockets = [match.user1.socketId, match.user2.socketId]
    .map((socketId) => io.sockets.sockets.get(socketId))
    .filter(Boolean)

  for (const participantSocket of participantSockets) {
    participantSocket.data.currentMatchId = null
  }

  if (disconnectingUserId) {
    const partnerSocket = getPartnerSocket(match, disconnectingUserId)
    partnerSocket?.emit('partner_disconnected')
  }

  return true
}

function getFriendThreadKey(userIdA, userIdB) {
  return [userIdA, userIdB].sort().join(':')
}

function getOrCreateFriendThread(userIdA, userIdB) {
  const threadKey = getFriendThreadKey(userIdA, userIdB)
  if (!friendThreads.has(threadKey)) {
    friendThreads.set(threadKey, {
      id: uuidv4(),
      participants: [userIdA, userIdB].sort(),
      messages: [],
      messageIds: new Set(),
      unreadCounts: {
        [userIdA]: 0,
        [userIdB]: 0
      }
    })
  }

  return friendThreads.get(threadKey)
}

function getFriendThread(userIdA, userIdB) {
  return friendThreads.get(getFriendThreadKey(userIdA, userIdB)) || null
}

function areFriends(userId, friendId) {
  const user = getUser(userId)
  return Boolean(user?.friends.some((friend) => friend.userId === friendId))
}

function getRelationshipState(viewerId, otherUserId) {
  const viewer = getUser(viewerId)
  if (!viewer || !otherUserId || viewerId === otherUserId) {
    return {
      isSelf: viewerId === otherUserId,
      isFriend: false,
      outgoingRequest: false,
      incomingRequest: false
    }
  }

  return {
    isSelf: false,
    isFriend: viewer.friends.some((friend) => friend.userId === otherUserId),
    outgoingRequest: viewer.outgoingFollowRequests.some((request) => request.targetUserId === otherUserId),
    incomingRequest: viewer.incomingFollowRequests.some((request) => request.fromUserId === otherUserId)
  }
}

function serializeFriendMessage(message, currentUserId) {
  return {
    id: message.id,
    text: message.text,
    timestamp: message.timestamp,
    fromSelf: message.sender === currentUserId
  }
}

function serializeFriendSummary(currentUserId, friendId) {
  const friend = getUser(friendId)
  if (!friend) {
    return null
  }

  const thread = getFriendThread(currentUserId, friendId)
  const lastMessage = thread?.messages.at(-1) || null
  const friendMeta = getUser(currentUserId)?.friends.find((entry) => entry.userId === friendId)

  return {
    id: friendId,
    username: friend.username,
    gender: friend.gender,
    isPremium: Boolean(friend.isPremium),
    since: friendMeta?.since || null,
    unreadCount: thread?.unreadCounts[currentUserId] || 0,
    lastMessagePreview: lastMessage ? lastMessage.text.slice(0, 80) : '',
    lastMessageAt: lastMessage?.timestamp || null
  }
}

function serializeSocialState(userId) {
  const user = getUser(userId)
  if (!user) {
    return null
  }

  const incomingRequests = user.incomingFollowRequests.map((request) => ({
    id: request.id,
    createdAt: request.createdAt,
    user: getPublicUserData(request.fromUserId)
  }))

  const acceptedNotifications = user.notifications
    .filter((notification) => notification.type === 'follow_accepted')
    .map((notification) => ({
      id: notification.id,
      createdAt: notification.createdAt,
      read: notification.read,
      user: getPublicUserData(notification.actorUserId),
      message: notification.message
    }))

  const friends = user.friends
    .map((friend) => serializeFriendSummary(userId, friend.userId))
    .filter(Boolean)
    .sort((left, right) => {
      const leftTime = left?.lastMessageAt ? new Date(left.lastMessageAt).getTime() : 0
      const rightTime = right?.lastMessageAt ? new Date(right.lastMessageAt).getTime() : 0
      if (leftTime !== rightTime) {
        return rightTime - leftTime
      }

      return left.username.localeCompare(right.username)
    })

  return {
    incomingRequests,
    acceptedNotifications,
    outgoingRequestUserIds: user.outgoingFollowRequests.map((request) => request.targetUserId),
    friendUserIds: user.friends.map((friend) => friend.userId),
    friends,
    counts: {
      incomingRequests: incomingRequests.length,
      acceptedNotifications: acceptedNotifications.filter((notification) => !notification.read).length,
      totalFriendUnread: friends.reduce((sum, friend) => sum + (friend.unreadCount || 0), 0)
    }
  }
}

function emitSocialState(userId) {
  const socialState = serializeSocialState(userId)
  if (socialState) {
    emitToUser(userId, 'social_state', socialState)
  }
}

function markAcceptedNotificationsRead(userId) {
  const user = getUser(userId)
  if (!user) {
    return
  }

  user.notifications = user.notifications.map((notification) => (
    notification.type === 'follow_accepted'
      ? { ...notification, read: true }
      : notification
  ))
}

function removeFollowRequestPair(fromUserId, targetUserId) {
  const fromUser = getUser(fromUserId)
  const targetUser = getUser(targetUserId)
  if (!fromUser || !targetUser) {
    return
  }

  fromUser.outgoingFollowRequests = fromUser.outgoingFollowRequests.filter((request) => request.targetUserId !== targetUserId)
  targetUser.incomingFollowRequests = targetUser.incomingFollowRequests.filter((request) => request.fromUserId !== fromUserId)
}

function addFriendship(userIdA, userIdB) {
  const userA = getUser(userIdA)
  const userB = getUser(userIdB)
  if (!userA || !userB) {
    return
  }

  const since = new Date().toISOString()
  if (!userA.friends.some((friend) => friend.userId === userIdB)) {
    userA.friends.push({ userId: userIdB, since })
  }

  if (!userB.friends.some((friend) => friend.userId === userIdA)) {
    userB.friends.push({ userId: userIdA, since })
  }
}

function addNotification(userId, notification) {
  const user = getUser(userId)
  if (user) {
    user.notifications.unshift(notification)
  }
}

function createProfilePayload(viewerUserId, targetUserId) {
  const targetUser = getUser(targetUserId)
  if (!targetUser) {
    return null
  }

  return {
    ...getPublicUserData(targetUserId),
    createdAt: targetUser.createdAt,
    relationship: getRelationshipState(viewerUserId, targetUserId)
  }
}

function broadcastQueuePositions() {
  matchQueue.forEach((entry, index) => {
    emitToUser(entry.userId, 'queue_joined', {
      position: index + 1,
      interestFallbackStarted: Boolean(entry.fallbackNotified)
    })
  })
}

function entryAllowsFallback(entry) {
  if (!entry.withInterests || entry.interests.length === 0) {
    return true
  }

  if (entry.interestTimeoutMs === null) {
    return false
  }

  return Date.now() - entry.joinedAt >= entry.interestTimeoutMs
}

function maybeNotifyInterestFallback(entry) {
  if (entry.fallbackNotified || !entry.withInterests || entry.interests.length === 0) {
    return
  }

  if (!entryAllowsFallback(entry)) {
    return
  }

  entry.fallbackNotified = true
  emitToUser(entry.userId, 'interest_fallback_started', { fallbackStarted: true })
}

function canEntriesMatch(leftEntry, rightEntry) {
  if (leftEntry.userId === rightEntry.userId) {
    return null
  }

  if (leftEntry.isPremium && leftEntry.filterGender !== 'both' && rightEntry.gender !== leftEntry.filterGender) {
    return null
  }

  if (rightEntry.isPremium && rightEntry.filterGender !== 'both' && leftEntry.gender !== rightEntry.filterGender) {
    return null
  }

  const sharedInterests = leftEntry.interests.filter((interest) => rightEntry.interests.includes(interest))
  const leftNeedsShared = leftEntry.withInterests && leftEntry.interests.length > 0 && !entryAllowsFallback(leftEntry)
  const rightNeedsShared = rightEntry.withInterests && rightEntry.interests.length > 0 && !entryAllowsFallback(rightEntry)

  if ((leftNeedsShared || rightNeedsShared) && sharedInterests.length === 0) {
    return null
  }

  return { sharedInterests }
}

function processQueue() {
  for (const entry of matchQueue) {
    maybeNotifyInterestFallback(entry)
  }

  let foundMatch = true
  while (foundMatch) {
    foundMatch = false

    for (let leftIndex = 0; leftIndex < matchQueue.length; leftIndex += 1) {
      const leftEntry = matchQueue[leftIndex]
      if (!io.sockets.sockets.get(leftEntry.socketId)) {
        matchQueue.splice(leftIndex, 1)
        leftIndex -= 1
        continue
      }

      for (let rightIndex = leftIndex + 1; rightIndex < matchQueue.length; rightIndex += 1) {
        const rightEntry = matchQueue[rightIndex]
        if (!io.sockets.sockets.get(rightEntry.socketId)) {
          matchQueue.splice(rightIndex, 1)
          rightIndex -= 1
          continue
        }

        const matchDecision = canEntriesMatch(leftEntry, rightEntry)
        if (!matchDecision) {
          continue
        }

        matchQueue.splice(rightIndex, 1)
        matchQueue.splice(leftIndex, 1)

        const matchId = uuidv4()
        const match = {
          user1: leftEntry,
          user2: rightEntry,
          sharedInterests: matchDecision.sharedInterests,
          startedAt: Date.now(),
          messages: [],
          messageIds: new Set()
        }

        activeMatches.set(matchId, match)
        const leftSocket = io.sockets.sockets.get(leftEntry.socketId)
        const rightSocket = io.sockets.sockets.get(rightEntry.socketId)
        if (leftSocket && rightSocket) {
          leftSocket.data.currentMatchId = matchId
          rightSocket.data.currentMatchId = matchId
          analytics.totalChats += 1
          analytics.chatsByHour[new Date().getHours()] += 1
          updateDailyStats('chats')

          leftSocket.emit('match_found', {
            matchId,
            partner: getPublicUserData(rightEntry.userId, rightEntry.gender),
            sharedInterests: matchDecision.sharedInterests
          })

          rightSocket.emit('match_found', {
            matchId,
            partner: getPublicUserData(leftEntry.userId, leftEntry.gender),
            sharedInterests: matchDecision.sharedInterests
          })
        }

        foundMatch = true
        break
      }

      if (foundMatch) {
        break
      }
    }
  }

  broadcastQueuePositions()
}

setInterval(() => {
  processQueue()
}, 1000)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

app.post('/api/auth/signup', (req, res) => {
  const userId = uuidv4()
  const user = createUser(userId)

  users.set(userId, user)
  issueSessionCookie(res, userId)
  analytics.totalUsers += 1
  updateDailyStats('users')

  res.status(201).json({ user: buildClientUser(userId) })
})

app.get('/api/users/me', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = buildClientUser(userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  return res.json(user)
})

app.patch('/api/users/me', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = getUser(userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  if (
    req.body.isPremium !== undefined ||
    req.body.badges !== undefined ||
    req.body.subscription !== undefined
  ) {
    return res.status(400).json({ error: 'Validation failed: cannot modify protected fields' })
  }

  const nextGender = req.body.gender === undefined ? user.gender : sanitizeGender(req.body.gender)
  if (req.body.gender !== undefined && !nextGender) {
    return res.status(400).json({ error: 'Invalid gender value' })
  }

  const nextPreferences = { ...user.matchPreferences }
  if (req.body.matchPreferences) {
    const nextFilter = sanitizeFilterGender(req.body.matchPreferences.genderFilter)
    if (nextFilter !== 'both' && !user.isPremium) {
      return res.status(403).json({
        error: 'Gender filter requires premium subscription',
        code: 'PREMIUM_REQUIRED'
      })
    }

    nextPreferences.genderFilter = nextFilter

    if (req.body.matchPreferences.withInterests !== undefined) {
      nextPreferences.withInterests = Boolean(req.body.matchPreferences.withInterests)
    }

    if (req.body.matchPreferences.interestTimeout !== undefined) {
      nextPreferences.interestTimeout = sanitizeInterestTimeoutSeconds(req.body.matchPreferences.interestTimeout)
    }
  }

  user.gender = nextGender
  user.matchPreferences = nextPreferences

  return res.json(buildClientUser(userId))
})

app.get('/api/users/:userId/profile', (req, res) => {
  const viewerUserId = getAuthenticatedUserId(req)
  if (!viewerUserId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const profile = createProfilePayload(viewerUserId, req.params.userId)
  if (!profile) {
    return res.status(404).json({ error: 'User not found' })
  }

  return res.json(profile)
})

app.get('/api/social/state', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const socialState = serializeSocialState(userId)
  if (!socialState) {
    return res.status(404).json({ error: 'User not found' })
  }

  return res.json(socialState)
})

app.post('/api/social/notifications/read', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.body.type === 'accepted') {
    markAcceptedNotificationsRead(userId)
  }

  emitSocialState(userId)
  return res.json({ ok: true })
})

app.post('/api/friends/requests', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const targetUserId = stripTags(req.body.targetUserId)
  if (!targetUserId || targetUserId === userId) {
    return res.status(400).json({ error: 'Choose a valid user to follow.' })
  }

  const user = getUser(userId)
  const targetUser = getUser(targetUserId)
  if (!user || !targetUser) {
    return res.status(404).json({ error: 'User not found' })
  }

  if (areFriends(userId, targetUserId)) {
    return res.status(409).json({ error: 'You are already friends.' })
  }

  if (user.outgoingFollowRequests.some((request) => request.targetUserId === targetUserId)) {
    return res.status(409).json({ error: 'Follow request already sent.' })
  }

  if (user.incomingFollowRequests.some((request) => request.fromUserId === targetUserId)) {
    return res.status(409).json({ error: 'That user already sent you a request.' })
  }

  const requestId = uuidv4()
  const createdAt = new Date().toISOString()
  user.outgoingFollowRequests.unshift({ id: requestId, targetUserId, createdAt })
  targetUser.incomingFollowRequests.unshift({ id: requestId, fromUserId: userId, createdAt })

  emitSocialState(userId)
  emitSocialState(targetUserId)

  return res.status(201).json({
    ok: true,
    requestId,
    relationship: getRelationshipState(userId, targetUserId)
  })
})

app.post('/api/friends/requests/:requestId/accept', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = getUser(userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const incomingRequest = user.incomingFollowRequests.find((request) => request.id === req.params.requestId)
  if (!incomingRequest) {
    return res.status(404).json({ error: 'Request not found' })
  }

  const fromUserId = incomingRequest.fromUserId
  removeFollowRequestPair(fromUserId, userId)
  addFriendship(fromUserId, userId)
  getOrCreateFriendThread(fromUserId, userId)

  addNotification(fromUserId, {
    id: uuidv4(),
    type: 'follow_accepted',
    actorUserId: userId,
    createdAt: new Date().toISOString(),
    read: false,
    message: `${getPublicUserData(userId).username} accepted your follow request.`
  })

  emitSocialState(fromUserId)
  emitSocialState(userId)

  return res.json({
    ok: true,
    friend: getPublicUserData(fromUserId)
  })
})

app.post('/api/friends/requests/:requestId/decline', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = getUser(userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const incomingRequest = user.incomingFollowRequests.find((request) => request.id === req.params.requestId)
  if (!incomingRequest) {
    return res.status(404).json({ error: 'Request not found' })
  }

  removeFollowRequestPair(incomingRequest.fromUserId, userId)
  emitSocialState(incomingRequest.fromUserId)
  emitSocialState(userId)
  return res.json({ ok: true })
})

app.get('/api/friends', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const socialState = serializeSocialState(userId)
  return res.json({ friends: socialState?.friends || [] })
})

app.get('/api/friends/:friendId/messages', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const friendId = stripTags(req.params.friendId)
  if (!areFriends(userId, friendId)) {
    return res.status(403).json({ error: 'Only friends can chat directly.' })
  }

  const thread = getOrCreateFriendThread(userId, friendId)
  thread.unreadCounts[userId] = 0
  emitSocialState(userId)

  return res.json({
    friend: serializeFriendSummary(userId, friendId),
    messages: thread.messages.map((message) => serializeFriendMessage(message, userId))
  })
})

app.post('/api/friends/:friendId/read', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const friendId = stripTags(req.params.friendId)
  if (!areFriends(userId, friendId)) {
    return res.status(403).json({ error: 'Only friends can chat directly.' })
  }

  const thread = getOrCreateFriendThread(userId, friendId)
  thread.unreadCounts[userId] = 0
  emitSocialState(userId)
  return res.json({ ok: true })
})

app.get('/api/match/active', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  for (const [matchId, match] of activeMatches.entries()) {
    const serializedMatch = serializeMatchForUser(matchId, match, userId)
    if (serializedMatch) {
      return res.json(serializedMatch)
    }
  }

  return res.json({ match: null })
})

app.get('/api/analytics/overview', (req, res) => {
  const apiKey = req.headers['x-api-key']
  if (apiKey !== (process.env.ANALYTICS_API_KEY || 'vibe-admin-key')) {
    return res.status(403).json({ error: 'Invalid API key' })
  }

  return res.json({
    totalUsers: analytics.totalUsers,
    totalChats: analytics.totalChats,
    totalMessages: analytics.totalMessages,
    premiumUsers: analytics.premiumUsers,
    revenue: analytics.revenue,
    activeNow: io.engine.clientsCount || 0,
    queueSize: matchQueue.length,
    activeMatches: activeMatches.size,
    dailyStats: analytics.dailyStats,
    chatsByHour: analytics.chatsByHour,
    timestamp: new Date().toISOString()
  })
})

app.get('/api/analytics/earnings', (req, res) => {
  const apiKey = req.headers['x-api-key']
  if (apiKey !== (process.env.ANALYTICS_API_KEY || 'vibe-admin-key')) {
    return res.status(403).json({ error: 'Invalid API key' })
  }

  const dailyEarnings = {}
  for (const [day, stats] of Object.entries(analytics.dailyStats)) {
    dailyEarnings[day] = {
      ...stats,
      revenue: stats.revenue || 0
    }
  }

  return res.json({
    totalRevenue: analytics.revenue,
    premiumSubscribers: analytics.premiumUsers,
    dailyBreakdown: dailyEarnings,
    currency: 'INR',
    timestamp: new Date().toISOString()
  })
})

app.get('/api/analytics/users', (req, res) => {
  const apiKey = req.headers['x-api-key']
  if (apiKey !== (process.env.ANALYTICS_API_KEY || 'vibe-admin-key')) {
    return res.status(403).json({ error: 'Invalid API key' })
  }

  return res.json({
    totalRegistered: analytics.totalUsers,
    currentlyOnline: io.engine.clientsCount || 0,
    inQueue: matchQueue.length,
    inActiveChats: activeMatches.size * 2,
    premiumCount: analytics.premiumUsers,
    recentSignups: Array.from(users.values())
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      .slice(0, 20)
      .map((user) => ({
        id: user.id,
        username: user.username,
        gender: user.gender,
        isPremium: user.isPremium,
        createdAt: user.createdAt
      })),
    timestamp: new Date().toISOString()
  })
})

io.use((socket, next) => {
  const cookies = parseCookies(socket.handshake.headers.cookie)
  const decoded = verifyToken(cookies[SESSION_COOKIE])

  if (!decoded) {
    return next(new Error('Unauthorized'))
  }

  const user = getUser(decoded.userId)
  if (!user) {
    return next(new Error('Unauthorized'))
  }

  socket.data.userId = decoded.userId
  socket.data.currentMatchId = null
  socket.data.currentFriendId = null
  return next()
})

io.on('connection', (socket) => {
  const currentUserId = socket.data.userId
  registerSocket(currentUserId, socket.id)

  analytics.activeNow = io.engine.clientsCount || 0
  emitSocialState(currentUserId)
  console.log(`[socket] connected ${socket.id} user=${currentUserId}`)

  socket.on('join_queue', (payload = {}) => {
    const user = getUser(currentUserId)
    if (!user) {
      socket.emit('queue_error', { message: 'Unable to load your session.' })
      return
    }

    if (socket.data.currentMatchId) {
      socket.emit('queue_error', { message: 'Finish your active chat before joining again.' })
      return
    }

    const resolvedGender = payload.gender ? sanitizeGender(payload.gender) : user.gender
    if (!resolvedGender) {
      socket.emit('queue_error', { message: 'Choose a valid gender before searching.' })
      return
    }

    const interests = sanitizeInterests(payload.interests)
    const requestedFilter = sanitizeFilterGender(payload.filterGender)
    const effectiveFilter = user.isPremium ? requestedFilter : 'both'
    const withInterests = payload.withInterests !== undefined ? Boolean(payload.withInterests) : user.matchPreferences.withInterests
    const interestTimeoutSeconds = sanitizeInterestTimeoutSeconds(
      payload.interestTimeoutSeconds !== undefined
        ? payload.interestTimeoutSeconds
        : user.matchPreferences.interestTimeout
    )

    user.gender = resolvedGender
    user.matchPreferences = {
      ...user.matchPreferences,
      genderFilter: effectiveFilter,
      withInterests,
      interestTimeout: interestTimeoutSeconds
    }

    removeFromQueue(currentUserId)

    matchQueue.push({
      userId: currentUserId,
      socketId: socket.id,
      interests,
      gender: resolvedGender,
      filterGender: effectiveFilter,
      isPremium: user.isPremium,
      withInterests,
      interestTimeoutMs: interestTimeoutSeconds === null ? null : interestTimeoutSeconds * 1000,
      joinedAt: Date.now(),
      fallbackNotified: interests.length === 0 || !withInterests
    })
    processQueue()
    console.log(`[queue] user=${currentUserId} size=${matchQueue.length}`)
  })

  socket.on('leave_queue', () => {
    if (removeFromQueue(currentUserId)) {
      socket.emit('queue_left')
      broadcastQueuePositions()
    }
  })

  socket.on('send_message', (payload = {}) => {
    const matchId = String(payload.matchId || '')
    const text = stripTags(payload.text).slice(0, MAX_MESSAGE_LENGTH)
    const incomingMessageId = stripTags(payload.messageId)

    if (!matchId || !text) {
      return
    }

    const match = activeMatches.get(matchId)
    if (!match || !isParticipant(match, currentUserId)) {
      socket.emit('chat_error', { message: 'That chat is no longer active.' })
      return
    }

    if (incomingMessageId && match.messageIds.has(incomingMessageId)) {
      const existingMessage = match.messages.find((message) => message.id === incomingMessageId)
      if (existingMessage) {
        socket.emit('new_message', {
          matchId,
          id: existingMessage.id,
          text: existingMessage.text,
          timestamp: existingMessage.timestamp,
          fromSelf: true
        })
      }
      return
    }

    const message = {
      id: incomingMessageId || uuidv4(),
      sender: currentUserId,
      text,
      timestamp: Date.now()
    }

    match.messages.push(message)
    match.messageIds.add(message.id)
    analytics.totalMessages += 1
    updateDailyStats('messages')

    socket.emit('new_message', {
      matchId,
      id: message.id,
      text: message.text,
      timestamp: message.timestamp,
      fromSelf: true
    })

    getPartnerSocket(match, currentUserId)?.emit('new_message', {
      matchId,
      id: message.id,
      text: message.text,
      timestamp: message.timestamp,
      fromSelf: false
    })
  })

  socket.on('send_friend_message', (payload = {}) => {
    const friendId = stripTags(payload.friendId)
    const text = stripTags(payload.text).slice(0, MAX_MESSAGE_LENGTH)
    const incomingMessageId = stripTags(payload.messageId)

    if (!friendId || !text || !areFriends(currentUserId, friendId)) {
      socket.emit('chat_error', { message: 'Only friends can chat directly.' })
      return
    }

    const thread = getOrCreateFriendThread(currentUserId, friendId)
    if (incomingMessageId && thread.messageIds.has(incomingMessageId)) {
      const existingMessage = thread.messages.find((message) => message.id === incomingMessageId)
      if (existingMessage) {
        socket.emit('friend_message', {
          friendId,
          id: existingMessage.id,
          text: existingMessage.text,
          timestamp: existingMessage.timestamp,
          fromSelf: true
        })
      }
      return
    }

    const message = {
      id: incomingMessageId || uuidv4(),
      sender: currentUserId,
      text,
      timestamp: Date.now()
    }

    thread.messages.push(message)
    thread.messageIds.add(message.id)
    thread.unreadCounts[currentUserId] = 0
    thread.unreadCounts[friendId] = (thread.unreadCounts[friendId] || 0) + 1
    analytics.totalMessages += 1
    updateDailyStats('messages')

    emitToUser(currentUserId, 'friend_message', {
      friendId,
      id: message.id,
      text: message.text,
      timestamp: message.timestamp,
      fromSelf: true
    })

    emitToUser(friendId, 'friend_message', {
      friendId: currentUserId,
      id: message.id,
      text: message.text,
      timestamp: message.timestamp,
      fromSelf: false
    })

    emitSocialState(currentUserId)
    emitSocialState(friendId)
  })

  socket.on('mark_friend_thread_read', ({ friendId } = {}) => {
    const normalizedFriendId = stripTags(friendId)
    if (!normalizedFriendId || !areFriends(currentUserId, normalizedFriendId)) {
      return
    }

    const thread = getOrCreateFriendThread(currentUserId, normalizedFriendId)
    thread.unreadCounts[currentUserId] = 0
    emitSocialState(currentUserId)
  })

  socket.on('typing_start', ({ matchId } = {}) => {
    const match = activeMatches.get(matchId)
    if (!match || !isParticipant(match, currentUserId)) {
      return
    }

    getPartnerSocket(match, currentUserId)?.emit('partner_typing', { isTyping: true })
  })

  socket.on('typing_stop', ({ matchId } = {}) => {
    const match = activeMatches.get(matchId)
    if (!match || !isParticipant(match, currentUserId)) {
      return
    }

    getPartnerSocket(match, currentUserId)?.emit('partner_typing', { isTyping: false })
  })

  socket.on('disconnect_match', ({ matchId } = {}) => {
    const activeMatchId = matchId || socket.data.currentMatchId
    if (!activeMatchId) {
      return
    }

    endMatch(activeMatchId, currentUserId)
  })

  socket.on('report_user', ({ matchId, reason } = {}) => {
    console.log(`[report] user=${currentUserId} match=${matchId} reason=${stripTags(reason).slice(0, 200)}`)
    socket.emit('report_received', { ok: true })
  })

  socket.on('disconnect', () => {
    analytics.activeNow = io.engine.clientsCount || 0
    unregisterSocket(currentUserId, socket.id)
    removeFromQueue(currentUserId)
    broadcastQueuePositions()

    if (socket.data.currentMatchId) {
      endMatch(socket.data.currentMatchId, currentUserId)
    }

    console.log(`[socket] disconnected ${socket.id} user=${currentUserId}`)
  })
})

httpServer.listen(PORT, () => {
  console.log(`[vibechat] api=http://127.0.0.1:${PORT}/api ws=ws://127.0.0.1:${PORT}`)
})
