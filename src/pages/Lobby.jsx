import React, { useState, useEffect } from 'react'
import AppLayout from '../components/layout/AppLayout'
import NeoButton from '../components/common/NeoButton'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'
import { authService } from '../services/api'
import { Hash, Zap, Users, ShieldAlert, Award, Search, X } from 'lucide-react'
import EditableWrapper from '../components/common/EditableWrapper'

const Lobby = () => {
  const { socialState, user, setUser, isQueueing, queuePosition, socket, interests, setInterests, onlineCount, isConnected } = useSocket()
  const [interestInput, setInterestInput] = useState('')
  const [isPremiumOpen, setIsPremiumOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
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

  const handleStartMatching = () => {
    if (socket) {
      socket.emit('join_queue', {
        interests: interests,
        withInterests: interests.length > 0,
        genderFilter: 'both'
      })
      navigate('/chat')
    }
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

  return (
    <AppLayout>
      <div className="p-4 md:p-8 flex flex-col gap-8 pb-24 md:pb-8">
        {/* Header Stats */}
        <EditableWrapper id="lobby_stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary text-black p-6 border-4 border-black shadow-lg flex justify-between items-center group overflow-hidden">
              <div>
                <div className="text-[10px] font-black uppercase opacity-60">TOTAL_CHATS_INITIATED</div>
                <div className="text-5xl font-headline font-black italic">124</div>
              </div>
              <Zap size={64} className="opacity-20 -mr-4 group-hover:scale-125 transition-transform" />
            </div>
            <div className="bg-secondary text-black p-6 border-4 border-black shadow-lg flex justify-between items-center group overflow-hidden">
              <div>
                <div className="text-[10px] font-black uppercase opacity-60">TIME_IN_UNDERGROUND</div>
                <div className="text-5xl font-headline font-black italic">1,042m</div>
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
        </EditableWrapper>

        {/* Status Section */}
        <div className="flex items-center gap-4 text-white">
          <div className="relative flex items-center justify-center h-4 w-4">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-tertiary' : 'bg-error'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-tertiary' : 'bg-error'}`}></span>
          </div>
          <h2 className="font-headline font-black text-2xl tracking-tight uppercase">
            {isConnected ? onlineCount?.toLocaleString() || '1,337' : 'OFFLINE'} <span className="text-outline">{isConnected ? 'USERS_ONLINE' : 'LINK_SEVERED'}</span>
          </h2>
        </div>

        {/* Matching Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interest Matching */}
          <EditableWrapper id="lobby_interests" className="h-full">
            <section className="bg-surface-container border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000000] h-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-headline font-black text-3xl text-primary uppercase italic">Interest Matching</h3>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Match with kindred spirits by adding up to 5 frequency tags.</p>
                </div>
                <Search className="text-outline" />
              </div>
              
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
                    <Zap size={24} className="text-primary" />
                  </button>
                </form>
                <div className="flex flex-wrap gap-4">
                  {interests.map((interest) => (
                    <div 
                      key={interest}
                      onClick={() => handleRemoveInterest(interest)}
                      className="bg-primary text-black border-2 border-black px-4 py-2 font-headline font-black text-sm uppercase flex items-center gap-2 hover:translate-x-1 hover:translate-y-1 transition-none cursor-pointer"
                    >
                      #{interest.toUpperCase()} <X size={14} />
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
          </EditableWrapper>

          {/* Social / Connections */}
          <EditableWrapper id="lobby_social" className="h-full">
            <section className="bg-surface-container border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000000] h-full flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-headline font-black uppercase italic mb-2">CONNECTIONS</h2>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Your tribe in the machine. Stay connected, stay anonymous.</p>
                </div>
                <Users className="text-outline" />
              </div>

              <div className="flex flex-col gap-3">
                {socialState?.friends?.length > 0 ? (
                  socialState.friends.map((friend, i) => (
                    <div key={i} className="bg-surface-container-highest border-2 border-black p-4 flex justify-between items-center group hover:bg-black transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary border-2 border-black flex items-center justify-center font-black text-lg">?</div>
                        <span className="font-headline font-black text-white uppercase">{friend.username}</span>
                      </div>
                      <div className="text-[10px] font-black uppercase text-tertiary">ONLINE</div>
                    </div>
                  ))
                ) : (
                  <div className="border-4 border-black border-dashed p-6 text-center text-outline font-bold uppercase text-xs">
                    NO_FRIENDS_DETECTED
                  </div>
                )}
              </div>
            </section>
          </EditableWrapper>
        </div>

        {/* Central Action Hero */}
        <div className="flex flex-col items-center justify-center py-12">
          <NeoButton 
            disabled={!isConnected}
            onClick={isQueueing ? handleLeaveQueue : handleStartMatching}
            variant="primary"
            className={`group relative text-5xl md:text-7xl py-12 px-16 ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isQueueing ? 'STOP_QUEUE' : isConnected ? 'START_MATCHING' : 'OFFLINE_MODE'}
            <span className={`absolute -top-4 -right-4 ${isConnected ? 'bg-secondary' : 'bg-error'} text-white text-base p-2 border-2 border-black not-italic rotate-12`}>
              {isConnected ? 'GO_LIVE' : 'NO_SIGNAL'}
            </span>
          </NeoButton>
          
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

        {/* Warning Banner */}
        <div className="bg-error text-black p-4 border-4 border-black shadow-[4px_4px_0px_#000000] flex items-center gap-4">
          <ShieldAlert size={32} strokeWidth={3} />
          <div className="font-headline font-black uppercase tracking-tight text-sm">
            REMINDER: VIBECHAT IS THE UNDERGROUND. SHARE NOTHING PERSONAL. STAY UNTRACEABLE.
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Lobby
