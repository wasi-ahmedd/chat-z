<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react'
import AppLayout from '../components/layout/AppLayout'
import NeoButton from '../components/common/NeoButton'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'
import { authService } from '../services/api'
import { Hash, Zap, Users, ShieldAlert, Award, Search, X } from 'lucide-react'
=======
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'
import ProfileModal from '../components/ProfileModal'
>>>>>>> Stashed changes

const Lobby = () => {
  const { socialState, user, isQueueing, queuePosition, socket, interests, setInterests, onlineCount, isConnected } = useSocket()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [interestInput, setInterestInput] = useState('')
  const navigate = useNavigate()
<<<<<<< Updated upstream
  const { user, setUser, socket, onlineCount } = useSocket()
  const [interests, setInterests] = useState(['NEO_BRUTALISM', 'WEB3_ANARCHY'])
  const [newInterest, setNewInterest] = useState('')
  const [stats, setStats] = useState({ totalChats: 124, minutesSpent: 1042 })
  const [genderFilter, setGenderFilter] = useState('both') // male, both, female
  const [isPremiumOpen, setIsPremiumOpen] = useState(false)

  useEffect(() => {
    // Load local user data if session exists
    const loadUser = async () => {
      try {
        const response = await authService.getMe()
        setUser(response.data)
      } catch (err) {
        console.error('Session expired', err)
        navigate('/onboarding')
      }
    }
    if (!user) loadUser()
  }, [user, navigate, setUser])

  const addInterest = () => {
    if (newInterest && interests.length < 5) {
      setInterests([...interests, newInterest.toUpperCase()])
      setNewInterest('')
    }
=======

  const handleStartMatching = () => {
    if (socket) {
      socket.emit('join_queue', {
        interests: interests,
        withInterests: interests.length > 0,
        genderFilter: 'both'
      })
      navigate('/chat')
    }
>>>>>>> Stashed changes
  }

  const handleAddInterest = (e) => {
    if (e) e.preventDefault()
    const val = interestInput.trim().toLowerCase()
    if (val && !interests.includes(val) && interests.length < 5) {
      setInterests([...interests, val])
      setInterestInput('')
    }
  }

  const handleRemoveInterest = (interest) => {
    setInterests(interests.filter(i => i !== interest))
  }

  const handleLeaveQueue = () => {
    if (socket) {
      socket.emit('leave_queue')
    }
  }

  const startChat = () => {
    navigate('/chat', { state: { interests, genderFilter } })
  }

  const handleGenderChange = (value) => {
    if (value === 'both') {
      setGenderFilter('both')
      return
    }

    if (!user?.isPremium) {
      setIsPremiumOpen(true)
      return
    }

    setGenderFilter(value)
  }

  return (
<<<<<<< Updated upstream
    <AppLayout>
      <div className="p-4 md:p-8 flex flex-col gap-8 pb-24 md:pb-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary text-black p-6 border-4 border-black shadow-lg flex justify-between items-center group overflow-hidden">
            <div>
              <div className="text-[10px] font-black uppercase opacity-60">TOTAL_CHATS_INITIATED</div>
              <div className="text-5xl font-headline font-black italic">{stats.totalChats}</div>
            </div>
            <Zap size={64} className="opacity-20 -mr-4 group-hover:scale-125 transition-transform" />
          </div>
          <div className="bg-secondary text-black p-6 border-4 border-black shadow-lg flex justify-between items-center group overflow-hidden">
            <div>
              <div className="text-[10px] font-black uppercase opacity-60">TIME_IN_UNDERGROUND</div>
              <div className="text-5xl font-headline font-black italic">{stats.minutesSpent}m</div>
            </div>
            <Users size={64} className="opacity-20 -mr-4 group-hover:scale-125 transition-transform" />
          </div>
          <div className="bg-white text-black p-6 border-4 border-black shadow-lg flex justify-between items-center group overflow-hidden">
            <div>
              <div className="text-[10px] font-black uppercase opacity-60">VIBE_REPUTATION</div>
              <div className="text-5xl font-headline font-black italic">RIOTER</div>
            </div>
            <Award size={64} className="opacity-20 -mr-4 group-hover:scale-125 transition-transform" />
          </div>
=======
    <div className="bg-background text-on-background min-h-screen font-body overflow-x-hidden">
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-40 bg-[#191919] font-headline font-black uppercase border-r-4 border-black w-64 shadow-[8px_0px_0px_0px_#000000]">
        <div className="p-6">
          <h1 className="text-2xl font-black text-[#fed023]"><Link to="/" className="decoration-none text-inherit">VIBECHAT</Link></h1>
          <p className="text-[10px] tracking-widest text-[#ff6d8d] mt-1 italic">RAW_MODE_ON</p>
        </div>
        <nav className="flex-1 mt-4">
          <div className="flex items-center gap-4 bg-[#fed023] text-black border-2 border-black m-2 p-4 transition-none cursor-default">
            <span className="material-symbols-outlined">forum</span>
            <span>CHANNELS</span>
          </div>
          <a className="flex items-center gap-4 text-white hover:text-[#9fff88] p-4 transition-none active:scale-95 decoration-none" href="#">
            <span className="material-symbols-outlined">group</span>
            <span>PEOPLE</span>
          </a>
          <Link className="flex items-center gap-4 text-white hover:text-[#9fff88] p-4 transition-none active:scale-95 decoration-none" to="/history">
            <span className="material-symbols-outlined">history</span>
            <span>HISTORY</span>
          </Link>
          <a className="flex items-center gap-4 text-white hover:text-[#9fff88] p-4 transition-none active:scale-95 decoration-none" href="#">
            <span className="material-symbols-outlined">bolt</span>
            <span>VIBES</span>
          </a>
        </nav>
        <div className="p-4 mt-auto space-y-4 mb-4">
          <div className="flex gap-4">
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="flex-1 bg-surface-container border-4 border-black p-3 hover:bg-primary hover:text-black transition-none shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase font-black flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">person</span>
              <span className="text-[10px]">PROFILE</span>
            </button>
            <Link 
              to="/settings"
              className="flex-1 bg-surface-container border-4 border-black p-3 hover:bg-secondary hover:text-black transition-none shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase font-black flex items-center justify-center gap-2 decoration-none text-white hover:decoration-none"
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="text-[10px]">SETTINGS</span>
            </Link>
          </div>
          <button 
            disabled={!isConnected}
            onClick={isQueueing ? handleLeaveQueue : handleStartMatching}
            className={`block text-center w-full ${!isConnected ? 'bg-surface-container text-outline' : isQueueing ? 'bg-error' : 'bg-[#ff6d8d]'} text-black border-4 border-black p-4 font-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] transition-none active:translate-x-1 active:translate-y-1 active:shadow-none uppercase`}
          >
            {isQueueing ? 'STOP_MATCH' : isConnected ? 'START_CHAT' : 'CONNECTING...'}
          </button>
        </div>
      </aside>

      {/* TopAppBar - Mobile Only */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#0e0e0e] border-b-4 border-black md:hidden shadow-[4px_4px_0px_0px_#000000]">
        <div className="text-3xl font-black italic text-[#fed023] tracking-tighter font-headline uppercase">VIBECHAT</div>
        <div className="flex gap-4">
          <button onClick={() => setIsProfileOpen(true)} className="material-symbols-outlined text-[#fed023]">person</button>
          <Link to="/settings" className="material-symbols-outlined text-[#fed023] decoration-none">settings</Link>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="md:ml-64 mr-0 lg:mr-80 min-h-screen pt-24 md:pt-12 p-8 transition-all">
        {/* Live Counter Section */}
        <div className="mb-12 flex items-center gap-4 text-white">
          <div className="relative flex items-center justify-center h-4 w-4">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-tertiary' : 'bg-error'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-tertiary' : 'bg-error'}`}></span>
          </div>
          <h2 className="font-headline font-black text-2xl tracking-tight uppercase">
            {isConnected ? onlineCount?.toLocaleString() || '1,337' : 'OFFLINE'} <span className="text-outline">{isConnected ? 'USERS_ONLINE' : 'LINK_SEVERED'}</span>
          </h2>
>>>>>>> Stashed changes
        </div>

        {/* Matching Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
<<<<<<< Updated upstream
          {/* Interest Matching */}
          <div className="bg-surface-container border-4 border-black p-8 shadow-lg flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-4xl font-headline font-black uppercase italic italic mb-2">INTERESTS</h2>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest leading-relaxed">Match with kindred spirits by adding up to 5 frequency tags.</p>
              </div>
              <Search className="text-outline" />
            </div>

            <div className="flex flex-wrap gap-2">
              {interests.map((interest, i) => (
                <div key={i} className="flex items-center gap-2 bg-black text-white px-4 py-2 border-2 border-white font-bold text-xs">
                  <Hash size={12} className="text-primary" /> {interest}
                  <button onClick={() => removeInterest(i)} className="hover:text-secondary"><X size={14} /></button>
                </div>
              ))}
              {interests.length < 5 && (
                <div className="flex-1 min-w-[150px] relative">
                  <input 
                    type="text" 
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                    placeholder="ADD_VIBE..."
                    className="w-full bg-surface-container-highest border-2 border-black p-2 font-bold focus:outline-none focus:border-tertiary uppercase text-xs"
                  />
                  <button onClick={addInterest} className="absolute right-2 top-1/2 -translate-y-1/2 text-tertiary">
                    <Zap size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Gender Filter Section */}
            <div className="mt-4 border-t-4 border-black pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline font-black text-xs uppercase italic tracking-widest text-outline">GENDER_TARGET</h3>
                {!user?.isPremium && (
                  <span className="bg-primary text-black px-2 py-0.5 text-[8px] font-black border border-black shadow-[2px_2px_0px_#000000]">PREMIUM_ONLY</span>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-0 border-4 border-black overflow-hidden relative">
                {/* Male */}
                <button 
                  onClick={() => handleGenderChange('male')}
                  className={`py-4 font-headline font-black text-sm uppercase transition-all flex flex-col items-center gap-1 ${genderFilter === 'male' ? 'bg-secondary text-black' : 'bg-surface-container-low text-white hover:bg-black'}`}
                >
                  MALE
                </button>

                {/* Both (Diamond) */}
                <button 
                  onClick={() => handleGenderChange('both')}
                  className={`py-4 font-headline font-black text-sm uppercase transition-all flex flex-col items-center justify-center gap-1 relative ${genderFilter === 'both' ? 'bg-primary text-black' : 'bg-surface-container-low text-white hover:bg-black'}`}
                >
                  <div className={`w-8 h-8 rotate-45 border-4 border-black flex items-center justify-center transition-all ${genderFilter === 'both' ? 'bg-white' : 'bg-outline'}`}>
                    <div className="w-2 h-2 bg-black -rotate-45"></div>
                  </div>
                  <span className="text-[10px] mt-1">BOTH</span>
                </button>

                {/* Female */}
                <button 
                  onClick={() => handleGenderChange('female')}
                  className={`py-4 font-headline font-black text-sm uppercase transition-all flex flex-col items-center gap-1 ${genderFilter === 'female' ? 'bg-tertiary text-black' : 'bg-surface-container-low text-white hover:bg-black'}`}
                >
                  FEMALE
                </button>
              </div>
              <p className="text-[9px] font-black uppercase text-center mt-3 tracking-tighter opacity-70">
                {genderFilter === 'both' ? 'ANONYMOUS_VOID_ENABLED_FOR_ALL' : 'TARGETED_FREQUENCY_LOCKED_TO_SENDER'}
              </p>
            </div>

            <NeoButton onClick={startChat} variant="primary" className="mt-4 py-6 text-2xl group">
              START_MATCHING <Zap className="inline-block ml-2 group-hover:animate-pulse" />
            </NeoButton>
          </div>

          {/* Social / Friends List */}
          <div className="bg-surface-container border-4 border-black p-8 shadow-lg flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-4xl font-headline font-black uppercase italic italic mb-2">CONNECTIONS</h2>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest leading-relaxed">Your tribe in the machine. Stay connected, stay anonymous.</p>
              </div>
              <Users className="text-outline" />
            </div>

            <div className="flex flex-col gap-3">
              {[
                { name: 'SKULL_KANDY', status: 'ONLINE', color: 'text-tertiary' },
                { name: 'LUNAR_WITCH', status: 'OFFLINE', color: 'text-outline' },
                { name: 'GHOST_MODE', status: 'CHATTING', color: 'text-secondary' }
              ].map((friend, i) => (
                <div key={i} className="bg-surface-container-highest border-2 border-black p-4 flex justify-between items-center group hover:bg-black transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface-container-low border-2 border-black flex items-center justify-center font-black text-lg">?</div>
                    <span className="font-headline font-black text-white">{friend.name}</span>
                  </div>
                  <div className={`text-[10px] font-black uppercase ${friend.color}`}>{friend.status}</div>
                </div>
              ))}
            </div>

            <button className="w-full py-2 border-2 border-black border-dashed text-[10px] font-black uppercase text-outline hover:text-white transition-none">
              VIEW_ALL_HISTORY
            </button>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-error text-black p-4 border-4 border-black shadow-[4px_4px_0px_#000000] flex items-center gap-4">
          <ShieldAlert size={32} strokeWidth={3} />
          <div className="font-headline font-black uppercase tracking-tight text-sm">
            REMINDER: VIBECHAT IS THE UNDERGROUND. SHARE NOTHING PERSONAL. STAY UNTRACEABLE.
          </div>
        </div>
      </div>
      <PremiumModal isOpen={isPremiumOpen} onClose={() => setIsPremiumOpen(false)} />
    </AppLayout>
=======
          {/* Input & Tags Card */}
          <section className="bg-surface-container border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000000]">
            <h3 className="font-headline font-black text-3xl mb-6 text-primary uppercase italic">Interest Matching</h3>
            <div className="space-y-6">
              <form onSubmit={handleAddInterest} className="relative">
                <input 
                  className="w-full bg-surface-container-highest border-4 border-black p-4 font-bold text-xl placeholder:text-outline focus:border-primary focus:ring-0 transition-none outline-none text-white font-body" 
                  placeholder="TYPE_A_VIBE..." 
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer bg-none border-none p-0 flex items-center"
                >
                  <span className="material-symbols-outlined text-primary text-3xl">add_box</span>
                </button>
              </form>
              <div className="flex flex-wrap gap-4">
                {interests.map((interest) => (
                  <div 
                    key={interest}
                    onClick={() => handleRemoveInterest(interest)}
                    className="bg-primary text-black border-2 border-black px-4 py-2 font-headline font-black text-sm uppercase flex items-center gap-2 hover:translate-x-1 hover:translate-y-1 transition-none cursor-pointer"
                  >
                    #{interest} <span className="material-symbols-outlined text-xs">close</span>
                  </div>
                ))}
                {interests.length === 0 && (
                  <div className="text-outline italic text-sm uppercase font-bold tracking-widest px-2">
                    Add_Interests_to_Narrow_Search
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Status Card */}
          <section className="bg-surface-container border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000000] flex flex-col justify-center items-start">
            <div className="bg-tertiary text-black border-2 border-black p-2 font-headline font-black text-xs mb-4 uppercase">
              Status: {isQueueing ? 'SEARCHING...' : 'READY'}
            </div>
            <h3 className="font-headline font-black text-4xl mb-4 text-on-surface uppercase leading-none italic">
              Your vibe is currently set to <span className="text-secondary underline decoration-4 underline-offset-8 capitalize">{interests[0] || 'Chaotic'}</span>.
            </h3>
            <p className="text-on-surface-variant font-medium max-w-xs">{interests.length > 0 ? `Matching with other ${interests[0]} fans and high-energy groups.` : 'Matching algorithm prioritizing high-energy groups and active channels.'}</p>
          </section>
        </div>

        {/* Central Action Hero */}
        <div className="mt-16 mb-16 flex flex-col items-center justify-center py-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')]">
          <button 
            disabled={!isConnected}
            onClick={isQueueing ? handleLeaveQueue : handleStartMatching}
            className={`group relative ${!isConnected ? 'bg-surface-container text-outline' : 'bg-primary'} text-black border-4 border-black px-12 py-8 font-headline font-black text-5xl md:text-7xl uppercase italic tracking-tighter shadow-[12px_12px_0px_0px_#000000] ${isConnected ? 'hover:translate-x-2 hover:translate-y-2 hover:shadow-none active:scale-95' : 'cursor-not-allowed'} transition-none`}
          >
            {isQueueing ? 'STOP_QUEUE' : isConnected ? 'START_MATCHING' : 'OFFLINE_MODE'}
            <span className={`absolute -top-4 -right-4 ${isConnected ? 'bg-secondary' : 'bg-error'} text-white text-base p-2 border-2 border-black not-italic rotate-12`}>
              {isConnected ? 'GO_LIVE' : 'NO_SIGNAL'}
            </span>
          </button>
          
          {isQueueing && (
            <div className="mt-8 text-center space-y-4">
               <p className="font-headline font-extrabold text-primary text-4xl uppercase tracking-widest animate-pulse">
                QUEUE_POSITION: {queuePosition || '...'}
              </p>
              <p className="font-headline font-extrabold text-outline text-xl uppercase tracking-widest">
                ESTIMATED_WAIT: 4S
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Right Panel: Active Friends */}
      <aside className="hidden lg:flex flex-col h-screen fixed right-0 top-0 z-40 bg-[#0e0e0e] border-l-4 border-black w-80 shadow-[-8px_0px_0px_0px_#000000] p-6">
        <h2 className="font-headline font-black text-2xl mb-8 text-white flex items-center justify-between uppercase">
          Friends 
          <span className="text-primary text-sm font-bold bg-black border-2 border-primary px-2">{socialState?.counts?.totalFriendUnread || 0}</span>
        </h2>
        <div className="space-y-6 overflow-y-auto pr-2">
          {socialState?.friends && socialState.friends.length > 0 ? (
            socialState.friends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-4 bg-surface-container border-4 border-black p-3 hover:bg-surface-bright transition-none cursor-pointer">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 border-2 border-black bg-primary flex items-center justify-center font-black">?</div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-tertiary border-2 border-black rounded-full"></div>
                </div>
                <div>
                  <div className="font-headline font-black text-white uppercase text-lg leading-none truncate w-40">{friend.username}</div>
                  <div className="text-tertiary font-bold text-xs uppercase mt-1">Vibe: Hyped</div>
                </div>
              </div>
            ))
          ) : (
            <div className="border-4 border-black border-dashed p-6 text-center text-outline font-bold uppercase text-xs">
              NO_FRIENDS_DETECTED
            </div>
          )}
        </div>
        <button className="block text-center mt-auto w-full bg-surface-container-highest text-white border-4 border-black p-4 font-headline font-black uppercase shadow-[4px_4px_0px_0px_#000000] hover:bg-primary hover:text-black transition-none">
          GET_PREMIUM
        </button>
      </aside>

      {/* BottomNavBar - Mobile Only */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-stretch h-16 md:hidden bg-[#0e0e0e] border-t-4 border-black font-headline font-bold text-[10px] uppercase">
        <Link className="flex flex-col items-center justify-center text-white h-full px-2 flex-1 hover:bg-[#ff6d8d] active:translate-y-1 transition-none decoration-none" to="/chat">
          <span className="material-symbols-outlined mb-1">chat_bubble</span>
          <span>CHAT</span>
        </Link>
        <a className="flex flex-col items-center justify-center text-white h-full px-2 flex-1 hover:bg-[#ff6d8d] active:translate-y-1 transition-none decoration-none" href="#">
          <span className="material-symbols-outlined mb-1">explore</span>
          <span>DISCOVER</span>
        </a>
        <a className="flex flex-col items-center justify-center text-white h-full px-2 flex-1 hover:bg-[#ff6d8d] active:translate-y-1 transition-none decoration-none" href="#">
          <span className="material-symbols-outlined mb-1">sensors</span>
          <span>LIVE</span>
        </a>
        <button onClick={() => setIsProfileOpen(true)} className="flex flex-col items-center justify-center text-white h-full px-2 flex-1 hover:bg-[#ff6d8d] active:translate-y-1 transition-none">
          <span className="material-symbols-outlined mb-1">account_circle</span>
          <span>PROFILE</span>
        </button>
      </nav>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={user}
      />
    </div>
>>>>>>> Stashed changes
  )
}

export default Lobby
