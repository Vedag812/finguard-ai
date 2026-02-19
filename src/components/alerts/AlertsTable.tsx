'use client'

import React, { useState, useMemo } from 'react'
import { C } from '@/lib/theme'
import { Card, Badge, RiskBadge, StatusBadge, SearchInput, ProgressBar } from '@/components/ui'
import { alertsData } from '@/data/mockData'
import { getEMIColor, getBarColor } from '@/lib/theme'
import type { AlertsTableProps, CustomerAlert } from '@/types'

const ITEMS_PER_PAGE = 10

export function AlertsTable({ addToast, onCustomerClick }: AlertsTableProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAlert | null>(null)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [personaFilter, setPersonaFilter] = useState("All")
  const [riskFilter, setRiskFilter] = useState("All")
  const [emiFilter, setEmiFilter] = useState("All")
  const [sortBy, setSortBy] = useState("risk_desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [approvedRows, setApprovedRows] = useState<Set<string>>(new Set())
  const [escalatedRows, setEscalatedRows] = useState<Set<string>>(new Set())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState(() => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  })

  // Filter and sort data
  const filteredAlerts = useMemo(() => {
    return alertsData
      .filter(a => {
        const q = searchQuery.toLowerCase()
        const matchSearch = a.name.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          a.persona.toLowerCase().includes(q)
        const matchPersona = personaFilter === "All" || a.persona === personaFilter
        const matchRisk = riskFilter === "All" ||
          (riskFilter === "Critical" && a.risk >= 80) ||
          (riskFilter === "High" && a.risk >= 60 && a.risk < 80) ||
          (riskFilter === "Moderate" && a.risk >= 40 && a.risk < 60)
        const matchEMI = emiFilter === "All" ||
          (emiFilter === "≤5 days" && a.daysToEMI <= 5) ||
          (emiFilter === "6-10 days" && a.daysToEMI >= 6 && a.daysToEMI <= 10) ||
          (emiFilter === "11+ days" && a.daysToEMI >= 11)
        return matchSearch && matchPersona && matchRisk && matchEMI
      })
      .sort((a, b) => {
        if (sortBy === "risk_desc") return b.risk - a.risk
        if (sortBy === "risk_asc") return a.risk - b.risk
        if (sortBy === "emi_asc") return a.daysToEMI - b.daysToEMI
        if (sortBy === "buffer_asc") return parseFloat(a.buffer) - parseFloat(b.buffer)
        return 0
      })
  }, [searchQuery, personaFilter, riskFilter, emiFilter, sortBy])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / ITEMS_PER_PAGE))
  const validPage = Math.min(currentPage, totalPages)
  const paginatedAlerts = useMemo(() => {
    const start = (validPage - 1) * ITEMS_PER_PAGE
    return filteredAlerts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredAlerts, validPage])

  const toggleRowSelection = (id: string) => {
    const newSet = new Set(selectedRows)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedRows(newSet)
  }

  const toggleAllRows = () => {
    if (selectedRows.size === paginatedAlerts.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedAlerts.map(a => a.id)))
    }
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setPersonaFilter("All")
    setRiskFilter("All")
    setEmiFilter("All")
    setSortBy("risk_desc")
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      const now = new Date()
      setLastRefreshed(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
      setIsRefreshing(false)
      addToast('Refreshed', 'Risk data updated successfully', 'success')
    }, 1000)
  }

  const handleExportCSV = async () => {
    addToast('Export', `Generating CSV for ${filteredAlerts.length} customers...`, 'info')
    try {
      const res = await fetch('/api/export?type=all')
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `finguard-export-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      addToast('Export Complete', 'CSV downloaded successfully', 'success')
    } catch {
      addToast('Export Failed', 'Could not generate CSV. Check API connection.', 'warning')
    }
  }

  const handleBulkApprove = async () => {
    const ids = Array.from(selectedRows)
    addToast('Processing', `Approving interventions for ${ids.length} customers...`, 'info')
    const newApproved = new Set(approvedRows)
    await Promise.allSettled(
      ids.map(async (id) => {
        const row = paginatedAlerts.find(a => a.id === id)
        if (!row) return
        try {
          await fetch('/api/interventions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customerId: row.id,
              customerName: row.name,
              intervention: row.recommendation,
              status: 'APPROVED',
            }),
          })
          newApproved.add(id)
        } catch { /* continue */ }
      })
    )
    setApprovedRows(newApproved)
    setSelectedRows(new Set())
    addToast('Bulk Approved', `Interventions approved for ${ids.length} customers`, 'success')
  }

  return (
    <>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        animation: 'fadeUp 0.4s ease both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontFamily: '"Barlow Condensed"',
            fontWeight: 800,
            fontSize: 32,
            color: C.text,
          }}>
            Risk Alerts
          </span>
          <Badge>100 Active</Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: '"DM Sans"', fontSize: 12, color: C.textMuted }}>
            Last refreshed: {lastRefreshed}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              background: 'transparent',
              border: `1px solid ${C.border}`,
              color: C.textSub,
              fontFamily: '"DM Sans"',
              fontSize: 12,
              padding: '6px 12px',
              borderRadius: 6,
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              opacity: isRefreshing ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ display: 'inline-block', animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none' }}>↻</span>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card padding="md" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
        flexWrap: 'wrap',
        animation: 'fadeUp 0.4s ease 0.08s both',
      }}>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search name, ID, or persona…"
        />

        <select
          value={personaFilter}
          onChange={(e) => setPersonaFilter(e.target.value)}
          style={{
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: '10px 14px',
            color: C.text,
            fontFamily: '"DM Sans"',
            fontSize: 14,
            width: 180,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="All">All Personas</option>
          <option value="Temporary Shock">Temporary Shock</option>
          <option value="Structural Income Risk">Structural Income Risk</option>
          <option value="Chronic Overspender">Chronic Overspender</option>
          <option value="Liquidity-Cash Poor">Liquidity-Cash Poor</option>
          <option value="Overleveraged">Overleveraged</option>
        </select>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          style={{
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: '10px 14px',
            color: C.text,
            fontFamily: '"DM Sans"',
            fontSize: 14,
            width: 150,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="All">All Levels</option>
          <option value="Critical">Critical 80+</option>
          <option value="High">High 60-79</option>
          <option value="Moderate">Moderate 40-59</option>
        </select>

        <select
          value={emiFilter}
          onChange={(e) => setEmiFilter(e.target.value)}
          style={{
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: '10px 14px',
            color: C.text,
            fontFamily: '"DM Sans"',
            fontSize: 14,
            width: 130,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="All">All</option>
          <option value="≤5 days">≤5 Days</option>
          <option value="6-10 days">6-10 Days</option>
          <option value="11+ days">11+ Days</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: '10px 14px',
            color: C.text,
            fontFamily: '"DM Sans"',
            fontSize: 14,
            width: 160,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="risk_desc">Highest Risk</option>
          <option value="risk_asc">Lowest Risk</option>
          <option value="emi_asc">EMI Soonest</option>
          <option value="buffer_asc">Buffer Lowest</option>
        </select>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: '"DM Sans"', fontSize: 13, color: C.textSub }}>
            Showing <span style={{ fontFamily: '"JetBrains Mono"', color: C.orange }}>
              {filteredAlerts.length}
            </span> of 100
          </span>
          <button
            onClick={handleExportCSV}
            style={{
              border: `1px solid ${C.orange}`,
              background: 'transparent',
              color: C.orange,
              padding: '6px 14px',
              borderRadius: 6,
              fontFamily: '"DM Sans"',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            ↓ Export CSV
          </button>
        </div>
      </Card>

      {/* Bulk Action Bar */}
      {selectedRows.size > 0 && (
        <div style={{
          background: 'rgba(249,115,22,0.12)',
          border: `1px solid ${C.orange}`,
          borderRadius: 8,
          padding: '12px 20px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'fadeUp 0.25s ease',
        }}>
          <span style={{
            fontFamily: '"Barlow Condensed"',
            fontWeight: 600,
            fontSize: 16,
            color: C.orange,
          }}>
            {selectedRows.size} customers selected
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleBulkApprove}
              style={{
                background: C.orange,
                border: 'none',
                color: C.text,
                fontFamily: '"DM Sans"',
                fontWeight: 600,
                fontSize: 12,
                padding: '8px 16px',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              ✓ Bulk Approve Intervention
            </button>
            <button
              onClick={() => {
                addToast('Bulk Action', `${selectedRows.size} customers sent to RM queue`, 'info')
                const newEscalated = new Set(escalatedRows)
                selectedRows.forEach(id => newEscalated.add(id))
                setEscalatedRows(newEscalated)
                setSelectedRows(new Set())
              }}
              style={{
                background: 'transparent',
                border: `1px solid ${C.orange}`,
                color: C.orange,
                fontFamily: '"DM Sans"',
                fontSize: 12,
                padding: '8px 16px',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              → Bulk Send to RM
            </button>
            <button
              onClick={() => setSelectedRows(new Set())}
              style={{
                background: 'transparent',
                border: `1px solid ${C.textMuted}`,
                color: C.textMuted,
                fontFamily: '"DM Sans"',
                fontSize: 12,
                padding: '8px 16px',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              ✕ Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Empty State or Table */}
      {filteredAlerts.length === 0 ? (
        <Card padding="lg" style={{
          padding: 60,
          textAlign: 'center',
          animation: 'fadeUp 0.4s ease 0.16s both',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{
            fontFamily: '"DM Sans"',
            fontSize: 16,
            color: C.textSub,
            marginBottom: 16,
          }}>
            No customers match your filters
          </div>
          <button
            onClick={clearAllFilters}
            style={{
              background: C.orange,
              border: 'none',
              color: C.text,
              fontFamily: '"DM Sans"',
              fontSize: 14,
              padding: '10px 20px',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Clear All Filters
          </button>
        </Card>
      ) : (
        <Card padding="none" style={{ overflow: 'hidden', animation: 'fadeUp 0.4s ease 0.16s both' }}>
          {/* Table Header */}
          <div style={{
            background: C.sidebar,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            fontFamily: '"DM Sans"',
            fontSize: 10,
            color: C.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1,
            borderBottom: `1px solid ${C.border}`,
          }}>
            <div style={{ width: 32 }}>
              <input
                type="checkbox"
                checked={selectedRows.size === paginatedAlerts.length && paginatedAlerts.length > 0}
                onChange={toggleAllRows}
                style={{ accentColor: C.orange }}
              />
            </div>
            <div style={{ width: 160 }}>CUSTOMER</div>
            <div style={{ width: 90 }}>RISK</div>
            <div style={{ width: 150 }}>PERSONA</div>
            <div style={{ width: 70 }}>BUFFER</div>
            <div style={{ width: 80 }}>INCOME</div>
            <div style={{ width: 80 }}>BEHAVIOR</div>
            <div style={{ width: 70 }}>EMI IN</div>
            <div style={{ width: 120 }}>KEY SIGNALS</div>
            <div style={{ width: 140 }}>AI RECOMMENDATION</div>
            <div style={{ width: 90 }}>ACTION</div>
          </div>

          {/* Table Rows */}
          {paginatedAlerts.map((row, i) => (
            <TableRow
              key={row.id}
              row={row}
              index={i}
              isSelected={selectedRows.has(row.id)}
              isExpanded={expandedRow === row.id}
              isApproved={approvedRows.has(row.id)}
              isEscalated={escalatedRows.has(row.id)}
              onToggleSelect={() => toggleRowSelection(row.id)}
              onToggleExpand={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
              onIntervene={() => setSelectedCustomer(row)}
              onClick={() => onCustomerClick?.(row)}
              onApprove={(id, name, recommendation) => {
                setApprovedRows(prev => new Set(prev).add(id))
              }}
              onEscalate={(id) => {
                setEscalatedRows(prev => new Set(prev).add(id))
              }}
              addToast={addToast}
            />
          ))}
        </Card>
      )}

      {/* Pagination */}
      {filteredAlerts.length > 0 && (
        <Pagination
          currentPage={validPage}
          totalPages={totalPages}
          totalItems={filteredAlerts.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Risk Distribution Summary */}
      <Card padding="md" style={{ marginTop: 16, animation: 'fadeUp 0.4s ease 0.28s both' }}>
        <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: C.textMuted, marginBottom: 8 }}>
          Risk Distribution Summary
        </div>
        <div style={{ display: 'flex', height: 24, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: '35%', background: C.danger, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: '"DM Sans"', fontSize: 10, color: '#fff' }}>CRITICAL 35 (35%)</span>
          </div>
          <div style={{ width: '40%', background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: '"DM Sans"', fontSize: 10, color: '#fff' }}>HIGH 40 (40%)</span>
          </div>
          <div style={{ width: '25%', background: C.warning, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: '"DM Sans"', fontSize: 10, color: '#000' }}>MODERATE 25 (25%)</span>
          </div>
        </div>
      </Card>
    </>
  )
}

// Table Row Component
interface TableRowProps {
  row: CustomerAlert
  index: number
  isSelected: boolean
  isExpanded: boolean
  isApproved: boolean
  isEscalated: boolean
  onToggleSelect: () => void
  onToggleExpand: () => void
  onIntervene: () => void
  onClick: () => void
  onApprove: (id: string, name: string, recommendation: string) => void
  onEscalate: (id: string) => void
  addToast: (title: string, msg: string, type?: 'success' | 'warning' | 'info') => void
}

function TableRow({ row, index, isSelected, isExpanded, isApproved, isEscalated, onToggleSelect, onToggleExpand, onIntervene, onClick, onApprove, onEscalate, addToast }: TableRowProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  const handleApproveIntervention = async () => {
    setIsApproving(true)
    try {
      await fetch('/api/interventions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: row.id,
          customerName: row.name,
          intervention: row.recommendation,
          status: 'APPROVED',
        }),
      })
      onApprove(row.id, row.name, row.recommendation)
      addToast('Approved', `${row.recommendation} for ${row.name}`, 'success')
    } catch {
      addToast('Error', 'Could not save intervention. Check API connection.', 'warning')
    } finally {
      setIsApproving(false)
    }
  }

  const handleEscalateToRM = () => {
    onEscalate(row.id)
    addToast('Escalated', `${row.name} sent to RM queue`, 'info')
  }

  return (
    <div>
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: isExpanded ? 'none' : `1px solid #141414`,
          transition: 'background 0.15s',
          background: isSelected
            ? 'rgba(249,115,22,0.05)'
            : isHovered ? '#141414' : index % 2 === 1 ? '#0C0C0C' : 'transparent',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ width: 32 }}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            style={{ accentColor: C.orange }}
          />
        </div>

        <div
          style={{ width: 160, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={onClick}
        >
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDeep} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"DM Sans"',
            fontWeight: 600,
            fontSize: 11,
            color: C.text,
          }}>
            {row.initials}
          </div>
          <div>
            <div style={{ fontFamily: '"DM Sans"', fontSize: 13, color: C.text }}>{row.name}</div>
            <div style={{ fontFamily: '"JetBrains Mono"', fontSize: 10, color: C.textMuted }}>{row.id}</div>
          </div>
        </div>

        <div style={{ width: 90 }}>
          <RiskBadge risk={row.risk} />
        </div>

        <div style={{ width: 150 }}>
          <span style={{
            display: 'inline-block',
            background: `${row.personaColor}20`,
            color: row.personaColor,
            border: `1px solid ${row.personaColor}40`,
            fontFamily: '"DM Sans"',
            fontSize: 11,
            padding: '3px 8px',
            borderRadius: 16,
          }}>
            {row.persona}
          </span>
        </div>

        <div style={{ width: 70 }}>
          <div style={{ fontFamily: '"JetBrains Mono"', fontSize: 12, color: C.text }}>{row.buffer}</div>
          <StatusBadge status={row.bufferStatus} />
        </div>

        <div style={{ width: 80, display: 'flex', alignItems: 'center', gap: 6 }}>
          <ProgressBar value={row.income} height={5} style={{ width: 40 }} />
          <span style={{
            fontFamily: '"JetBrains Mono"',
            fontSize: 11,
            color: getBarColor(row.income),
          }}>
            {row.income}
          </span>
        </div>

        <div style={{ width: 80, display: 'flex', alignItems: 'center', gap: 6 }}>
          <ProgressBar value={row.behavior} height={5} style={{ width: 40 }} />
          <span style={{
            fontFamily: '"JetBrains Mono"',
            fontSize: 11,
            color: getBarColor(row.behavior),
          }}>
            {row.behavior}
          </span>
        </div>

        <div style={{ width: 70 }}>
          <div style={{
            fontFamily: '"Barlow Condensed"',
            fontWeight: 700,
            fontSize: 16,
            color: getEMIColor(row.daysToEMI),
          }}>
            {row.daysToEMI}
          </div>
          <div style={{ fontFamily: '"DM Sans"', fontSize: 10, color: C.textMuted }}>days</div>
        </div>

        <div style={{ width: 120, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {row.signals.slice(0, 2).map((s, j) => (
            <span key={j} style={{
              background: '#161616',
              border: '1px solid #2A2A2A',
              borderRadius: 3,
              fontFamily: '"DM Sans"',
              fontSize: 10,
              color: C.textSub,
              padding: '2px 5px',
            }}>
              {s}
            </span>
          ))}
          {row.signals.length > 2 && (
            <span style={{ fontFamily: '"DM Sans"', fontSize: 10, color: C.textMuted }}>
              +{row.signals.length - 2}
            </span>
          )}
        </div>

        <div style={{ width: 140 }}>
          <div style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.orange }}>
            {row.recommendation}
          </div>
          <StatusBadge status={row.suitability >= 80 ? 'STRONG FIT' : row.suitability >= 60 ? 'HIGH' : 'RM REVIEW'} />
        </div>

        <div style={{ width: 90, display: 'flex', gap: 6 }}>
          {isEscalated ? (
            <span style={{
              background: 'rgba(234,179,8,0.15)',
              border: '1px solid rgba(234,179,8,0.4)',
              color: C.warning,
              fontFamily: '"DM Sans"',
              fontSize: 10,
              fontWeight: 600,
              padding: '5px 8px',
              borderRadius: 4,
            }}>📋 RM Queued</span>
          ) : isApproved ? (
            <span style={{
              background: 'rgba(34,197,94,0.15)',
              border: '1px solid rgba(34,197,94,0.4)',
              color: C.safe,
              fontFamily: '"DM Sans"',
              fontSize: 10,
              fontWeight: 600,
              padding: '5px 8px',
              borderRadius: 4,
            }}>✓ Approved</span>
          ) : (
            <button
              onClick={handleApproveIntervention}
              disabled={isApproving}
              style={{
                background: isApproving ? C.border : C.orange,
                border: 'none',
                color: C.text,
                fontFamily: '"DM Sans"',
                fontWeight: 600,
                fontSize: 10,
                padding: '5px 10px',
                borderRadius: 4,
                cursor: isApproving ? 'not-allowed' : 'pointer',
                opacity: isApproving ? 0.6 : 1,
              }}
            >
              {isApproving ? '...' : '▶ Approve'}
            </button>
          )}
          {!isApproved && !isEscalated && (
            <button
              onClick={handleEscalateToRM}
              style={{
                background: 'transparent',
                border: `1px solid ${C.border}`,
                color: C.textSub,
                fontFamily: '"DM Sans"',
                fontSize: 10,
                padding: '5px 8px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              {isExpanded ? '▲' : '▼'}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Row Panel */}
      {isExpanded && (
        <div style={{
          background: '#0D0D0D',
          borderTop: `1px solid ${C.orange}`,
          padding: 20,
          display: 'flex',
          gap: 24,
          animation: 'fadeUp 0.3s ease',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"DM Sans"', fontSize: 13, color: C.orange, marginBottom: 12 }}>
              Why is this customer flagged?
            </div>
            {row.shap.map((s, j) => {
              const pts = parseInt(s.match(/\d+/)?.[0] || '0')
              return (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 120, fontFamily: '"DM Sans"', fontSize: 11, color: C.textSub }}>
                    {s.split(':')[0]}
                  </div>
                  <div style={{ flex: 1, height: 6, background: C.border, borderRadius: 3 }}>
                    <div style={{
                      width: `${Math.min(pts, 35) * 3}%`,
                      height: '100%',
                      background: C.orange,
                      borderRadius: 3,
                    }} />
                  </div>
                  <span style={{
                    fontFamily: '"JetBrains Mono"',
                    fontSize: 11,
                    color: pts > 20 ? C.danger : C.orange,
                  }}>
                    +{pts}pts
                  </span>
                </div>
              )
            })}
          </div>

          <div style={{ width: 200 }}>
            <div style={{ fontFamily: '"DM Sans"', fontSize: 13, color: C.orange, marginBottom: 12 }}>
              Signal History — Last 4 Weeks
            </div>
            {row.signals.slice(0, 3).map((s, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: '"DM Sans"', fontSize: 10, color: C.textMuted, width: 80 }}>{s}</span>
                <svg width={60} height={16} viewBox="0 0 60 16">
                  <polyline points="10,14 25,10 40,8 55,4" fill="none" stroke={C.orange} strokeWidth={1.5} />
                </svg>
              </div>
            ))}
          </div>

          <div style={{ width: 200 }}>
            <div style={{
              fontFamily: '"Barlow Condensed"',
              fontWeight: 600,
              fontSize: 16,
              color: C.text,
              marginBottom: 8,
            }}>
              {row.recommendation}
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: '"DM Sans"', fontSize: 10, color: C.textMuted }}>Suitability: </span>
              <span style={{
                fontFamily: '"JetBrains Mono"',
                fontSize: 12,
                color: row.suitability >= 70 ? C.safe : C.warning,
              }}>
                {row.suitability}/100
              </span>
            </div>
            {isApproved ? (
              <div style={{
                width: '100%',
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.4)',
                color: C.safe,
                fontFamily: '"DM Sans"',
                fontWeight: 600,
                fontSize: 12,
                padding: '8px 12px',
                borderRadius: 6,
                textAlign: 'center',
                marginBottom: 6,
              }}>✓ Intervention Approved</div>
            ) : (
              <button
                onClick={handleApproveIntervention}
                disabled={isApproving}
                style={{
                  width: '100%',
                  background: isApproving ? C.border : C.orange,
                  border: 'none',
                  color: C.text,
                  fontFamily: '"DM Sans"',
                  fontSize: 12,
                  padding: '8px 12px',
                  borderRadius: 6,
                  cursor: isApproving ? 'not-allowed' : 'pointer',
                  marginBottom: 6,
                }}
              >
                {isApproving ? '⟳ Saving...' : '▶ Approve Intervention'}
              </button>
            )}
            {!isEscalated ? (
              <button
                onClick={handleEscalateToRM}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: `1px solid ${C.border}`,
                  color: C.textSub,
                  fontFamily: '"DM Sans"',
                  fontSize: 12,
                  padding: '8px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                → Send to RM
              </button>
            ) : (
              <div style={{
                width: '100%',
                background: 'rgba(234,179,8,0.12)',
                border: '1px solid rgba(234,179,8,0.4)',
                color: C.warning,
                fontFamily: '"DM Sans"',
                fontSize: 12,
                padding: '8px 12px',
                borderRadius: 6,
                textAlign: 'center',
              }}>📋 Sent to RM Queue</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Pagination Component
interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 16,
      animation: 'fadeUp 0.4s ease 0.24s both',
    }}>
      <div style={{ fontFamily: '"DM Sans"', fontSize: 13, color: C.textSub }}>
        Showing {startItem}–{endItem} of {totalItems} customers
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          style={{
            background: currentPage === 1 ? C.border : 'transparent',
            border: `1px solid ${C.border}`,
            color: currentPage === 1 ? C.textMuted : C.textSub,
            padding: '6px 10px',
            borderRadius: 4,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontFamily: '"DM Sans"',
            fontSize: 12,
          }}
        >
          « First
        </button>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          style={{
            background: currentPage === 1 ? C.border : 'transparent',
            border: `1px solid ${C.border}`,
            color: currentPage === 1 ? C.textMuted : C.textSub,
            padding: '6px 12px',
            borderRadius: 4,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontFamily: '"DM Sans"',
            fontSize: 12,
          }}
        >
          ‹ Prev
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum: number
          if (totalPages <= 5) {
            pageNum = i + 1
          } else if (currentPage <= 3) {
            pageNum = i + 1
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i
          } else {
            pageNum = currentPage - 2 + i
          }

          return (
            <button
              key={i}
              onClick={() => onPageChange(pageNum)}
              style={{
                background: currentPage === pageNum ? C.orange : 'transparent',
                border: `1px solid ${currentPage === pageNum ? C.orange : C.border}`,
                color: currentPage === pageNum ? C.text : C.textSub,
                padding: '6px 12px',
                borderRadius: 4,
                cursor: 'pointer',
                fontFamily: '"JetBrains Mono"',
                fontSize: 12,
                minWidth: 36,
              }}
            >
              {pageNum}
            </button>
          )
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          style={{
            background: currentPage === totalPages ? C.border : 'transparent',
            border: `1px solid ${C.border}`,
            color: currentPage === totalPages ? C.textMuted : C.textSub,
            padding: '6px 12px',
            borderRadius: 4,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontFamily: '"DM Sans"',
            fontSize: 12,
          }}
        >
          Next ›
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={{
            background: currentPage === totalPages ? C.border : 'transparent',
            border: `1px solid ${C.border}`,
            color: currentPage === totalPages ? C.textMuted : C.textSub,
            padding: '6px 10px',
            borderRadius: 4,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontFamily: '"DM Sans"',
            fontSize: 12,
          }}
        >
          Last »
        </button>
      </div>
    </div>
  )
}
