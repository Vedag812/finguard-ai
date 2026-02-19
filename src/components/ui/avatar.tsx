'use client'

import React from 'react'
import { C } from '@/lib/theme'

// ==================== AVATAR COMPONENT ====================

interface AvatarProps {
  initials: string
  size?: 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
}

export function Avatar({ initials, size = 'md', style }: AvatarProps) {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { width: 24, height: 24, fontSize: 10 },
    md: { width: 32, height: 32, fontSize: 13 },
    lg: { width: 40, height: 40, fontSize: 15 },
  }

  return (
    <div
      style={{
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDeep} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"DM Sans"',
        fontWeight: 600,
        color: C.text,
        ...sizeStyles[size],
        ...style,
      }}
    >
      {initials}
    </div>
  )
}

// ==================== AVATAR GROUP COMPONENT ====================

interface AvatarGroupProps {
  avatars: { initials: string; name?: string }[]
  max?: number
  size?: 'sm' | 'md'
}

export function AvatarGroup({ avatars, max = 3, size = 'md' }: AvatarGroupProps) {
  const displayed = avatars.slice(0, max)
  const remaining = avatars.length - max

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { width: 24, height: 24, fontSize: 9 },
    md: { width: 32, height: 32, fontSize: 11 },
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {displayed.map((avatar, i) => (
        <div
          key={i}
          style={{
            ...sizeStyles[size],
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDeep} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"DM Sans"',
            fontWeight: 600,
            color: C.text,
            marginLeft: i > 0 ? -8 : 0,
            border: '2px solid #070707',
            zIndex: displayed.length - i,
          }}
          title={avatar.name}
        >
          {avatar.initials}
        </div>
      ))}
      {remaining > 0 && (
        <div
          style={{
            ...sizeStyles[size],
            borderRadius: '50%',
            background: C.border,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"DM Sans"',
            fontSize: 10,
            color: C.textSub,
            marginLeft: -8,
            border: '2px solid #070707',
          }}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
