import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.join(__dirname, '..')
const UI_CONFIG_PATH = path.join(ROOT_DIR, 'ui-config.json')
const UI_STATE_PATH = path.join(ROOT_DIR, 'ui-state.json')

const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'vibechat-secret-change-in-production'
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'
const CORS_ORIGIN_ALT = 'http://127.0.0.1:5173'
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
    origin: [CORS_ORIGIN, CORS_ORIGIN_ALT],
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true
  }
})

app.use(cors({ origin: [CORS_ORIGIN, CORS_ORIGIN_ALT], credentials: true }))
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

// --- UI Persistence APIs ---
app.get('/api/ui/config', async (req, res) => {
  try {
    const data = await fs.readFile(UI_CONFIG_PATH, 'utf8')
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: 'FAILED_TO_LOAD_UI_CONFIG' })
  }
})

app.get('/api/ui/state', async (req, res) => {
  try {
    const data = await fs.readFile(UI_STATE_PATH, 'utf8')
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: 'FAILED_TO_LOAD_UI_STATE' })
  }
})

app.post('/api/ui/save', async (req, res) => {
  try {
    const { config, state } = req.body
    if (config) {
      await fs.writeFile(UI_CONFIG_PATH, JSON.stringify(config, null, 2))
    }
    if (state) {
      await fs.writeFile(UI_STATE_PATH, JSON.stringify(state, null, 2))
    }
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'FAILED_TO_SAVE_UI' })
  }
})

function generateAnonymousName() {
  const adjectives = [
    'Cosmic', 'Silent', 'Neon', 'Pixel', 'Lunar', 'Frost',
    'Echo', 'Velvet', 'Wild', 'Crystal', 'Dark', 'Golden',
    'Azure', 'Phantom', 'Silver', 'Blaze', 'Mystic', 'Radiant',
    'Serene', 'Vivid', 'Dreamy', 'Electric', 'Twilight', 'Stellar'
  ]
  const nouns = [
    'Rioter', 'Viber', 'Ghost', 'Stalker', 'Signal', 'Frequency',
    'Nova', 'Pulse', 'Cipher', 'Shadow', 'Blade', 'Spark',
    'Titan', 'Nomad', 'Seeker', 'Voyager', 'Guard', 'Wraith',
    'Spirit', 'Agent', 'Pilot', 'Rover', 'Scout', 'Warden'
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
    .filter((interest) => interest.length > 0)
    .slice(0, MAX_INTERESTS))]
}

function sanitizeGender(gender) {
  return VALID_GENDERS.includes(gender) ? gender : null
}

function sanitizeFilterGender(gender) {
  return VALID_FILTER_GENDERS.includes(gender) ? gender : 'both'
}

function sanitizeInterestTimeoutSeconds(rawValue) {
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
    notifications: [],
    history: []
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

function generateMatchId() {
  return uuidv4()
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

  // Save to history for both users
  const sessionSummary = {
    id: matchId,
    user1: match.user1.userId,
    user2: match.user2.userId,
    user1Username: getUser(match.user1.userId)?.username || 'Stranger',
    user2Username: getUser(match.user2.userId)?.username || 'Stranger',
    sharedInterests: match.sharedInterests,
    startedAt: match.startedAt,
    durationMs: Date.now() - match.startedAt,
    messageCount: match.messages.length
  }

  const user1 = getUser(match.user1.userId)
  const user2 = getUser(match.user2.userId)
  if (user1) {
    user1.history.unshift(sessionSummary)
    if (user1.history.length > 50) user1.history.pop()
  }
  if (user2) {
    user2.history.unshift(sessionSummary)
    if (user2.history.length > 50) user2.history.pop()
  }

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
      userId1: [userIdA, userIdB].sort()[0],
      userId2: [userIdA, userIdB].sort()[1],
      messages: []
    })
  }

  return friendThreads.get(threadKey)
}

