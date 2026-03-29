import React from 'react'
import { useDesign } from '../../context/DesignContext'
import { Save, Undo, Redo, Layout, Magnet, XCircle, MoreVertical } from 'lucide-react'

const DesignToolbar = () => {
  const { 
    config, 
    toggleEditable, 
    toggleMagnetic, 
    undo, 
    redo, 
    saveToDisk, 
    isSaving,
    canUndo,
    canRedo 
  } = useDesign()

  return (
    <div className="fixed bottom-24 right-8 z-[200] flex flex-col items-end gap-4 pointer-events-none group">
      {/* Expanded Controls */}
      <div className={`flex flex-col gap-3 transition-all duration-300 ${config.editable ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-10 scale-50'}`}>
        {/* Undo/Redo Pair */}
        <div className="flex gap-2">
          <button 
            onClick={undo}
            disabled={!canUndo}
            className={`p-3 border-4 border-black bg-white shadow-[4px_4px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none ${!canUndo ? 'opacity-30' : 'hover:bg-tertiary'}`}
          >
            <Undo size={18} />
          </button>
          <button 
            onClick={redo}
            disabled={!canRedo}
            className={`p-3 border-4 border-black bg-white shadow-[4px_4px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none ${!canRedo ? 'opacity-30' : 'hover:bg-tertiary'}`}
          >
            <Redo size={18} />
          </button>
        </div>

        {/* Snapping Toggle */}
        <button 
          onClick={toggleMagnetic}
          className={`p-4 border-4 border-black font-headline font-black uppercase text-xs flex items-center gap-2 shadow-[6px_6px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none ${config.magneticSnapping ? 'bg-secondary' : 'bg-white'}`}
          title="Toggle Magnetic Snap"
        >
          <Magnet size={20} className={config.magneticSnapping ? 'animate-pulse' : 'opacity-40'} />
          {config.magneticSnapping ? 'MAGNET_ON' : 'MAGNET_OFF'}
        </button>

        {/* Save to Disk */}
        <button 
          onClick={saveToDisk}
          className={`p-4 border-4 border-black font-headline font-black uppercase text-sm flex items-center gap-2 shadow-[6px_6px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-colors ${isSaving ? 'bg-error animate-pulse' : 'bg-primary hover:bg-[#fed023]'}`}
        >
          <Save size={20} />
          {isSaving ? 'SAVING...' : 'ANCHOR_REALITY'}
        </button>
      </div>

      {/* Main Toggle Button */}
      <button 
        onClick={toggleEditable}
        className={`pointer-events-auto p-5 border-4 border-black shadow-[8px_8px_0px_#000000] flex items-center gap-3 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none ${config.editable ? 'bg-black text-white' : 'bg-primary text-black'}`}
      >
        {config.editable ? <XCircle size={28} /> : <Layout size={28} />}
        <span className="font-headline font-black uppercase text-lg tracking-tighter italic">
          {config.editable ? 'EXIT_DESIGN' : 'EDIT_UI'}
        </span>
      </button>

      {/* Background Decorative Pattern (Halftone) */}
      <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '6px 6px' }}></div>
    </div>
  )
}

export default DesignToolbar
