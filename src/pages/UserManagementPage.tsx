import { useState } from 'react'
import { CardPage } from '../components/CardPage'

const adminService = {
  getAll: async () => ({ success: true, data: [] }),
  create: async (_record: Record<string, string>) => ({ success: true, data: undefined }),
  update: async (_id: string, _changes: Record<string, string>) => ({ success: true }),
  delete: async (_id: string) => {},
}

const powerUserService = {
  getAll: async () => ({ success: true, data: [] }),
  create: async (_record: Record<string, string>) => ({ success: true, data: undefined }),
  update: async (_id: string, _changes: Record<string, string>) => ({ success: true }),
  delete: async (_id: string) => {},
}

const USER_MANAGEMENT_TABS = [
  { id: 'admin', label: 'Admin Users' },
  { id: 'power', label: 'Power Users' },
] as const

type UserManagementTabId = typeof USER_MANAGEMENT_TABS[number]['id']

const USER_FIELDS = [
  { key: 'email', label: 'Email', editable: true, required: true },
  { key: 'displayName', label: 'Display Name', editable: true, required: true },
]

export function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<UserManagementTabId>('admin')

  return (
    <section className="refs-page">
      <div className="refs-header">
        <h2 className="refs-title">User Management</h2>
        <p className="refs-description">Manage admin and power users.</p>
      </div>

      <div className="refs-tabs" role="tablist" aria-label="User management tabs">
        {USER_MANAGEMENT_TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`refs-tab-btn${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="refs-tab-panel" role="tabpanel">
        {activeTab === 'admin' && (
          <CardPage
            config={{
              title: 'Admin Users',
              description: 'Manage admin users.',
              idField: 'id',
              service: adminService,
              fields: USER_FIELDS,
            }}
          />
        )}
        {activeTab === 'power' && (
          <CardPage
            config={{
              title: 'Power Users',
              description: 'Manage power users.',
              idField: 'id',
              service: powerUserService,
              fields: USER_FIELDS,
            }}
          />
        )}
      </div>
    </section>
  )
}
