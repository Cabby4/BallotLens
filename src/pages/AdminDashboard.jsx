import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/admin-dashboard.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5001/api"
).replace(/\/$/, "");

function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  const [stats, setStats] = useState({
    totalAgents: 0,
    pendingAgents: 0,
    resultSheetsAwaitingReview: 0,
    publishedResultSheets: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("ballotLensToken");
    const savedUser = localStorage.getItem("ballotLensUser");

    if (!token || !savedUser) {
      navigate("/admin/login", { replace: true });
      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("ballotLensUser");
      navigate("/admin/login", { replace: true });
      return;
    }

    if (user.role !== "admin") {
      navigate("/observer/login", { replace: true });
      return;
    }

    setAdmin(user);

    let cancelled = false;

    async function loadStats() {
      setStatsLoading(true);
      setStatsError("");

      try {
        const response = await fetch(`${API_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load dashboard statistics."
          );
        }

        if (data.success && data.stats && !cancelled) {
          setStats(data.stats);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Admin statistics error:", error);
          setStatsError(
            error.message || "Unable to load dashboard statistics."
          );
        }
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("ballotLensToken");
    localStorage.removeItem("ballotLensUser");
    navigate("/admin/login", { replace: true });
  };

  if (!admin) {
    return <div className="admin-loading">Loading admin dashboard...</div>;
  }

  const dashboardCards = [
    {
      title: "Agent Management",
      description: "Review observer registrations and manage agent approvals.",
      icon: "👥",
      link: "/admin/agents",
      action: "Manage Agents",
    },
    {
      title: "Result Sheet Review",
      description: "Inspect uploaded result sheets and review submissions.",
      icon: "📋",
      link: "/admin/result-sheets",
      action: "Review Submissions",
    },
    {
      title: "Election Management",
      description: "Manage elections and monitor their progress.",
      icon: "🗳️",
      link: "/admin/elections",
      action: "Manage Elections",
    },
    {
      title: "Polling Units",
      description: "View and manage polling-unit records.",
      icon: "📍",
      link: "/admin/polling-units",
      action: "View Polling Units",
    },
    {
      title: "Candidates & Parties",
      description: "Manage candidate and political-party information.",
      icon: "🏛️",
      link: "/admin/candidates",
      action: "Manage Candidates",
    },
    {
      title: "Published Results",
      description: "Access published election results and verified records.",
      icon: "📊",
      link: "/admin/results",
      action: "View Results",
    },
  ];

  const statCards = [
    {
      title: "Total Agents",
      value: stats.totalAgents,
      description: "Registered observer accounts",
      icon: "👥",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingAgents,
      description: "Agents awaiting approval",
      icon: "⏳",
    },
    {
      title: "Awaiting Review",
      value: stats.resultSheetsAwaitingReview,
      description: "Result sheets awaiting review",
      icon: "📋",
    },
    {
      title: "Published Sheets",
      value: stats.publishedResultSheets,
      description: "Published result sheets",
      icon: "✓",
    },
  ];

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <Link to="/admin/dashboard" className="admin-brand">
          <span className="admin-brand-icon">B</span>
          <span>
            <strong>BallotLens</strong>
            <small>ADMINISTRATION</small>
          </span>
        </Link>

        <div className="admin-sidebar-label">WORKSPACE</div>

        <nav className="admin-navigation">
          <Link to="/admin/dashboard" className="admin-nav-link active">
            <span>▦</span> Dashboard
          </Link>

          <Link to="/admin/agents" className="admin-nav-link">
            <span>♙</span> Agents
          </Link>

          <Link to="/admin/result-sheets" className="admin-nav-link">
            <span>▤</span> Result Sheets
          </Link>

          <Link to="/admin/elections" className="admin-nav-link">
            <span>◉</span> Elections
          </Link>

          <Link to="/admin/polling-units" className="admin-nav-link">
            <span>⌖</span> Polling Units
          </Link>

          <Link to="/admin/candidates" className="admin-nav-link">
            <span>♧</span> Candidates & Parties
          </Link>

          <Link to="/admin/results" className="admin-nav-link">
            <span>▥</span> Published Results
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-avatar">A</div>

          <div className="admin-user-info">
            <strong>
              {admin.full_name || admin.name || "Administrator"}
            </strong>
            <small>Administrator</small>
          </div>

          <button
            type="button"
            className="admin-logout-icon"
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
          >
            ↗
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-eyebrow">
              BALLOTLENS CONTROL CENTRE
            </span>
            <h1>Admin Dashboard</h1>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </header>

        <section className="admin-welcome">
          <div>
            <span className="admin-welcome-tag">
              ADMINISTRATOR ACCESS
            </span>

            <h2>
              Welcome back, {admin.full_name || admin.name || "Admin"}!
            </h2>

            <p>
              Manage election data, review observer submissions, and oversee
              the verification and publication process from one place.
            </p>
          </div>

          <div className="admin-welcome-icon">🗳️</div>
        </section>

        <section className="admin-stats-section">
          <div className="admin-stats-heading">
            <div>
              <h2>Election Operations Overview</h2>
              <p>Live statistics from your BallotLens database.</p>
            </div>

            {statsLoading && <span>Loading statistics...</span>}
          </div>

          {statsError && (
            <div className="admin-stats-error" role="alert">
              <p>{statsError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          <div className="admin-stats-grid">
            {statCards.map((card) => (
              <article className="admin-stat-card" key={card.title}>
                <div className="admin-stat-icon">{card.icon}</div>
                <p>{card.title}</p>
                <h3>
                  {statsLoading ? "—" : card.value.toLocaleString()}
                </h3>
                <span>{card.description}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <h2>Administration Modules</h2>
              <p>Select an area to manage BallotLens.</p>
            </div>
          </div>

          <div className="admin-module-grid">
            {dashboardCards.map((card) => (
              <article className="admin-module-card" key={card.title}>
                <div className="admin-module-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>

                <Link to={card.link} className="admin-module-link">
                  {card.action} <span>→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <footer className="admin-dashboard-footer">
          <span>BallotLens Administration</span>
          <span>
            Election transparency through accountable verification.
          </span>
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;