'use client'

import React, { useState, useMemo } from 'react'
import { C } from '@/lib/theme'
import { Card, CardHeader, Badge, SearchInput, Avatar, ProgressBar } from '@/components/ui'
import { alertsData, txData } from '@/data/mockData'
import { getBarColor, getEMIColor, getRiskColor } from '@/lib/theme'
import type { ToastType, CustomerAlert } from '@/types'

interface Customer360PageProps {
  addToast: (title: string, msg: string, type?: ToastType) => void
  initialCustomer?: CustomerAlert
}

export function Customer360Page({ addToast, initialCustomer }: Customer360PageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAlert | null>(initialCustomer || null)

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return alertsData.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.id.toLowerCase().includes(query)
    ).slice(0, 10)
  }, [searchQuery])

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24, animation: 'fadeUp 0.4s ease both' }}>
        <h1 style={{
          fontFamily: '"Barlow Condensed"',
          fontWeight: 800,
          fontSize: 32,
          color: C.text,
        }}>
          Customer 360
        </h1>
        <p style={{
          fontFamily: '"DM Sans"',
          fontSize: 14,
          color: C.textMuted,
          marginTop: 4,
        }}>
          Individual customer deep-dive and risk analysis
        </p>
      </div>

      {/* Search Section */}
      <Card padding="md" style={{ marginBottom: 24, animation: 'fadeUp 0.4s ease 0.08s both' }}>
        <div style={{ position: 'relative' }}>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search customer by name or ID..."
            style={{ width: '100%' }}
          />

          {/* Search Results Dropdown */}
          {filteredCustomers.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              marginTop: 4,
              maxHeight: 300,
              overflowY: 'auto',
              zIndex: 10,
            }}>
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomer(customer)
                    setSearchQuery('')
                  }}
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    cursor: 'pointer',
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <Avatar initials={customer.initials} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: '"DM Sans"', fontSize: 14, color: C.text }}>
                      {customer.name}
                    </div>
                    <div style={{ fontFamily: '"JetBrains Mono"', fontSize: 11, color: C.textMuted }}>
                      {customer.id}
                    </div>
                  </div>
                  <Badge variant={customer.risk >= 80 ? 'danger' : customer.risk >= 60 ? 'warning' : 'success'}>
                    Risk: {customer.risk}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Customer Details */}
      {selectedCustomer ? (
        <CustomerDetails customer={selectedCustomer} addToast={addToast} />
      ) : (
        <Card padding="lg" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
          <div style={{
            fontFamily: '"DM Sans"',
            fontSize: 16,
            color: C.textSub,
            marginBottom: 8,
          }}>
            Search for a customer to view their 360° profile
          </div>
          <div style={{
            fontFamily: '"DM Sans"',
            fontSize: 13,
            color: C.textMuted,
          }}>
            Enter a name or Customer ID above
          </div>
        </Card>
      )}
    </div>
  )
}

