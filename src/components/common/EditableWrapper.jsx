import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { useDesign } from '../../context/DesignContext'

const SNAP_THRESHOLD = 15 // Pixels to trigger snapping

const EditableWrapper = ({ id, children, className = '' }) => {
  const { config, uiState, updateElement } = useDesign()
  const constraintsRef = useRef(null)
  const elementRef = useRef(null)
  
  // Use persistent state or defaults
  // x/y are now DELTAS from the original position
  const state = uiState[id] || { x: 0, y: 0, width: 'auto', height: 'auto' }
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [isResizing, setIsResizing] = useState(false)

  // Current size during resize
  const [dims, setDims] = useState({ 
    width: state.width === 'auto' ? null : state.width, 
    height: state.height === 'auto' ? null : state.height 
  })

  useEffect(() => {
    if (elementRef.current && dims.width === null) {
      const rect = elementRef.current.getBoundingClientRect()
      setDims({ width: rect.width, height: rect.height })
    }
  }, [])

  // Drag End: save the relative translation
  const handleDragEnd = (event, info) => {
    if (isResizing) return
    updateElement(id, { 
      x: state.x + info.offset.x, 
      y: state.y + info.offset.y 
    })
  }

  // Resize Drag Handler
  const handleResizeDrag = (event, info) => {
    // Basic resizing logic: update width/height based on mouse movement
    const newWidth = Math.max(50, (dims.width || 100) + info.delta.x)
    const newHeight = Math.max(50, (dims.height || 100) + info.delta.y)
    setDims({ width: newWidth, height: newHeight })
    updateElement(id, { width: newWidth, height: newHeight })
  }

  if (!config.editable) {
    const hasMoved = state.x !== 0 || state.y !== 0
    return (
      <div 
        data-ui-id={id} 
        ref={elementRef}
        style={{ 
          position: 'relative',
          transform: `translate(${state.x}px, ${state.y}px)`,
          width: state.width,
          height: state.height,
          zIndex: hasMoved ? 50 : 'auto',
          transition: 'transform 0.2s cubic-bezier(0.19, 1, 0.22, 1)'
        }}
        className={className}
      >
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={elementRef}
      data-ui-id={id}
      drag={!isResizing}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsSelected(!isSelected)}
      style={{
        position: 'relative',
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
        cursor: isHovered ? 'move' : 'default',
        zIndex: isSelected ? 100 : 50,
        outline: isSelected ? '4px solid #fed023' : isHovered ? '4px dashed #ff6d8d' : 'none',
        outlineOffset: '-2px',
        boxShadow: isSelected ? '0 0 20px #fed023' : 'none',
        touchAction: 'none'
      }}
      className={`vibe-editable select-none ${className}`}
    >
      {/* Visual Alignment Guidelines (Neon Grid Lines) */}
      {(isSelected || isHovered) && config.magneticSnapping && (
        <>
          <div className="absolute inset-x-[-2000px] top-0 border-t border-primary/20 pointer-events-none z-[-1]" />
          <div className="absolute inset-x-[-2000px] bottom-0 border-t border-primary/20 pointer-events-none z-[-1]" />
          <div className="absolute inset-y-[-2000px] left-0 border-l border-primary/20 pointer-events-none z-[-1]" />
          <div className="absolute inset-y-[-2000px] right-0 border-l border-primary/20 pointer-events-none z-[-1]" />
        </>
      )}

      {/* Resizing Handle */}
      {isSelected && (
        <motion.div
          drag
          dragMomentum={false}
          onDragStart={() => setIsResizing(true)}
          onDrag={handleResizeDrag}
          onDragEnd={() => setIsResizing(false)}
          className="absolute bottom-0 right-0 w-8 h-8 bg-tertiary cursor-nwse-resize border-4 border-black z-[101] flex items-center justify-center p-1"
          style={{ x: 0, y: 0 }}
        >
          <div className="w-full h-full border-r-2 border-b-2 border-black opacity-40" />
        </motion.div>
      )}
      
      {children}
    </motion.div>
  )
}

export default EditableWrapper
