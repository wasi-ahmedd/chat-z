import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import GenderSelection from './pages/GenderSelection'
import Lobby from './pages/Lobby'
import ChatRoom from './pages/ChatRoom'
import History from './pages/History'
import Settings from './pages/Settings'
import Loading from './pages/Loading'
import Error404 from './pages/Error404'
import { SocketProvider } from './context/SocketContext'
import { DesignProvider } from './context/DesignContext'

function App() {
  return (
    <DesignProvider>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<GenderSelection />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/chat" element={<ChatRoom />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </SocketProvider>
    </DesignProvider>
  )
}

export default App
