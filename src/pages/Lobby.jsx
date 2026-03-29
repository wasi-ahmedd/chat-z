import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'
import { authService } from '../services/api'

const Lobby = () => {
  const navigate = useNavigate()
  const { user, setUser, onlineCount } = useSocket()
  const [interests, setInterests] = useState(['#gaming', '#music', '#anime'])
  const [newInterest, setNewInterest] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await authService.getMe()
        setUser(response.data)
      } catch (err) {
        console.error('Session expired', err)
      }
    }
    if (!user) loadUser()
  }, [user, setUser])

  const removeInterest = (index) => {
    setInterests(interests.filter((_, i) => i !== index))
  }

  return (
    <div className="overflow-hidden">
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-40 bg-[#191919] font-['Epilogue'] font-extrabold uppercase border-r-4 border-black w-64 shadow-[8px_0px_0px_0px_#000000]">
        <div className="p-6">
          <h1 className="text-2xl font-black text-[#fed023]"><Link to="/">VIBECHAT</Link></h1>
          <p className="text-[10px] tracking-widest text-[#ff6d8d] mt-1">RAW_MODE_ON</p>
        </div>
        <nav className="flex-1 mt-4">
          <Link className="flex items-center gap-4 bg-[#fed023] text-black border-2 border-black m-2 p-4 transition-none active:scale-95" to="/lobby">
            <span className="material-symbols-outlined">forum</span>
            <span>CHANNELS</span>
          </Link>
          <a className="flex items-center gap-4 text-white hover:text-[#9fff88] p-4 transition-none active:scale-95" href="#">
            <span className="material-symbols-outlined">group</span>
            <span>PEOPLE</span>
          </a>
          <Link className="flex items-center gap-4 text-white hover:text-[#9fff88] p-4 transition-none active:scale-95" to="/history">
            <span className="material-symbols-outlined">history</span>
            <span>HISTORY</span>
          </Link>
          <a className="flex items-center gap-4 text-white hover:text-[#9fff88] p-4 transition-none active:scale-95" href="#">
            <span className="material-symbols-outlined">bolt</span>
            <span>VIBES</span>
          </a>
        </nav>
        <div className="p-4 mt-auto mb-8">
          <Link to="/chat" className="block text-center w-full bg-[#ff6d8d] text-black border-4 border-black p-4 font-black neo-shadow hover:neo-shadow-lg transition-none active:translate-x-1 active:translate-y-1 active:shadow-none uppercase decoration-none">
            START_CHAT
          </Link>
        </div>
      </aside>

      {/* TopAppBar - Mobile Only */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#0e0e0e] border-b-4 border-black md:hidden shadow-[4px_4px_0px_0px_#000000]">
        <div className="text-3xl font-black italic text-[#fed023] tracking-tighter headline-font uppercase">VIBECHAT</div>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-[#fed023]">person</span>
          <span className="material-symbols-outlined text-[#fed023]">settings</span>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="md:ml-64 mr-0 lg:mr-80 min-h-screen pt-24 md:pt-12 p-8 transition-all">
        {/* Live Counter Section */}
        <div className="mb-12 flex items-center gap-4">
          <div className="relative flex items-center justify-center h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-tertiary"></span>
          </div>
          <h2 className="headline-font font-black text-2xl tracking-tight text-on-surface uppercase">
            {onlineCount?.toLocaleString() || '42,069'} <span className="text-outline">USERS_ONLINE</span>
          </h2>
        </div>

        {/* Interest Matching Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input & Tags Card */}
          <section className="bg-surface-container border-4 border-black p-8 neo-shadow">
            <h3 className="headline-font font-black text-3xl mb-6 text-primary uppercase italic">Interest Matching</h3>
            <div className="space-y-6">
              <div className="relative">
                <input
                  className="w-full bg-surface-container-highest border-4 border-black p-4 headline-font font-bold text-xl placeholder:text-outline focus:border-primary focus:ring-0 transition-none outline-none text-white"
                  placeholder="TYPE_A_VIBE..."
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newInterest && interests.length < 5) {
                      setInterests([...interests, newInterest.startsWith('#') ? newInterest : '#' + newInterest])
                      setNewInterest('')
                    }
                  }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <span className="material-symbols-outlined text-primary text-3xl">add_box</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {interests.map((interest, i) => (
                  <div key={i} className={`border-2 border-black px-4 py-2 headline-font font-black text-sm uppercase flex items-center gap-2 hover:translate-x-1 hover:translate-y-1 transition-none ${i % 2 === 0 ? 'bg-secondary text-black' : 'bg-primary text-black'}`}>
                    {interest} <button onClick={() => removeInterest(i)} className="material-symbols-outlined text-xs">close</button>
                  </div>
                ))}
                {interests.length < 5 && (
                  <div className="bg-surface-container-highest text-white border-2 border-black px-4 py-2 headline-font font-black text-sm uppercase flex items-center gap-2 opacity-50">
                    #techno
                  </div>
                )}
              </div>
            </div>
          </section>
          {/* Status Card */}
          <section className="bg-surface-container border-4 border-black p-8 neo-shadow flex flex-col justify-center items-start">
            <div className="bg-tertiary-container text-on-tertiary-container border-2 border-black p-2 headline-font font-black text-xs mb-4 uppercase">
              Status: Ready
            </div>
            <h3 className="headline-font font-black text-4xl mb-4 text-on-surface uppercase leading-none">Your vibe is currently set to <span className="text-secondary underline decoration-4 underline-offset-4">Chaotic</span>.</h3>
            <p className="text-on-surface-variant font-medium max-w-xs">Matching algorithm prioritizing high-energy groups and active voice channels.</p>
          </section>
        </div>

        {/* Central Action Hero */}
        <div className="mt-16 mb-16 flex flex-col items-center justify-center py-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-light.png')" }}>
          <Link to="/chat" className="group relative bg-primary text-black border-4 border-black px-12 py-8 headline-font font-black text-5xl md:text-7xl uppercase italic tracking-tighter neo-shadow-lg hover:translate-x-2 hover:translate-y-2 hover:shadow-none active:scale-95 transition-none decoration-none">
            START_MATCHING
            <span className="absolute -top-4 -right-4 bg-secondary text-white text-base p-2 border-2 border-black not-italic rotate-12">GO_LIVE</span>
          </Link>
          <p className="mt-8 headline-font font-extrabold text-outline text-xl uppercase tracking-widest">ESTIMATED_WAIT: 4S</p>
        </div>
      </main>

      {/* Right Panel: Active Friends */}
      <aside className="hidden lg:flex flex-col h-screen fixed right-0 top-0 z-40 bg-[#0e0e0e] border-l-4 border-black w-80 shadow-[-8px_0px_0px_0px_#000000] p-6">
        <h2 className="headline-font font-black text-2xl mb-8 text-white flex items-center justify-between uppercase">
          Friends
          <span className="text-primary text-sm font-bold bg-black border-2 border-primary px-2">12</span>
        </h2>
        <div className="space-y-6">
          {/* Friend Item */}
          <div className="flex items-center gap-4 bg-surface-container border-4 border-black p-3 hover:bg-surface-bright transition-none cursor-pointer">
            <div className="relative">
              <img alt="Avatar" className="w-14 h-14 border-2 border-black bg-primary" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj6IYSWW7WQp7qBspb87H6J3kUcgC9Cq_6F8NNITuUPG9Bq_kShyMFOsdiIxptB_dTCjrAYxjPcXBI90WArHUL1JI1netuWLT1tOw955lAiEFnHdAFYDerxXWkGVjMRWZmJFsTkOL6ILdnPHCKfkudFsBKCpkc_Zn-73gzRAxdP-5rGGE01012_tSZIO1mNTPFlVwL5ehnTwkyk-q3sWd8yC96wckD5zvhVCjklmWL8Q2Zw8dBIrVzTR7JHvEgQuOilfHXMuRAWtM"/>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-tertiary border-2 border-black rounded-full"></div>
            </div>
            <div>
              <div className="headline-font font-black text-white uppercase text-lg leading-none">SKULL_KANDY</div>
              <div className="text-tertiary font-bold text-xs uppercase mt-1">Vibe: Hyped</div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-surface-container border-4 border-black p-3 hover:bg-surface-bright transition-none cursor-pointer">
            <div className="relative">
              <img alt="Avatar" className="w-14 h-14 border-2 border-black bg-secondary" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiNEpjxwrPyPGD2ZIL7Pw12JcZvrTXyGYFu7or04euu0LWAxSWGhDSPE3whob60zbmAHhgbZN0yLkGJcgOdSNQmGDxpSJPsNirTl1IHbtWsTbg2z-ngxQgN09AeD1OcdN7NtT_RRRRq9s6aTXuR8cNMFL5R15gHc6VxU151DeEi_s5KlQcwA4SjC3r8rg9HmFgyQgjwURlFlEhH9EOLflCvJry2J5fiamLpG8FcGIw8gVa-3kS1aLBh3d0oq1vu-lI0icCOl-0SyU"/>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-tertiary border-2 border-black rounded-full"></div>
            </div>
            <div>
              <div className="headline-font font-black text-white uppercase text-lg leading-none">LUNAR_WITCH</div>
              <div className="text-outline font-bold text-xs uppercase mt-1">Vibe: Chill</div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-surface-container border-4 border-black p-3 hover:bg-surface-bright transition-none cursor-pointer grayscale opacity-70">
            <div className="relative">
              <img alt="Avatar" className="w-14 h-14 border-2 border-black bg-surface-container-highest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdonhKHvWnDpUWbTiIc15W1sSPwNFmWwje81Jo8xFeytvwb_ILtPnIN-y4TJJQ-JQeExp7wQthyucnL78PtSYujG3o-H58AOzPBkpOoxuBukEHQfiCGj7ce2JXJANl6MZY6ojuWiExOEQIZ-uDq-3xCA4dUNNlrqsHWGe9sf2nGS1iahoUtZjBvlepuZ15-f5eC5EC84bB3i8tUJvwDToagzseclM8PZGvZDrqwM4n4_N5QMjKz4Dk_tmOmQuthx_YN-0NdTNKZiA"/>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-surface-variant border-2 border-black rounded-full"></div>
            </div>
            <div>
              <div className="headline-font font-black text-white uppercase text-lg leading-none">GHOST_MODE</div>
              <div className="text-outline font-bold text-xs uppercase mt-1">OFFLINE</div>
            </div>
          </div>
        </div>
        <button className="block text-center mt-auto w-full bg-surface-container-highest text-white border-4 border-black p-4 headline-font font-black uppercase neo-shadow active:translate-x-1 active:translate-y-1 active:shadow-none transition-none">
          GET_PREMIUM
        </button>
      </aside>

      {/* BottomNavBar - Mobile Only */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-stretch h-16 md:hidden bg-[#0e0e0e] border-t-4 border-black font-['Epilogue'] font-bold text-[10px] uppercase">
        <Link className="flex flex-col items-center justify-center bg-[#fed023] text-black h-full px-2 flex-1 active:translate-y-1 transition-none" to="/chat">
          <span className="material-symbols-outlined mb-1">chat_bubble</span>
          <span>CHAT</span>
        </Link>
        <a className="flex flex-col items-center justify-center text-white h-full px-2 flex-1 hover:bg-[#ff6d8d] active:translate-y-1 transition-none" href="#">
          <span className="material-symbols-outlined mb-1">explore</span>
          <span>DISCOVER</span>
        </a>
        <a className="flex flex-col items-center justify-center text-white h-full px-2 flex-1 hover:bg-[#ff6d8d] active:translate-y-1 transition-none" href="#">
          <span className="material-symbols-outlined mb-1">sensors</span>
          <span>LIVE</span>
        </a>
        <a className="flex flex-col items-center justify-center text-white h-full px-2 flex-1 hover:bg-[#ff6d8d] active:translate-y-1 transition-none" href="#">
          <span className="material-symbols-outlined mb-1">account_circle</span>
          <span>PROFILE</span>
        </a>
      </nav>
    </div>
  )
}

export default Lobby
