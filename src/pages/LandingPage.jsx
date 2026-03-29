import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import NeoButton from '../components/common/NeoButton'
import { useNavigate } from 'react-router-dom'
import { Rocket, Shield, Zap, Image as ImageIcon, Users } from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <AppLayout hideSidebar={true}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden border-b-8 border-black">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="z-10 container mx-auto px-6 text-center">
          <div className="inline-block bg-secondary text-black px-4 py-1 font-headline font-black text-xs uppercase mb-6 border-2 border-black rotate-2">
            V2_REBOOT_INITIATED
          </div>
          <h1 className="text-6xl md:text-9xl font-headline font-black text-white leading-none tracking-tighter uppercase italic mb-8">
            MEET RANDOM <br/> 
            <span className="text-primary bg-black border-4 border-primary px-4 shadow-[8px_8px_0px_#ff6d8d]">STRANGERS</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl font-body font-bold text-on-surface-variant uppercase tracking-widest mb-12">
            The Digital Riot of Anonymous Connection. No Filters. No Fakes. Raw Vibe Only.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <NeoButton 
              className="text-2xl px-12 py-6 shadow-xl"
              onClick={() => navigate('/onboarding')}
            >
              START CHATTING
            </NeoButton>
            <div className="bg-white text-black p-4 border-4 border-black font-headline font-black text-xl -rotate-2 shadow-lg">
              14.2K_PEOPLE_ONLINE
            </div>
          </div>
        </div>

        {/* Ticker Tape */}
        <div className="absolute bottom-0 left-0 w-full bg-tertiary text-black py-4 border-t-4 border-black overflow-hidden whitespace-nowrap">
          <div className="flex animate-scroll font-headline font-black text-2xl uppercase">
            <span className="mx-8">ANONYMOUS FOREVER</span>
            <span className="mx-8">NO SURRENDER</span>
            <span className="mx-8">RAW_MODE_ON</span>
            <span className="mx-8">ANONYMOUS FOREVER</span>
            <span className="mx-8">NO SURRENDER</span>
            <span className="mx-8">RAW_MODE_ON</span>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="bg-surface p-8 md:p-24">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 bg-surface-container border-4 border-black p-10 flex flex-col justify-between shadow-lg group hover:bg-primary transition-all duration-300">
            <Zap size={48} className="mb-6 group-hover:rotate-12 transition-transform" />
            <div>
              <h3 className="text-4xl font-headline font-black uppercase mb-4 italic">INSTANT MATCH</h3>
              <p className="font-bold uppercase tracking-tight opacity-70">Lightning fast pairing with zero delay. The riot waits for no one.</p>
            </div>
          </div>
          <div className="bg-secondary border-4 border-black p-10 shadow-lg text-black">
            <Shield size={48} className="mb-6" />
            <h3 className="text-3xl font-headline font-black uppercase mb-4 leading-tight italic">RAZOR SHARP PRIVACY</h3>
            <p className="font-bold uppercase text-xs">No logs. No tracks. Your ghost in the machine.</p>
          </div>
          <div className="bg-tertiary border-4 border-black p-10 shadow-lg text-black">
            <ImageIcon size={48} className="mb-6" />
            <h3 className="text-3xl font-headline font-black uppercase mb-4 italic">MEDIA_X</h3>
            <p className="font-bold uppercase text-xs">Share RAW moments without a trace.</p>
          </div>
          <div className="md:col-span-2 bg-[#2c2c2c] border-4 border-black p-10 shadow-lg flex items-center gap-8 group">
            <Users size={64} className="group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="text-3xl font-headline font-black uppercase italic">INTEREST_GROUPS</h3>
              <p className="font-bold uppercase text-sm opacity-60">Find your tribe by matching common frequencies.</p>
            </div>
          </div>
          <div className="md:col-span-2 bg-white border-4 border-black p-10 shadow-lg text-black flex flex-col justify-center">
            <h3 className="text-5xl font-headline font-black uppercase italic leading-none mb-4">JOIN THE UNDERGROUND.</h3>
            <NeoButton variant="secondary" className="self-start">CREATE_IDENTITY</NeoButton>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default LandingPage
