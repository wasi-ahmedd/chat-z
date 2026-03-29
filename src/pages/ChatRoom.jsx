import React, { useState, useEffect, useRef } from 'react'
import AppLayout from '../components/layout/AppLayout'
import NeoButton from '../components/common/NeoButton'
import { useSocket } from '../context/SocketContext'
<<<<<<< Updated upstream
import { useLocation, useNavigate } from 'react-router-dom'
import { Send, X, SkipForward, Hash, Radio } from 'lucide-react'
=======
import ProfileModal from '../components/ProfileModal'
>>>>>>> Stashed changes

const ChatRoom = () => {
  const { socket, user, isQueueing, queuePosition, socialState, interests, activeMatch, setActiveMatch } = useSocket()
  const location = useLocation()
  const navigate = useNavigate()
<<<<<<< Updated upstream
  const [status, setStatus] = useState('FINDING_STRANGER') // FINDING_STRANGER, MATCHED, DISCONNECTED
  const [partner, setPartner] = useState(null)
=======
  
  const [isMatching, setIsMatching] = useState(!activeMatch)
  const [partner, setPartner] = useState(activeMatch?.partner || null)
>>>>>>> Stashed changes
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [sharedInterests, setSharedInterests] = useState([])
  const [queuePosition, setQueuePosition] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
<<<<<<< Updated upstream
  const [currentMatchId, setCurrentMatchId] = useState(null)
=======
  const [matchId, setMatchId] = useState(null)
  const [sharedInterests, setSharedInterests] = useState([])
  const [isProfileOpen, setIsProfileOpen] = useState(false)

>>>>>>> Stashed changes
  const messagesEndRef = useRef(null)

  const userInterests = location.state?.interests || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
<<<<<<< Updated upstream
    if (!socket || !user) return

    // Join the queue
    socket.emit('join_queue', {
      interests: userInterests,
      withInterests: userInterests.length > 0
    })

    const onQueueJoined = ({ position }) => {
      setQueuePosition(position)
    }

    const onMatchFound = ({ matchId, partner, sharedInterests }) => {
      setStatus('MATCHED')
      setPartner(partner)
      setCurrentMatchId(matchId)
      setSharedInterests(sharedInterests || [])
      setMessages([])
    }

    const onNewMessage = (message) => {
      setMessages((prev) => [...prev, { ...message, fromSelf: message.sender === user?.id }])
    }

    const onPartnerDisconnected = () => {
      setStatus('DISCONNECTED')
    }

    const onPartnerTyping = ({ isTyping }) => {
      setIsTyping(isTyping)
    }

    socket.on('queue_joined', onQueueJoined)
    socket.on('match_found', onMatchFound)
    socket.on('new_message', onNewMessage)
    socket.on('partner_disconnected', onPartnerDisconnected)
    socket.on('partner_typing', onPartnerTyping)
=======
    let syncInterval

    if (activeMatch) {
      setMatchId(activeMatch.matchId)
      setPartner(activeMatch.partner)
      setSharedInterests(activeMatch.sharedInterests || [])
      setIsMatching(false)
      if (messages.length === 0) {
        setMessages([{ type: 'system', text: `ESTABLISHED_LINK_WITH_${activeMatch.partner.username}` }])
      }
    } else {
      const checkActiveMatch = async () => {
        try {
          const { matchService } = await import('../services/api')
          const response = await matchService.getActiveMatch()
          if (response.data && response.data.matchId) {
            setActiveMatch(response.data)
            setMatchId(response.data.matchId)
            setPartner(response.data.partner)
            setSharedInterests(response.data.sharedInterests || [])
            setMessages(response.data.messages || [{ type: 'system', text: 'RECONNECTED_TO_STATION' }])
            setIsMatching(false)
          }
        } catch (err) {
          console.error('Failed to check active match', err)
        }
      }

      checkActiveMatch()
      
      // Fallback Polling: Check every 5s if still matching
      syncInterval = setInterval(() => {
        if (isMatching) {
          console.log('[sync] Running 5s safety poll for active match...')
          checkActiveMatch()
        }
      }, 5000)
    }

    return () => {
      if (syncInterval) clearInterval(syncInterval)
    }
  }, [activeMatch, isMatching])

  useEffect(() => {
    if (!socket) return

    socket.on('new_message', (msg) => {
      setMessages(prev => [...prev, { 
        text: msg.text, 
        timestamp: msg.timestamp, 
        type: msg.fromSelf ? 'user' : 'partner' 
      }])
    })

    socket.on('partner_typing', (data) => {
      setIsTyping(data.isTyping)
    })

    socket.on('partner_disconnected', () => {
      setMessages(prev => [...prev, { type: 'system', text: 'STRANGER_DISCONNECTED_FROM_CHANNEL' }])
      setPartner(null)
    })
>>>>>>> Stashed changes

    socket.on('chat_error', (data) => {
      setMessages(prev => [...prev, { type: 'system', text: `ERROR: ${data.message}` }])
    })

    return () => {
<<<<<<< Updated upstream
      socket.emit('leave_queue')
      socket.emit('disconnect_match')
      socket.off('queue_joined', onQueueJoined)
      socket.off('match_found', onMatchFound)
      socket.off('new_message', onNewMessage)
      socket.off('partner_disconnected', onPartnerDisconnected)
      socket.off('partner_typing', onPartnerTyping)
    }
  }, [socket, user, userInterests])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputText.trim() || status !== 'MATCHED' || !partner || !currentMatchId) return

    socket.emit('send_message', { 
      text: inputText,
      matchId: currentMatchId
    })
    setInputText('')
    socket.emit('typing_stop', { matchId: currentMatchId })
  }

  const handleInputChange = (e) => {
    setInputText(e.target.value)
    if (status === 'MATCHED' && currentMatchId) {
      socket.emit('typing_start', { matchId: currentMatchId })
      // Auto stop typing after 3 seconds of inactivity
      clearTimeout(window.typingTimeout)
      window.typingTimeout = setTimeout(() => {
        socket.emit('typing_stop', { matchId: currentMatchId })
=======
      socket.off('match_found')
      socket.off('new_message')
      socket.off('partner_typing')
      socket.off('partner_disconnected')
      socket.off('chat_error')
    }
  }, [socket])

  const sendMessage = () => {
    if (input.trim() && socket && matchId) {
      socket.emit('send_message', {
        matchId,
        text: input,
        messageId: crypto.randomUUID()
      })
      setInput('')
      socket.emit('typing_stop', { matchId })
    }
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    if (socket && matchId) {
      socket.emit('typing_start', { matchId })
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', { matchId })
>>>>>>> Stashed changes
      }, 3000)
    }
  }

  const handleNextMatch = () => {
<<<<<<< Updated upstream
    setStatus('FINDING_STRANGER')
    setPartner(null)
    setCurrentMatchId(null)
    setMessages([])
    socket.emit('disconnect_match', { matchId: currentMatchId })
    socket.emit('join_queue', {
      interests: userInterests,
      withInterests: userInterests.length > 0
    })
  }

  const handleLeave = () => {
    socket.emit('disconnect_match', { matchId: currentMatchId })
    navigate('/lobby')
  }

  return (
    <AppLayout hideSidebar={true}>
      <div className="h-[calc(100vh-80px)] flex flex-col pt-4">
        {/* Stranger Status Header */}
        <div className="sticky top-0 z-30 bg-surface border-b-4 border-black p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 border-2 border-black shadow-[2px_2px_0px_#000000] ${status === 'MATCHED' ? 'bg-tertiary' : 'bg-secondary animate-pulse'}`}></div>
              <h2 className="text-2xl font-headline font-black uppercase tracking-tight">
                STATUS: <span className={status === 'MATCHED' ? 'text-primary' : 'text-secondary'}>
                  {status === 'MATCHED' ? 'CONNECTED' : status === 'DISCONNECTED' ? 'DISCONNECTED' : `SEARCHING (POS: ${queuePosition})`}
                </span>
              </h2>
            </div>
            {status === 'MATCHED' && partner && (
              <div className="flex flex-wrap gap-2">
                <span className="bg-black border-2 border-white text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter italic">STRANGER: {partner.username}</span>
                {sharedInterests.map((interest, i) => (
                  <span key={i} className="bg-tertiary text-black px-3 py-1 text-[10px] font-black border-2 border-black uppercase flex items-center gap-1">
                    <Hash size={10} /> {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <NeoButton onClick={handleNextMatch} variant="tertiary" className="flex-1 md:flex-none py-2 px-6 flex items-center gap-2">
              NEXT MATCH <SkipForward size={16} />
            </NeoButton>
            <NeoButton onClick={handleLeave} variant="error" className="flex-1 md:flex-none py-2 px-6 flex items-center gap-2">
              LEAVE <X size={16} />
            </NeoButton>
          </div>
        </div>

        {/* Chat Log */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-8 bg-[#0e0e0e] custom-scrollbar">
          {(status === 'FINDING_STRANGER' || status === 'DISCONNECTED') && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 bg-surface-container border-4 border-black mb-8 flex items-center justify-center shadow-lg animate-bounce">
                <Radio size={48} className="text-primary" />
              </div>
              <h3 className="text-4xl font-headline font-black uppercase italic mb-4">
                {status === 'DISCONNECTED' ? 'CONNECTION SEVERED' : 'TUNING INTO FREQUENCY...'}
              </h3>
              <p className="max-w-md text-on-surface-variant font-bold uppercase text-xs tracking-[0.2em] leading-relaxed">
                {status === 'DISCONNECTED' 
                  ? 'Your partner has vanished into the binary. Ready for a new riot?'
                  : `Searching the underground for another anonymous soul on your frequency. Position in match queue: ${queuePosition}`}
              </p>
              {status === 'DISCONNECTED' && (
                <NeoButton onClick={handleNextMatch} className="mt-8">FIND NEW RIOT</NeoButton>
              )}
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.fromSelf ? 'items-end self-end' : 'items-start'} max-w-[85%] md:max-w-[60%]`}>
              <div className={`p-4 border-4 border-black shadow-${msg.fromSelf ? '[-6px_6px_0px_#000000]' : '[6px_6px_0px_#000000]'} font-bold leading-tight ${msg.fromSelf ? 'bg-primary text-black italic' : 'bg-white text-black'}`}>
                {msg.text}
              </div>
              <span className="mt-2 text-[10px] font-black uppercase text-on-surface-variant">
                {msg.fromSelf ? 'YOU' : 'STRANGER'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary animate-pulse border border-black"></div>
              <div className="w-2 h-2 bg-secondary animate-pulse border border-black delay-75"></div>
              <div className="w-2 h-2 bg-secondary animate-pulse border border-black delay-150"></div>
              <span className="text-[10px] font-black uppercase text-secondary ml-2">STRANGER IS VIBING...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {status === 'MATCHED' && (
          <form onSubmit={handleSendMessage} className="p-4 md:p-8 bg-surface border-t-4 border-black z-40 mb-16 md:mb-0">
            <div className="max-w-6xl mx-auto flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="TYPE YOUR MANIFESTO..."
                  className="w-full bg-surface-container-highest text-white border-4 border-black p-4 focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_#fed023] font-black placeholder:text-outline/40 uppercase transition-all"
                />
              </div>
              <NeoButton type="submit" variant="primary" className="px-8 flex items-center gap-2">
                SEND <Send size={20} />
              </NeoButton>
            </div>
          </form>
        )}
      </div>
    </AppLayout>
=======
    if (socket) {
      if (matchId) {
        socket.emit('disconnect_match', { matchId })
      }
      setActiveMatch(null)
      setMatchId(null)
      setPartner(null)
      setMessages([])
      setSharedInterests([])
      setIsMatching(true)
      socket.emit('join_queue', {
        interests: interests,
        withInterests: interests.length > 0,
        genderFilter: 'both'
      })
    }
  }

  const disconnect = () => {
    if (window.confirm('TERMINATE_SESSION?')) {
      socket.emit('disconnect_match', { matchId })
      navigate('/lobby')
    }
  }

  const handleStopMatch = () => {
    if (socket) {
      socket.emit('leave_queue')
      navigate('/lobby')
    }
  }

  return (
    <div className="text-on-background min-h-screen flex flex-col font-body overflow-x-hidden">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#0e0e0e] border-b-4 border-black shadow-[4px_4px_0px_0px_#000000]">
        <div className="text-3xl font-black italic text-[#fed023] tracking-tighter uppercase font-headline">
          <Link to="/" className="decoration-none text-inherit">VIBECHAT</Link>
        </div>
        <div className="hidden md:flex gap-8 font-headline font-black tracking-tighter uppercase">
          <Link className="text-white hover:bg-[#ff6d8d] hover:text-black transition-none px-2 decoration-none" to="/lobby">CHANNELS</Link>
          <div className="text-[#fed023] underline decoration-4 px-2 cursor-default">CHAT</div>
          <Link className="text-white hover:bg-[#ff6d8d] hover:text-black transition-none px-2 decoration-none" to="/history">HISTORY</Link>
          <a className="text-white hover:bg-[#ff6d8d] hover:text-black transition-none px-2 decoration-none" href="#">VIBES</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsProfileOpen(true)} className="material-symbols-outlined text-white p-2 border-4 border-black bg-surface-container shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none">person</button>
          <Link to="/settings" className="material-symbols-outlined text-white p-2 border-4 border-black bg-surface-container shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none decoration-none">settings</Link>
        </div>
      </nav>

      {/* Side Navigation (Web) */}
      <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-40 bg-[#191919] border-r-4 border-black w-64 shadow-[8px_0px_0px_0px_#000000] pt-24 font-headline uppercase font-black">
        <div className="px-6 mb-8">
          <div className="text-2xl font-black text-[#fed023]">VIBECHAT</div>
          <div className="text-[10px] font-extrabold text-secondary tracking-[0.2em] italic">RAW_MODE_ON</div>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          <Link className="text-white hover:text-[#9fff88] p-4 flex items-center gap-4 hover:bg-[#2c2c2c] transition-none decoration-none" to="/lobby">
            <span className="material-symbols-outlined">forum</span> CHANNELS
          </Link>
          <div className="bg-[#fed023] text-black border-2 border-black m-2 p-4 flex items-center gap-4 cursor-default">
            <span className="material-symbols-outlined">chat_bubble</span> PEOPLE
          </div>
          <Link className="text-white hover:text-[#9fff88] p-4 flex items-center gap-4 hover:bg-[#2c2c2c] transition-none decoration-none" to="/history">
            <span className="material-symbols-outlined">history</span> HISTORY
          </Link>
          <a className="text-white hover:text-[#9fff88] p-4 flex items-center gap-4 hover:bg-[#2c2c2c] transition-none decoration-none" href="#">
            <span className="material-symbols-outlined">bolt</span> VIBES
          </a>
        </nav>
        
        {/* Added Profile/Settings icons for Desktop */}
        <div className="p-4 flex gap-4 mt-auto">
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="flex-1 bg-surface-container border-4 border-black p-3 hover:bg-primary hover:text-black transition-none shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase font-black flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">person</span>
          </button>
          <Link 
            to="/settings"
            className="flex-1 bg-surface-container border-4 border-black p-3 hover:bg-secondary hover:text-black transition-none shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase font-black flex items-center justify-center gap-2 decoration-none text-white hover:decoration-none"
          >
            <span className="material-symbols-outlined">settings</span>
          </Link>
        </div>

        <div className="p-4 mb-4">
          <button onClick={handleNextMatch} className="w-full py-4 bg-secondary text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none uppercase">NEXT_MATCH</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:pl-64 lg:pr-80 pt-20 pb-16 md:pb-0 relative min-h-screen transition-all">
        {isMatching ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0e0e0e]">
            <div className="relative group mb-12">
              <h2 className="font-headline font-black text-6xl md:text-8xl text-primary italic tracking-tighter animate-pulse mb-8 uppercase">
                MATCHING...
              </h2>
              <div className="absolute -top-4 -right-4 bg-secondary text-black font-black px-4 py-2 border-4 border-black rotate-12">
                SIGNAL_SEEKING
              </div>
            </div>
            
            {isQueueing && (
              <div className="mb-12 text-center bg-surface-container border-4 border-black p-8 shadow-[8px_8px_0px_0px_#fed023] w-full max-w-sm">
                <p className="font-headline font-black text-[#fed023] text-4xl uppercase tracking-[0.2em] mb-4">
                  POS: {queuePosition || '...'}
                </p>
                <div className="flex gap-2 justify-center">
                  <span className="w-4 h-4 bg-primary border-2 border-black animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-4 h-4 bg-secondary border-2 border-black animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-4 h-4 bg-tertiary border-2 border-black animate-bounce"></span>
                </div>
              </div>
            )}

            <p className="text-lg font-bold text-on-surface-variant max-w-md text-center mb-12 uppercase tracking-[0.1em] border-y-2 border-black/20 py-6 italic">
              Connecting to the digital riot. Stay on the frequency.
            </p>
            <button 
              onClick={handleStopMatch}
              className="bg-[#ff6d8d] text-black font-headline font-black text-2xl px-12 py-6 border-4 border-black shadow-[8px_8px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-white transition-none uppercase"
            >
              STOP_MATCH
            </button>
          </div>
        ) : (
          <>
            {/* Stranger Status Header */}
            <div className="sticky top-20 z-30 bg-surface border-b-4 border-black p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-tertiary border-2 border-black shadow-[2px_2px_0px_0px_#000000]"></div>
                  <h2 className="text-2xl font-black font-headline uppercase tracking-tight">Stranger Status: <span className="text-primary">{partner ? 'VIBING' : 'DISCONNECTED'}</span></h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sharedInterests.length > 0 ? (
                    sharedInterests.map((interest) => (
                      <span key={interest} className="bg-tertiary text-black px-3 py-1 text-xs font-bold border-2 border-black uppercase tracking-widest italic">#{interest}</span>
                    ))
                  ) : (
                    <>
                      <span className="bg-tertiary text-black px-3 py-1 text-xs font-bold border-2 border-black uppercase tracking-widest italic">#ANON_MATCH</span>
                      <span className="bg-secondary text-black px-3 py-1 text-xs font-bold border-2 border-black uppercase tracking-widest italic">#RAW_VIBE</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button onClick={handleNextMatch} className="flex-1 md:flex-none bg-tertiary text-black px-6 py-2 font-black font-headline border-4 border-black shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none uppercase italic">NEXT MATCH</button>
                <button onClick={disconnect} className="flex-1 md:flex-none bg-error text-black px-6 py-2 font-black font-headline border-4 border-black shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none uppercase italic">DISCONNECT</button>
              </div>
            </div>

            {/* Chat Log */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-8 bg-[#0e0e0e] pb-40">
              <div className="flex justify-center">
                <div className="bg-surface-container-highest border-2 border-black px-4 py-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Encryption: ON | Connection: UNSTABLE | Reality: ANALOG
                </div>
              </div>

              {messages.map((msg, i) => (
                msg.type === 'system' ? (
                  <div key={i} className="flex justify-center">
                    <div className="bg-surface-container-highest border-2 border-black px-4 py-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">
                      {msg.text}
                    </div>
                  </div>
                ) : msg.type === 'partner' ? (
                  <div key={i} className="flex flex-col items-start max-w-[85%] md:max-w-[60%] animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="bg-white text-black p-4 border-4 border-black shadow-[6px_6px_0px_0px_#000000] font-medium leading-tight text-lg">
                      {msg.text}
                    </div>
                    <span className="mt-2 text-[10px] font-bold uppercase text-on-surface-variant">Stranger • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ) : (
                  <div key={i} className="flex flex-col items-end self-end max-w-[85%] md:max-w-[60%] animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-primary text-black p-4 border-4 border-black shadow-[-6px_6px_0px_0px_#000000] font-black leading-tight italic text-lg">
                      {msg.text}
                    </div>
                    <span className="mt-2 text-[10px] font-bold uppercase text-on-surface-variant">You • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 animate-pulse">
                  <div className="w-2 h-2 bg-secondary border border-black"></div>
                  <div className="w-2 h-2 bg-secondary border border-black delay-75"></div>
                  <div className="w-2 h-2 bg-secondary border border-black delay-150"></div>
                  <span className="text-[10px] font-bold uppercase text-secondary ml-2 italic tracking-widest">Stranger is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area (Fixed Bottom) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-surface border-t-4 border-black z-40">
              <div className="max-w-6xl mx-auto flex gap-4">
                <div className="relative flex-1">
                  <input 
                    className="w-full bg-surface-container-highest text-white border-4 border-black p-4 focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_0px_#fed023] font-bold placeholder:text-outline uppercase transition-all font-body text-xl" 
                    placeholder="TYPE YOUR MANIFESTO..." 
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                    <button className="material-symbols-outlined text-white hover:text-primary transition-colors">add_circle</button>
                    <button className="material-symbols-outlined text-white hover:text-secondary transition-colors">mood</button>
                  </div>
                </div>
                <button 
                  onClick={sendMessage}
                  className="bg-primary text-black px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000000] font-black font-headline flex items-center gap-2 hover:bg-secondary active:translate-x-1 active:translate-y-1 active:shadow-none transition-all uppercase italic"
                >
                  SEND <span className="material-symbols-outlined font-black">send</span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Right Panel: Active Friends */}
      <aside className="hidden lg:flex flex-col h-screen fixed right-0 top-0 z-40 bg-[#0e0e0e] border-l-4 border-black w-80 shadow-[-8px_0px_0px_0px_#000000] p-6">
        <h2 className="font-headline font-black text-2xl mb-8 text-white flex items-center justify-between uppercase italic">
          Friends 
          <span className="text-tertiary text-sm font-bold bg-black border-2 border-tertiary px-2">{socialState?.counts?.totalFriendUnread || 0}</span>
        </h2>
        <div className="space-y-6 overflow-y-auto pr-2">
          {socialState?.friends?.map((friend) => (
            <div key={friend.id} className="flex items-center gap-4 bg-surface-container border-4 border-black p-3 hover:bg-surface-bright transition-none cursor-pointer group">
              <div className="relative shrink-0">
                <div className="w-12 h-12 border-2 border-black bg-primary flex items-center justify-center font-black text-black">?</div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-black rounded-full ${friend.unreadCount > 0 ? 'bg-secondary' : 'bg-tertiary'}`}></div>
              </div>
              <div className="min-w-0">
                <div className="font-headline font-black text-white uppercase text-lg leading-none truncate group-hover:text-primary transition-colors">{friend.username}</div>
                <div className="text-on-surface-variant font-bold text-[10px] uppercase mt-1 truncate italic">RAW_LOG_ACTIVE</div>
              </div>
            </div>
          ))}
          {!socialState?.friends?.length && (
            <div className="border-4 border-black border-dashed p-8 text-center text-outline font-black uppercase text-xs">
              NO_SIGNALS_DETECTED
            </div>
          )}
        </div>
        <button className="block text-center mt-auto w-full bg-surface-container-highest text-white border-4 border-black p-4 font-headline font-black uppercase shadow-[4px_4px_0px_0px_#000000] hover:bg-primary hover:text-black transition-none italic">
          GET_PREMIUM
        </button>
      </aside>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-stretch h-16 md:hidden bg-[#0e0e0e] border-t-4 border-black">
        <div className="flex flex-col items-center justify-center bg-[#fed023] text-black h-full px-2 flex-1 active:translate-y-1 transition-none">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="font-headline font-bold text-[10px] uppercase">CHAT</span>
        </div>
        <Link className="flex flex-col items-center justify-center text-white h-full px-2 flex-1 hover:bg-[#ff6d8d] active:translate-y-1 transition-none decoration-none" to="/lobby">
          <span className="material-symbols-outlined">explore</span>
          <span className="font-headline font-bold text-[10px] uppercase">LOBBY</span>
        </Link>
        <div className="flex flex-col items-center justify-center text-white h-full px-2 flex-1 hover:bg-[#ff6d8d] active:translate-y-1 transition-none">
          <span className="material-symbols-outlined">sensors</span>
          <span className="font-headline font-bold text-[10px] uppercase">LIVE</span>
        </div>
        <button onClick={() => setIsProfileOpen(true)} className="flex flex-col items-center justify-center text-white h-full px-2 flex-1 hover:bg-[#ff6d8d] active:translate-y-1 transition-none">
          <span className="material-symbols-outlined">account_circle</span>
          <span className="font-headline font-bold text-[10px] uppercase">PROFILE</span>
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

export default ChatRoom
