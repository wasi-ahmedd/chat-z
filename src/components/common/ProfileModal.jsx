import React from 'react'
import { X, LogOut, ChevronRight, Zap, Award, Moon, Volume2 } from 'lucide-react'
import NeoButton from './NeoButton'

const ProfileModal = ({ isOpen, onClose, user, onLogout }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
      {/* Profile Modal Container */}
      <div className="relative w-full max-w-md bg-[#F0F0F0] border-[4px] border-black shadow-[8px_8px_0px_0px_#000000] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header section */}
        <div className="bg-primary p-6 border-b-[4px] border-black flex justify-between items-start">
          <h1 className="font-headline font-black italic text-4xl tracking-tighter text-black uppercase">
            VIBE_PROFILE
          </h1>
          <button 
            onClick={onClose}
            className="bg-white border-2 border-black p-1 hover:bg-error transition-colors active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_#000000]"
          >
            <X size={24} className="text-black" />
          </button>
        </div>

        {/* Avatar & Badge Row */}
        <div className="p-8 flex gap-6 items-center">
          <div className="w-32 h-32 bg-white border-[4px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000000] relative group overflow-hidden">
            {/* Halftone placeholder */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(black 1.5px, transparent 0)', backgroundSize: '6px 6px' }}></div>
            <span className="text-6xl font-headline font-black text-black z-10">?</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="bg-secondary text-black font-headline font-black px-4 py-1 border-[3px] border-black inline-block text-sm tracking-widest shadow-[4px_4px_0px_0px_#000000]">
              RIOTER
            </span>
            <div className="mt-2">
              <p className="text-xs font-bold text-black/60 uppercase tracking-widest">Status</p>
              <p className="text-on-secondary font-black uppercase text-lg">ONLINE_NOW</p>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="px-8 pb-4">
          <div className="border-[4px] border-black p-4 bg-white shadow-[4px_4px_0px_0px_#000000]">
            <h3 className="font-headline font-black text-black border-b-[3px] border-black mb-4 pb-1 uppercase italic flex items-center gap-2">
              <Zap size={16} /> ACCOUNT_INFO
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b-2 border-black/10 pb-1">
                <span className="text-xs font-bold text-black/50 uppercase tracking-wider font-body">Username</span>
                <span className="text-black font-black uppercase font-headline tracking-tighter">{user?.username || 'NEON_PHANTOM'}</span>
              </div>
              <div className="flex justify-between items-end border-b-2 border-black/10 pb-1">
                <span className="text-xs font-bold text-black/50 uppercase tracking-wider font-body">Joined</span>
                <span className="text-black font-black uppercase font-headline text-sm tracking-tighter">OCT_2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="px-8 py-4">
          <div className="border-[4px] border-black p-4 bg-surface-bright text-white shadow-[4px_4px_0px_0px_#000000]">
            <h3 className="font-headline font-black text-primary border-b-[3px] border-primary mb-4 pb-1 uppercase italic flex items-center gap-2">
              <Award size={16} /> PREFERENCES
            </h3>
            <div className="space-y-4">
              {/* Switch 1: Dark Mode */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                  <Moon size={14} /> DARK_MODE
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked readOnly />
                  <div className="w-14 h-8 bg-black border-[3px] border-white peer-checked:bg-tertiary transition-all"></div>
                  <div className="absolute left-1 top-1 w-6 h-6 bg-white border-[2px] border-black peer-checked:translate-x-6 transition-transform"></div>
                </label>
              </div>
              {/* Switch 2: Sound Effects */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                  <Volume2 size={14} /> SOUND_EFFECTS
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-14 h-8 bg-black border-[3px] border-white peer-checked:bg-tertiary transition-all"></div>
                  <div className="absolute left-1 top-1 w-6 h-6 bg-white border-[2px] border-black peer-checked:translate-x-6 transition-transform"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-8 flex flex-col gap-4">
          <NeoButton variant="primary" className="py-4 text-xl italic tracking-tighter w-full">
            UPGRADE_TO_PREMIUM
          </NeoButton>
          <button 
            onClick={onLogout}
            className="w-full bg-[#ff4d4d] text-white font-headline font-black text-lg py-3 border-[4px] border-black shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-error-dim transition-all uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <LogOut size={20} /> LOGOUT
          </button>
        </div>

        {/* Decorative Strip */}
        <div className="h-4 w-full bg-black flex overflow-hidden">
          <div className="h-full w-full opacity-30" style={{ backgroundImage: 'radial-gradient(#fed023 1px, transparent 0)', backgroundSize: '4px 4px' }}></div>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
