import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { authService } from '../services/api'

const SocketContext = createContext()

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [user, setUser] = useState(null)
<<<<<<< Updated upstream
  const [onlineCount, setOnlineCount] = useState(0)
=======
  const [socialState, setSocialState] = useState(null)
  const [isQueueing, setIsQueueing] = useState(false)
  const [queuePosition, setQueuePosition] = useState(null)
  const [interests, setInterests] = useState(['coding', 'music', 'art'])
  const [activeMatch, setActiveMatch] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
>>>>>>> Stashed changes

  // 1. Initial User Session Load
  useEffect(() => {
<<<<<<< Updated upstream
    // In development, the proxy handles this, so we connect to the same origin
    const newSocket = io('/', {
      withCredentials: true,
      autoConnect: true
=======
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
    // We only connect if we have a user (session cookie)
    // Onboarding will call setUser() after signup, triggering this.
    const newSocket = io('/', {
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
      setOnlineCount(data.count)
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
>>>>>>> Stashed changes
    })

    setSocket(newSocket)

<<<<<<< Updated upstream
    newSocket.on('connect', () => {
      console.log('Connected to socket server')
    })

    newSocket.on('online_count', (count) => {
      setOnlineCount(count || 0)
    })

    return () => newSocket.close()
  }, [])

  return (
    <SocketContext.Provider value={{ socket, user, setUser, onlineCount }}>
=======
    return () => {
      console.log('--- Cleaning Up Old VibeSocket ---')
      newSocket.off('connect')
      newSocket.off('disconnect')
      newSocket.off('match_found')
      newSocket.close()
    }
  }, [user?.userId]) // Only re-create if the actual User ID changes (e.g. signup/logout)

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
>>>>>>> Stashed changes
      {children}
    </SocketContext.Provider>
  )
}
