'use client'

import React from 'react'
import { C } from '@/lib/theme'
import { navItems, portfolioHealth } from '@/data/mockData'
import { ProgressBar } from '@/components/ui'
import type { SidebarProps } from '@/types'

export function Sidebar({ activePage, setActivePage, onFlagCustomer, onExportReport, onAlertSettings }: SidebarProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 56,
      left: 0,
      width: 260,
      bottom: 0,
      background: C.sidebar,
      borderRight: `1px solid ${C.border}`,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 90,
      overflowY: 'auto',
    }}>
      {/* Navigation Section */}
      <div style={{ padding: '20px 20px 8px' }}>
        <span style={{
          fontFamily: '"DM Sans"',
          fontSize: 10,
          color: C.textMuted,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}>
          Navigation
        </span>
      </div>

      {navItems.map((item) => (
        <div
          key={item.id}
          onClick={() => setActivePage(item.id)}
          style={{
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activePage === item.id ? 'rgba(249,115,22,0.08)' : 'transparent',
            borderLeftWidth: 3,
            borderLeftStyle: 'solid',
            borderLeftColor: activePage === item.id ? C.orange : 'transparent',
          }}
        >
          <span style={{
            fontSize: 18,
            color: activePage === item.id ? C.orange : C.textMuted,
            marginTop: 2,
          }}>
            {item.icon}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: '"DM Sans"',
                fontSize: 14,
                fontWeight: 500,
                color: activePage === item.id ? C.orange : C.textSub,
                transition: 'color 0.2s',
              }}>
                {item.label}
              </span>
              {item.badge && (
                <span style={{
                  background: 'rgba(249,115,22,0.15)',
                  color: C.orange,
                  fontFamily: '"JetBrains Mono"',
                  fontSize: 10,
                  padding: '2px 7px',
                  borderRadius: 10,
                }}>
                  {item.badge}
                </span>
              )}
            </div>
            <div style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.textMuted, marginTop: 1 }}>
              {item.sub}
            </div>
          </div>
        </div>
      ))}

      {/* Divider */}
      <div style={{ height: 1, background: C.border, margin: '16px 20px' }} />

      {/* Portfolio Health Section */}
      <div style={{ padding: '0 20px 8px' }}>
        <span style={{
          fontFamily: '"DM Sans"',
          fontSize: 10,
          color: C.textMuted,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}>
          Portfolio Health
        </span>
      </div>

      <div style={{
        margin: '0 12px',
        background: '#0D0D0D',
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: 14,
      }}>
        {portfolioHealth.map((item, i) => (
          <div key={item.label} style={{ marginBottom: i < 2 ? 10 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.textMuted }}>
                {item.label}
              </span>
              <span style={{ fontFamily: '"JetBrains Mono"', fontSize: 12, color: item.color }}>
                {item.value}
              </span>
            </div>
            <ProgressBar value={item.pct} color={item.color} height={5} />
            <span style={{ fontFamily: '"DM Sans"', fontSize: 9, color: item.color }}>
              {item.status}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: C.border, margin: '16px 20px' }} />

      {/* Quick Actions Section */}
      <div style={{ padding: '0 20px 8px' }}>
        <span style={{
          fontFamily: '"DM Sans"',
          fontSize: 10,
          color: C.textMuted,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}>
          Quick Actions
        </span>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <QuickActionButton onClick={onFlagCustomer} variant="primary">
          + Flag Customer
        </QuickActionButton>
        <QuickActionButton onClick={onExportReport}>
          ↓ Export Report
        </QuickActionButton>
        <QuickActionButton onClick={onAlertSettings}>
          ⚙ Alert Settings
        </QuickActionButton>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', padding: 16, textAlign: 'center' }}>
        <div style={{ fontFamily: '"JetBrains Mono"', fontSize: 10, color: C.textMuted }}>
          FinGuard AI v2.4.1
        </div>
        <div style={{ fontFamily: '"JetBrains Mono"', fontSize: 10, color: C.textMuted }}>
          Model AUC-ROC: 0.78
        </div>
        <div style={{ fontFamily: '"DM Sans"', fontSize: 10, color: C.textMuted, marginTop: 4 }}>
          © Barclays 2026
        </div>
      </div>
    </div>
  )
}

// Quick Action Button Component
interface QuickActionButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

function QuickActionButton({ children, onClick, variant = 'secondary' }: QuickActionButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        background: isHovered && variant === 'primary' ? C.orangeGlow : 'transparent',
        border: `1px solid ${variant === 'primary' ? C.orange : isHovered ? C.orange : C.textMuted}`,
        color: variant === 'primary' ? C.orange : C.textSub,
        padding: '10px 16px',
        borderRadius: 6,
        fontFamily: '"DM Sans"',
        fontSize: 12,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}
