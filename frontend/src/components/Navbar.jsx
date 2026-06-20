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

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

      <div className="container">

        {/* Application title */}

        <span className="navbar-brand">
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