function addFriendMessage(userIdA, userIdB, senderUserId, text) {
  const thread = getOrCreateFriendThread(userIdA, userIdB)
  const message = {
    id: uuidv4(),
    sender: senderUserId,
    text: stripTags(text).slice(0, MAX_MESSAGE_LENGTH),
    timestamp: new Date().toISOString()
  }

  thread.messages.push(message)
  if (thread.messages.length > 100) {
    thread.messages.shift()
  }

  return message
}

function getRelationshipState(userId, targetUserId) {
  const user = getUser(userId)
  if (!user) {
    return 'none'
  }

  if (user.friends.some((friend) => friend.userId === targetUserId)) {
    return 'friend'
  }

  if (user.outgoingFollowRequests.some((request) => request.targetUserId === targetUserId)) {
    return 'pending_sent'
  }

  if (user.incomingFollowRequests.some((request) => request.fromUserId === targetUserId)) {
    return 'pending_received'
  }

  return 'none'
}

function serializeSocialState(userId) {
  const user = getUser(userId)
  if (!user) {
    return null
  }

  const incomingRequests = user.incomingFollowRequests.map((request) => ({
    id: request.id,
    fromUserId: request.fromUserId,
    fromUsername: getUser(request.fromUserId)?.username || 'Stranger',
    timestamp: request.timestamp
  }))

  const acceptedNotifications = user.notifications.filter((notification) => notification.type === 'follow_accepted')

  const friends = user.friends
    .map((friend) => {
      const friendUser = getUser(friend.userId)
      if (!friendUser) {
        return null
      }

      const threadKey = getFriendThreadKey(userId, friend.userId)
      const thread = friendThreads.get(threadKey)
      const lastMessage = thread?.messages[thread.messages.length - 1]

      return {
        userId: friend.userId,
        username: friendUser.username,
        since: friend.since,
        lastMessageAt: lastMessage?.timestamp || friend.since,
        unreadCount: 0 // In-memory simplified
      }
    })
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
  if (entry.withInterests === false) {
    return true
  }

  const waitTimeMs = Date.now() - entry.joinedAt
  const timeoutMs = getUser(entry.userId)?.matchPreferences?.interestTimeout * 1000 || 10000
  return waitTimeMs >= timeoutMs
}

function processQueue() {
  if (matchQueue.length < 2) {
    broadcastQueuePositions()
    return
  }

  for (let i = 0; i < matchQueue.length; i++) {
    const entryA = matchQueue[i]
    for (let j = i + 1; j < matchQueue.length; j++) {
      const entryB = matchQueue[j]

      // Simplified matching logic for MVP
      let matchDecision = null

      // Check interests
      const sharedInterests = entryA.interests.filter((interest) => entryB.interests.includes(interest))

      if (sharedInterests.length > 0) {
        matchDecision = { sharedInterests }
      } else if (entryAllowsFallback(entryA) && entryAllowsFallback(entryB)) {
        matchDecision = { sharedInterests: [] }
      }

      if (matchDecision) {
        // Remove from queue
        matchQueue.splice(j, 1)
        matchQueue.splice(i, 1)

        const matchId = generateMatchId()
        const match = {
          user1: entryA,
          user2: entryB,
          sharedInterests: matchDecision.sharedInterests,
          messages: [],
          startedAt: Date.now()
        }

        activeMatches.set(matchId, match)

        // Set sockets to matched state
        const leftEntry = entryA
        const rightEntry = entryB

        const leftSockets = io.sockets.adapter.rooms.get(leftEntry.userId)
        const rightSockets = io.sockets.adapter.rooms.get(rightEntry.userId)

        if (leftSockets) {
          for (const sId of leftSockets) {
            const s = io.sockets.sockets.get(sId)
            if (s) s.data.currentMatchId = matchId
          }
        }
        if (rightSockets) {
          for (const sId of rightSockets) {
            const s = io.sockets.sockets.get(sId)
            if (s) s.data.currentMatchId = matchId
          }
        }

        io.to(leftEntry.userId).emit('match_found', {
          matchId,
          partner: getPublicUserData(rightEntry.userId, rightEntry.gender),
          sharedInterests: matchDecision.sharedInterests
        })

        io.to(rightEntry.userId).emit('match_found', {
          matchId,
          partner: getPublicUserData(leftEntry.userId, leftEntry.gender),
          sharedInterests: matchDecision.sharedInterests
        })

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
  io.emit('online_count', { count: io.engine.clientsCount || 0 })
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
  const body = req.body || {}
  
  if (body.username) user.username = stripTags(body.username).slice(0, 32)
  if (body.gender) user.gender = sanitizeGender(body.gender)

  users.set(userId, user)
  issueSessionCookie(res, userId)
  analytics.totalUsers += 1
  updateDailyStats('users')

  res.status(201).json({ user: buildClientUser(userId) })
})

app.get('/api/users/history', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = getUser(userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  return res.json({ history: user.history || [] })
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

  return res.json(serializeSocialState(userId))
})

app.post('/api/social/notifications/read', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.body.type === 'follow_accepted') {
    markAcceptedNotificationsRead(userId)
  }

  return res.json({ ok: true })
})

