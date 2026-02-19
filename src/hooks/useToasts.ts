'use client'

import { useState, useCallback } from 'react'
import type { Toast, ToastType } from '@/types'

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

  return { toasts, add, remove }
}
