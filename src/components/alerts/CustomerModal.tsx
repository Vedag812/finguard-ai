'use client'

import React from 'react'
import { C } from '@/lib/theme'
import { Modal, ModalActions, Button, ProgressBar } from '@/components/ui'
import { getBarColor } from '@/lib/theme'
import type { CustomerModalProps } from '@/types'

export function CustomerModal({ customer, onClose, addToast }: CustomerModalProps) {
  return (
    <Modal isOpen={true} onClose={onClose} title={customer.name} icon="👤" width={720}>
      {/* Header Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        marginBottom: 20,
      }}>
        <StatCard label="Risk Score" value={customer.risk} color={C.danger} />
        <StatCard label="Buffer" value={customer.buffer} color={C.orange} />
        <StatCard label="Days to EMI" value={customer.daysToEMI} color={C.warning} />
        <StatCard label="Suitability" value={`${customer.suitability}%`} color={C.safe} />
      </div>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Customer ID</div>
          <div style={{ fontFamily: '"JetBrains Mono"', fontSize: 14, color: C.text }}>{customer.id}</div>
        </div>
        <div>
          <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Persona</div>
          <span style={{
            display: 'inline-block',
            background: `${customer.personaColor}20`,
            color: customer.personaColor,
            border: `1px solid ${customer.personaColor}40`,
            fontFamily: '"DM Sans"',
            fontSize: 12,
            padding: '4px 10px',
            borderRadius: 16,
          }}>
            {customer.persona}
          </span>
        </div>
        <div>
          <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Income Index</div>
          <ProgressBar value={customer.income} height={8} showLabel label={customer.income.toString()} />
        </div>
        <div>
          <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Behavior Index</div>
          <ProgressBar value={customer.behavior} height={8} showLabel label={customer.behavior.toString()} />
        </div>
      </div>

      {/* Signals */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: '"DM Sans"', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>
          Key Signals
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {customer.signals.map((signal, i) => (
            <span key={i} style={{
              background: '#161616',
              border: '1px solid #2A2A2A',
              borderRadius: 6,
              fontFamily: '"DM Sans"',
              fontSize: 12,
              color: C.textSub,
              padding: '6px 12px',
            }}>
              {signal}
            </span>
          ))}
        </div>
      </div>

      {/* SHAP Explainability */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: '"DM Sans"', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>
          AI Risk Factors (SHAP)
        </div>
        {customer.shap.map((s, i) => {
          const pts = parseInt(s.match(/\d+/)?.[0] || '0')
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 120, fontFamily: '"DM Sans"', fontSize: 11, color: C.textSub }}>
                {s.split(':')[0]}
              </div>
              <div style={{ flex: 1, height: 8, background: C.border, borderRadius: 4 }}>
                <div style={{
                  width: `${Math.min(pts, 35) * 3}%`,
                  height: '100%',
                  background: C.orange,
                  borderRadius: 4,
                }} />
              </div>
              <span style={{
                fontFamily: '"JetBrains Mono"',
                fontSize: 12,
                color: pts > 20 ? C.danger : C.orange,
              }}>
                +{pts}pts
              </span>
            </div>
          )
        })}
      </div>

      {/* Recommendation */}
      <div style={{
        background: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
      }}>
        <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: C.textMuted, marginBottom: 4 }}>
          AI Recommendation
        </div>
        <div style={{ fontFamily: '"Barlow Condensed"', fontWeight: 600, fontSize: 18, color: C.orange, marginBottom: 8 }}>
          {customer.recommendation}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{
            background: customer.suitability >= 80 ? C.safeBg : customer.suitability >= 60 ? C.warningBg : C.dangerBg,
            color: customer.suitability >= 80 ? C.safe : customer.suitability >= 60 ? C.warning : C.danger,
            fontFamily: '"JetBrains Mono"',
            fontSize: 12,
            padding: '4px 8px',
            borderRadius: 4,
          }}>
            {customer.suitability}/100 fit
          </span>
        </div>
      </div>

      {/* Actions */}
      <ModalActions>
        <Button variant="primary" onClick={() => {
          addToast('Approved', `${customer.recommendation} for ${customer.name}`, 'success')
          onClose()
        }}>
          ▶ Approve Intervention
        </Button>
        <Button variant="secondary" onClick={() => {
          addToast('Escalated', `${customer.name} sent to RM queue`, 'info')
          onClose()
        }}>
          → Send to RM
        </Button>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
      </ModalActions>
    </Modal>
  )
}

// Stat Card Component
function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{
      background: C.bg,
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      padding: 12,
      textAlign: 'center',
    }}>
      <div style={{ fontFamily: '"DM Sans"', fontSize: 10, color: C.textMuted, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: '"Barlow Condensed"', fontWeight: 700, fontSize: 24, color }}>
        {value}
      </div>
    </div>
  )
}
