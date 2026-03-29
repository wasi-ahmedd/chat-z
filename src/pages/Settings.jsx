import React from 'react'
import { Link } from 'react-router-dom'

const Settings = () => {
  return (
    <div className="bg-background text-on-background font-body min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#0e0e0e] border-b-4 border-black shadow-[4px_4px_0px_0px_#000000]">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-headline font-black uppercase tracking-tighter text-3xl text-[#fed023] italic decoration-none">
            VIBECHAT
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 border-4 border-black bg-surface text-white hover:bg-[#fed023] hover:text-black transition-colors active:translate-x-1 active:translate-y-1 active:shadow-none neo-shadow">
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button className="p-2 border-4 border-black bg-[#fed023] text-black transition-colors active:translate-x-1 active:translate-y-1 active:shadow-none neo-shadow">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </nav>

      <main className="pt-28 pb-32 px-4 max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <header className="mb-16">
          <Link to="/lobby" className="inline-flex items-center gap-2 mb-6 px-6 py-2 border-4 border-black bg-surface-container text-white font-headline font-black uppercase neo-shadow hover:bg-primary hover:text-black active:translate-x-1 active:translate-y-1 active:shadow-none transition-all decoration-none">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Lobby
          </Link>
          <h1 className="font-headline font-black text-6xl md:text-8xl text-primary uppercase leading-none tracking-tighter mb-4">
            Settings
          </h1>
          <div className="h-2 w-32 bg-secondary border-2 border-black neo-shadow"></div>
        </header>

        {/* Account Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-4xl">person</span>
            <h2 className="font-headline font-black text-3xl uppercase tracking-tight">Account</h2>
          </div>
          <div className="grid grid-cols-1 gap-0 border-4 border-black bg-surface-container neo-shadow">
            {/* Profile Item */}
            <div className="flex items-center justify-between p-6 border-b-4 border-black hover:bg-surface-bright transition-colors group">
              <div className="flex flex-col">
                <span className="font-headline font-extrabold text-xl uppercase text-primary">Anonymous Handle</span>
                <span className="text-on-surface-variant font-bold">@NeonShadow_99</span>
              </div>
              <button className="px-6 py-2 border-4 border-black bg-primary text-black font-black uppercase neo-shadow hover:bg-secondary transition-all active:translate-x-1 active:translate-y-1 active:shadow-none">
                Edit
              </button>
            </div>
            {/* Email Item */}
            <div className="flex items-center justify-between p-6 hover:bg-surface-bright transition-colors cursor-pointer">
              <div className="flex flex-col">
                <span className="font-headline font-extrabold text-xl uppercase text-primary">Recovery Email</span>
                <span className="text-on-surface-variant font-bold">shadow****@proton.me</span>
              </div>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary text-4xl">notifications_active</span>
            <h2 className="font-headline font-black text-3xl uppercase tracking-tight">Notifications</h2>
          </div>
          <div className="grid grid-cols-1 border-4 border-black bg-surface-container neo-shadow">
            {/* Push Notification Toggle */}
            <div className="flex items-center justify-between p-6 border-b-4 border-black">
              <div className="flex flex-col max-w-[70%]">
                <span className="font-headline font-extrabold text-xl uppercase text-primary">Push Alerts</span>
                <p className="text-on-surface-variant text-sm font-bold">Get pinged when a vibe match is found in your area.</p>
              </div>
              <div className="relative inline-block w-14 h-8 bg-surface-container-highest border-4 border-black p-1 transition-colors cursor-pointer">
                <div className="w-4 h-4 bg-[#9fff88] border-2 border-black translate-x-6"></div>
              </div>
            </div>
            {/* Vibe Alerts Toggle */}
            <div className="flex items-center justify-between p-6">
              <div className="flex flex-col max-w-[70%]">
                <span className="font-headline font-extrabold text-xl uppercase text-primary">Stealth Mode</span>
                <p className="text-on-surface-variant text-sm font-bold">Silence all sounds. Only haptic buzzes allowed.</p>
              </div>
              <div className="relative inline-block w-14 h-8 bg-surface-container-highest border-4 border-black p-1 transition-colors cursor-pointer">
                <div className="w-4 h-4 bg-white border-2 border-black"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-4xl">security</span>
            <h2 className="font-headline font-black text-3xl uppercase tracking-tight">Privacy</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-4 border-black neo-shadow">
            <div className="p-8 bg-surface-container-high border-b-4 md:border-b-0 md:border-r-4 border-black space-y-4">
              <span className="font-headline font-black text-2xl uppercase block text-tertiary">Ghost Mode</span>
              <p className="text-on-surface-variant font-bold leading-tight">Your location is scrambled every 30 seconds. Total anonymity.</p>
              <button className="w-full py-3 border-4 border-black bg-tertiary text-black font-black uppercase neo-shadow hover:neo-shadow-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                Enable Ghost
              </button>
            </div>
            <div className="p-8 bg-surface-container-high space-y-4">
              <span className="font-headline font-black text-2xl uppercase block text-secondary">Data Shredder</span>
              <p className="text-on-surface-variant font-bold leading-tight">Wipe all message history and media from the server instantly.</p>
              <button className="w-full py-3 border-4 border-black bg-error text-white font-black uppercase neo-shadow hover:neo-shadow-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                Shred Data
              </button>
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-4xl">palette</span>
            <h2 className="font-headline font-black text-3xl uppercase tracking-tight">Appearance</h2>
          </div>
          <div className="p-8 border-4 border-black bg-surface-container neo-shadow">
            <span className="font-headline font-extrabold text-xl uppercase text-primary mb-6 block">Color Profile</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button className="aspect-square border-4 border-black bg-primary flex flex-col items-center justify-center gap-2 group hover:scale-105 transition-transform">
                <div className="w-8 h-8 bg-black"></div>
                <span className="text-xs font-black text-black tracking-tighter">RETRO</span>
              </button>
              <button className="aspect-square border-4 border-black bg-secondary flex flex-col items-center justify-center gap-2 group hover:scale-105 transition-transform">
                <div className="w-8 h-8 bg-black"></div>
                <span className="text-xs font-black text-black tracking-tighter">CYBER</span>
              </button>
              <button className="aspect-square border-4 border-black bg-tertiary flex flex-col items-center justify-center gap-2 group hover:scale-105 transition-transform">
                <div className="w-8 h-8 bg-black"></div>
                <span className="text-xs font-black text-black tracking-tighter">TOXIC</span>
              </button>
              <button className="aspect-square border-4 border-black bg-white flex flex-col items-center justify-center gap-2 group hover:scale-105 transition-transform">
                <div className="w-8 h-8 bg-black"></div>
                <span className="text-xs font-black text-black tracking-tighter">STARK</span>
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <div className="pt-12">
          <button className="w-full py-6 border-4 border-black bg-surface-container-lowest text-error font-headline font-black text-2xl uppercase tracking-widest neo-shadow hover:bg-error hover:text-white transition-all active:translate-x-1 active:translate-y-1 active:shadow-none">
            Terminate Account
          </button>
        </div>
      </main>
      
      {/* Bottom Navigation is removed as per user request */}
    </div>
  )
}

export default Settings
