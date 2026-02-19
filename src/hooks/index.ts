import { useState, useCallback, useEffect, useRef } from 'react'
import type { Toast, ToastType } from '@/types'

// ==================== USE TOASTS HOOK ====================

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const add = useCallback((title: string, msg: string, type: ToastType = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, title, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500)
  }, [])

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const success = useCallback((title: string, msg: string) => add(title, msg, 'success'), [add])
  const warning = useCallback((title: string, msg: string) => add(title, msg, 'warning'), [add])
  const info = useCallback((title: string, msg: string) => add(title, msg, 'info'), [add])

  return { toasts, add, remove, success, warning, info }
}

// ==================== USE DEBOUNCE HOOK ====================

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// ==================== USE LOCAL STORAGE HOOK ====================

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  return [storedValue, setValue]
}

// ==================== USE KEYBOARD SHORTCUT HOOK ====================

export function useKeyboardShortcut(key: string, callback: () => void, modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        (!modifiers.ctrl || e.ctrlKey) &&
        (!modifiers.shift || e.shiftKey) &&
        (!modifiers.alt || e.altKey)
      ) {
        e.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [key, callback, modifiers])
}

// ==================== USE CLICK OUTSIDE HOOK ====================

export function useClickOutside<T extends HTMLElement>(callback: () => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [callback])

  return ref
}

// ==================== USE ANIMATED COUNTER HOOK ====================

export function useAnimatedCounter(endValue: number, duration: number = 1200): number {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const steps = 60
    const increment = endValue / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= endValue) {
        setDisplayValue(endValue)
        clearInterval(timer)
      } else {
        setDisplayValue(current)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [endValue, duration])

  return displayValue
}

// ==================== USE MODAL HOOK ====================

export function useModal() {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  useKeyboardShortcut('Escape', close)

  return { isOpen, open, close, toggle }
}
