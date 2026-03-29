import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'

const ChatRoom = () => {
  const { socket, user } = useSocket()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMatching, setIsMatching] = useState(true)
  const [partner, setPartner] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!socket) return

    const interests = location.state?.interests || []
    socket.emit('start_matching', { interests })

    socket.on('match_found', (data) => {
      setPartner(data.partner)
      setIsMatching(false)
      setMessages([{ type: 'system', text: `MATCHED WITH ${data.partner.username}` }])
    })

    socket.on('new_message', (msg) => {
      setMessages(prev => [...prev, { ...msg, type: 'partner' }])
    })

    socket.on('partner_typing', (typing) => {
      setIsTyping(typing)
    })

    socket.on('partner_disconnected', () => {
      setMessages(prev => [...prev, { type: 'system', text: 'STRANGER DISCONNECTED FROM CHANNEL' }])
      setPartner(null)
    })

    return () => {
      socket.off('match_found')
      socket.off('new_message')
      socket.off('partner_typing')
      socket.off('partner_disconnected')
      socket.emit('stop_matching')
    }
  }, [socket, location.state])

  const sendMessage = () => {
    if (input.trim() && socket) {
      const msg = { text: input, timestamp: new Date() }
      socket.emit('send_message', msg)
      setMessages(prev => [...prev, { ...msg, type: 'user' }])
      setInput('')
      socket.emit('typing', false)
    }
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    if (socket) {
      socket.emit('typing', true)
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', false)
      }, 3000)
    }
  }

  const disconnect = () => {
    if (window.confirm('TERMINATE THIS SESSION?')) {
      socket.emit('disconnect_match')
      navigate('/lobby')
    }
  }

  return (
    <div className="text-on-background min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#0e0e0e] border-b-4 border-black shadow-[4px_4px_0px_0px_#000000]">
        <div className="text-3xl font-black italic text-[#fed023] tracking-tighter uppercase font-['Epilogue']"><Link to="/">VIBECHAT</Link></div>
        <div className="hidden md:flex gap-8 font-['Epilogue'] font-black tracking-tighter uppercase">
          <Link className="text-white hover:bg-[#ff6d8d] hover:text-black transition-none px-2" to="/lobby">CHANNELS</Link>
          <a className="text-[#fed023] underline decoration-4 px-2" href="#">CHAT</a>
          <a className="text-white hover:bg-[#ff6d8d] hover:text-black transition-none px-2" href="#">HISTORY</a>
          <a className="text-white hover:bg-[#ff6d8d] hover:text-black transition-none px-2" href="#">VIBES</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-white p-2 border-4 border-black bg-surface-container shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none">person</button>
          <button className="material-symbols-outlined text-white p-2 border-4 border-black bg-surface-container shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none">settings</button>
        </div>
      </nav>

      {/* Side Navigation (Web) */}
      <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-40 bg-[#191919] border-r-4 border-black w-64 shadow-[8px_0px_0px_0px_#000000] pt-24">
        <div className="px-6 mb-8">
          <div className="text-2xl font-black text-[#fed023] font-['Epilogue']">VIBECHAT</div>
          <div className="text-[10px] font-extrabold text-secondary tracking-[0.2em] font-['Epilogue']">RAW_MODE_ON</div>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          <Link className="text-white hover:text-[#9fff88] p-4 font-['Epilogue'] font-extrabold uppercase flex items-center gap-4 hover:bg-[#2c2c2c] transition-none" to="/lobby">
            <span className="material-symbols-outlined">forum</span> CHANNELS
          </Link>
          <a className="bg-[#fed023] text-black border-2 border-black m-2 p-4 font-['Epilogue'] font-extrabold uppercase flex items-center gap-4 active:scale-95 transition-none" href="#">
            <span className="material-symbols-outlined">chat_bubble</span> PEOPLE
          </a>
          <a className="text-white hover:text-[#9fff88] p-4 font-['Epilogue'] font-extrabold uppercase flex items-center gap-4 hover:bg-[#2c2c2c] transition-none" href="#">
            <span className="material-symbols-outlined">history</span> HISTORY
          </a>
          <a className="text-white hover:text-[#9fff88] p-4 font-['Epilogue'] font-extrabold uppercase flex items-center gap-4 hover:bg-[#2c2c2c] transition-none" href="#">
            <span className="material-symbols-outlined">bolt</span> VIBES
          </a>
        </nav>
        <div className="p-4 mt-auto">
          <button className="w-full py-4 bg-secondary text-black font-black font-['Epilogue'] border-4 border-black shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none uppercase">START_CHAT</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:pl-64 pt-20 pb-16 md:pb-0">
        {/* Stranger Status Header */}
        <div className="sticky top-20 z-30 bg-surface border-b-4 border-black p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-tertiary border-2 border-black shadow-[2px_2px_0px_0px_#000000]"></div>
              <h2 className="text-2xl font-black font-['Epilogue'] uppercase tracking-tight">Stranger Status: <span className="text-primary">VIBING</span></h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-tertiary text-black px-3 py-1 text-xs font-bold border-2 border-black uppercase">#NEO_BRUTALISM</span>
              <span className="bg-secondary text-black px-3 py-1 text-xs font-bold border-2 border-black uppercase">#WEB3_ANARCHY</span>
              <span className="bg-primary text-black px-3 py-1 text-xs font-bold border-2 border-black uppercase">#DIGITAL_RIOT</span>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-tertiary text-black px-6 py-2 font-black font-['Epilogue'] border-4 border-black shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none uppercase">NEXT MATCH</button>
            <button onClick={disconnect} className="flex-1 md:flex-none bg-error text-black px-6 py-2 font-black font-['Epilogue'] border-4 border-black shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none uppercase">DISCONNECT</button>
          </div>
        </div>

        {/* Chat Log */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-8 bg-[#0e0e0e] pb-32">
          {/* System Message */}
          <div className="flex justify-center">
            <div className="bg-surface-container-highest border-2 border-black px-4 py-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Encryption: ON | Connection: UNSTABLE | Reality: ANALOG
            </div>
          </div>

          {/* Render messages */}
          {messages.map((msg, i) => (
            msg.type === 'system' ? (
              <div key={i} className="flex justify-center">
                <div className="bg-surface-container-highest border-2 border-black px-4 py-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  {msg.text}
                </div>
              </div>
            ) : msg.type === 'partner' ? (
              <div key={i} className="flex flex-col items-start max-w-[85%] md:max-w-[60%]">
                <div className="bg-white text-black p-4 border-4 border-black shadow-[6px_6px_0px_0px_#000000] font-medium leading-tight">
                  {msg.text}
                </div>
                <span className="mt-2 text-[10px] font-bold uppercase text-on-surface-variant">
                  Stranger &bull; {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ) : (
              <div key={i} className="flex flex-col items-end self-end max-w-[85%] md:max-w-[60%]">
                <div className="bg-primary text-black p-4 border-4 border-black shadow-[-6px_6px_0px_0px_#000000] font-black leading-tight italic">
                  {msg.text}
                </div>
                <span className="mt-2 text-[10px] font-bold uppercase text-on-surface-variant">
                  You &bull; {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary animate-pulse border border-black"></div>
              <div className="w-2 h-2 bg-secondary animate-pulse border border-black" style={{ animationDelay: '75ms' }}></div>
              <div className="w-2 h-2 bg-secondary animate-pulse border border-black" style={{ animationDelay: '150ms' }}></div>
              <span className="text-[10px] font-bold uppercase text-secondary ml-2">Stranger is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area (Fixed Bottom) */}
        <div className="fixed bottom-16 md:bottom-0 left-0 md:left-64 right-0 p-4 md:p-8 bg-surface border-t-4 border-black z-40">
          <div className="max-w-6xl mx-auto flex gap-4">
            <div className="relative flex-1">
              <input
                className="w-full bg-surface-container-highest text-white border-4 border-black p-4 focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_0px_#fed023] font-bold placeholder:text-outline uppercase transition-all"
                placeholder="TYPE YOUR MANIFESTO..."
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                <button className="material-symbols-outlined text-white hover:text-primary">add_circle</button>
                <button className="material-symbols-outlined text-white hover:text-secondary">mood</button>
              </div>
            </div>
            <button
              onClick={sendMessage}
              className="bg-primary text-black px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000000] font-black font-['Epilogue'] flex items-center gap-2 hover:bg-secondary active:translate-x-1 active:translate-y-1 active:shadow-none transition-none"
            >
              SEND <span className="material-symbols-outlined font-black">send</span>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-stretch h-16 md:hidden bg-[#0e0e0e] border-t-4 border-black">
        <a className="flex flex-col items-center justify-center bg-[#fed023] text-black h-full px-2 flex-1 active:translate-y-1 transition-none" href="#">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="font-['Epilogue'] font-bold text-[10px] uppercase">CHAT</span>
        </a>
        <a className="flex flex-col items-center justify-center text-white h-full px-2 flex-1 hover:bg-[#ff6d8d] active:translate-y-1 transition-none" href="#">
          <span className="material-symbols-outlined">explore</span>
          <span className="font-['Epilogue'] font-bold text-[10px] uppercase">DISCOVER</span>
        </a>
        <a className="flex flex-col items-center justify-center text-white h-full px-2 flex-1 hover:bg-[#ff6d8d] active:translate-y-1 transition-none" href="#">
          <span className="material-symbols-outlined">sensors</span>
          <span className="font-['Epilogue'] font-bold text-[10px] uppercase">LIVE</span>
        </a>
        <a className="flex flex-col items-center justify-center text-white h-full px-2 flex-1 hover:bg-[#ff6d8d] active:translate-y-1 transition-none" href="#">
          <span className="material-symbols-outlined">account_circle</span>
          <span className="font-['Epilogue'] font-bold text-[10px] uppercase">PROFILE</span>
        </a>
      </nav>
    </div>
  )
}

export default ChatRoom
