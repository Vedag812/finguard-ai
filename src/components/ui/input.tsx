'use client'

import React from 'react'
import { C } from '@/lib/theme'

// ==================== INPUT COMPONENT ====================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export function Input({ label, error, icon, style, ...props }: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false)

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ display: 'block', fontFamily: '"DM Sans"', fontSize: 12, color: C.textSub, marginBottom: 6 }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textMuted }}>
            {icon}
          </span>
        )}
        <input
          style={{
            width: '100%',
            background: C.bg,
            border: `1px solid ${error ? C.danger : isFocused ? C.orange : C.border}`,
            borderRadius: 8,
            padding: icon ? '10px 14px 10px 36px' : '10px 14px',
            color: C.text,
            fontFamily: props.type === 'text' || !props.type ? '"DM Sans"' : '"JetBrains Mono"',
            fontSize: 14,
            outline: 'none',
            transition: 'border-color 0.15s',
            ...style,
          }}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          {...props}
        />
      </div>
      {error && (
        <div style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.danger, marginTop: 4 }}>
          {error}
        </div>
      )}
    </div>
  )
}

// ==================== SELECT COMPONENT ====================

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export function Select({ label, options, style, ...props }: SelectProps) {
  const [isFocused, setIsFocused] = React.useState(false)

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ display: 'block', fontFamily: '"DM Sans"', fontSize: 12, color: C.textSub, marginBottom: 6 }}>
          {label}
        </label>
      )}
      <select
        style={{
          width: '100%',
          background: C.bg,
          border: `1px solid ${isFocused ? C.orange : C.border}`,
          borderRadius: 8,
          padding: '10px 14px',
          color: C.text,
          fontFamily: '"DM Sans"',
          fontSize: 14,
          outline: 'none',
          cursor: 'pointer',
          transition: 'border-color 0.15s',
          ...style,
        }}
        onFocus={(e) => {
          setIsFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          props.onBlur?.(e)
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// ==================== SEARCH INPUT COMPONENT ====================

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  style?: React.CSSProperties
}

export function SearchInput({ value, onChange, placeholder = 'Search...', style }: SearchInputProps) {
  return (
    <div style={{ position: 'relative', width: 280, ...style }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textMuted }}>
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: '10px 14px 10px 32px',
          color: C.text,
          fontFamily: '"DM Sans"',
          fontSize: 14,
          outline: 'none',
        }}
        onFocus={(e) => (e.currentTarget.style.border = `1px solid ${C.orange}`)}
        onBlur={(e) => (e.currentTarget.style.border = `1px solid ${C.border}`)}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: C.textMuted,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          ✕
        </button>
      )}
    </div>
  )
}

// ==================== TOGGLE COMPONENT ====================

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderRadius: 8,
        background: C.bg,
        border: `1px solid ${C.border}`,
        cursor: 'pointer',
      }}
    >
      <div>
        {label && (
          <div style={{ fontFamily: '"DM Sans"', fontSize: 13, color: C.text }}>{label}</div>
        )}
        {description && (
          <div style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.textMuted, marginTop: 2 }}>
            {description}
          </div>
        )}
      </div>
      <div
        style={{
          width: 48,
          height: 26,
          borderRadius: 13,
          background: checked ? C.safe : C.border,
          position: 'relative',
          transition: 'background 0.2s',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: C.text,
            transition: 'left 0.2s',
            left: checked ? 25 : 3,
          }}
        />
      </div>
    </div>
  )
}
