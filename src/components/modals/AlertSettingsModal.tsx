'use client'

import React, { useState, useEffect } from 'react'
import { C } from '@/lib/theme'
import type { AlertSettings } from '@/types'

interface AlertSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (settings: AlertSettings) => void
}

export function AlertSettingsModal({ isOpen, onClose, onSave }: AlertSettingsModalProps) {
  const [settings, setSettings] = useState<AlertSettings>({
    thresholds: { critical: 80, high: 60, moderate: 40 },
    notifications: { email: true, sms: false, slack: true },
    autoEscalate: true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [savedOnce, setSavedOnce] = useState(false)

  // Load existing settings when modal opens
  useEffect(() => {
    if (!isOpen) return
    fetch('/api/alert-settings')
      .then(r => r.json())
      .then(json => {
        if (json?.data) {
          const d = json.data
          setSettings({
            thresholds: { critical: d.criticalThreshold ?? 80, high: d.highThreshold ?? 60, moderate: d.moderateThreshold ?? 40 },
            notifications: { email: d.emailEnabled ?? true, sms: d.smsEnabled ?? false, slack: d.slackEnabled ?? false },
            autoEscalate: d.autoEscalate ?? true,
          })
        }
      })
      .catch(() => { /* use defaults */ })
  }, [isOpen])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    try {
      const res = await fetch('/api/alert-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          criticalThreshold: settings.thresholds.critical,
          highThreshold: settings.thresholds.high,
          moderateThreshold: settings.thresholds.moderate,
          emailEnabled: settings.notifications.email,
          smsEnabled: settings.notifications.sms,
          slackEnabled: settings.notifications.slack,
          autoEscalate: settings.autoEscalate,
        }),
      })
      if (!res.ok) throw new Error('Could not save settings')
      setSavedOnce(true)
      onSave(settings)
      onClose()
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  const thresholdOptions = [
    { key: 'critical', label: 'Critical Alert', color: C.danger } as const,
    { key: 'high', label: 'High Alert', color: C.orange } as const,
    { key: 'moderate', label: 'Moderate Alert', color: C.warning } as const,
  ]

  const notificationOptions = [
    { key: 'email', label: 'Email', icon: '📧' } as const,
    { key: 'sms', label: 'SMS', icon: '📱' } as const,
    { key: 'slack', label: 'Slack', icon: '💬' } as const,
  ]

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
          width: 520,
          background: C.card,
          border: `1px solid ${C.orange}`,
          borderRadius: 16,
          padding: 28,
          boxShadow: '0 0 60px rgba(249,115,22,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24, color: C.orange }}>⚙</span>
            <span style={{ fontFamily: '"Barlow Condensed"', fontWeight: 700, fontSize: 22, color: C.text }}>
              Alert Settings
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: 20, cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Risk Thresholds */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: '"DM Sans"', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>
            Risk Score Thresholds
          </div>
          {thresholdOptions.map((t) => (
            <div key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ width: 100, fontFamily: '"DM Sans"', fontSize: 12, color: C.textSub }}>
                {t.label}
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.thresholds[t.key]}
                  onChange={(e) => setSettings({
                    ...settings,
                    thresholds: { ...settings.thresholds, [t.key]: parseInt(e.target.value) }
                  })}
                  style={{ flex: 1, accentColor: t.color }}
                />
                <span style={{ width: 40, fontFamily: '"JetBrains Mono"', fontSize: 13, color: t.color }}>
                  {settings.thresholds[t.key]}+
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Notification Channels */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: '"DM Sans"', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>
            Notification Channels
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {notificationOptions.map((n) => (
              <div
                key={n.key}
                onClick={() => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, [n.key]: !settings.notifications[n.key] }
                })}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: settings.notifications[n.key] ? `1px solid ${C.orange}` : `1px solid ${C.border}`,
                  background: settings.notifications[n.key] ? C.orangeGlow : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>{n.icon}</div>
                <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: settings.notifications[n.key] ? C.text : C.textSub }}>
                  {n.label}
                </div>
                <div style={{
                  fontFamily: '"DM Sans"',
                  fontSize: 10,
                  color: settings.notifications[n.key] ? C.safe : C.textMuted,
                  marginTop: 2,
                }}>
                  {settings.notifications[n.key] ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auto-Escalation */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: '"DM Sans"', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>
            Automation Settings
          </div>
          <div
            onClick={() => setSettings({ ...settings, autoEscalate: !settings.autoEscalate })}
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
              <div style={{ fontFamily: '"DM Sans"', fontSize: 13, color: C.text }}>
                Auto-Escalate Critical Alerts
              </div>
              <div style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                Automatically escalate critical alerts to RM queue
              </div>
            </div>
            <div style={{
              width: 48,
              height: 26,
              borderRadius: 13,
              background: settings.autoEscalate ? C.safe : C.border,
              position: 'relative',
              transition: 'background 0.2s',
            }}>
              <div style={{
                position: 'absolute',
                top: 3,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: C.text,
                transition: 'left 0.2s',
                left: settings.autoEscalate ? 25 : 3,
              }} />
            </div>
          </div>
        </div>

        {/* Error */}
        {saveError && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.35)',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 12,
            fontFamily: '"DM Sans"',
            fontSize: 13,
            color: C.danger,
          }}>
            ⚠ {saveError}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              flex: 1,
              background: isSaving ? C.border : C.orange,
              border: 'none',
              color: C.text,
              fontFamily: '"DM Sans"',
              fontWeight: 600,
              fontSize: 14,
              padding: '12px 20px',
              borderRadius: 8,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.6 : 1,
            }}
          >
            {isSaving ? '⟳ Saving...' : '✓ Save Settings'}
          </button>
          <button
            onClick={onClose}
            disabled={isSaving}
            style={{
              background: 'transparent',
              border: `1px solid ${C.border}`,
              color: C.textSub,
              fontFamily: '"DM Sans"',
              fontSize: 14,
              padding: '12px 20px',
              borderRadius: 8,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
