import { useState } from 'react'
import { RolesPage } from './RolesPage'
import { CoSegmentsPage } from './CoSegmentsPage'
import { LocationSegmentsPage } from './LocationSegmentsPage'
import { DivsPage } from './DivsPage'
import { GroupsPage } from './GroupsPage'
import { LedgerTypesPage } from './LedgerTypesPage'
import { TypesPage } from './TypesPage'
import { OtcsPage } from './OtcsPage'
import { ManagersPage } from './ManagersPage'

const DATA_MANAGEMENT_TABS = [
  { id: 'roles', label: 'Roles', component: <RolesPage /> },
  { id: 'divisions', label: 'Divisions', component: <DivsPage /> },
  { id: 'groups', label: 'Groups', component: <GroupsPage /> },
  { id: 'co-segments', label: 'Co. Segments', component: <CoSegmentsPage /> },
  { id: 'loc-segments', label: 'Loc. Segments', component: <LocationSegmentsPage /> },
  { id: 'ledger-types', label: 'Ledger Types', component: <LedgerTypesPage /> },
  { id: 'company-types', label: 'Company Types', component: <TypesPage /> },
  { id: 'otcs', label: 'OTCs', component: <OtcsPage /> },
  { id: 'jde-managers', label: 'JDE Managers', component: <ManagersPage /> },
] as const

type DataManagementTabId = typeof DATA_MANAGEMENT_TABS[number]['id']

export function DataManagementPage() {
  const [activeTab, setActiveTab] = useState<DataManagementTabId>('roles')
  const active = DATA_MANAGEMENT_TABS.find(tab => tab.id === activeTab) ?? DATA_MANAGEMENT_TABS[0]

  return (
    <section className="refs-page">
{/*       <div className="refs-header">
        <h2 className="refs-title">Data Management</h2>
        <p className="refs-description">
          Use tabs to manage reference tables, managers, and assignment records.
        </p>
      </div> */}

      <div className="refs-tabs" role="tablist" aria-label="Data management tabs">
        {DATA_MANAGEMENT_TABS.map(tab => (
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
        {active.component}
      </div>
    </section>
  )
}
