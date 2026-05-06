import { useState } from 'react'
import './App.css'
import { useTheme } from './components/theme/use-theme'
import { BUILD_META } from './build-meta'
import { HomePage } from './pages/HomePage'
import { CompaniesPage } from './pages/CompaniesPage'
import { LocationsPage } from './pages/LocationsPage'
import { ManagersHubPage } from './pages/ManagersHubPage'
import { DataManagementPage } from './pages/DataManagementPage'
import { PageModeProvider } from './components/page-mode'

const PRIMARY_NAV = [
  { id: 'home', label: 'Home', component: <HomePage /> },
  { id: 'companies', label: 'JDE Companies', component: <CompaniesPage /> },
  { id: 'locations', label: 'JDE Locations', component: <LocationsPage /> },
  { id: 'managers', label: 'JDE Managers', component: <ManagersHubPage /> },
] as const

const ADMIN_NAV = [
  { id: 'data-management', label: 'Data Management', component: <DataManagementPage /> },
] as const

const NAV = [...PRIMARY_NAV, ...ADMIN_NAV] as const

type NavId = typeof NAV[number]['id']

function App() {
  const [activePage, setActivePage] = useState<NavId>('home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [refreshTime] = useState(() => new Date())
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  const active = NAV.find(n => n.id === activePage) ?? NAV[0]

  return (
    <div className="app-root">
      <aside className={`app-sidebar${sidebarCollapsed ? ' collapsed' : ''}`}>
        <div className="app-brand">
          <span className="app-brand-mark" aria-hidden="true">
            <span className="app-brand-mark-inner" />
          </span>
          <div>
            <div className="app-brand-sub">Manage JDE Company/Location Ownership</div>
          </div>
        </div>

        <nav className="side-nav" role="navigation">
          {PRIMARY_NAV.map(item => (
            <button
              key={item.id}
              className={`side-nav-btn${activePage === item.id ? ' active' : ''}`}
              onClick={() => setActivePage(item.id as NavId)}
            >
              {item.label}
            </button>
          ))}

          <div className="side-nav-divider" role="presentation" />
          <div className="side-nav-section-label">Admin</div>

          <div className="side-nav-group">
            {ADMIN_NAV.map(item => (
              <button
                key={item.id}
                className={`side-nav-btn side-nav-btn-sub${activePage === item.id ? ' active' : ''}`}
                onClick={() => setActivePage(item.id as NavId)}
              >
                {item.label}
              </button>
            ))}
          </div>
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
        <header className="app-header">
          <button
            className="app-sidebar-toggle"
            onClick={() => setSidebarCollapsed(value => !value)}
            aria-label={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            title={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            {sidebarCollapsed ? '›' : '‹'}
          </button>
          <div className="app-header-copy">
            <h1 className="app-header-title">{active.label}</h1>
          </div>
        </header>

        <main className="app-content" key={activePage}>
          <PageModeProvider mode="default">
            {active.component}
          </PageModeProvider>
        </main>
      </div>
    </div>
  )
}

export default App
