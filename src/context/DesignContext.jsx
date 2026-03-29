import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { uiService } from '../services/api'

const DesignContext = createContext()

export const useDesign = () => useContext(DesignContext)

export const DesignProvider = ({ children }) => {
  const [config, setConfig] = useState({ editable: false, magneticSnapping: true })
  const [uiState, setUiState] = useState({})
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isSaving, setIsSaving] = useState(false)

  // Load initial design from server
  useEffect(() => {
    const loadDesign = async () => {
      try {
        const [configRes, stateRes] = await Promise.all([
          uiService.getConfig(),
          uiService.getState()
        ])
        setConfig(configRes.data)
        setUiState(stateRes.data)
      } catch (err) {
        console.error('Failed to load VibeDesign state', err)
      }
    }
    loadDesign()
  }, [])

  // Push to history for Undo/Redo
  const pushToHistory = useCallback((newState) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    if (newHistory.length > 50) newHistory.shift() // Limit history
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  const updateElement = useCallback((id, styles) => {
    setUiState(prev => {
      const newState = { ...prev, [id]: { ...prev[id], ...styles } }
      pushToHistory(newState)
      return newState
    })
  }, [pushToHistory])

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1
      setUiState(history[prevIndex])
      setHistoryIndex(prevIndex)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1
      setUiState(history[nextIndex])
      setHistoryIndex(nextIndex)
    }
  }

  const saveToDisk = async () => {
    setIsSaving(true)
    try {
      await uiService.save(config, uiState)
      console.log('--- VibeDesign: Reality Anchored to Disk ---')
    } catch (err) {
      console.error('Failed to anchor reality', err)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleEditable = () => setConfig(prev => ({ ...prev, editable: !prev.editable }))
  const toggleMagnetic = () => setConfig(prev => ({ ...prev, magneticSnapping: !prev.magneticSnapping }))

  return (
    <DesignContext.Provider value={{
      config,
      uiState,
      updateElement,
      undo,
      redo,
      saveToDisk,
      toggleEditable,
      toggleMagnetic,
      isSaving,
      canUndo: historyIndex > 0,
      canRedo: historyIndex < history.length - 1
    }}>
      {children}
    </DesignContext.Provider>
  )
}
