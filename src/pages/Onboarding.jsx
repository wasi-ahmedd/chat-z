import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'
import { authService } from '../services/api'

const Onboarding = () => {
  const [selectedGender, setSelectedGender] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useSocket()

  const handleContinue = async () => {
    setLoading(true)
    try {
      const response = await authService.createSession('ANON_' + Math.random().toString(36).substring(2, 8).toUpperCase())
      setUser(response.data.user || { username: 'ANON' })
      navigate('/lobby')
    } catch (err) {
      console.error('Onboarding failed', err)
      navigate('/lobby')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background font-body text-on-background overflow-hidden">
      {/* Blurred Background (The Lobby) */}
      <div className="fixed inset-0 z-0 flex blur-md opacity-40 scale-105">
        {/* Side Navigation Component Placeholder */}
        <aside className="fixed left-0 top-0 h-full w-72 flex flex-col p-4 gap-6 bg-[#191919] border-r-4 border-black shadow-[8px_0px_0px_0px_#000000] z-10">
          <div className="text-xl font-black text-[#fed023] font-headline italic tracking-tighter">THE_LOBBY</div>
          <div className="flex flex-col gap-4 mt-8">
            <div className="bg-[#ff6d8d] text-black border-4 border-black p-4 font-headline uppercase translate-x-1 flex items-center gap-3">
              <span className="material-symbols-outlined">forum</span> Global Lobby
            </div>
            <div className="text-white border-2 border-transparent p-4 font-headline uppercase flex items-center gap-3">
              <span className="material-symbols-outlined">security</span> Private DMs
            </div>
            <div className="text-white border-2 border-transparent p-4 font-headline uppercase flex items-center gap-3">
              <span className="material-symbols-outlined">bolt</span> Trending Tags
            </div>
          </div>
        </aside>
        {/* Content Canvas Placeholder */}
        <main className="ml-72 w-full p-8 flex flex-col gap-12">
          <header className="flex justify-between items-center w-full px-6 py-4 sticky top-0 bg-[#0e0e0e] border-b-4 border-black shadow-[4px_4px_0px_0px_#000000]">
            <h1 className="font-headline font-black uppercase tracking-tighter text-3xl text-[#fed023] italic">ANON_CHAT</h1>
            <div className="flex items-center gap-6">
              <span className="material-symbols-outlined text-[#fed023]">notifications</span>
              <span className="material-symbols-outlined text-[#fed023]">account_circle</span>
            </div>
          </header>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-8">
              <div className="bg-surface-container border-4 border-black p-8 neo-shadow h-96">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary border-4 border-black"></div>
                  <div className="h-4 w-48 bg-surface-variant border-2 border-black"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-surface-variant border-2 border-black"></div>
                  <div className="h-4 w-3/4 bg-surface-variant border-2 border-black"></div>
                  <div className="h-4 w-5/6 bg-surface-variant border-2 border-black"></div>
                </div>
              </div>
            </div>
            <div className="col-span-4 space-y-8">
              <div className="bg-secondary border-4 border-black p-6 neo-shadow">
                <div className="font-headline font-black text-black text-xl mb-4">LIVE RIOTS</div>
                <div className="h-40 bg-black/20 border-2 border-black"></div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        {/* The Modal */}
        <div className="relative w-full max-w-lg bg-surface border-[4px] border-black neo-shadow-lg p-8 md:p-12 flex flex-col items-start overflow-hidden">
          {/* Decorative Element (Top Right Accent) */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-tertiary border-4 border-black rotate-12 -z-10"></div>
          {/* Modal Title */}
          <h2 className="font-headline font-black text-4xl md:text-5xl text-primary uppercase leading-none tracking-tighter mb-4 text-left">
            IDENTIFY_YOUR_VIBE
          </h2>
          <p className="font-body text-lg text-on-surface-variant font-medium mb-10 max-w-sm">
            Before entering the digital riot, let the void know who you are. All data remains anonymous.
          </p>
          {/* Choice Grid */}
          <div className="w-full flex flex-col gap-4 mb-12">
            {/* Male Option */}
            <button
              onClick={() => setSelectedGender('male')}
              className={`gender-select-btn gender-select-btn--male group w-full flex items-center justify-between p-5 border-4 border-black neo-shadow hover:neo-shadow-lg hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none ${selectedGender === 'male' ? 'bg-primary text-black neo-shadow-lg' : 'bg-surface-container text-on-surface'}`}
            >
              <span className={`font-headline font-extrabold text-2xl uppercase ${selectedGender === 'male' ? 'text-black' : 'group-hover:text-primary'}`}>Male</span>
              <span className={`material-symbols-outlined text-4xl group-hover:scale-110 ${selectedGender === 'male' ? 'scale-110' : ''}`}>man</span>
            </button>
            {/* Female Option */}
            <button
              onClick={() => setSelectedGender('female')}
              className={`gender-select-btn gender-select-btn--female group w-full flex items-center justify-between p-5 border-4 border-black neo-shadow hover:neo-shadow-lg hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none ${selectedGender === 'female' ? 'bg-secondary text-black neo-shadow-lg' : 'bg-surface-container text-on-surface'}`}
            >
              <span className={`font-headline font-extrabold text-2xl uppercase ${selectedGender === 'female' ? 'text-black' : 'group-hover:text-secondary'}`}>Female</span>
              <span className={`material-symbols-outlined text-4xl group-hover:scale-110 ${selectedGender === 'female' ? 'scale-110' : ''}`}>woman</span>
            </button>
            {/* Other Option */}
            <button
              onClick={() => setSelectedGender('other')}
              className={`gender-select-btn gender-select-btn--other group w-full flex items-center justify-between p-5 border-4 border-black neo-shadow hover:neo-shadow-lg hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none ${selectedGender === 'other' ? 'bg-tertiary text-black neo-shadow-lg' : 'bg-surface-container text-on-surface'}`}
            >
              <div className="flex flex-col items-start">
                <span className={`font-headline font-extrabold text-2xl uppercase leading-tight ${selectedGender === 'other' ? 'text-black' : 'group-hover:text-tertiary'}`}>Other</span>
                <span className="gender-select-btn__sub text-xs font-body font-bold text-on-surface-variant uppercase tracking-widest">Prefer not to say</span>
              </div>
              <span className={`material-symbols-outlined text-4xl group-hover:scale-110 ${selectedGender === 'other' ? 'scale-110' : ''}`}>diversity_3</span>
            </button>
          </div>
          {/* Main Action */}
          <div className="w-full">
            <button
              onClick={handleContinue}
              disabled={loading}
              className="w-full bg-primary text-black font-headline font-black text-2xl py-6 border-4 border-black neo-shadow hover:neo-shadow-lg hover:bg-[#ffdf45] active:translate-x-1 active:translate-y-1 active:neo-shadow-active transition-all flex items-center justify-center gap-4"
            >
              {loading ? 'CONNECTING...' : 'CONTINUE_TO_CHAT'}
              <span className="material-symbols-outlined text-3xl">arrow_forward</span>
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
