import React from 'react';
import { ArrowLeft, LogOut, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center h-16 px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-900 focus:outline-none flex items-center"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} className="mr-2" />
            <span className="text-sm">Voltar</span>
          </button>

          <button
            type="button"
            className="text-gray-600 hover:text-gray-900 focus:outline-none flex items-center"
            onClick={() => navigate('/analyses')}
          >
            <FolderOpen size={20} className="mr-2" />
            <span className="text-sm">Minhas Análises</span>
          </button>
        </div>

        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-gray-800">FlipInvest</h1>
        </div>

        <button
          type="button"
          className="text-gray-600 hover:text-gray-900 focus:outline-none flex items-center"
          onClick={logout}
        >
          <LogOut size={20} className="mr-2" />
          <span className="text-sm">Sair</span>
        </button>
      </div>
    </header>
  );
};

export default Header;