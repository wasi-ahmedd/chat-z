import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Onboarding from './pages/Onboarding'
import Lobby from './pages/Lobby'
import ChatRoom from './pages/ChatRoom'
import { SocketProvider } from './context/SocketContext'

function App() {
  return (
    <SocketProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/chat" element={<ChatRoom />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </SocketProvider>
  )
}

export default App
