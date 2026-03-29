import React from 'react'

const ProfileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      {/* Profile Modal Container */}
      <div className="relative w-full max-w-md bg-[#F0F0F0] border-[4px] border-black neo-brutal-shadow flex flex-col z-10 overflow-hidden">
        {/* Header section */}
        <div className="bg-primary p-6 border-b-[4px] border-black flex justify-between items-start">
          <h1 className="font-headline font-black italic text-4xl tracking-tighter text-black uppercase">
            VIBE_PROFILE
          </h1>
          <button
            onClick={onClose}
            className="bg-white border-2 border-black p-1 hover:bg-error transition-colors active-press neo-brutal-shadow-sm"
          >
            <span className="material-symbols-outlined block text-black">close</span>
          </button>
        </div>
        {/* Avatar & Badge Row */}
        <div className="p-8 flex gap-6 items-center">
          <div className="w-32 h-32 bg-white border-[4px] border-black flex items-center justify-center neo-brutal-shadow-sm relative group overflow-hidden">
            <img alt="User Avatar Placeholder" className="absolute inset-0 w-full h-full object-cover opacity-20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXJUC-dzwnma95Dg8lZYh6ZD62d4Nmb29F4wVdXeSoVyKNHnKAhRreSdX_6wCyYHqppxX9ZH7VIi9_trETtww4nQwMS2mINIJ0hDRKq7e5T_67qU5TsqH99KuKWk7WV4UNc3ksySOL18qoplmDqKUyYSZ43XzhQsD76QHefm_qSVl_zUSOalgWqwUP-b_X0rrT1KNlpnS8otVDm818HV9aBge3kJXHotzsoaeEWyXgHR5OORez_a4dD6Ff-bm-ON_heeTA2LdWd60" />
            <span className="text-6xl font-headline font-black text-black z-10">?</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="bg-secondary text-black font-headline font-black px-4 py-1 border-[3px] border-black inline-block text-sm tracking-widest neo-brutal-shadow-sm">
              RIOTER
            </span>
            <div className="mt-2">
              <p className="text-xs font-bold text-black/60 uppercase tracking-widest">Status</p>
              <p className="text-black font-black uppercase text-lg">ONLINE_NOW</p>
            </div>
          </div>
        </div>
        {/* Account Info */}
        <div className="px-8 pb-4">
          <div className="border-[4px] border-black p-4 bg-white neo-brutal-shadow-sm">
            <h3 className="font-headline font-black text-black border-b-[3px] border-black mb-4 pb-1 uppercase italic">
              Account Info
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b-2 border-black/10 pb-1">
                <span className="text-xs font-bold text-black/50 uppercase tracking-wider">Username</span>
                <span className="text-black font-black uppercase font-headline">NEON_PHANTOM</span>
              </div>
              <div className="flex justify-between items-end border-b-2 border-black/10 pb-1">
                <span className="text-xs font-bold text-black/50 uppercase tracking-wider">Joined</span>
                <span className="text-black font-black uppercase font-headline text-sm tracking-tighter">OCT_2026</span>
              </div>
            </div>
          </div>
        </div>
        {/* Preferences */}
        <div className="px-8 py-4">
          <div className="border-[4px] border-black p-4 bg-surface-bright text-white neo-brutal-shadow-sm">
            <h3 className="font-headline font-black text-primary border-b-[3px] border-primary mb-4 pb-1 uppercase italic">
              Preferences
            </h3>
            <div className="space-y-4">
              {/* Switch 1: Dark Mode */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-black uppercase tracking-tight">Dark Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked className="sr-only peer" type="checkbox" />
                  <div className="w-14 h-8 bg-black border-[3px] border-white peer-checked:bg-tertiary transition-all"></div>
                  <div className="absolute left-1 top-1 w-6 h-6 bg-white border-[2px] border-black peer-checked:translate-x-6 transition-transform"></div>
                </label>
              </div>
              {/* Switch 2: Sound Effects */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-black uppercase tracking-tight">Sound Effects</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="w-14 h-8 bg-black border-[3px] border-white peer-checked:bg-tertiary transition-all"></div>
                  <div className="absolute left-1 top-1 w-6 h-6 bg-white border-[2px] border-black peer-checked:translate-x-6 transition-transform"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="p-8 flex flex-col gap-4">
          <button className="w-full bg-primary text-black font-headline font-black text-xl py-4 border-[4px] border-black neo-brutal-shadow-sm active-press hover:bg-primary-container transition-all uppercase italic tracking-tighter">
            UPGRADE TO PREMIUM
          </button>
          <button className="w-full bg-[#ff4d4d] text-white font-headline font-black text-lg py-3 border-[4px] border-black neo-brutal-shadow-sm active-press hover:bg-error-dim transition-all uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="material-symbols-outlined font-black">logout</span>
            LOGOUT
          </button>
        </div>
        {/* Decorative Halftone Pattern Strip */}
        <div className="h-4 w-full bg-black flex overflow-hidden">
          <div className="h-full w-full opacity-30" style={{ backgroundImage: 'radial-gradient(#fed023 1px, transparent 0)', backgroundSize: '4px 4px' }}></div>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
