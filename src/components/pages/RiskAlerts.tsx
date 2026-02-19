'use client'

import React from 'react'
import { C } from '@/lib/theme'
import { AlertsTable, CustomerModal } from '@/components/alerts'
import type { ToastType, CustomerAlert } from '@/types'

interface RiskAlertsProps {
  addToast: (title: string, msg: string, type?: ToastType) => void
}

export function RiskAlerts({ addToast }: RiskAlertsProps) {
  const [selectedCustomer, setSelectedCustomer] = React.useState<CustomerAlert | null>(null)

  return (
    <div>
      <AlertsTable
        addToast={addToast}
        onCustomerClick={(customer) => setSelectedCustomer(customer)}
      />

      {selectedCustomer && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          addToast={addToast}
        />
      )}
    </div>
  )
}
