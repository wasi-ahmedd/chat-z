import React from 'react'
import NeoButton from './NeoButton'
import { X, Zap, ShieldCheck, Award } from 'lucide-react'

const PremiumModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-body">
      <div className="relative w-full max-w-4xl bg-surface border-4 border-black shadow-[16px_16px_0px_#000000] flex flex-col md:flex-row overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-[70] bg-white text-black border-4 border-black p-2 hover:bg-secondary active-press shadow-none transition-none"
        >
          <X size={24} strokeWidth={3} />
        </button>

        {/* Decorative Left Panel (Desktop Only) */}
        <div className="hidden md:block w-1/3 bg-tertiary border-r-4 border-black relative overflow-hidden p-8">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '8px 8px' }}></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="text-black font-headline font-black text-6xl leading-[0.8] tracking-tighter uppercase italic">
              NO<br/>LIMITS
            </div>
            <div className="bg-black text-tertiary p-4 font-headline font-black text-xl border-2 border-white -rotate-3 text-center">
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
                <Zap className="text-tertiary" size={24} />
                <span className="font-headline font-black uppercase text-[10px] leading-tight text-white">Skip match queues</span>
              </div>
              <div className="flex items-center gap-3 bg-surface-container border-2 border-black p-4">
                <Award className="text-secondary" size={24} />
                <span className="font-headline font-black uppercase text-[10px] leading-tight text-white">Custom profile badges</span>
              </div>
              <div className="flex items-center gap-3 bg-surface-container border-2 border-black p-4">
                <ShieldCheck className="text-primary" size={24} />
                <span className="font-headline font-black uppercase text-[10px] leading-tight text-white">Zero ads. Raw vibe.</span>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Monthly */}
              <div className="bg-surface-container-high border-4 border-black p-6 shadow-[8px_8px_0px_#fed023] relative group hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_#fed023] transition-all">
                <div className="font-headline font-black text-xl text-white mb-2 uppercase">MONTHLY</div>
                <div className="font-headline font-black text-5xl text-primary mb-4">$9.99</div>
                <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Billed every 30 days</div>
                <div className="absolute -top-3 -right-3 bg-black border-2 border-white text-white text-[10px] px-2 py-1 font-black uppercase rotate-12">Flexible</div>
              </div>
              {/* Yearly */}
              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#ff6d8d] relative text-black group hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_#ff6d8d] transition-all">
                <div className="font-headline font-black text-xl mb-2 uppercase">YEARLY</div>
                <div className="font-headline font-black text-5xl mb-4">$59.99</div>
                <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Save 50% vs Monthly</div>
                <div className="absolute -top-4 -right-2 bg-secondary text-black border-2 border-black text-[10px] px-3 py-1 font-black uppercase -rotate-6">BEST_VALUE</div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col gap-4 mt-4">
              <NeoButton variant="secondary" className="w-full py-6 text-3xl">
                UPGRADE NOW
              </NeoButton>
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
