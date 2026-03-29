import React from 'react'

const NeoButton = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const variants = {
    primary: 'bg-primary text-black hover:bg-primary-container',
    secondary: 'bg-secondary text-black hover:bg-secondary-dim',
    tertiary: 'bg-tertiary text-black hover:bg-tertiary-dim',
    outline: 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-black',
    error: 'bg-error text-black hover:bg-error-dim'
  }

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        px-6 py-2 font-headline font-black uppercase italic tracking-tighter
        border-4 border-black shadow-[4px_4px_0px_0px_#000000]
        transition-all active:translate-x-1 active:translate-y-1 active:shadow-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </button>
  )
}

export default NeoButton
