import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import NeoButton from '../components/common/NeoButton'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, MessageSquare, ShieldAlert, History as HistoryIcon, Hash } from 'lucide-react'

const History = () => {
  const navigate = useNavigate()

  // Mock history data
  const historyData = [
    { id: 'R-772', partner: 'CYBER_GHOST', dur: '12m 45s', date: '29 OCT 2026', vibe: 'NEO_BRUTALISM' },
    { id: 'R-765', partner: 'LUNAR_WITCH', dur: '45m 12s', date: '28 OCT 2026', vibe: 'WEB3_ANARCHY' },
    { id: 'R-759', partner: 'SYSTEM_REBEL', dur: '05m 22s', date: '28 OCT 2026', vibe: 'VOID_CORE' },
    { id: 'R-744', partner: 'PIXEL_PUNK', dur: '22m 10s', date: '27 OCT 2026', vibe: 'GLITCH_HOP' },
  ]

  return (
    <AppLayout>
      <div className="p-4 md:p-8 flex flex-col gap-8 max-w-5xl mx-auto pb-24 md:pb-8">
        {/* Header Title */}
        <div className="flex justify-between items-end border-b-8 border-black pb-4 mb-4">
          <div>
            <h1 className="text-6xl md:text-8xl font-headline font-black uppercase italic tracking-tighter text-white">
              HISTORY_LOG
            </h1>
            <p className="text-sm font-bold text-tertiary uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
              <HistoryIcon size={16} /> TRACING_PREVIOUS_RIOTS_IN_THE_MACHINE
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-black bg-white text-black px-2 py-1 border-2 border-black">SECURE_CONNECTION</span>
            <span className="text-4xl font-headline font-black italic">RIOTER_v1.0</span>
          </div>
        </div>

        {/* History List */}
        <div className="grid grid-cols-1 gap-6">
          {historyData.map((riot, i) => (
            <div 
              key={riot.id} 
              className="bg-surface-container border-4 border-black shadow-[8px_8px_0px_#fed023] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group overflow-hidden"
            >
              <div className="flex flex-col md:flex-row divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
                {/* Info Section */}
                <div className="p-6 flex-1 bg-white text-black">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase opacity-60">SESSION_ID</span>
                      <h3 className="text-2xl font-headline font-black italic uppercase tracking-tight">{riot.id}</h3>
                    </div>
                    <div className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase border-2 border-black">
                      {riot.vibe}
                    </div>
                  </div>
                  
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] font-black uppercase opacity-60">STRANGER</p>
                      <p className="text-xl font-headline font-black italic uppercase">{riot.partner}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase opacity-60">DURATION</p>
                      <p className="text-xl font-headline font-black italic uppercase">{riot.dur}</p>
                    </div>
                  </div>
                </div>

                {/* Date Section */}
                <div className="p-6 md:w-48 bg-secondary text-black flex flex-col justify-center items-center text-center">
                  <Calendar size={32} className="mb-2" />
                  <span className="font-headline font-black text-xs uppercase">{riot.date}</span>
                </div>

                {/* Actions */}
                <div className="p-6 flex flex-col gap-2 justify-center bg-surface-container-highest">
                  <button className="bg-primary text-black font-black uppercase text-[10px] py-2 px-4 border-2 border-black hover:bg-white transition-colors active:translate-x-1 active:translate-y-1">
                    REPORT_RIOT
                  </button>
                  <button className="bg-black text-white font-black uppercase text-[10px] py-2 px-4 border-2 border-white hover:bg-white hover:text-black transition-colors active:translate-x-1 active:translate-y-1">
                    ADD_FRIEND
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Warning Toast */}
        <div className="fixed bottom-20 md:bottom-8 right-8 z-[60] bg-error border-4 border-black p-4 shadow-[4px_4px_0px_#000000] flex items-center gap-4 animate-bounce hover:animate-none">
          <ShieldAlert size={24} />
          <span className="font-black uppercase text-xs tracking-tighter">DATA PURGE IN 24H</span>
        </div>
      </div>
    </AppLayout>
  )
}

export default History
