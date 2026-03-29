import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext()

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [onlineCount, setOnlineCount] = useState(0)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const newSocket = io('/', {
      path: '/socket.io',
      transports: ['websocket']
    })

    newSocket.on('connect', () => {
      console.log('Connected to VibeServer')
    })

    newSocket.on('online_count', (count) => {
      setOnlineCount(count)
    })

    setSocket(newSocket)

    return () => newSocket.close()
  }, [])

  return (
    <SocketContext.Provider value={{ socket, onlineCount, user, setUser }}>
      {children}
    </SocketContext.Provider>
  )
}
