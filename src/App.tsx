
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import AnalysisListPage from './pages/AnalysisList/AnalysisListPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PropertiesPage from './pages/Properties/PropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetails/PropertyDetailsPage';
import SettingsPage from './pages/Settings/SettingsPage';
import AnalysisPage from './pages/Analysis/AnalysisPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/analyses" element={<AnalysisListPage />} />
        <Route path="/analysis/:analysisId/dashboard" element={<DashboardPage />} />
        <Route path="/analysis/:analysisId/properties" element={<PropertiesPage />} />
        <Route path="/analysis/:analysisId/property" element={<AnalysisPage />} />
        <Route path="/analysis/:analysisId/property/:propertyId" element={<PropertyDetailsPage />} />
        <Route path="/analysis/:analysisId/settings" element={<SettingsPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