app.get('/api/friends', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const socialState = serializeSocialState(userId)
  return res.json({ friends: socialState.friends })
})

app.get('/api/friends/:friendId/messages', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = getUser(userId)
  if (!user.friends.some((f) => f.userId === req.params.friendId)) {
    return res.status(403).json({ error: 'Not friends' })
  }

  const thread = getOrCreateFriendThread(userId, req.params.friendId)
  return res.json({ messages: thread.messages })
})

app.post('/api/friends/requests', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const targetUserId = req.body.targetUserId
  if (!targetUserId || targetUserId === userId) {
    return res.status(400).json({ error: 'Invalid target' })
  }

  const user = getUser(userId)
  const targetUser = getUser(targetUserId)

  if (!targetUser) {
    return res.status(404).json({ error: 'Target user not found' })
  }

  if (user.friends.some((f) => f.userId === targetUserId)) {
    return res.status(400).json({ error: 'Already friends' })
  }

  if (user.outgoingFollowRequests.some((r) => r.targetUserId === targetUserId)) {
    return res.status(400).json({ error: 'Request already sent' })
  }

  // Check if they already sent a request to us - then accept it
  const incoming = user.incomingFollowRequests.find((r) => r.fromUserId === targetUserId)
  if (incoming) {
    removeFollowRequestPair(targetUserId, userId)
    addFriendship(userId, targetUserId)
    addNotification(targetUserId, {
      id: uuidv4(),
      type: 'follow_accepted',
      fromUserId: userId,
      timestamp: new Date().toISOString(),
      read: false
    })
    emitSocialState(userId)
    emitSocialState(targetUserId)
    return res.json({ ok: true, status: 'friend' })
  }

  const requestId = uuidv4()
  const timestamp = new Date().toISOString()

  user.outgoingFollowRequests.push({ id: requestId, targetUserId, timestamp })
  targetUser.incomingFollowRequests.push({ id: requestId, fromUserId: userId, timestamp })

  emitSocialState(targetUserId)
  return res.json({ ok: true, status: 'pending' })
})

app.post('/api/friends/requests/:requestId/accept', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = getUser(userId)
  const request = user.incomingFollowRequests.find((r) => r.id === req.params.requestId)

  if (!request) {
    return res.status(404).json({ error: 'Request not found' })
  }

  const fromUserId = request.fromUserId
  removeFollowRequestPair(fromUserId, userId)
  addFriendship(userId, fromUserId)
  
  addNotification(fromUserId, {
    id: uuidv4(),
    type: 'follow_accepted',
    fromUserId: userId,
    timestamp: new Date().toISOString(),
    read: false
  })

  emitSocialState(userId)
  emitSocialState(fromUserId)

  return res.json({ ok: true })
})

app.post('/api/friends/requests/:requestId/decline', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = getUser(userId)
  const request = user.incomingFollowRequests.find((r) => r.id === req.params.requestId)

  if (!request) {
    return res.status(404).json({ error: 'Request not found' })
  }

  removeFollowRequestPair(request.fromUserId, userId)
  emitSocialState(userId)
  emitSocialState(request.fromUserId)

  return res.json({ ok: true })
})

