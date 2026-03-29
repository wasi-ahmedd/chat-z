import React from 'react'

const PremiumModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-surface border-4 border-black shadow-[16px_16px_0px_0px_#000000] flex flex-col md:flex-row overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[70] bg-white text-black border-4 border-black p-2 hover:bg-secondary active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_#000000] transition-none"
        >
          <span className="material-symbols-outlined font-bold">close</span>
        </button>
        {/* Decorative Left Panel (Desktop Only) */}
        <div className="hidden md:block w-1/3 bg-tertiary border-r-4 border-black relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '8px 8px' }}></div>
          <div className="p-8 h-full flex flex-col justify-between relative z-10">
            <div className="text-black font-headline font-black text-6xl leading-[0.8] tracking-tighter uppercase italic">
              NO<br/>LIMITS
            </div>
            <img alt="Abstract digital distortion" className="w-full border-4 border-black shadow-[4px_4px_0px_0px_#000000] rotate-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvoKDA3XvFrgYnKwE62XPiTU7LpYses6zeNmR24s0C06kfXB4X8sEaoBWhOs_hLQQcZYoM3Qo1lNbuyYrO0noTuVFAjJRiMLcpp121QtaKGJGOzhYzNszcJEq9Ck2QIyOR690f6NS3654cWYNVFQEm2yEZMsOQ1C2Dj46zkGl7TvYik-ijXOU2GKMR3StB1iRlVgrfQiwMogmWDicvwtQ3f-K19pXycSwXkaz_g-JQuPTh7WMky4mGK7H_g6ogiuPC3qpgVQ-79mc"/>
            <div className="bg-black text-tertiary p-4 font-headline font-black text-xl border-2 border-white -rotate-3">
              VIBECHAT_RAW
            </div>
          </div>
        </div>
        {/* Main Content Panel */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-primary p-6 md:p-10 border-b-4 border-black">
            <h1 className="text-black font-headline font-black text-4xl md:text-6xl leading-none tracking-tighter uppercase italic">
              UNLOCK THE RIOT:<br/>VIBECHAT PREMIUM
            </h1>
          </header>
          {/* Body */}
          <div className="p-6 md:p-10 flex flex-col gap-8">
            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 bg-surface-container border-2 border-black p-4">
                <span className="material-symbols-outlined text-tertiary font-bold text-3xl">bolt</span>
                <span className="font-headline font-extrabold uppercase text-xs">Skip queues</span>
              </div>
              <div className="flex items-center gap-3 bg-surface-container border-2 border-black p-4">
                <span className="material-symbols-outlined text-secondary font-bold text-3xl">verified</span>
                <span className="font-headline font-extrabold uppercase text-xs">Custom profile badges</span>
              </div>
              <div className="flex items-center gap-3 bg-surface-container border-2 border-black p-4">
                <span className="material-symbols-outlined text-primary font-bold text-3xl">block</span>
                <span className="font-headline font-extrabold uppercase text-xs">Ad-free</span>
              </div>
            </div>
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Monthly */}
              <div className="bg-surface-container-high border-4 border-black p-6 shadow-[8px_8px_0px_0px_#fed023] relative group hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#fed023] transition-all">
                <div className="font-headline font-black text-xl text-white mb-2 uppercase">MONTHLY</div>
                <div className="font-headline font-black text-5xl text-primary mb-4">$9.99</div>
                <div className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Billed every 30 days</div>
                <div className="absolute -top-3 -right-3 bg-black border-2 border-white text-white text-[10px] px-2 py-1 font-black uppercase rotate-12">Flexible</div>
              </div>
              {/* Yearly */}
              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#ff6d8d] relative group hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#ff6d8d] transition-all">
                <div className="font-headline font-black text-xl text-black mb-2 uppercase">YEARLY</div>
                <div className="font-headline font-black text-5xl text-black mb-4">$59.99</div>
                <div className="text-xs text-black/60 font-bold uppercase tracking-widest">Save 50% vs Monthly</div>
                <div className="absolute -top-4 -right-2 bg-secondary text-black border-2 border-black text-[10px] px-3 py-1 font-black uppercase -rotate-6">BEST_VALUE</div>
              </div>
            </div>
            {/* CTA Section */}
            <div className="flex flex-col gap-4 mt-4">
              <button className="w-full bg-secondary border-4 border-black py-6 text-black font-headline font-black text-3xl uppercase tracking-tighter shadow-[8px_8px_0px_0px_#000000] hover:shadow-[12px_12px_0px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none transition-none">
                UPGRADE NOW
              </button>
              <p className="text-center text-[10px] text-on-surface-variant uppercase font-bold tracking-[0.2em]">
                Cancel anytime. No questions. No bullshit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PremiumModal
