import React, { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import { Home, DollarSign, PieChart } from 'lucide-react';
import DashboardStats from './DashboardStats';
import PropertyList from './PropertyList';

const DashboardPage: React.FC = () => {
  const [selectedRoiRange, setSelectedRoiRange] = useState<string | null>(null);

  const stats = [
    { 
      label: 'Quantidade de Reformados', 
      value: '15', 
      change: '+2', 
      positive: true,
      icon: <Home size={20} className="text-blue-600" />,
      color: 'bg-blue-100'
    },
    { 
      label: 'Preço Médio Reformados', 
      value: 'R$ 850.000', 
      change: '+5,2%', 
      positive: true,
      icon: <DollarSign size={20} className="text-green-600" />,
      color: 'bg-green-100'
    },
    { 
      label: 'Quantidade Não Reformados', 
      value: '32', 
      change: '+8', 
      positive: true,
      icon: <Home size={20} className="text-purple-600" />,
      color: 'bg-purple-100'
    },
    { 
      label: 'Preço Médio Não Reformados', 
      value: 'R$ 520.000', 
      change: '+3,1%', 
      positive: true,
      icon: <DollarSign size={20} className="text-orange-600" />,
      color: 'bg-orange-100'
    }
  ];

  const roiDistribution = [
    { range: '>30%', count: 5, percentage: 15, color: 'bg-green-600' },
    { range: '20-30%', count: 12, percentage: 35, color: 'bg-blue-600' },
    { range: '15-20%', count: 10, percentage: 30, color: 'bg-yellow-500' },
    { range: '<15%', count: 7, percentage: 20, color: 'bg-red-500' }
  ];

  const handleRoiRangeClick = (range: string) => {
    setSelectedRoiRange(selectedRoiRange === range ? null : range);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral da sua análise de oportunidades</p>
      </div>

      <DashboardStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-3 bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <PieChart size={20} className="mr-2 text-blue-600" />
              Distribuição de ROI
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {roiDistribution.map((item) => (
                <button
                  key={item.range}
                  onClick={() => handleRoiRangeClick(item.range)}
                  className={`rounded-lg p-4 transition-all duration-200 ${
                    selectedRoiRange === item.range
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-sm text-gray-500">{item.range} ROI</div>
                  <div className="text-lg font-medium text-gray-900">{item.count} imóveis</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`${item.color} h-2 rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Oportunidades</h3>
          </div>
          <PropertyList selectedRoiRange={selectedRoiRange} />
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;