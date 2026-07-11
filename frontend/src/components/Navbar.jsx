// ColdGuard navigation bar
// Provides navigation between protected pages.

import { Link } from "react-router-dom";
// React Router navigation
import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  // Logout current user
  function handleLogout() {

  // Remove JWT token from browser storage
  localStorage.removeItem("token");

  // Redirect to login page
  navigate("/");

  }

  return (

    <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark mx-1 mt-2 px-2"
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
    >

      <div className="container-fluid px-4">

        {/* Application title */}

        <span
        className="navbar-brand fw-bold fs-4 ms-2 d-flex align-items-center"
        style={{ letterSpacing: "0.5px" }}
        >
        <span className="me-2">🧊</span>
        ColdGuard
        </span>

        {/* Navigation links */}

        <div className="navbar-nav">

          <Link
            className="nav-link"
            to="/dashboard"
          >
            Dashboard
          </Link>

          <Link
            className="nav-link"
            to="/temperature"
          >
            Temperature
          </Link>

          <Link className="nav-link" 
                to="/thresholds"
          >
            Thresholds
          </Link>

          <Link
            className="nav-link"
            to="/temperature-insights"
          >
            Insights
          </Link>

          <Link
            className="nav-link"
            to="/alerts"
          >
            Alerts
          </Link>

          <Link
            className="nav-link"
            to="/reports"
          >
            Reports
          </Link>

          <Link
            className="nav-link"
            to="/ai-risk-advisor"
          >
            Operational Advisor
          </Link>

          <Link
            className="nav-link"
            to="/"
            onClick={handleLogout}
          >
            Logout
          </Link>

        </div>

      </div>

    </nav>

  );
}

export default Navbar;