import { useState } from 'react'
import { CardPage } from '../components/CardPage'
import { Cr113_user_securitiesService } from '../generated/services/Cr113_user_securitiesService'

// Define USER_MANAGEMENT_TABS constant with explicit types
const USER_MANAGEMENT_TABS: { id: 'admin' | 'power'; label: string; roleType: 1 | 2 }[] = [
  { id: 'admin', label: 'Admin Users', roleType: 1 },
  { id: 'power', label: 'Power Users', roleType: 2 },
]

// Update USER_FIELDS to include key property
import type { FieldDef } from '../components/CardPage'

const USER_FIELDS: FieldDef[] = [
  { key: 'cr113_username', label: 'Username', inputType: 'text', showOnCard: true },
  { key: 'cr113_email', label: 'Email', inputType: 'text', showOnCard: true },
]

const getService = (roleType: 1 | 2) => ({
  getAll: async (): Promise<{ success: boolean; data: any[] }> => {
    console.log(`Fetching records for roleType: ${roleType}`)
    const result = await Cr113_user_securitiesService.getAll({
      filter: `cr113_application eq 'Dairy Brands Hierarchy Manager' and cr113_roletype eq ${roleType}`,
      select: ['cr113_username', 'cr113_email', 'cr113_user_securityid'],
    })
    console.log('API Response:', result)
    return { success: result.success, data: result.data || [] }
  },
  create: async (record: Record<string, any>): Promise<{ success: boolean; data: any }> => {
    const result = await Cr113_user_securitiesService.create({
      ...record,
      cr113_application: 'Dairy Brands Hierarchy Manager',
      cr113_roletype: roleType,
      ownerid: 'default-owner-id',
      owneridtype: 'default-owner-type',
      statecode: 0,
    })
    return { success: result.success, data: result.data }
  },
  update: async (id: string, changes: Record<string, any>): Promise<{ success: boolean }> => {
    const result = await Cr113_user_securitiesService.update(id, changes)
    return { success: result.success }
  },
  delete: async (id: string): Promise<void> => {
    await Cr113_user_securitiesService.delete(id)
  },
})

export function UserManagementPage() {
  console.log('UserManagementPage rendered')
  const [activeTab, setActiveTab] = useState<'admin' | 'power'>(USER_MANAGEMENT_TABS[0].id)

  return (
    <section className="refs-page">
{/*       <div className="refs-header">
        <h2 className="refs-title">User Management</h2>
        <p className="refs-description">Manage admin and power users.</p>
      </div> */}

      <div className="refs-tabs" role="tablist" aria-label="User management tabs">
        {USER_MANAGEMENT_TABS.map((tab) => (
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
        {USER_MANAGEMENT_TABS.map(
          (tab) =>
            activeTab === tab.id && (
              <CardPage
                key={tab.id}
                config={{
                  title: tab.label,
                  description: `Manage ${tab.label.toLowerCase()}.`,
                  idField: 'cr113_user_securityid',
                  service: getService(tab.roleType),
                  fields: USER_FIELDS,
                }}
              />
            )
        )}
      </div>
    </section>
  )
}
