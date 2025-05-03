import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center h-16 px-4 md:px-6">
        <button
          type="button"
          className="text-gray-600 hover:text-gray-900 focus:outline-none flex items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="text-sm">Voltar</span>
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-gray-800">FlipInvest</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;