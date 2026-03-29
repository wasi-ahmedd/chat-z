import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import { authService } from '../services/api'

const SocketContext = createContext()

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [user, setUser] = useState(null)
  const [onlineCount, setOnlineCount] = useState(0)
  const [socialState, setSocialState] = useState(null)
  const [isQueueing, setIsQueueing] = useState(false)
  const [queuePosition, setQueuePosition] = useState(null)
  const [interests, setInterests] = useState(['coding', 'music', 'art'])
  const [activeMatch, setActiveMatch] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const typingTimeoutRef = useRef(null)

  // 1. Initial User Session Load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await authService.getMe()
        setUser(response.data)
      } catch (err) {
        console.log('No active session found during initial load')
      }
    }
    loadUser()
  }, [])

  // 2. Reactive Socket Connection (Depends on User session)
  useEffect(() => {
    // Determine backend URL - in production it might be different, but for now we assume same origin or proxy
    const socketUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? 'http://127.0.0.1:3001' 
      : '/'

    const newSocket = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket'],
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    newSocket.on('connect', () => {
      console.log('--- VibeSocket Protocol Established ---')
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('--- VibeSocket Link Severed ---')
      setIsConnected(false)
    })

    newSocket.on('social_state', (state) => {
      setSocialState(state)
    })

    newSocket.on('online_count', (data) => {
      setOnlineCount(typeof data === 'number' ? data : data.count || 0)
    })

    newSocket.on('queue_joined', (data) => {
      setIsQueueing(true)
      setQueuePosition(data.position)
    })

    newSocket.on('queue_left', () => {
      setIsQueueing(false)
      setQueuePosition(null)
    })

    newSocket.on('match_found', (data) => {
      setIsQueueing(false)
      setQueuePosition(null)
      setActiveMatch(data)
    })

    newSocket.on('partner_disconnected', () => {
      setActiveMatch(prev => prev ? { ...prev, partnerDisconnected: true } : null)
    })

    setSocket(newSocket)

    return () => {
      console.log('--- Cleaning Up Old VibeSocket ---')
      newSocket.off('connect')
      newSocket.off('disconnect')
      newSocket.off('match_found')
      newSocket.close()
    }
  }, [user?.id]) // Re-connect if user ID changes (auth update)

  return (
    <SocketContext.Provider value={{ 
      socket, 
      onlineCount, 
      user, 
      setUser, 
      socialState, 
      isQueueing, 
      setIsQueueing,
      queuePosition,
      interests,
      setInterests,
      activeMatch,
      setActiveMatch,
      isConnected
    }}>
      {children}
    </SocketContext.Provider>
  )
}
