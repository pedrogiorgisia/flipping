import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import AnalysisListPage from './pages/AnalysisList/AnalysisListPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PropertiesPage from './pages/Properties/PropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetails/PropertyDetailsPage';
import SettingsPage from './pages/Settings/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/analyses" element={<AnalysisListPage />} />
        
        {/* Rotas específicas de análise */}
        <Route path="/analysis/:analysisId">
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="property/:propertyId" element={<PropertyDetailsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;