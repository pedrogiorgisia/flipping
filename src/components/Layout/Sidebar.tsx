import React from 'react';
import { Home, Database, FileText, Settings } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150 ease-in-out
        ${isActive
          ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
        }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { analysisId } = useParams();
  const currentPath = location.pathname;

  const navItems = [
    { 
      to: `/analysis/${analysisId}/dashboard`, 
      icon: <Home size={20} />, 
      label: 'Dashboard' 
    },
    { 
      to: `/analysis/${analysisId}/properties`, 
      icon: <Database size={20} />, 
      label: 'Base de Imóveis' 
    },
    { 
      to: `/analysis/${analysisId}/settings`, 
      icon: <Settings size={20} />, 
      label: 'Parâmetros' 
    },
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">FlipInvest</h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={currentPath === item.to}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;