app.get('/api/match/active', (req, res) => {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const socketIds = socketIdsByUserId.get(userId)
  if (!socketIds) {
    return res.json(null)
  }

  let activeMatch = null
  for (const socketId of socketIds) {
    const socket = io.sockets.sockets.get(socketId)
    if (socket?.data?.currentMatchId) {
      const match = activeMatches.get(socket.data.currentMatchId)
      if (match) {
        activeMatch = serializeMatchForUser(socket.data.currentMatchId, match, userId)
        break
      }
    }
  }

  return res.json(activeMatch)
})

io.on('connection', (socket) => {
  const cookies = parseCookies(socket.handshake.headers.cookie)
  const token = cookies[SESSION_COOKIE]
  const decoded = verifyToken(token)

  if (!decoded) {
    socket.disconnect()
    return
  }

  const currentUserId = decoded.userId
  const user = getUser(currentUserId)

  if (!user) {
    socket.disconnect()
    return
  }

  socket.data.userId = currentUserId
  registerSocket(currentUserId, socket.id)
  socket.join(currentUserId)

  console.log(`[socket] connected ${socket.id} user=${currentUserId}`)

  emitSocialState(currentUserId)
  socket.emit('online_count', { count: io.engine.clientsCount || 0 })

  socket.on('join_queue', (data) => {
    removeFromQueue(currentUserId)
    matchQueue.push({
      userId: currentUserId,
      socketId: socket.id,
      interests: sanitizeInterests(data.interests),
      withInterests: Boolean(data.withInterests),
      joinedAt: Date.now()
    })
    processQueue()
  })

  socket.on('leave_queue', () => {
    removeFromQueue(currentUserId)
  })

  socket.on('send_message', (data) => {
    const matchId = data.matchId
    const match = activeMatches.get(matchId)
    if (!match || !isParticipant(match, currentUserId)) {
      return
    }

    const message = {
      id: uuidv4(),
      sender: currentUserId,
      text: stripTags(data.text).slice(0, MAX_MESSAGE_LENGTH),
      timestamp: new Date().toISOString()
    }

    match.messages.push(message)
    io.to(match.user1.userId).to(match.user2.userId).emit('new_message', message)
    analytics.totalMessages += 1
    updateDailyStats('messages')
  })

  socket.on('typing_start', (data) => {
    const match = activeMatches.get(data.matchId)
    if (match && isParticipant(match, currentUserId)) {
      const partnerSocket = getPartnerSocket(match, currentUserId)
      partnerSocket?.emit('partner_typing', { isTyping: true })
    }
  })

  socket.on('typing_stop', (data) => {
    const match = activeMatches.get(data.matchId)
    if (match && isParticipant(match, currentUserId)) {
      const partnerSocket = getPartnerSocket(match, currentUserId)
      partnerSocket?.emit('partner_typing', { isTyping: false })
    }
  })

  socket.on('disconnect_match', (data) => {
    endMatch(data.matchId, currentUserId)
  })

  socket.on('send_friend_message', (data) => {
    const { friendId, text } = data
    if (!user.friends.some((f) => f.userId === friendId)) {
      return
    }

    const message = addFriendMessage(currentUserId, friendId, currentUserId, text)
    emitToUser(currentUserId, 'new_friend_message', { friendId, message })
    emitToUser(friendId, 'new_friend_message', { friendId: currentUserId, message })
  })

  socket.on('disconnect', () => {
    unregisterSocket(currentUserId, socket.id)
    removeFromQueue(currentUserId)

    if (socket.data.currentMatchId) {
      endMatch(socket.data.currentMatchId, currentUserId)
    }

    console.log(`[socket] disconnected ${socket.id} user=${currentUserId}`)
  })
})

httpServer.listen(PORT, () => {
  console.log(`[vibechat] api=http://127.0.0.1:${PORT}/api ws=ws://127.0.0.1:${PORT}`)
})
