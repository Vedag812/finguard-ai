'use client'

import React, { useState, useCallback } from 'react'
import { C } from '@/lib/theme'
import { useToasts } from '@/hooks'
import { TopBar, Sidebar, ToastContainer } from '@/components/layout'
import { FlagCustomerModal, ExportReportModal, AlertSettingsModal } from '@/components/modals'
import {
  PortfolioOverview,
  RiskAlerts,
  Interventions,
  TrendsAnalytics,
  Customer360Page,
  SignalIntelligencePage
} from '@/components/pages'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { FlagCustomerFormData, AlertSettings, CustomerAlert } from '@/types'

// Import animations CSS
import '@/lib/animations.css'

export default function FinGuardDashboard() {
  const { toasts, add, remove } = useToasts()
  const [activePage, setActivePage] = useState('overview')

  // Modal states
  const [showFlagModal, setShowFlagModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // Customer 360 state
  const [customer360Initial, setCustomer360Initial] = useState<CustomerAlert | undefined>(undefined)

  // Modal handlers
  const handleFlagCustomer = useCallback((data: FlagCustomerFormData) => {
    add(
      'Customer Flagged',
      `${data.name} (${data.id}) flagged for ${data.reason} - ${data.priority} priority`,
      data.priority === 'Critical' ? 'warning' : 'success'
    )
  }, [add])

  const handleExportReport = useCallback((format: string, sections: string[]) => {
    add(
      'Export Started',
      `Generating ${format} report with ${sections.length} sections...`,
      'info'
    )
    // Simulate download
    setTimeout(() => {
      add('Export Complete', `Your ${format} report is ready for download`, 'success')
    }, 1500)
  }, [add])

  const handleSaveSettings = useCallback((settings: AlertSettings) => {
    add(
      'Settings Saved',
      `Alert thresholds updated. Notifications: ${Object.entries(settings.notifications).filter(([, v]) => v).map(([k]) => k).join(', ')}`,
      'success'
    )
  }, [add])

  // Navigate to customer 360
  const handleCustomerClick = useCallback((customer: CustomerAlert) => {
    setCustomer360Initial(customer)
    setActivePage('customer360')
  }, [])

  // Render active page
  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return (
          <PortfolioOverview
            addToast={add}
            onNavigate={setActivePage}
            onOpenExport={() => setShowExportModal(true)}
          />
        )
      case 'alerts':
        return <RiskAlerts addToast={add} />
      case 'interventions':
        return <Interventions addToast={add} />
      case 'trends':
        return <TrendsAnalytics />
      case 'customer360':
        return <Customer360Page addToast={add} initialCustomer={customer360Initial} />
      case 'signals':
        return <SignalIntelligencePage />
      default:
        return <PortfolioOverview addToast={add} />
    }
  }

  return (
    <ErrorBoundary>
      {/* Font Import */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
      ` }} />

      {/* Main Container */}
      <div style={{
        minHeight: '100vh',
        background: C.bg,
        color: C.text,
        fontFamily: '"DM Sans"',
      }}>
        {/* Top Bar */}
        <TopBar />

        {/* Sidebar */}
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          onFlagCustomer={() => setShowFlagModal(true)}
          onExportReport={() => setShowExportModal(true)}
          onAlertSettings={() => setShowSettingsModal(true)}
        />

        {/* Main Content */}
        <main style={{
          marginLeft: 260,
          marginTop: 56,
          padding: 24,
          minHeight: 'calc(100vh - 56px)',
        }}>
          {renderPage()}
        </main>

        {/* Toast Container */}
        <ToastContainer toasts={toasts} remove={remove} />

        {/* Modals */}
        <FlagCustomerModal
          isOpen={showFlagModal}
          onClose={() => setShowFlagModal(false)}
          onSubmit={handleFlagCustomer}
        />

        <ExportReportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={handleExportReport}
        />

        <AlertSettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          onSave={handleSaveSettings}
        />
      </div>
    </ErrorBoundary>
  )
}
