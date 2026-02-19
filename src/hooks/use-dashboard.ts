import { useState, useCallback, useEffect, useRef } from 'react'
import type { Toast, ToastType, AlertSettings, FlagCustomerFormData } from '@/types'

// ==================== TOAST HOOK ====================
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])
  
  const add = useCallback((title: string, msg: string, type: ToastType = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, title, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500)
  }, [])
  
  const remove = useCallback((id: number) => setToasts(prev => prev.filter(t => t.id !== id)), [])
  
  return { toasts, add, remove }
}

// ==================== DEBOUNCE HOOK ====================
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}

// ==================== KEYBOARD SHORTCUTS HOOK ====================
export function useKeyboardShortcuts(handlers: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key
      if (e.key === 'Escape' && handlers.onEscape) {
        handlers.onEscape()
      }
      // Ctrl/Cmd + / for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === '/' && handlers.onSearchFocus) {
        e.preventDefault()
        handlers.onSearchFocus()
      }
      // Ctrl/Cmd + E for export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e' && handlers.onExport) {
        e.preventDefault()
        handlers.onExport()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}

// ==================== LOCAL STORAGE HOOK ====================
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })
  
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [key, storedValue])
  
  return [storedValue, setValue]
}

// ==================== ALERT SETTINGS HOOK ====================
const DEFAULT_SETTINGS: AlertSettings = {
  thresholds: { critical: 80, high: 60, moderate: 40 },
  notifications: { email: true, sms: false, slack: true },
  autoEscalate: true,
}

export function useAlertSettings() {
  return useLocalStorage<AlertSettings>('finguard-alert-settings', DEFAULT_SETTINGS)
}

// ==================== COUNTER ANIMATION HOOK ====================
export function useAnimatedCounter(endValue: number, duration: number = 1200) {
  const [displayValue, setDisplayValue] = useState(0)
  const previousValue = useRef(0)
  
  useEffect(() => {
    const startValue = previousValue.current
    const steps = 60
    const increment = (endValue - startValue) / steps
    let current = startValue
    const stepDuration = duration / steps
    
    const timer = setInterval(() => {
      current += increment
      if ((increment > 0 && current >= endValue) || (increment < 0 && current <= endValue)) {
        setDisplayValue(endValue)
        previousValue.current = endValue
        clearInterval(timer)
      } else {
        setDisplayValue(current)
      }
    }, stepDuration)
    
    return () => clearInterval(timer)
  }, [endValue, duration])
  
  return displayValue
}

// ==================== MODAL HOOK ====================
export function useModal() {
  const [isOpen, setIsOpen] = useState(false)
  
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])
  
  return { isOpen, open, close, toggle }
}

// ==================== PAGINATION HOOK ====================
export function usePagination(totalItems: number, itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const validPage = Math.min(currentPage, totalPages)
  
  const startIndex = (validPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])
  
  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }, [totalPages])
  
  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }, [])
  
  const firstPage = useCallback(() => setCurrentPage(1), [])
  const lastPage = useCallback(() => setCurrentPage(totalPages), [totalPages])
  
  return {
    currentPage: validPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
  }
}
