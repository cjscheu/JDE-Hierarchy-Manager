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
import { AppReviewPage } from './pages/AppReviewPage'
import { PageModeProvider } from './components/page-mode'
import { Cr113_user_securitiesService } from './generated/services/Cr113_user_securitiesService'
import { setCurrentAccessRole, type AccessRole } from './security/access'
import { ManagerAssignmentsPage } from './pages/ManagerAssignmentsPage'

const PRIMARY_NAV = [
  { id: 'home', label: 'Home', icon: '🏠', component: <HomePage />, hidden: false },
  { id: 'companies', label: 'Companies', icon: '🏢', component: <CompaniesPage />, hidden: false },
  { id: 'locations', label: 'JDE Locations', icon: '📍', component: <LocationsPage />, hidden: true },
  { id: 'managers', label: 'Managers', icon: '🧑‍💼', component: <ManagersHubPage />, hidden: false },
  { id: 'manager-assignments', label: 'Assignments', icon: '📋', component: <ManagerAssignmentsPage />, hidden: false },
] as const



const ADMIN_NAV = [
  { id: 'data-management', label: 'Data', icon: '🗄️', component: <DataManagementPage /> },
  { id: 'user-management', label: 'Users', icon: '👤', component: <UserManagementPage /> },
] as const

const SUPER_NAV = [
  { id: 'app-review', label: 'Data Tables', icon: '🧪', component: <AppReviewPage /> },
] as const

const NAV = [...PRIMARY_NAV, ...ADMIN_NAV, ...SUPER_NAV] as const

type NavId = typeof NAV[number]['id']

const APP_SECURITY_NAME = 'Dairy Brands Hierarchy Manager'
const BASIC_NAV: NavId[] = ['home']
const POWER_NAV: NavId[] = ['home', 'companies', 'managers']
const ADMIN_NAV_IDS: NavId[] = [...PRIMARY_NAV, ...ADMIN_NAV].map(item => item.id)
const SUPER_NAV_IDS: NavId[] = NAV.map(item => item.id)

function normalizeValue(value?: string | null) {
  return value?.trim().toLowerCase() ?? ''
}

function getAllowedNavIds(role: AccessRole) {
  if (role === 'super') return new Set<NavId>(SUPER_NAV_IDS)
  if (role === 'admin') return new Set<NavId>(ADMIN_NAV_IDS)
  if (role === 'power') return new Set<NavId>(POWER_NAV)
  return new Set<NavId>(BASIC_NAV)
}

function getAccessRoleForUser(
  records: Array<{ cr113_email?: string; cr113_username?: string; cr113_roletype?: 1 | 2 | 3; statecode?: 0 | 1 }>,
  userPrincipalName: string,
  fullName: string,
) {
  const matchingRecords = records.filter(record => {
    if (record.statecode === 1) {
      return false
    }

    const email = normalizeValue(record.cr113_email)
    const username = normalizeValue(record.cr113_username)

    return Boolean(
      (userPrincipalName && (email === userPrincipalName || username === userPrincipalName)) ||
      (fullName && username === fullName)
    )
  })

  if (matchingRecords.some(record => record.cr113_roletype === 3)) {
    return 'super'
  }

  if (matchingRecords.some(record => record.cr113_roletype === 1)) {
    return 'admin'
  }

  if (matchingRecords.some(record => record.cr113_roletype === 2)) {
    return 'power'
  }

  return 'basic'
}

function App() {
  const [activePage, setActivePage] = useState<NavId>('home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [refreshTime] = useState(() => new Date())
  const [networkUserName, setNetworkUserName] = useState('DFA network user')
  const [accessRole, setAccessRole] = useState<AccessRole>('basic')

  const allowedNavIds = getAllowedNavIds(accessRole)
  const visiblePrimaryNav = PRIMARY_NAV.filter(item => allowedNavIds.has(item.id) && !item.hidden)
  const visibleAdminNav = ADMIN_NAV.filter(item => allowedNavIds.has(item.id))
  const visibleSuperNav = SUPER_NAV.filter(item => allowedNavIds.has(item.id))

  const active = NAV.find(n => n.id === activePage) ?? NAV[0]

  useEffect(() => {
    let isActive = true

    const loadCurrentUser = async () => {
      try {
        const context = await getContext()
        const fullName = context.user.fullName?.trim()
        const userPrincipalName = context.user.userPrincipalName?.trim()
        const normalizedFullName = normalizeValue(fullName)
        const normalizedUserPrincipalName = normalizeValue(userPrincipalName)

        const accessRes = await Cr113_user_securitiesService.getAll({
          filter: `cr113_application eq '${APP_SECURITY_NAME}'`,
          select: ['cr113_email', 'cr113_username', 'cr113_roletype', 'statecode'],
        })

        if (!isActive) {
          return
        }

        setNetworkUserName(fullName || userPrincipalName || 'DFA network user')
        const resolvedRole = getAccessRoleForUser(
          accessRes.data ?? [],
          normalizedUserPrincipalName,
          normalizedFullName,
        )
        setAccessRole(resolvedRole)
        setCurrentAccessRole(resolvedRole)
      } catch {
        if (isActive) {
          setNetworkUserName('DFA network user')
          setAccessRole('basic')
          setCurrentAccessRole('basic')
        }
      }
    }

    loadCurrentUser()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    if (!allowedNavIds.has(activePage)) {
      setActivePage('home')
    }
  }, [activePage, accessRole])

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
          {visiblePrimaryNav.map(item => (
            <button
              key={item.id}
              className={`side-nav-btn${activePage === item.id ? ' active' : ''}`}
              onClick={() => setActivePage(item.id as NavId)}
            >
              <span style={{ marginRight: 10 }} aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}

          {visibleAdminNav.length > 0 && (
            <>
              <div className="side-nav-divider" role="presentation" />
              <div className="side-nav-section-label">Admin Management</div>

              <div className="side-nav-group">
                {visibleAdminNav.map(item => (
                  <button
                    key={item.id}
                    className={`side-nav-btn side-nav-btn-sub${activePage === item.id ? ' active' : ''}`}
                    onClick={() => setActivePage(item.id as NavId)}
                  >
                    <span style={{ marginRight: 10 }} aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {accessRole === 'super' && visibleSuperNav.length > 0 && (
            <>
              <div className="side-nav-divider" role="presentation" />
              <div className="side-nav-section-label">Super Management</div>

              <div className="side-nav-group">
                {visibleSuperNav.map(item => (
                  <button
                    key={item.id}
                    className={`side-nav-btn side-nav-btn-sub${activePage === item.id ? ' active' : ''}`}
                    onClick={() => setActivePage(item.id as NavId)}
                  >
                    <span style={{ marginRight: 10 }} aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="network-user" aria-label="DFA network user">
            <UserRound className="network-user-icon" size={18} aria-hidden="true" />
            <span className="network-user-text">{networkUserName}</span>
            <span className={`role-badge role-badge-${accessRole}`}>{accessRole.charAt(0).toUpperCase() + accessRole.slice(1)}</span>
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
            {active.id === 'data-management' ? (
              <PageModeProvider mode="data">
                <DataManagementPage accessRole={accessRole} />
              </PageModeProvider>
            ) : active.id === 'app-review' ? (
              <PageModeProvider mode="app-review">
                <AppReviewPage />
              </PageModeProvider>
            ) : active.id === 'user-management' ? (
              <UserManagementPage accessRole={accessRole} />
            ) : (
              active.component
            )}
          </PageModeProvider>
        </main>
      </div>
    </div>
  )
}

export default App
