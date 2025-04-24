import React from 'react';
import MainLayout from '../../components/Layout/MainLayout';

const OpportunitiesPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Opportunities</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {/* Opportunities content will go here */}
          <p className="text-gray-600">Opportunities analysis dashboard</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default OpportunitiesPage;