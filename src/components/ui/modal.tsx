'use client'

import React from 'react'
import { C } from '@/lib/theme'

// ==================== MODAL COMPONENT ====================

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  width?: number
}

export function Modal({ isOpen, onClose, title, icon, children, width = 500 }: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width,
          background: C.card,
          border: `1px solid ${C.orange}`,
          borderRadius: 16,
          padding: 28,
          boxShadow: '0 0 60px rgba(249,115,22,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {icon && <span style={{ fontSize: 24, color: C.orange }}>{icon}</span>}
            <span style={{ fontFamily: '"Barlow Condensed"', fontWeight: 700, fontSize: 22, color: C.text }}>
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: 20, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ==================== MODAL ACTIONS COMPONENT ====================

interface ModalActionsProps {
  children: React.ReactNode
}

export function ModalActions({ children }: ModalActionsProps) {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
      {children}
    </div>
  )
}
