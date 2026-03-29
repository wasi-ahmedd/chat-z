import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext()

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [user, setUser] = useState(null)
  const [onlineCount, setOnlineCount] = useState(0)

  useEffect(() => {
    // In development, the proxy handles this, so we connect to the same origin
    const newSocket = io('/', {
      withCredentials: true,
      autoConnect: true
    })

    setSocket(newSocket)

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
      {children}
    </SocketContext.Provider>
  )
}