// Customer Details Component
function CustomerDetails({ customer, addToast }: { customer: CustomerAlert; addToast: (title: string, msg: string, type?: ToastType) => void }) {
  const [isApproving, setIsApproving] = useState(false)
  const [isApproved, setIsApproved] = useState(false)

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      const res = await fetch('/api/interventions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          customerName: customer.name,
          intervention: customer.recommendation,
          status: 'APPROVED',
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setIsApproved(true)
      addToast('Intervention Approved', `${customer.recommendation} for ${customer.name}`, 'success')
    } catch {
      addToast('Error', 'Could not log intervention. Check API connection.', 'warning')
    } finally {
      setIsApproving(false)
    }
  }
  return (
    <div style={{ animation: 'fadeUp 0.4s ease 0.16s both' }}>
      {/* Customer Header */}
      <Card padding="lg" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDeep} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"DM Sans"',
            fontWeight: 600,
            fontSize: 24,
            color: C.text,
          }}>
            {customer.initials}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontFamily: '"Barlow Condensed"',
              fontWeight: 700,
              fontSize: 28,
              color: C.text,
              margin: 0,
            }}>
              {customer.name}
            </h2>
            <div style={{
              fontFamily: '"JetBrains Mono"',
              fontSize: 13,
              color: C.textMuted,
            }}>
              {customer.id}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: '"Barlow Condensed"',
              fontWeight: 800,
              fontSize: 48,
              color: getRiskColor(customer.risk),
            }}>
              {customer.risk}
            </div>
            <div style={{
              fontFamily: '"DM Sans"',
              fontSize: 12,
              color: C.textMuted,
            }}>
              Risk Score
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 16,
      }}>
        <StatCard label="Buffer" value={customer.buffer} color={C.orange} />
        <StatCard label="Income Index" value={customer.income} color={getBarColor(customer.income)} />
        <StatCard label="Behavior" value={customer.behavior} color={getBarColor(customer.behavior)} />
        <StatCard label="Days to EMI" value={customer.daysToEMI} color={getEMIColor(customer.daysToEMI)} />
      </div>

      {/* Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 16,
      }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Signals */}
          <Card padding="lg">
            <CardHeader title="Active Signals" subtitle="Detected risk indicators" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {customer.signals.map((signal, i) => (
                <span key={i} style={{
                  background: '#161616',
                  border: '1px solid #2A2A2A',
                  borderRadius: 6,
                  fontFamily: '"DM Sans"',
                  fontSize: 13,
                  color: C.textSub,
                  padding: '8px 14px',
                }}>
                  {signal}
                </span>
              ))}
            </div>
          </Card>

          {/* SHAP Factors */}
          <Card padding="lg">
            <CardHeader title="Risk Factor Analysis (SHAP)" subtitle="AI-explainable risk breakdown" />
            {customer.shap.map((s, i) => {
              const pts = parseInt(s.match(/\d+/)?.[0] || '0')
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 140, fontFamily: '"DM Sans"', fontSize: 12, color: C.textSub }}>
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
          </Card>

          {/* Transaction Trend */}
          <Card padding="lg">
            <CardHeader title="Transaction Trend" subtitle="Last 4 weeks spending pattern" />
            <TransactionTrendChart />
          </Card>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Persona */}
          <Card padding="lg">
            <div style={{
              fontFamily: '"DM Sans"',
              fontSize: 11,
              color: C.textMuted,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Customer Persona
            </div>
            <span style={{
              display: 'inline-block',
              background: `${customer.personaColor}20`,
              color: customer.personaColor,
              border: `1px solid ${customer.personaColor}40`,
              fontFamily: '"DM Sans"',
              fontSize: 14,
              padding: '8px 16px',
              borderRadius: 20,
            }}>
              {customer.persona}
            </span>
          </Card>

          {/* Recommendation */}
          <Card padding="lg" style={{
            background: `linear-gradient(135deg, ${C.card} 0%, #130800 100%)`,
            borderLeftWidth: 4,
            borderLeftStyle: 'solid',
            borderLeftColor: C.orange,
          }}>
            <div style={{
              fontFamily: '"DM Sans"',
              fontSize: 11,
              color: C.textMuted,
              marginBottom: 8,
            }}>
              AI Recommendation
            </div>
            <div style={{
              fontFamily: '"Barlow Condensed"',
              fontWeight: 600,
              fontSize: 18,
              color: C.orange,
              marginBottom: 12,
            }}>
              {customer.recommendation}
            </div>
            <div style={{
              fontFamily: '"DM Sans"',
              fontSize: 12,
              color: C.textSub,
              marginBottom: 16,
            }}>
              Suitability: {customer.suitability}%
            </div>
            {isApproved ? (
              <div style={{
                width: '100%',
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.4)',
                color: C.safe,
                fontFamily: '"DM Sans"',
                fontWeight: 600,
                fontSize: 13,
                padding: '10px 16px',
                borderRadius: 6,
                textAlign: 'center',
              }}>
                ✓ Intervention Approved & Logged
              </div>
            ) : (
              <button
                onClick={handleApprove}
                disabled={isApproving}
                style={{
                  width: '100%',
                  background: isApproving ? C.border : C.orange,
                  border: 'none',
                  color: C.text,
                  fontFamily: '"DM Sans"',
                  fontWeight: 600,
                  fontSize: 13,
                  padding: '10px 16px',
                  borderRadius: 6,
                  cursor: isApproving ? 'not-allowed' : 'pointer',
                  opacity: isApproving ? 0.6 : 1,
                }}
              >
                {isApproving ? '⟳ Saving...' : '▶ Approve Intervention'}
              </button>
            )}
          </Card>

          {/* Timeline */}
          <Card padding="lg">
            <CardHeader title="Journey Timeline" subtitle="Key events" />
            <JourneyTimeline />
          </Card>
        </div>
      </div>
    </div>
  )
}

// Stat Card
function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <Card padding="md">
      <div style={{
        fontFamily: '"DM Sans"',
        fontSize: 11,
        color: C.textMuted,
        marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: '"Barlow Condensed"',
        fontWeight: 700,
        fontSize: 28,
        color,
      }}>
        {value}
      </div>
    </Card>
  )
}

// Transaction Trend Chart
function TransactionTrendChart() {
  const maxVal = Math.max(...txData.flatMap(d => [d.dining, d.atm, d.lending]))

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120 }}>
      {txData.map((week, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 80 }}>
            <div style={{ width: 8, height: (week.dining / maxVal) * 80, background: C.orange, borderRadius: 2 }} />
            <div style={{ width: 8, height: (week.atm / maxVal) * 80, background: C.danger, borderRadius: 2 }} />
            <div style={{ width: 8, height: (week.lending / maxVal) * 80, background: C.warning, borderRadius: 2 }} />
          </div>
          <span style={{ fontFamily: '"DM Sans"', fontSize: 10, color: C.textMuted }}>{week.week}</span>
        </div>
      ))}
    </div>
  )
}

// Journey Timeline
function JourneyTimeline() {
  const events = [
    { date: 'Feb 13', event: 'Failed auto-debit attempt', type: 'danger' },
    { date: 'Feb 10', event: 'Salary credit delayed', type: 'warning' },
    { date: 'Feb 8', event: 'Savings balance drop detected', type: 'warning' },
    { date: 'Feb 5', event: 'ATM withdrawal spike', type: 'info' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {events.map((e, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: e.type === 'danger' ? C.danger : e.type === 'warning' ? C.warning : C.orange,
            marginTop: 4,
          }} />
          <div>
            <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: C.text }}>{e.event}</div>
            <div style={{ fontFamily: '"JetBrains Mono"', fontSize: 10, color: C.textMuted }}>{e.date}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
