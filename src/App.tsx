import { useState } from 'react'
import './App.css'
import { useTheme } from './components/theme/use-theme'
import { BUILD_META } from './build-meta'
import { HomePage } from './pages/HomePage'
import { RolesPage } from './pages/RolesPage'
import { CoSegmentsPage } from './pages/CoSegmentsPage'
import { LocationSegmentsPage } from './pages/LocationSegmentsPage'
import { DivsPage } from './pages/DivsPage'
import { GroupsPage } from './pages/GroupsPage'
import { LedgerTypesPage } from './pages/LedgerTypesPage'
import { TypesPage } from './pages/TypesPage'
import { OtcsPage } from './pages/OtcsPage'
import { CompaniesPage } from './pages/CompaniesPage'

const HOME_NAV = [
  { id: 'home', label: '🏠 Home', component: <HomePage /> },
] as const

const REF_NAV = [
  { id: 'roles',         label: 'Roles',             component: <RolesPage /> },
  { id: 'divisions',     label: 'Divisions',         component: <DivsPage /> },
  { id: 'groups',        label: 'Groups',            component: <GroupsPage /> },
  { id: 'co-segments',   label: 'Co. Segments',      component: <CoSegmentsPage /> },
  { id: 'loc-segments',  label: 'Loc. Segments',     component: <LocationSegmentsPage /> },
  { id: 'ledger-types',  label: 'Ledger Types',      component: <LedgerTypesPage /> },
  { id: 'company-types', label: 'Company Types',     component: <TypesPage /> },
  { id: 'otcs',          label: 'OTCs',              component: <OtcsPage /> },
] as const

const UPDATES_NAV = [
  { id: 'companies', label: 'JDE Companies', component: <CompaniesPage /> },
] as const

const NAV = [...HOME_NAV, ...REF_NAV, ...UPDATES_NAV] as const

type NavId = typeof NAV[number]['id']

function App() {
  const [activePage, setActivePage] = useState<NavId>('home')
  const [refsOpen, setRefsOpen] = useState(false)
  const [updatesOpen, setUpdatesOpen] = useState(false)
  const [refreshTime] = useState(() => new Date())
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

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
          {HOME_NAV.map(item => (
            <button
              key={item.id}
              className={`side-nav-btn${activePage === item.id ? ' active' : ''}`}
              onClick={() => setActivePage(item.id as NavId)}
            >
              {item.label}
            </button>
          ))}

          <button
            className="side-nav-group-btn"
            onClick={() => setRefsOpen(o => !o)}
            aria-expanded={refsOpen}
          >
            <span>📋 JDE References</span>
            <span className={`side-nav-chevron${refsOpen ? ' open' : ''}`}>▸</span>
          </button>

          {refsOpen && (
            <div className="side-nav-group">
              {REF_NAV.map(item => (
                <button
                  key={item.id}
                  className={`side-nav-btn side-nav-btn-sub${activePage === item.id ? ' active' : ''}`}
                  onClick={() => setActivePage(item.id as NavId)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <button
            className="side-nav-group-btn"
            onClick={() => setUpdatesOpen(o => !o)}
            aria-expanded={updatesOpen}
          >
            <span>🔔 JDE Updates</span>
            <span className={`side-nav-chevron${updatesOpen ? ' open' : ''}`}>▸</span>
          </button>

          {updatesOpen && (
            <div className="side-nav-group">
              {UPDATES_NAV.map(item => (
                <button
                  key={item.id}
                  className={`side-nav-btn side-nav-btn-sub${activePage === item.id ? ' active' : ''}`}
                  onClick={() => setActivePage(item.id as NavId)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <button
            className="theme-toggle"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="theme-toggle-icon">{isDark ? '☀️' : '🌙'}</span>
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <div className="build-meta" aria-label="Build information">
            <div>v{BUILD_META.version} - Build {BUILD_META.build}</div>
            <div>{refreshTime.toLocaleString()}</div>
          </div>
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
