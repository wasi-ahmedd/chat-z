import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const AppLayout = ({ children, hideSidebar = false }) => {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#0e0e0e] border-b-4 border-black shadow-[4px_4px_0px_0px_#000000]">
        <Link to="/" className="text-3xl font-['Epilogue'] font-black text-[#fed023] tracking-tighter italic uppercase">VIBECHAT</Link>
        <div className="hidden md:flex gap-8 items-center font-['Epilogue'] font-black uppercase tracking-tighter">
          <Link to="/lobby" className={`px-2 transition-none ${location.pathname === '/lobby' ? 'text-[#ff6d8d] underline decoration-4 underline-offset-8' : 'text-[#fed023] hover:bg-[#fed023] hover:text-black'}`}>CHANNELS</Link>
          <Link to="/chat" className={`px-2 transition-none ${location.pathname === '/chat' ? 'text-[#fed023] underline decoration-4' : 'text-[#fed023] hover:bg-[#fed023] hover:text-black'}`}>CHAT</Link>
          <a className="text-[#fed023] hover:bg-[#fed023] hover:text-black px-2 transition-none" href="#">VAULT</a>
          <a className="text-[#fed023] hover:bg-[#fed023] hover:text-black px-2 transition-none" href="#">CREW</a>
        </div>
        <div className="flex gap-4 items-center">
          <button className="hidden lg:block bg-[#fed023] text-black font-['Epilogue'] font-black uppercase px-6 py-2 border-4 border-black shadow-[4px_4px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none">JOIN RIOT</button>
          <button className="text-[#fed023] font-['Epilogue'] font-black uppercase px-4 py-2 hover:bg-[#fed023] hover:text-black transition-none">LOG IN</button>
        </div>
      </nav>

      <div className="flex flex-1 pt-20">
        {/* Sidebar */}
        {!hideSidebar && location.pathname !== '/' && (
          <aside className="hidden md:flex flex-col h-[calc(100vh-80px)] fixed left-0 top-0 z-40 bg-[#191919] border-r-4 border-black w-64 shadow-[8px_0px_0px_0px_#000000] pt-20">
            <div className="px-6 mb-8">
              <Link to="/" className="text-2xl font-black text-[#fed023] font-['Epilogue']">VIBECHAT</Link>
              <div className="text-[10px] font-extrabold text-secondary tracking-[0.2em] font-['Epilogue']">RAW_MODE_ON</div>
            </div>
            <nav className="flex-1 flex flex-col gap-2">
              <Link to="/lobby" className={`p-4 font-['Epilogue'] font-extrabold uppercase flex items-center gap-4 hover:bg-[#2c2c2c] transition-none ${location.pathname === '/lobby' ? 'bg-[#fed023] text-black border-2 border-black m-2' : 'text-white hover:text-[#9fff88]'}`}>
                <span className="material-symbols-outlined">forum</span> CHANNELS
              </Link>
              <Link to="/chat" className={`p-4 font-['Epilogue'] font-extrabold uppercase flex items-center gap-4 hover:bg-[#2c2c2c] transition-none ${location.pathname === '/chat' ? 'bg-[#fed023] text-black border-2 border-black m-2' : 'text-white hover:text-[#9fff88]'}`}>
                <span className="material-symbols-outlined">chat_bubble</span> PEOPLE
              </Link>
              <a className="text-white hover:text-[#9fff88] p-4 font-['Epilogue'] font-extrabold uppercase flex items-center gap-4 hover:bg-[#2c2c2c] transition-none" href="#">
                <span className="material-symbols-outlined">history</span> HISTORY
              </a>
              <a className="text-white hover:text-[#9fff88] p-4 font-['Epilogue'] font-extrabold uppercase flex items-center gap-4 hover:bg-[#2c2c2c] transition-none" href="#">
                <span className="material-symbols-outlined">bolt</span> VIBES
              </a>
            </nav>
            <div className="p-4 mt-auto">
              <Link to="/chat" className="block text-center w-full bg-[#ff6d8d] text-black border-4 border-black p-4 font-black font-['Epilogue'] neo-shadow hover:neo-shadow-lg transition-none active:translate-x-1 active:translate-y-1 active:shadow-none uppercase decoration-none">
                START_CHAT
              </Link>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-all ${(!hideSidebar && location.pathname !== '/') ? 'md:ml-64' : ''}`}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      {location.pathname !== '/' && (
        <nav className="fixed bottom-0 w-full z-50 flex justify-around items-stretch h-16 md:hidden bg-[#0e0e0e] border-t-4 border-black font-['Epilogue'] font-bold text-[10px] uppercase">
          <Link className={`flex flex-col items-center justify-center h-full px-2 flex-1 active:translate-y-1 transition-none ${location.pathname === '/chat' ? 'bg-[#fed023] text-black' : 'text-white hover:bg-[#ff6d8d]'}`} to="/chat">
            <span className="material-symbols-outlined mb-1">chat_bubble</span>
            <span>CHAT</span>
          </Link>
          <Link className={`flex flex-col items-center justify-center h-full px-2 flex-1 active:translate-y-1 transition-none ${location.pathname === '/lobby' ? 'bg-[#fed023] text-black' : 'text-white hover:bg-[#ff6d8d]'}`} to="/lobby">
            <span className="material-symbols-outlined mb-1">forum</span>
            <span>CHANNELS</span>
          </Link>
          <a className="flex flex-col items-center justify-center text-white h-full px-2 flex-1 hover:bg-[#ff6d8d] active:translate-y-1 transition-none" href="#">
            <span className="material-symbols-outlined mb-1">explore</span>
            <span>DISCOVER</span>
          </a>
          <a className="flex flex-col items-center justify-center text-white h-full px-2 flex-1 hover:bg-[#ff6d8d] active:translate-y-1 transition-none" href="#">
            <span className="material-symbols-outlined mb-1">sensors</span>
            <span>LIVE</span>
          </a>
        </nav>
      )}
    </div>
  )
}

export default AppLayout
