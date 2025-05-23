import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/Login/LoginPage";
import AnalysisListPage from "./pages/AnalysisList/AnalysisListPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import PropertiesPage from "./pages/Properties/PropertiesPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import AnalysisPage from "./pages/Analysis/AnalysisPage";
import IndividualAnalysisPage from "./pages/Analysis/IndividualAnalysisPage";
import { AnalysisProvider } from "./context/AnalysisContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnalysisProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/analyses" element={<AnalysisListPage />} />
            <Route
              path="/individual-analyses"
              element={<IndividualAnalysisPage />}
            />
            <Route
              path="/analysis/:id/*"
              element={
                <Routes>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="properties" element={<PropertiesPage />} />
                  <Route
                    path="property/:propertyId"
                    element={<AnalysisPage />}
                  />
                  <Route path="property" element={<AnalysisPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Routes>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnalysisProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
