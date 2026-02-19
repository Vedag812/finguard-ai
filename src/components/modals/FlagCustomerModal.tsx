'use client'

import React, { useState, useMemo } from 'react'
import { C } from '@/lib/theme'
import { Modal, ModalActions, Button } from '@/components/ui'
import { alertsData } from '@/data/mockData'
import type { FlagCustomerFormData, Priority, CustomerAlert } from '@/types'

interface FlagCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FlagCustomerFormData) => void
}

export function FlagCustomerModal({ isOpen, onClose, onSubmit }: FlagCustomerModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAlert | null>(null)
  const [formData, setFormData] = useState<FlagCustomerFormData>({
    name: '',
    id: '',
    reason: '',
    priority: 'High'
  })
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Filter customers based on search
  const filteredCustomers = useMemo(() => {
    if (!searchQuery || searchQuery.length < 1) return []
    const q = searchQuery.toLowerCase()
    return alertsData
      .filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.persona.toLowerCase().includes(q)
      )
      .slice(0, 8)
  }, [searchQuery])

  const handleCustomerSelect = (customer: CustomerAlert) => {
    setSelectedCustomer(customer)
    setSearchQuery(customer.name)
    setFormData({
      ...formData,
      name: customer.name,
      id: customer.id
    })
    setShowDropdown(false)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.id || !formData.reason) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/flagged-customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: formData.id,
          name: formData.name,
          reason: formData.reason,
          priority: formData.priority,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error ?? 'Failed to flag customer')
      }
      onSubmit(formData)
      setFormData({ name: '', id: '', reason: '', priority: 'High' })
      setSelectedCustomer(null)
      setSearchQuery("")
      onClose()
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', id: '', reason: '', priority: 'High' })
    setSelectedCustomer(null)
    setSearchQuery("")
    setSubmitError(null)
    onClose()
  }

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
      onClick={handleClose}
    >
      <div
        style={{
          width: 500,
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
            <span style={{ fontSize: 24, color: C.orange }}>🚩</span>
            <span style={{ fontFamily: '"Barlow Condensed"', fontWeight: 700, fontSize: 22, color: C.text }}>
              Flag New Customer
            </span>
          </div>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: 20, cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Customer Search */}
        <div style={{ marginBottom: 16, position: 'relative' }}>
          <label style={{ display: 'block', fontFamily: '"DM Sans"', fontSize: 12, color: C.textSub, marginBottom: 6 }}>
            Search Customer *
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textMuted }}>
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowDropdown(true)
                if (!e.target.value) {
                  setSelectedCustomer(null)
                  setFormData({ ...formData, name: '', id: '' })
                }
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search by name, ID, or persona..."
              style={{
                width: '100%',
                background: C.bg,
                border: `1px solid ${selectedCustomer ? C.safe : C.border}`,
                borderRadius: 8,
                padding: '10px 14px 10px 36px',
                color: C.text,
                fontFamily: '"DM Sans"',
                fontSize: 14,
                outline: 'none',
              }}
            />
            {selectedCustomer && (
              <span style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: C.safe,
                fontSize: 14,
              }}>
                ✓
              </span>
            )}
          </div>

          {/* Search Dropdown */}
          {showDropdown && filteredCustomers.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: C.sidebar,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              marginTop: 4,
              maxHeight: 280,
              overflowY: 'auto',
              zIndex: 10,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}>
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => handleCustomerSelect(customer)}
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    cursor: 'pointer',
                    borderBottom: `1px solid ${C.border}`,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#141414'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDeep} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"DM Sans"',
                    fontWeight: 600,
                    fontSize: 12,
                    color: C.text,
                  }}>
                    {customer.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: '"DM Sans"', fontSize: 13, color: C.text }}>
                      {customer.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: '"JetBrains Mono"', fontSize: 10, color: C.textMuted }}>
                        {customer.id}
                      </span>
                      <span style={{
                        background: `${customer.personaColor}20`,
                        color: customer.personaColor,
                        fontSize: 9,
                        padding: '1px 5px',
                        borderRadius: 8,
                      }}>
                        {customer.persona}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: '"Barlow Condensed"',
                      fontWeight: 700,
                      fontSize: 16,
                      color: customer.risk >= 80 ? C.danger : customer.risk >= 60 ? C.orange : C.warning,
                    }}>
                      {customer.risk}
                    </div>
                    <div style={{ fontFamily: '"DM Sans"', fontSize: 9, color: C.textMuted }}>risk</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {showDropdown && searchQuery && filteredCustomers.length === 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: C.sidebar,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              marginTop: 4,
              padding: 16,
              textAlign: 'center',
              zIndex: 10,
            }}>
              <span style={{ fontFamily: '"DM Sans"', fontSize: 13, color: C.textMuted }}>
                No customers found matching "{searchQuery}"
              </span>
            </div>
          )}
        </div>

        {/* Selected Customer Info */}
        {selectedCustomer && (
          <div style={{
            background: '#0D0D0D',
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDeep} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"DM Sans"',
              fontWeight: 600,
              fontSize: 14,
              color: C.text,
            }}>
              {selectedCustomer.initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: '"DM Sans"', fontWeight: 600, fontSize: 14, color: C.text }}>
                {selectedCustomer.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                <span style={{ fontFamily: '"JetBrains Mono"', fontSize: 11, color: C.textMuted }}>
                  {selectedCustomer.id}
                </span>
                <span style={{
                  background: `${selectedCustomer.personaColor}20`,
                  color: selectedCustomer.personaColor,
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 8,
                }}>
                  {selectedCustomer.persona}
                </span>
                <span style={{
                  fontFamily: '"Barlow Condensed"',
                  fontWeight: 700,
                  fontSize: 14,
                  color: selectedCustomer.risk >= 80 ? C.danger : C.orange,
                }}>
                  Risk: {selectedCustomer.risk}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedCustomer(null)
                setSearchQuery("")
                setFormData({ ...formData, name: '', id: '' })
              }}
              style={{
                background: 'none',
                border: 'none',
                color: C.textMuted,
                cursor: 'pointer',
                fontSize: 16,
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Manual Entry Option */}
        {!selectedCustomer && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontFamily: '"DM Sans"', fontSize: 12, color: C.textSub, marginBottom: 6 }}>
                Customer Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter customer name manually"
                style={{
                  width: '100%',
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: C.text,
                  fontFamily: '"DM Sans"',
                  fontSize: 14,
                  outline: 'none',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = C.orange}
                onBlur={(e) => e.currentTarget.style.borderColor = C.border}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontFamily: '"DM Sans"', fontSize: 12, color: C.textSub, marginBottom: 6 }}>
                Customer ID *
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g., CUS-00123"
                style={{
                  width: '100%',
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: C.text,
                  fontFamily: '"JetBrains Mono"',
                  fontSize: 14,
                  outline: 'none',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = C.orange}
                onBlur={(e) => e.currentTarget.style.borderColor = C.border}
              />
            </div>
          </>
        )}

        {/* Flag Reason */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontFamily: '"DM Sans"', fontSize: 12, color: C.textSub, marginBottom: 6 }}>
            Flag Reason *
          </label>
          <select
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            style={{
              width: '100%',
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: '10px 14px',
              color: C.text,
              fontFamily: '"DM Sans"',
              fontSize: 14,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">Select reason...</option>
            <option value="Salary Delay">Salary Delay</option>
            <option value="Savings Decline">Savings Decline</option>
            <option value="Multiple Lending App Usage">Multiple Lending App Usage</option>
            <option value="Utility Payment Issues">Utility Payment Issues</option>
            <option value="Abnormal ATM Withdrawals">Abnormal ATM Withdrawals</option>
            <option value="EMI Default Risk">EMI Default Risk</option>
            <option value="Manual Review Request">Manual Review Request</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Priority Level */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontFamily: '"DM Sans"', fontSize: 12, color: C.textSub, marginBottom: 6 }}>
            Priority Level
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            {(['Critical', 'High', 'Medium', 'Low'] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setFormData({ ...formData, priority: p })}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: formData.priority === p
                    ? `1px solid ${p === 'Critical' ? C.danger : p === 'High' ? C.orange : p === 'Medium' ? C.warning : C.safe}`
                    : `1px solid ${C.border}`,
                  background: formData.priority === p
                    ? (p === 'Critical' ? C.dangerBg : p === 'High' ? C.orangeGlow : p === 'Medium' ? C.warningBg : C.safeBg)
                    : 'transparent',
                  color: formData.priority === p
                    ? (p === 'Critical' ? C.danger : p === 'High' ? C.orange : p === 'Medium' ? C.warning : C.safe)
                    : C.textSub,
                  fontFamily: '"DM Sans"',
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {submitError && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 12,
            fontFamily: '"DM Sans"',
            fontSize: 13,
            color: C.danger,
          }}>
            ⚠ {submitError}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.id || !formData.reason || isSubmitting}
            style={{
              flex: 1,
              background: (!formData.name || !formData.id || !formData.reason || isSubmitting) ? C.border : C.orange,
              border: 'none',
              color: C.text,
              fontFamily: '"DM Sans"',
              fontWeight: 600,
              fontSize: 14,
              padding: '12px 20px',
              borderRadius: 8,
              cursor: (!formData.name || !formData.id || !formData.reason || isSubmitting) ? 'not-allowed' : 'pointer',
              opacity: (!formData.name || !formData.id || !formData.reason || isSubmitting) ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {isSubmitting ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span>
                Flagging...
              </>
            ) : '🚩 Flag Customer'}
          </button>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            style={{
              background: 'transparent',
              border: `1px solid ${C.border}`,
              color: C.textSub,
              fontFamily: '"DM Sans"',
              fontSize: 14,
              padding: '12px 20px',
              borderRadius: 8,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
