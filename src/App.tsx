import { useEffect, useState } from 'react'
import { getContext } from '@microsoft/power-apps/app'
import { UserRound } from 'lucide-react'
import './App.css'
import { ModeToggle } from './components/theme/ModeToggle'
import { BUILD_META } from './build-meta'
import { HomePage } from './pages/HomePage'
import { CompaniesPage } from './pages/CompaniesPage'
import { LocationsPage } from './pages/LocationsPage'
import { ManagersHubPage } from './pages/ManagersHubPage'
import { DataManagementPage } from './pages/DataManagementPage'
import { UserManagementPage } from './pages/UserManagementPage'
import { PageModeProvider } from './components/page-mode'

const PRIMARY_NAV = [
  { id: 'home', label: 'Home', icon: '🏠', component: <HomePage />, hidden: false },
  { id: 'companies', label: 'JDE Companies', icon: '🏢', component: <CompaniesPage />, hidden: false },
  { id: 'locations', label: 'JDE Locations', icon: '📍', component: <LocationsPage />, hidden: true },
  { id: 'managers', label: 'JDE Managers', icon: '🧑‍💼', component: <ManagersHubPage />, hidden: false },
] as const


const ADMIN_NAV = [
  { id: 'data-management', label: 'Data Management', icon: '🗄️', component: <DataManagementPage /> },
  { id: 'user-management', label: 'User Management', icon: '👤', component: <UserManagementPage /> },
] as const

const NAV = [...PRIMARY_NAV, ...ADMIN_NAV] as const

type NavId = typeof NAV[number]['id']

function App() {
  const [activePage, setActivePage] = useState<NavId>('home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [refreshTime] = useState(() => new Date())
  const [networkUserName, setNetworkUserName] = useState('DFA network user')

  const active = NAV.find(n => n.id === activePage) ?? NAV[0]

  useEffect(() => {
    let isActive = true

    const loadCurrentUser = async () => {
      try {
        const context = await getContext()
        const fullName = context.user.fullName?.trim()
        const userPrincipalName = context.user.userPrincipalName?.trim()

        if (!isActive) {
          return
        }

        setNetworkUserName(fullName || userPrincipalName || 'DFA network user')
      } catch {
        if (isActive) {
          setNetworkUserName('DFA network user')
        }
      }
    }

    loadCurrentUser()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <div className="app-root">
      <aside className={`app-sidebar${sidebarCollapsed ? ' collapsed' : ''}`}>

        <div className="app-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span aria-hidden="true" style={{ fontSize: '1.25em', marginRight: 2 }}>🏛️</span>
            <div className="app-brand-sub">Manage JDE Hierarchy Ownership</div>
          </div>
        </div>

        <nav className="side-nav" role="navigation">
          {PRIMARY_NAV.filter(item => !item.hidden).map(item => (
            <button
              key={item.id}
              className={`side-nav-btn${activePage === item.id ? ' active' : ''}`}
              onClick={() => setActivePage(item.id as NavId)}
            >
              <span style={{ marginRight: 10 }} aria-hidden="true">{item.icon}</span>
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
                onClick={() => {
                  console.log('Sidebar click:', item.id);
                  setActivePage(item.id as NavId);
                }}
              >
                <span style={{ marginRight: 10 }} aria-hidden="true">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-divider" role="presentation" />

          <div className="network-user" aria-label="DFA network user">
            <UserRound className="network-user-icon" size={18} aria-hidden="true" />
            <span className="network-user-text">{networkUserName}</span>
          </div>

          <ModeToggle />

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
