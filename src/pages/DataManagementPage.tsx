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
import { CompanyAssignmentsPage } from './CompanyAssignmentsPage'
import { LocationAssignmentsPage } from './LocationAssignmentsPage'
import type { AccessRole } from '../security/access'

const DATA_MANAGEMENT_TABS = [
  { id: 'divisions', label: 'Divisions', component: <DivsPage /> },
  { id: 'groups', label: 'Groups', component: <GroupsPage /> },
  { id: 'roles', label: 'Roles', component: <RolesPage /> },
  { id: 'co-segments', label: 'Company Segments', component: <CoSegmentsPage /> },
  { id: 'loc-segments', label: 'Location Segments', component: <LocationSegmentsPage /> },
  { id: 'ledger-types', label: 'Ledger Types', component: <LedgerTypesPage /> },
  { id: 'company-types', label: 'Company Types', component: <TypesPage /> },
  { id: 'otcs', label: 'OTC Type', component: <OtcsPage /> },
  { id: 'jde-managers', label: 'JDE Managers', component: <ManagersPage /> },
  { id: 'jde-co-assignments', label: 'Company Assignments', component: <CompanyAssignmentsPage /> },
  { id: 'jde-loc-assignments', label: 'Location Assignments', component: <LocationAssignmentsPage /> },
] as const

type DataManagementTabId = typeof DATA_MANAGEMENT_TABS[number]['id']

export function DataManagementPage({ accessRole = 'basic' }: { accessRole?: AccessRole }) {
  const [activeTab, setActiveTab] = useState<DataManagementTabId>('divisions')
  const visibleTabs = DATA_MANAGEMENT_TABS.filter(tab =>
    accessRole === 'admin'
      ? tab.id !== 'jde-co-assignments' && tab.id !== 'jde-loc-assignments'
      : true
  )
  const active = visibleTabs.find(tab => tab.id === activeTab) ?? visibleTabs[0]

  return (
    <section className="refs-page data-management-page">
{/*       <div className="refs-header">
        <h2 className="refs-title">Data Management</h2>
        <p className="refs-description">
          Use tabs to manage reference tables, managers, and assignment records.
        </p>
      </div> */}

      <div className="refs-tabs" role="tablist" aria-label="Data management tabs">
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
