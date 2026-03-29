import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSocket } from '../../context/SocketContext'
import { User, Settings, MessageSquare, Compass, Radio } from 'lucide-react'
import PremiumModal from '../common/PremiumModal'
import ProfileModal from '../common/ProfileModal'

const AppLayout = ({ children, hideSidebar = false }) => {
  const { onlineCount } = useSocket()
  const location = useLocation()
  const [isPremiumOpen, setIsPremiumOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user } = useSocket()

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#0e0e0e] border-b-4 border-black shadow-[4px_4px_0px_#000000]">
        <Link to="/" className="text-3xl font-headline font-black text-primary tracking-tighter italic uppercase">VIBECHAT</Link>
        <div className="hidden md:flex gap-8 items-center font-headline font-black uppercase tracking-tighter">
          <Link to="/lobby" className={`${location.pathname === '/lobby' ? 'text-secondary underline decoration-4' : 'text-white hover:bg-primary hover:text-black transition-none px-2'}`}>CHANNELS</Link>
          <Link to="/chat" className={`${location.pathname === '/chat' ? 'text-primary underline decoration-4' : 'text-white hover:bg-secondary hover:text-black transition-none px-2'}`}>CHAT</Link>
          <Link to="/history" className={`${location.pathname === '/history' ? 'text-tertiary underline decoration-4' : 'text-white hover:bg-tertiary hover:text-black transition-none px-2'}`}>HISTORY</Link>
          <button className="text-white hover:bg-primary hover:text-black transition-none px-2">VIBES</button>
        </div>
        <div className="flex gap-4 items-center">
          <span className="hidden lg:flex items-center gap-2 bg-black border-2 border-white px-3 py-1 text-[10px] font-black uppercase text-tertiary">
            <span className="w-2 h-2 bg-tertiary animate-pulse rounded-full"></span>
            {onlineCount?.toLocaleString()} LIVE
          </span>
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="p-2 border-4 border-black bg-surface-container shadow-[4px_4px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none"
          >
            <User size={20} />
          </button>
          <button className="p-2 border-4 border-black bg-surface-container shadow-[4px_4px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none">
            <Settings size={20} />
          </button>
        </div>
      </nav>

      <div className="flex flex-1 pt-20">
        {/* Sidebar */}
        {!hideSidebar && (location.pathname !== '/') && (
          <aside className="hidden md:flex flex-col h-[calc(100vh-80px)] fixed left-0 top-20 z-40 bg-[#191919] border-r-4 border-black w-64 shadow-[8px_0px_0px_#000000]">
            <nav className="flex-1 flex flex-col gap-2 pt-8">
              <Link to="/lobby" className={`p-4 font-headline font-black uppercase flex items-center gap-4 hover:bg-surface-bright transition-none ${location.pathname === '/lobby' ? 'bg-primary text-black' : 'text-white'}`}>
                <MessageSquare size={20} /> CHANNELS
              </Link>
              <Link to="/chat" className={`p-4 font-headline font-black uppercase flex items-center gap-4 hover:bg-surface-bright transition-none ${location.pathname === '/chat' ? 'bg-secondary text-black' : 'text-white'}`}>
                <Radio size={20} /> START_CHAT
              </Link>
              <button className="p-4 font-headline font-black uppercase flex items-center gap-4 hover:bg-surface-bright transition-none text-white">
                <Compass size={20} /> DISCOVER
              </button>
            </nav>
            <div className="p-4 mt-auto border-t-4 border-black">
              <button
                onClick={() => setIsPremiumOpen(true)}
                className="w-full bg-tertiary text-black p-4 border-2 border-black font-headline font-black text-xs uppercase -rotate-1 hover:rotate-0 transition-transform active:scale-95"
              >
                PREMIUM_VIBES_ON
              </button>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-all ${(!hideSidebar && location.pathname !== '/') ? 'md:ml-64' : ''}`}>
          {children}
        </main>
      </div>

      <PremiumModal isOpen={isPremiumOpen} onClose={() => setIsPremiumOpen(false)} />
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={user}
        onLogout={() => {
          // Add logout logic here
          window.location.href = '/'
        }}
      />

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-stretch h-16 md:hidden bg-[#0e0e0e] border-t-4 border-black">
        <Link to="/chat" className={`flex flex-col items-center justify-center flex-1 font-headline font-bold text-[10px] uppercase transition-none ${location.pathname === '/chat' ? 'bg-primary text-black' : 'text-white'}`}>
          <Radio size={20} />
          <span>CHAT</span>
        </Link>
        <Link to="/lobby" className={`flex flex-col items-center justify-center flex-1 font-headline font-bold text-[10px] uppercase transition-none ${location.pathname === '/lobby' ? 'bg-secondary text-black' : 'text-white'}`}>
          <Compass size={20} />
          <span>LOBBY</span>
        </Link>
        <button 
          onClick={() => setIsProfileOpen(true)}
          className="flex flex-col items-center justify-center flex-1 font-headline font-bold text-[10px] uppercase text-white hover:bg-tertiary hover:text-black transition-none"
        >
          <User size={20} />
          <span>PROFILE</span>
        </button>
      </nav>
    </div>
  )
}

export default AppLayout
