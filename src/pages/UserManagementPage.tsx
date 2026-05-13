import { useState } from 'react'
import { CardPage } from '../components/CardPage'
import { Cr113_user_securitiesService } from '../generated/services/Cr113_user_securitiesService'
import type { AccessRole } from '../security/access'

// Define USER_MANAGEMENT_TABS constant with explicit types
const USER_MANAGEMENT_TABS: { id: 'admin' | 'power' | 'super'; label: string; roleType: 1 | 2 | 3 }[] = [
  { id: 'admin', label: 'Admin', roleType: 1 },
  { id: 'power', label: 'Power User', roleType: 2 },
  { id: 'super', label: 'Super User', roleType: 3 },
]

// Update USER_FIELDS to include key property
import type { FieldDef } from '../components/CardPage'

const getUserFields = (tabId: 'admin' | 'power' | 'super'): FieldDef[] => [
  {
    key: 'cr113_username',
    label: 'User Name',
    inputType: 'text',
    showOnCard: true,
    editable: true,
    required: true,
    placeholder: 'e.g. Jane Doe',
  },
  {
    key: 'cr113_email',
    label: 'Email',
    inputType: 'text',
    showOnCard: true,
    editable: true,
    required: true,
    placeholder: 'e.g. user@contoso.com',
  },
  {
    key: 'cr113_roletype',
    label: 'Role Type',
    inputType: 'select',
    options: tabId === 'super'
      ? [
          { label: 'Admin', value: '1' },
          { label: 'Power User', value: '2' },
          { label: 'Super User', value: '3' },
        ]
      : [
          { label: 'Admin', value: '1' },
          { label: 'Power User', value: '2' },
        ],
    showOnCard: false,
    editable: true,
    editOnly: true,
    required: true,
    placeholder: 'Select role type',
  },
]

const getService = (roleType: 1 | 2 | 3) => ({
  getAll: async (): Promise<{ success: boolean; data: any[] }> => {
    console.log(`Fetching records for roleType: ${roleType}`)
    const result = await Cr113_user_securitiesService.getAll({
      filter: `cr113_application eq 'Dairy Brands Hierarchy Manager' and cr113_roletype eq ${roleType}`,
      select: ['cr113_username', 'cr113_email', 'cr113_roletype', 'cr113_user_securityid'],
    })
    console.log('API Response:', result)
    return { success: result.success, data: result.data || [] }
  },
  create: async (record: Record<string, any>): Promise<{ success: boolean; data: any }> => {
    const result = await Cr113_user_securitiesService.create({
      ...record,
      cr113_application: 'Dairy Brands Hierarchy Manager',
      cr113_roletype: roleType as any,
    } as any)
    if (!result.success) {
      throw new Error('Unable to create user security record.')
    }
    return { success: result.success, data: result.data }
  },
  update: async (id: string, changes: Record<string, any>): Promise<{ success: boolean }> => {
    const payload = {
      ...changes,
      ...(changes.cr113_roletype !== undefined
        ? { cr113_roletype: Number(changes.cr113_roletype) as 1 | 2 | 3 }
        : {}),
    }
    const result = await Cr113_user_securitiesService.update(
      id,
      payload as Parameters<typeof Cr113_user_securitiesService.update>[1]
    )
    if (!result.success) {
      throw new Error('Unable to update user security record.')
    }
    return { success: result.success }
  },
  delete: async (id: string): Promise<void> => {
    await Cr113_user_securitiesService.delete(id)
  },
})

export function UserManagementPage({ accessRole = 'basic' }: { accessRole?: AccessRole }) {
  console.log('UserManagementPage rendered')
  const [activeTab, setActiveTab] = useState<'admin' | 'power' | 'super'>(USER_MANAGEMENT_TABS[0].id)
  const visibleTabs = USER_MANAGEMENT_TABS.filter(tab =>
    accessRole === 'admin' ? tab.id !== 'super' : true
  )
  const currentTab = visibleTabs.find(tab => tab.id === activeTab) ?? visibleTabs[0]

  return (
    <section className="refs-page user-management-page">
{/*       <div className="refs-header">
        <h2 className="refs-title">User Security</h2>
        <p className="refs-description">Manage admin and power users.</p>
      </div> */}

      <div className="refs-tabs" role="tablist" aria-label="User management tabs">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={currentTab.id === tab.id}
            className={`refs-tab-btn${currentTab.id === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="refs-tab-panel" role="tabpanel">
        {visibleTabs.map(
          (tab) =>
            currentTab.id === tab.id && (
              <CardPage
                key={tab.id}
                config={{
                  title: tab.label,
                  description: `Manage ${tab.label.toLowerCase()}.`,
                  hideRowEditAction: true,
                  enableRowDoubleClickEdit: true,
                  idField: 'cr113_user_securityid',
                  service: getService(tab.roleType),
                  fields: getUserFields(tab.id),
                }}
              />
            )
        )}
      </div>
    </section>
  )
}
