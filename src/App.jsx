import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import GenderSelection from './pages/GenderSelection'
import Lobby from './pages/Lobby'
import ChatRoom from './pages/ChatRoom'
import History from './pages/History'
import { SocketProvider } from './context/SocketContext'

function App() {
  return (
    <SocketProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<GenderSelection />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/chat" element={<ChatRoom />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </SocketProvider>
  )
}

export default App
