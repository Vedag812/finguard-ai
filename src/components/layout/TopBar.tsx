'use client'

import React from 'react'
import { C } from '@/lib/theme'
import { Avatar } from '@/components/ui'

export function TopBar() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 56,
      zIndex: 100,
      background: C.sidebar,
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
    }}>
      {/* Logo Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 2L6 8V16L14 26L22 16V8L14 2Z" stroke={C.orange} strokeWidth="1.5" fill="none"/>
          <path d="M10 10L14 6L18 10L14 14L10 10Z" fill={C.orange}/>
          <path d="M8 14L14 20L20 14" stroke={C.orange} strokeWidth="1.5" fill="none"/>
        </svg>
        <span style={{ fontFamily: '"DM Sans"', fontWeight: 600, fontSize: 18, color: C.text }}>Barclays</span>
        <span style={{ color: C.textMuted, margin: '0 10px' }}>|</span>
        <span style={{ fontFamily: '"Barlow Condensed"', fontWeight: 700, fontSize: 18, color: C.orange }}>FinGuard AI</span>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Live Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: C.safe,
            animation: 'pulse 1.5s infinite',
          }} />
          <span style={{ fontFamily: '"DM Sans"', fontSize: 12, color: C.textSub }}>LIVE</span>
        </div>

        {/* Date */}
        <span style={{ fontFamily: '"DM Sans"', fontSize: 13, color: C.textSub }}>Feb 17, 2026</span>

        <div style={{ width: 1, height: 20, background: C.border }} />

        {/* User Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          <Avatar initials="AK" size="md" />
          <span style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.textMuted }}>UK Retail Banking</span>
        </div>
      </div>
    </div>
  )
}
