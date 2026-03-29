import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'
import { authService } from '../services/api'

const Onboarding = () => {
  const [selectedGender, setSelectedGender] = useState(null)
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { setUser } = useSocket()

  const handleContinue = async () => {
    if (!selectedGender) {
      setError('PLEASE_SELECT_A_VIBE')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await authService.signup({
        username: username.trim() || undefined, // Backend will generate if empty
        gender: selectedGender
      })
      
      if (response.data && response.data.user) {
        setUser(response.data.user)
        navigate('/lobby')
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      console.error('Onboarding failed', err)
      setError(err.response?.data?.error || 'CONNECTION_STRIKE_ERROR')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background font-body text-on-background min-h-screen overflow-x-hidden">
      {/* Blurred Background (The Lobby) */}
      <div className="fixed inset-0 z-0 flex blur-md opacity-40 scale-105 pointer-events-none">
        <aside className="fixed left-0 top-0 h-full w-72 flex flex-col p-4 gap-6 bg-[#191919] border-r-4 border-black shadow-[8px_0px_0px_0px_#000000] z-10">
          <div className="text-xl font-black text-[#fed023] font-headline italic tracking-tighter uppercase">THE_LOBBY</div>
          <div className="flex flex-col gap-4 mt-8">
            <div className="bg-[#ff6d8d] text-black border-4 border-black p-4 font-headline uppercase flex items-center gap-3">
              <span className="material-symbols-outlined">forum</span> Global Lobby
            </div>
          </div>
        </aside>
        <main className="ml-72 w-full p-8 flex flex-col gap-12">
          <header className="flex justify-between items-center w-full px-6 py-4 bg-[#0e0e0e] border-b-4 border-black shadow-[4px_4px_0px_0px_#000000]">
            <h1 className="font-headline font-black uppercase tracking-tighter text-3xl text-[#fed023] italic">ANON_CHAT</h1>
          </header>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 bg-surface-container border-4 border-black p-8 h-96"></div>
          </div>
        </main>
      </div>

      {/* Modal Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        {/* The Modal */}
        <div className="relative w-full max-w-lg bg-surface border-[4px] border-black shadow-[12px_12px_0px_0px_#000000] p-8 md:p-12 flex flex-col items-start overflow-hidden">
          {/* Decorative Element */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-tertiary border-4 border-black rotate-12 -z-10"></div>
          
          {/* Modal Title */}
          <h2 className="font-headline font-black text-4xl md:text-5xl text-primary uppercase leading-none tracking-tighter mb-4 text-left italic">
            IDENTIFY_YOUR_VIBE
          </h2>
          <p className="font-body text-lg text-on-surface-variant font-medium mb-8 max-w-sm uppercase tracking-tight">
            Before entering the digital riot, let the void know who you are.
          </p>

          {/* Username Input Section */}
          <div className="w-full mb-8">
            <label className="block font-headline font-black text-xs uppercase tracking-widest text-[#ff6d8d] mb-2 px-1">CODE_NAME (OPTIONAL)</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ANON_WANDERER"
              className="w-full bg-surface-container-highest border-4 border-black p-4 font-bold text-xl placeholder:text-outline focus:border-primary focus:ring-0 transition-none outline-none text-white uppercase"
            />
          </div>

          {/* Choice Grid */}
          <div className="w-full flex flex-col gap-4 mb-10">
            {/* Male Option */}
            <button 
              onClick={() => setSelectedGender('male')}
              className={`group w-full flex items-center justify-between p-5 border-4 border-black transition-all ${selectedGender === 'male' ? 'bg-primary text-black translate-x-1 translate-y-1 shadow-none' : 'bg-surface-container text-white shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000]'}`}
            >
              <span className={`font-headline font-extrabold text-2xl uppercase ${selectedGender === 'male' ? 'text-black' : 'group-hover:text-primary'}`}>Male</span>
              <span className="material-symbols-outlined text-4xl">man</span>
            </button>
            {/* Female Option */}
            <button 
              onClick={() => setSelectedGender('female')}
              className={`group w-full flex items-center justify-between p-5 border-4 border-black transition-all ${selectedGender === 'female' ? 'bg-secondary text-black translate-x-1 translate-y-1 shadow-none' : 'bg-surface-container text-white shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000]'}`}
            >
              <span className={`font-headline font-extrabold text-2xl uppercase ${selectedGender === 'female' ? 'text-black' : 'group-hover:text-secondary'}`}>Female</span>
              <span className="material-symbols-outlined text-4xl">woman</span>
            </button>
            {/* Other Option */}
            <button 
              onClick={() => setSelectedGender('other')}
              className={`group w-full flex items-center justify-between p-5 border-4 border-black transition-all ${selectedGender === 'other' ? 'bg-tertiary text-black translate-x-1 translate-y-1 shadow-none' : 'bg-surface-container text-white shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000]'}`}
            >
              <div className="flex flex-col items-start">
                <span className={`font-headline font-extrabold text-2xl uppercase leading-tight ${selectedGender === 'other' ? 'text-black' : 'group-hover:text-tertiary'}`}>Other</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Prefer not to say</span>
              </div>
              <span className="material-symbols-outlined text-4xl">diversity_3</span>
            </button>
          </div>

          {error && (
            <div className="w-full mb-6 bg-error text-black p-3 border-4 border-black font-black uppercase text-xs italic">
              ERROR: {error}
            </div>
          )}

          {/* Main Action */}
          <div className="w-full">
            <button 
              onClick={handleContinue}
              disabled={loading}
              className="w-full bg-primary text-black font-headline font-black text-2xl py-6 border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:bg-[#ffdf45] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-4 uppercase"
            >
              {loading ? 'CONNECTING...' : 'CONTINUE_TO_CHAT'}
              {!loading && <span className="material-symbols-outlined text-3xl">arrow_forward</span>}
            </button>
            <div className="mt-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              <p className="text-[10px] font-body font-bold uppercase tracking-tighter text-on-surface-variant">
                By proceeding, you agree to our <span className="text-primary border-b-2 border-primary cursor-pointer">Manifesto of Anonymity</span>
              </p>
            </div>
          </div>
          
          {/* Absolute Texture Overlays */}
          <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fed023 2px, transparent 2px)', backgroundSize: '10px 10px' }}></div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
