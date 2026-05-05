import { useState, useEffect } from 'react'
import './App.css'
import { HomePage } from './pages/HomePage'
import { RolesPage } from './pages/RolesPage'
import { CoSegmentsPage } from './pages/CoSegmentsPage'
import { LocationSegmentsPage } from './pages/LocationSegmentsPage'
import { DivsPage } from './pages/DivsPage'
import { GroupsPage } from './pages/GroupsPage'
import { LedgerTypesPage } from './pages/LedgerTypesPage'
import { TypesPage } from './pages/TypesPage'
import { OtcsPage } from './pages/OtcsPage'

const NAV = [
  { id: 'home',          label: '🏠 Home',           component: <HomePage /> },
  { id: 'roles',         label: 'Roles',             component: <RolesPage /> },
  { id: 'divisions',     label: 'Divisions',         component: <DivsPage /> },
  { id: 'groups',        label: 'Groups',            component: <GroupsPage /> },
  { id: 'co-segments',   label: 'Co. Segments',      component: <CoSegmentsPage /> },
  { id: 'loc-segments',  label: 'Loc. Segments',     component: <LocationSegmentsPage /> },
  { id: 'ledger-types',  label: 'Ledger Types',      component: <LedgerTypesPage /> },
  { id: 'company-types', label: 'Company Types',     component: <TypesPage /> },
  { id: 'otcs',          label: 'OTCs',              component: <OtcsPage /> },
] as const

type NavId = typeof NAV[number]['id']

function App() {
  const [activePage, setActivePage] = useState<NavId>('home')
  const [dark, setDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const active = NAV.find(n => n.id === activePage) ?? NAV[0]

  return (
    <div className="app-root">
      <aside className="app-sidebar">
        <div className="app-brand">
          <span className="app-brand-icon">🏗</span>
          <div>
            <div className="app-brand-title">JDE Hierarchy</div>
            <div className="app-brand-sub">Manager</div>
          </div>
        </div>

        <nav className="side-nav" role="navigation">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`side-nav-btn${activePage === item.id ? ' active' : ''}`}
              onClick={() => setActivePage(item.id as NavId)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="theme-toggle"
            onClick={() => setDark(d => !d)}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="theme-toggle-icon">{dark ? '☀️' : '🌙'}</span>
            <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      <div className="app-body">
        <main className="app-content" key={activePage}>
          {active.component}
        </main>
      </div>
    </div>
  )
}

export default App
