import React, { useState, useEffect } from 'react'
import AppLayout from '../components/layout/AppLayout'
import NeoButton from '../components/common/NeoButton'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'
import { authService } from '../services/api'
import { Hash, Zap, Users, ShieldAlert, Award, Search, X } from 'lucide-react'

const Lobby = () => {
  const navigate = useNavigate()
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
  }

  const removeInterest = (index) => {
    setInterests(interests.filter((_, i) => i !== index))
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
        </div>

        {/* Matching Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
  )
}

export default Lobby
