'use client'

import React, { Component, ReactNode } from 'react'
import { C } from '@/lib/theme'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: C.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        }}>
          <div style={{
            background: C.card,
            border: `1px solid ${C.danger}`,
            borderRadius: 16,
            padding: 40,
            maxWidth: 500,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h1 style={{
              fontFamily: '"Barlow Condensed"',
              fontWeight: 700,
              fontSize: 28,
              color: C.text,
              marginBottom: 12,
            }}>
              Something went wrong
            </h1>
            <p style={{
              fontFamily: '"DM Sans"',
              fontSize: 14,
              color: C.textSub,
              marginBottom: 24,
            }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: C.orange,
                border: 'none',
                color: C.text,
                fontFamily: '"DM Sans"',
                fontWeight: 600,
                fontSize: 14,
                padding: '12px 24px',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
