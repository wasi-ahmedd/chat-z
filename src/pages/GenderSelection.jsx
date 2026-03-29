import React, { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import NeoButton from '../components/common/NeoButton'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import { useSocket } from '../context/SocketContext'

const GenderSelection = () => {
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useSocket()

  const handleProceed = async () => {
    if (!selected) return
    setLoading(true)
    try {
      const response = await authService.signup({})
      const newUser = response.data.user
      
      // Update with selected gender
      const updatedUser = await authService.updateProfile({ gender: selected })
      setUser(updatedUser.data)
      
      navigate('/lobby')
    } catch (err) {
      console.error('Onboarding failed', err)
      alert('Signup failed. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout hideSidebar={true}>
      <div className="fixed inset-0 z-0 bg-surface flex items-center justify-center p-4">
        {/* Background Mockup */}
        <div className="absolute inset-0 opacity-10 grayscale pointer-events-none select-none overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-64 bg-surface-container border-4 border-black"></div>
            ))}
          </div>
        </div>

        {/* Modal */}
        <div className="relative z-10 w-full max-w-2xl bg-surface border-8 border-black shadow-[24px_24px_0px_#000000] p-8 md:p-12 overflow-hidden">
          {/* Glitch Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <div className="absolute bottom-4 -right-12 bg-secondary text-black font-headline font-black text-4xl px-8 rotate-12">IDENTITY</div>
          
          <header className="mb-12">
            <div className="text-[10px] font-headline font-black text-secondary tracking-[0.3em] uppercase mb-1">UNAUTHORIZED_ACCESS</div>
            <h1 className="text-5xl md:text-7xl font-headline font-black text-white italic uppercase leading-none tracking-tighter">
              WHO <span className="text-primary italic underline">ARE</span> YOU?
            </h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { id: 'male', label: 'MALE', icon: '♂', color: 'bg-primary' },
              { id: 'female', label: 'FEMALE', icon: '♀', color: 'bg-secondary' },
              { id: 'other', label: 'NON-BINARY', icon: '⚥', color: 'bg-tertiary' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSelected(option.id)}
                className={`flex flex-col items-center justify-center p-8 border-4 border-black transition-all duration-75 active:scale-95 ${
                  selected === option.id 
                    ? `${option.color} text-black shadow-none translate-x-1 translate-y-1` 
                    : 'bg-surface-container text-white shadow-[8px_8px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_#000000]'
                }`}
              >
                <span className="text-6xl mb-4 leading-none">{option.icon}</span>
                <span className="font-headline font-black text-xl uppercase italic">{option.label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <NeoButton 
              className={`w-full py-6 text-3xl ${!selected ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleProceed}
              variant={selected === 'female' ? 'secondary' : selected === 'other' ? 'tertiary' : 'primary'}
            >
              {loading ? 'INITIALIZING...' : 'CONTINUE_TO_THE_RIOT'}
            </NeoButton>
            <p className="text-center text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
              By proceeding, you agree to the VibeChat Manifesto and Code of Anarchy.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default GenderSelection
