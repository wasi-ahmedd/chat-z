import React, { useState, useEffect, useRef } from 'react'
import AppLayout from '../components/layout/AppLayout'
import NeoButton from '../components/common/NeoButton'
import { useSocket } from '../context/SocketContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { Send, X, SkipForward, Hash, Radio } from 'lucide-react'
import EditableWrapper from '../components/common/EditableWrapper'

const ChatRoom = () => {
  const { socket, user, isQueueing, queuePosition, socialState, interests, activeMatch, setActiveMatch } = useSocket()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [status, setStatus] = useState(activeMatch ? 'MATCHED' : 'FINDING_STRANGER')
  const [partner, setPartner] = useState(activeMatch?.partner || null)
  const [messages, setMessages] = useState(activeMatch?.messages || [])
  const [inputText, setInputText] = useState('')
  const [sharedInterests, setSharedInterests] = useState(activeMatch?.sharedInterests || [])
  const [isTyping, setIsTyping] = useState(false)
  const [matchId, setMatchId] = useState(activeMatch?.matchId || null)

  const messagesEndRef = useRef(null)
  const userInterests = location.state?.interests || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!socket || !user) return

    // If not already matched, join the queue
    if (!activeMatch) {
      socket.emit('join_queue', {
        interests: userInterests,
        withInterests: userInterests.length > 0
      })
    }

    const onMatchFound = (data) => {
      setStatus('MATCHED')
      setPartner(data.partner)
      setMatchId(data.matchId)
      setSharedInterests(data.sharedInterests || [])
      setMessages([{ type: 'system', text: `ESTABLISHED_LINK_WITH_${data.partner.username.toUpperCase()}` }])
      setActiveMatch(data)
    }

    const onNewMessage = (msg) => {
      setMessages(prev => [...prev, { 
        ...msg,
        fromSelf: msg.sender === user?.id,
        type: msg.sender === user?.id ? 'user' : 'partner'
      }])
    }

    const onPartnerDisconnected = () => {
      setStatus('DISCONNECTED')
      setMessages(prev => [...prev, { type: 'system', text: 'STRANGER_DISCONNECTED_FROM_CHANNEL' }])
      setPartner(null)
    }

    const onPartnerTyping = ({ isTyping }) => {
      setIsTyping(isTyping)
    }

    socket.on('match_found', onMatchFound)
    socket.on('new_message', onNewMessage)
    socket.on('partner_disconnected', onPartnerDisconnected)
    socket.on('partner_typing', onPartnerTyping)

    return () => {
      socket.off('match_found', onMatchFound)
      socket.off('new_message', onNewMessage)
      socket.off('partner_disconnected', onPartnerDisconnected)
      socket.off('partner_typing', onPartnerTyping)
    }
  }, [socket, user, userInterests, activeMatch, setActiveMatch])

  const handleSendMessage = (e) => {
    if (e) e.preventDefault()
    if (!inputText.trim() || status !== 'MATCHED' || !matchId) return

    socket.emit('send_message', { 
      text: inputText,
      matchId: matchId
    })
    setInputText('')
    socket.emit('typing_stop', { matchId })
  }

  const handleInputChange = (e) => {
    setInputText(e.target.value)
    if (status === 'MATCHED' && matchId) {
      socket.emit('typing_start', { matchId })
      clearTimeout(window.typingTimeout)
      window.typingTimeout = setTimeout(() => {
        socket.emit('typing_stop', { matchId })
      }, 3000)
    }
  }

  const handleNextMatch = () => {
    if (matchId) socket.emit('disconnect_match', { matchId })
    setStatus('FINDING_STRANGER')
    setPartner(null)
    setMatchId(null)
    setMessages([])
    setActiveMatch(null)
    socket.emit('join_queue', {
      interests: userInterests,
      withInterests: userInterests.length > 0
    })
  }

  const handleLeave = () => {
    if (matchId) socket.emit('disconnect_match', { matchId })
    setActiveMatch(null)
    navigate('/lobby')
  }

  return (
    <AppLayout hideSidebar={true}>
      <div className="h-[calc(100vh-80px)] flex flex-col pt-4">
        {/* Stranger Status Header */}
        <EditableWrapper id="chat_header">
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
                  <span className="bg-black border-2 border-white text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter italic">STRANGER: {partner.username.toUpperCase()}</span>
                  {sharedInterests.map((interest, i) => (
                    <span key={i} className="bg-tertiary text-black px-3 py-1 text-[10px] font-black border-2 border-black uppercase flex items-center gap-1">
                      <Hash size={10} /> {interest.toUpperCase()}
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
        </EditableWrapper>

        {/* Chat Log */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-8 bg-[#111] custom-scrollbar">
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
            msg.type === 'system' ? (
              <div key={i} className="flex justify-center">
                <div className="bg-surface-container-highest border-2 border-black px-4 py-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">
                  {msg.text}
                </div>
              </div>
            ) : (
              <EditableWrapper key={i} id={`msg_${i}`} className={`flex flex-col ${msg.fromSelf ? 'items-end self-end' : 'items-start'} max-w-[85%] md:max-w-[60%]`}>
                <div className={`p-4 border-4 border-black shadow-${msg.fromSelf ? '[-6px_6px_0px_#000000]' : '[6px_6px_0px_#000000]'} font-bold leading-tight ${msg.fromSelf ? 'bg-primary text-black italic' : 'bg-white text-black'}`}>
                  {msg.text}
                </div>
                <span className="mt-2 text-[10px] font-black uppercase text-on-surface-variant">
                  {msg.fromSelf ? 'YOU' : 'STRANGER'} • {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </EditableWrapper>
            )
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
          <EditableWrapper id="chat_input_area">
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
          </EditableWrapper>
        )}
      </div>
    </AppLayout>
  )
}

export default ChatRoom
