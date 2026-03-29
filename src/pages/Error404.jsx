import React from 'react'
import { Link } from 'react-router-dom'

const Error404 = () => {
  return (
    <div className="bg-background text-on-background font-body min-h-screen flex flex-col overflow-hidden relative">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#0e0e0e] border-b-4 border-black shadow-[4px_4px_0px_0px_#000000]">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-3xl font-black text-[#fed023] italic font-headline uppercase tracking-tighter decoration-none">
            VIBECHAT
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-white hover:bg-[#fed023] hover:text-black transition-colors active:translate-x-1 active:translate-y-1 active:shadow-none">
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button className="p-2 text-white hover:bg-[#fed023] hover:text-black transition-colors active:translate-x-1 active:translate-y-1 active:shadow-none">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </nav>

      {/* Main Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center relative p-6 mt-20">
        {/* Background Noise/Texture Simulation */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAWIHLY9aqQzcxa2hoIJFFXHj6kyWxTfkSW44Xif8zDwlxjCX8HSExVxrzNlH9GLhTikJmoxoP1gCLayD1_Rz6l2_ql8qqQcmRQFqY3W6Rl3Cg6ZpEYiCvi-P2Ut8rU8cx7ZkbxD_PAsMUvq6bErzlmkIvGDY67sO_KI6IWfgkF6LgjJCAheBvufTk7B_m11oXxGPAZ5sa6aZTlV36NrwOLgZgG1gwGfxiIV0fMPuFcEoVgFTpHcIcoDGH1ypU76_wdufZK1g7c6QE')" }}
        ></div>

        {/* Asymmetric Layout Container */}
        <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Large 404 */}
          <div className="md:col-span-7 flex flex-col items-start">
            <div className="relative inline-block mb-4">
              <h1 
                className="font-headline font-black text-[12rem] md:text-[18rem] leading-none tracking-tighter text-on-surface glitch-text select-none"
                style={{ textShadow: "4px 0px 0px #ff6d8d, -4px 0px 0px #9fff88" }}
              >
                404
              </h1>
              <div className="absolute -top-4 -right-8 bg-secondary text-black font-headline font-black px-4 py-2 text-2xl border-4 border-black neo-shadow -rotate-6">
                CRASHED
              </div>
            </div>
            <div className="bg-surface-container-high border-4 border-black p-6 neo-shadow-pink max-w-md -mt-10 md:mt-0 ml-4 md:ml-20">
              <h2 className="font-headline font-black text-3xl md:text-5xl uppercase text-primary leading-none mb-4 italic">
                WHOOPS! THE VIBE IS GONE.
              </h2>
              <p className="text-xl font-bold text-on-surface-variant leading-tight">
                The frequency you are trying to reach has been scrambled or deleted. No signal detected at this coordinate.
              </p>
            </div>
          </div>

          {/* Right Column: Visual Element & CTA */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start gap-8">
            <div className="w-full aspect-square bg-surface-container border-4 border-black neo-shadow-lg overflow-hidden relative rotate-3">
              <img alt="Scrambled static" className="w-full h-full object-cover grayscale contrast-150 mix-blend-screen opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6uD3cqNAZY89i7yZbUMLRXGG_ISsOpKZ1RmZs2dlCu2fSWi-7luZTNK-ppybReR2eDWzLMLk5Rbg_KWE1rYrAIbUKyBflO3Gxv2LJ-81-EEPfIdxIIbjzCrmLUVMHj_y_ROtQLEhz5Z8DQWHb8U4hNOIjGanvfBcIRRKf3FtOFByIezfrLEDgVbr50Ro_bEHCNEVA_RS0y_nvEDCP30DP65d0kyUDTS8nrLT2uq95buwKfqUCVV7GW5stCUJgdY2Qyrxog7dzUjA"/>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-[10rem] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              </div>
            </div>
            
            {/* Primary CTA */}
            <Link className="group relative inline-block w-full text-black decoration-none" to="/">
              <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>
              <button className="relative w-full bg-primary text-black font-headline font-black text-3xl py-6 border-4 border-black active:translate-x-1 active:translate-y-1">
                RETURN_TO_BASE
              </button>
            </Link>

            {/* Secondary Actions */}
            <div className="flex gap-4 w-full">
              <button className="flex-1 bg-secondary text-black font-label font-bold py-3 border-4 border-black neo-shadow hover:bg-white transition-colors">
                REPORT_LOG
              </button>
              <button className="flex-1 bg-surface-container-highest text-white font-label font-bold py-3 border-4 border-black neo-shadow hover:bg-tertiary hover:text-black transition-colors">
                HELP_CENTER
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Floating Elements */}
        <div className="absolute top-1/4 right-10 hidden lg:block">
          <div className="w-32 h-32 border-4 border-tertiary neo-shadow rotate-12 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary text-5xl">wifi_off</span>
          </div>
        </div>
        <div className="absolute bottom-1/4 left-10 hidden lg:block">
          <div className="bg-secondary p-4 border-4 border-black neo-shadow -rotate-12">
            <span className="font-headline font-black text-black">CODE: 0xDEADBEEF</span>
          </div>
        </div>
      </main>

      {/* Scrolling Ticker Tape */}
      <footer className="fixed bottom-0 w-full z-50 overflow-hidden bg-primary border-t-4 border-black py-4">
        <div className="flex whitespace-nowrap animate-scroll">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="font-headline font-black text-4xl text-black px-4 italic">SIGNAL_LOST //</span>
          ))}
        </div>
      </footer>
    </div>
  )
}

export default Error404
