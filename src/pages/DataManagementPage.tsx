import { useState } from 'react'
import { RolesPage } from './RolesPage'
import { CoSegmentsPage } from './CoSegmentsPage'
import { LocationSegmentsPage } from './LocationSegmentsPage'
import { DivsPage } from './DivsPage'
import { GroupsPage } from './GroupsPage'
import { LedgerTypesPage } from './LedgerTypesPage'
import { TypesPage } from './TypesPage'
import { OtcsPage } from './OtcsPage'
import type { AccessRole } from '../security/access'

const DATA_MANAGEMENT_TABS = [
  { id: 'divisions', label: 'Divisions', component: <DivsPage /> },
  { id: 'groups', label: 'Groups', component: <GroupsPage /> },
  { id: 'roles', label: 'Roles', component: <RolesPage /> },
  // Removed Managers, Company Assignments, Location Assignments tabs
  { id: 'co-segments', label: 'Company Segments', component: <CoSegmentsPage /> },
  { id: 'loc-segments', label: 'Location Segments', component: <LocationSegmentsPage /> },
  { id: 'ledger-types', label: 'Ledger Types', component: <LedgerTypesPage /> },
  { id: 'company-types', label: 'Company Types', component: <TypesPage /> },
  { id: 'otcs', label: 'OTC Types', component: <OtcsPage /> },
] as const

type DataManagementTabId = typeof DATA_MANAGEMENT_TABS[number]['id']

export function DataManagementPage({ accessRole: _accessRole = 'basic' }: { accessRole?: AccessRole }) {
  const [activeTab, setActiveTab] = useState<DataManagementTabId>('divisions')
  const visibleTabs = DATA_MANAGEMENT_TABS
  const active = visibleTabs.find(tab => tab.id === activeTab) ?? visibleTabs[0]

  return (
    <section className="refs-page data-management-page">
      <div className="refs-tabs" role="tablist" aria-label="Application management tabs">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active.id === tab.id}
            className={`refs-tab-btn${active.id === tab.id ? ' active' : ''}`}
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
