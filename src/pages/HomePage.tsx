export function HomePage() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-icon">🏗</div>
        <h1 className="home-title">Welcome to the JDE Hierarchy Manager App</h1>
        <p className="home-descriptor">A Power App code app powered by Copilot Studio.</p>
      </div>

      <div className="home-cards">
        <div className="home-info-card">
          <div className="home-info-icon">📋</div>
          <div className="home-info-text">
            <strong>Reference Data</strong>
            <span>Manage Roles, Divisions, Groups, Segments, Ledger Types, Company Types, and OTCs from the navigation pane.</span>
          </div>
        </div>
        <div className="home-info-card">
          <div className="home-info-icon">✏️</div>
          <div className="home-info-text">
            <strong>Full CRUD</strong>
            <span>Add, edit, and delete records on every page using the built-in table and modal forms.</span>
          </div>
        </div>
        <div className="home-info-card">
          <div className="home-info-icon">🔍</div>
          <div className="home-info-text">
            <strong>Instant Search</strong>
            <span>Filter any table in real-time using the search box at the top of each page.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
