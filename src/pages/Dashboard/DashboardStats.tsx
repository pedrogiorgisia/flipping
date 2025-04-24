import React from 'react';

interface Stat {
  label: string;
  value: string | number;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  color: string;
}

interface DashboardStatsProps {
  stats: Stat[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="ml-5">
                <div className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          </div>
          <div className={`px-5 py-2 ${stat.positive ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'} text-right`}>
              <span className="font-medium">{stat.change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;