import { useState } from 'react';
import { CompanyAssignmentsPage } from './CompanyAssignmentsPage';
import { LocationAssignmentsPage } from './LocationAssignmentsPage';

const ASSIGNMENT_TABS = [
  { id: 'company', label: 'Company Assignments', component: <CompanyAssignmentsPage /> },
  { id: 'location', label: 'Location Assignments', component: <LocationAssignmentsPage /> },
] as const;

type AssignmentTabId = typeof ASSIGNMENT_TABS[number]['id'];

export function ManagerAssignmentsPage() {
  const [activeTab, setActiveTab] = useState<AssignmentTabId>('company');
  const active = ASSIGNMENT_TABS.find(tab => tab.id === activeTab) ?? ASSIGNMENT_TABS[0];

  return (
    <section className="refs-page manager-assignments-page">
      <div className="refs-tabs" role="tablist" aria-label="Assignment tabs">
        {ASSIGNMENT_TABS.map(tab => (
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
  );
}
