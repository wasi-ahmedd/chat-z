import React from 'react'

const Loading = () => {
  return (
    <div className="bg-background font-body text-on-background min-h-screen overflow-hidden flex flex-col justify-center items-center relative">
      {/* Halftone Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none z-0"
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '10px 10px' }}
      ></div>

      {/* Main Container */}
      <main className="z-10 w-full max-w-4xl px-8 flex flex-col items-center gap-16">
        {/* Logo Section */}
        <div className="relative">
          <h1 className="font-headline italic font-black text-8xl md:text-[12rem] text-primary tracking-tighter leading-none animate-bounce select-none drop-shadow-[8px_8px_0px_#000000]">
            VIBECHAT
          </h1>
          {/* Aesthetic Clash Element */}
          <div className="absolute -top-6 -right-6 bg-secondary text-black font-black text-xl px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_#000000] -rotate-6">
            LOADING...
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex gap-6 items-center">
          <div className="w-6 h-6 bg-tertiary border-4 border-black animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-6 h-6 bg-tertiary border-4 border-black animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-6 h-6 bg-tertiary border-4 border-black animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Progress Wrapper */}
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-end mb-4">
            <span className="font-headline font-black text-primary text-3xl italic tracking-tighter">STABILIZING FREQUENCIES</span>
            <span className="font-headline font-black text-white text-3xl italic tracking-tighter">88%</span>
          </div>
          {/* Progress Bar Container */}
          <div className="w-full h-12 bg-surface-container border-4 border-black shadow-[8px_8px_0px_0px_#000000] relative overflow-hidden">
            {/* Progress Fill */}
            <div 
              className="h-full bg-primary border-r-4 border-black flex items-center justify-end px-4 transition-all duration-1000"
              style={{ width: '88%' }}
            >
              <div className="h-full w-2 bg-black/20 ml-1"></div>
              <div className="h-full w-2 bg-black/20 ml-1"></div>
              <div className="h-full w-2 bg-black/20 ml-1"></div>
            </div>
          </div>
        </div>

        {/* System Messages Bento-style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
          <div className="bg-surface-container border-4 border-black p-4 flex flex-col gap-2 shadow-[4px_4px_0px_0px_#000000]">
            <span className="text-secondary font-bold text-xs tracking-widest uppercase">Encryption</span>
            <p className="text-white font-medium text-sm">ENABLING CHAOTIC-GOOD SECURITY PROTOCOLS</p>
          </div>
          <div className="bg-surface-container border-4 border-black p-4 flex flex-col gap-2 shadow-[4px_4px_0px_0px_#000000]">
            <span className="text-tertiary font-bold text-xs tracking-widest uppercase">Network</span>
            <p className="text-white font-medium text-sm">SYNCING EMOTIONAL METADATA CHANNELS</p>
          </div>
          <div className="bg-surface-container border-4 border-black p-4 flex flex-col gap-2 shadow-[4px_4px_0px_0px_#000000]">
            <span className="text-primary font-bold text-xs tracking-widest uppercase">Mood</span>
            <p className="text-white font-medium text-sm">CALIBRATING NEON SATURATION LEVELS</p>
          </div>
        </div>
      </main>

      {/* Bottom Visual Anchor */}
      <div className="fixed bottom-0 left-0 w-full h-8 bg-primary border-t-4 border-black flex items-center px-6 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap animate-scroll">
          <span className="font-black text-black text-xs tracking-widest uppercase">SYSTEM ONLINE // SYSTEM ONLINE // SYSTEM ONLINE // SYSTEM ONLINE // SYSTEM ONLINE // </span>
          <span className="font-black text-black text-xs tracking-widest uppercase">SYSTEM ONLINE // SYSTEM ONLINE // SYSTEM ONLINE // SYSTEM ONLINE // SYSTEM ONLINE // </span>
        </div>
      </div>

      {/* Aesthetic Floating Icons */}
      <div className="fixed top-12 left-12 w-16 h-16 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#fed023] rotate-12">
        <span className="material-symbols-outlined text-black text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
      </div>
      <div className="fixed bottom-24 right-12 w-20 h-20 bg-secondary border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000000] -rotate-12">
        <span className="material-symbols-outlined text-black text-5xl">sensors</span>
      </div>
    </div>
  )
}

export default Loading
