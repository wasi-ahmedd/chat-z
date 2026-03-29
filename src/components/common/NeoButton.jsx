import React from 'react'

const NeoButton = ({ children, onClick, variant = 'primary', className = '', type = 'button' }) => {
  const variants = {
    primary: 'bg-primary text-black neo-shadow hover:bg-secondary active-press',
    secondary: 'bg-secondary text-black neo-shadow hover:bg-primary active-press',
    tertiary: 'bg-tertiary text-black neo-shadow hover:bg-primary active-press',
    error: 'bg-error text-black neo-shadow active-press',
    outline: 'border-4 border-black text-white hover:bg-surface-container active-press'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 font-headline font-black uppercase tracking-tighter border-4 border-black transition-none ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default NeoButton
