'use client'

import React from 'react'
import { C } from '@/lib/theme'
import type { ToastProps, ToastType } from '@/types'

export function ToastContainer({ toasts, remove }: ToastProps) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      right: 28,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} remove={remove} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: { id: number; title: string; msg: string; type: ToastType }
  remove: (id: number) => void
}

function ToastItem({ toast, remove }: ToastItemProps) {
  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return '✓'
      case 'warning': return '⚠'
      case 'info': return '→'
    }
  }

  const getColor = (type: ToastType) => {
    switch (type) {
      case 'success': return C.safe
      case 'warning': return C.warning
      case 'info': return C.orange
    }
  }

  return (
    <div style={{
      background: '#111',
      border: `1px solid ${C.orange}`,
      borderRadius: 10,
      padding: '16px 20px',
      minWidth: 340,
      maxWidth: 420,
      boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(249,115,22,0.15)',
      animation: 'slideInRight 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Icon */}
      <div style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: getColor(toast.type),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        flexShrink: 0,
        color: '#fff',
      }}>
        {getIcon(toast.type)}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: '"DM Sans"', fontWeight: 600, fontSize: 14, color: C.text }}>
          {toast.title}
        </div>
        <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: C.textSub, marginTop: 2 }}>
          {toast.msg}
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={() => remove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          color: C.textMuted,
          cursor: 'pointer',
          fontSize: 16,
          padding: 4,
        }}
      >
        ✕
      </button>

      {/* Progress Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        background: getColor(toast.type),
        animation: 'barFill 4.5s linear forwards',
      }} />
    </div>
  )
}
