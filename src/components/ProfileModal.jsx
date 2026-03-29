import React, { useState, useEffect } from 'react'
import { userService } from '../services/api'
import { useSocket } from '../context/SocketContext'

const ProfileModal = ({ isOpen, onClose, user: initialUser }) => {
  const { setUser } = useSocket()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    username: initialUser?.username || '',
    gender: initialUser?.gender || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && initialUser) {
      setEditData({
        username: initialUser.username || '',
        gender: initialUser.gender || ''
      })
      setError(null)
      setIsEditing(false)
    }
  }, [isOpen, initialUser])

  if (!isOpen) return null

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await userService.updateMe({
        username: editData.username,
        gender: editData.gender
      })
      setUser(response.data)
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update profile', err)
      setError(err.response?.data?.error || 'UPDATE_FAILED')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#F0F0F0] border-[4px] border-black shadow-[12px_12px_0px_0px_#000000] flex flex-col z-10 overflow-hidden transform transition-all font-body">
        {/* Header section */}
        <div className="bg-primary p-6 border-b-[4px] border-black flex justify-between items-start">
          <h1 className="font-headline font-black italic text-4xl tracking-tighter text-black uppercase leading-none">
            VIBE_PROFILE
          </h1>
          <button 
            onClick={onClose}
            className="bg-white border-2 border-black p-1 hover:bg-secondary transition-colors active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_1px_#000000]"
          >
            <span className="material-symbols-outlined block text-black">close</span>
          </button>
        </div>

        {/* Avatar & Badge Row */}
        <div className="p-8 flex gap-6 items-center">
          <div className="w-24 h-24 bg-white border-[4px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000000] relative group overflow-hidden shrink-0">
            <span className="text-5xl font-headline font-black text-black z-10">?</span>
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <span className="material-symbols-outlined text-black font-black">edit</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className={`font-headline font-black px-4 py-1 border-[3px] border-black inline-block text-sm tracking-widest shadow-[4px_4px_0px_0px_#000000] uppercase ${initialUser?.isPremium ? 'bg-[#9fff88] text-black' : 'bg-secondary text-black'}`}>
              {initialUser?.isPremium ? 'PREMIUM_USER' : 'ANON_RIOTER'}
            </span>
            <div className="mt-2">
              <p className="text-[10px] font-bold text-black/60 uppercase tracking-widest">Digital Reality</p>
              <p className="text-black font-black uppercase text-lg tracking-tight italic">ONLINE_AND_VIBING</p>
            </div>
          </div>
        </div>

        {/* Account Info / Edit Form */}
        <div className="px-8 pb-4">
          <div className="border-[4px] border-black p-6 bg-white shadow-[6px_6px_0px_0px_#000000]">
            <div className="flex justify-between items-center border-b-[3px] border-black mb-6 pb-2">
              <h3 className="font-headline font-black text-black uppercase italic tracking-tighter text-xl">
                Identity_Tags
              </h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-black uppercase text-secondary underline decoration-2 underline-offset-4"
                >
                  EDIT_CORE
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 bg-error text-black p-2 border-2 border-black font-black uppercase text-[10px] italic">
                ERROR: {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-black/50 uppercase tracking-[0.2em] mb-1">Codename</label>
                {isEditing ? (
                  <input 
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({...editData, username: e.target.value})}
                    className="w-full bg-surface-container-low border-2 border-black p-2 font-black uppercase text-black focus:outline-none focus:bg-primary-container"
                  />
                ) : (
                  <div className="text-black font-black uppercase font-headline text-xl tracking-tighter">{initialUser?.username || 'ANON_PHANTOM'}</div>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-black/50 uppercase tracking-[0.2em] mb-1">Bio_Vibe</label>
                {isEditing ? (
                  <select 
                    value={editData.gender || ''}
                    onChange={(e) => setEditData({...editData, gender: e.target.value})}
                    className="w-full bg-surface-container-low border-2 border-black p-2 font-black uppercase text-black focus:outline-none"
                  >
                    <option value="">SELECT_GENDER</option>
                    <option value="male">MALE</option>
                    <option value="female">FEMALE</option>
                    <option value="other">OTHER</option>
                  </select>
                ) : (
                  <div className="text-black font-black uppercase font-headline text-xl tracking-tighter">
                    {initialUser?.gender || 'UNKNOWN_VIBE'}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 flex gap-4">
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-primary text-black font-headline font-black py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none uppercase italic"
                >
                  {loading ? 'SAVING...' : 'SAVE_EDITS'}
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-white text-black font-headline font-black py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none uppercase italic"
                >
                  CANCEL
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 flex flex-col gap-4">
          <button className="w-full bg-black text-white font-headline font-black text-lg py-4 border-[4px] border-black shadow-[4px_4px_0px_0px_#fed023] active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-surface-container-highest transition-all uppercase italic tracking-widest flex items-center justify-center gap-3">
            <span className="material-symbols-outlined">logout</span>
            TERMINATE_SESSION
          </button>
        </div>

        {/* Decorative Halftone Pattern Strip */}
        <div className="h-4 w-full bg-black flex overflow-hidden">
          <div 
            className="h-full w-full opacity-30"
            style={{ backgroundImage: 'radial-gradient(#fed023 1px, transparent 0)', backgroundSize: '4px 4px' }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
