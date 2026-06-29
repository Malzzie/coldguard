// Main application router
// Controls navigation between frontend pages.

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Temperature from "./pages/Temperature";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import AIRiskAdvisor from "./pages/AIRiskAdvisor";
import TemperatureInsights from "./pages/TemperatureInsights";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Authentication */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* Inventory Dashboard */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Temperature Monitoring */}

        <Route
          path="/temperature"
          element={
            <ProtectedRoute>
              <Temperature />
            </ProtectedRoute>
          }
        />

        {/* Alerts Dashboard */}

        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />

        {/* Reports Dashboard */}

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* AI Risk Advisor */}

        <Route
          path="/ai-risk-advisor"
          element={
            <ProtectedRoute>
              <AIRiskAdvisor />
            </ProtectedRoute>
          }
        />

        {/* Temperature Insights */}

        <Route
          path="/temperature-insights"
          element={
            <ProtectedRoute>
              <TemperatureInsights />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;