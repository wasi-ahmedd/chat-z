import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="bg-background text-on-background">
      {/* TopNavBar */}
      <nav className="flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50 bg-[#0e0e0e] border-b-4 border-black shadow-[4px_4px_0px_#000000]">
        <div className="text-3xl font-['Epilogue'] font-black text-[#fed023] tracking-tighter italic">VIBECHAT</div>
        <div className="hidden md:flex gap-8 items-center">
          <a className="font-['Epilogue'] font-black uppercase tracking-tighter text-[#ff6d8d] underline decoration-4 underline-offset-8" href="#">FEED</a>
          <Link className="font-['Epilogue'] font-black uppercase tracking-tighter text-[#fed023] hover:bg-[#fed023] hover:text-black transition-none px-2 py-1" to="/lobby">CHANNELS</Link>
          <a className="font-['Epilogue'] font-black uppercase tracking-tighter text-[#fed023] hover:bg-[#fed023] hover:text-black transition-none px-2 py-1" href="#">VAULT</a>
          <a className="font-['Epilogue'] font-black uppercase tracking-tighter text-[#fed023] hover:bg-[#fed023] hover:text-black transition-none px-2 py-1" href="#">CREW</a>
        </div>
        <div className="flex gap-4">
          <button className="hidden lg:block bg-[#fed023] text-black font-['Epilogue'] font-black uppercase px-6 py-2 border-4 border-black shadow-[4px_4px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none">JOIN RIOT</button>
          <button className="text-[#fed023] font-['Epilogue'] font-black uppercase px-4 py-2 hover:bg-[#fed023] hover:text-black transition-none">LOG IN</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full min-h-[921px] flex flex-col items-start justify-center px-6 md:px-16 overflow-hidden pt-20 pb-32">
        <div className="absolute top-20 right-10 md:right-20 rotate-6 z-0 opacity-20 md:opacity-100">
          <div className="w-64 h-64 md:w-96 md:h-96 border-8 border-primary bg-surface-container neo-shadow-lg flex items-center justify-center p-4">
            <img alt="Retro tech vibe" className="w-full h-full object-cover border-4 border-black" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZkqFew-tC-37UlbiIavDtI0gN49o8ssS0cPEDyDj_yeuJYbWs7Bhh5yjUuTY3ua9FBo8dgyDqTK6ZBAsxorfmFlrcvX60FGS-O-1glYtRj_TkRJhB_zInebR78If0vkWwNO1h7Ihjm-KcwF19AZCdAkxxHZxG52wfP-V1wGo76bcsvBMv-hROuZyYgzpBYXIePnSQ-cgcdxAm1yHxCFiL-qJHxJqxkl8tfRvk4B21jM00dkEc2nI70fiVTGtxWBpcpZfkAVFQuok"/>
          </div>
        </div>
        <div className="z-10 max-w-4xl">
          <h1 className="font-headline font-black text-6xl md:text-9xl uppercase leading-[0.85] tracking-tighter mb-8">
            Meet <span className="text-secondary">Random</span><br/>
            Strangers,<br/>
            <span className="bg-primary text-black px-4 inline-block -rotate-1">Chat</span><br/>
            Anonymously
          </h1>
          <p className="font-body text-xl md:text-2xl font-bold max-w-xl mb-12 text-on-surface-variant border-l-8 border-tertiary pl-6">
            No profiles. No tracking. No filters. Just raw, unfiltered conversation in the digital underground. Join the chaos or stay silent.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link to="/onboarding" className="bg-primary text-black text-2xl font-headline font-black uppercase px-10 py-6 border-4 border-black neo-shadow-lg active-press transition-none flex items-center gap-3 decoration-none">
              Start Chatting
              <span className="material-symbols-outlined font-bold">bolt</span>
            </Link>
            <button className="bg-surface-container text-primary text-2xl font-headline font-black uppercase px-10 py-6 border-4 border-black neo-shadow-lg active-press transition-none">
              Enter Vault
            </button>
          </div>
        </div>
        {/* Ticker Tape */}
        <div className="absolute bottom-0 left-0 w-full bg-tertiary text-black py-4 border-t-4 border-black overflow-hidden whitespace-nowrap">
          <div className="flex animate-scroll font-headline font-black text-2xl uppercase">
            <span className="mx-8">14.2K LIVE NOW</span>
            <span className="mx-8">NO SURRENDER</span>
            <span className="mx-8">ANONYMOUS FOREVER</span>
            <span className="mx-8">VIBE OR DIE</span>
            <span className="mx-8">14.2K LIVE NOW</span>
            <span className="mx-8">NO SURRENDER</span>
            <span className="mx-8">ANONYMOUS FOREVER</span>
            <span className="mx-8">VIBE OR DIE</span>
          </div>
        </div>
      </header>

      {/* Features Section (Bento Grid) */}
      <section className="py-32 px-6 md:px-16 bg-surface-container-low">
        <h2 className="font-headline font-black text-5xl md:text-7xl uppercase mb-16 tracking-tighter">
          System <span className="text-primary">Capabilities</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Large Feature 1 */}
          <div className="md:col-span-8 bg-surface-container border-4 border-black p-10 neo-shadow-primary flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <div className="text-secondary font-headline font-black text-4xl mb-4">01. ZERO LOGS</div>
              <p className="font-body text-xl">We don't know who you are. We don't want to know. Your data is purged the second you disconnect. Permanent amnesia by design.</p>
            </div>
            <div className="w-full md:w-64 h-48 border-4 border-black bg-black shrink-0 relative overflow-hidden">
              <img alt="Server racks" className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABsc-YLRf5odvE1tOdq1OI3aaWZ7bdEDd1jX3kao0B16y5g9nVryvzevl708rvkPJ1xSUkqH9zn8BwYLAQdZszLk8jE3nOqbBb5Sd6iztwHDP0GmtxQ2rTBwR5v43_VGYg1FOSUKFzE1Pos6fAuTTRi10HNdXcEMwW0lOQZooS1IJsyJKEoYmF-1cJLaB6zcxKZl0qfIhvrvrUM97Bw-UP66IOgF9jc366yDDPt7NmtPhxK37F8K98fzGHsNJBkDOOmENoH7u7YP0"/>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              </div>
            </div>
          </div>
          {/* Small Feature 2 */}
          <div className="md:col-span-4 bg-secondary text-black border-4 border-black p-10 neo-shadow active:rotate-1 transition-transform">
            <span className="material-symbols-outlined text-5xl mb-6">group</span>
            <div className="font-headline font-black text-3xl mb-4 uppercase leading-none">Global Crews</div>
            <p className="font-body font-bold">Join temporary squads based on interest. Raid the feed and disappear.</p>
          </div>
          {/* Small Feature 3 */}
          <div className="md:col-span-4 bg-tertiary text-black border-4 border-black p-10 neo-shadow">
            <span className="material-symbols-outlined text-5xl mb-6">lock_open</span>
            <div className="font-headline font-black text-3xl mb-4 uppercase leading-none">Vault Access</div>
            <p className="font-body font-bold">End-to-end encrypted file drops that self-destruct after 60 seconds.</p>
          </div>
          {/* Medium Feature 4 */}
          <div className="md:col-span-8 bg-surface-container-highest border-4 border-black p-10 neo-shadow-secondary">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="max-w-md">
                <div className="text-primary font-headline font-black text-4xl mb-4 uppercase">Chaos Mode</div>
                <p className="font-body text-xl">Enter a 100-person chat room where every message is text-to-speech and the speed is uncapped. Absolute digital riot.</p>
              </div>
              <button className="w-full md:w-auto bg-black text-white border-4 border-white px-8 py-4 font-headline font-black uppercase hover:bg-white hover:text-black transition-none">
                Activate
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive CTA Section */}
      <section className="py-32 px-6 md:px-16 text-center">
        <div className="max-w-5xl mx-auto border-8 border-black bg-primary p-12 md:p-24 neo-shadow-lg -rotate-1">
          <h2 className="font-headline font-black text-5xl md:text-8xl text-black uppercase leading-none mb-8">
            Ready to <span className="text-white bg-black px-4">Vibe?</span>
          </h2>
          <p className="font-body text-xl md:text-3xl text-black font-black uppercase mb-12 tracking-tight">
            Join the underground network. No surrender.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link to="/onboarding" className="bg-black text-white text-3xl font-headline font-black uppercase px-12 py-8 border-4 border-black neo-shadow-secondary active-press transition-none decoration-none">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-10 py-16 flex flex-col md:flex-row justify-between items-center gap-8 bg-[#fed023] border-t-8 border-black font-['Epilogue'] font-extrabold uppercase text-black">
        <div className="text-4xl font-black text-black">VIBECHAT</div>
        <div className="flex flex-wrap justify-center gap-8 text-lg">
          <a className="text-black underline hover:text-[#ff6d8d] transition-none hover:-rotate-1" href="#">MANIFESTO</a>
          <a className="text-black hover:text-[#ff6d8d] transition-none hover:-rotate-1" href="#">PRIVACY</a>
          <a className="text-black hover:text-[#ff6d8d] transition-none hover:-rotate-1" href="#">CHAOS_MODE</a>
          <a className="text-black hover:text-[#ff6d8d] transition-none hover:-rotate-1" href="#">SUPPORT</a>
        </div>
        <div className="text-black tracking-widest text-center md:text-right">
          &copy;2024 VIBECHAT. NO SURRENDER.
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
