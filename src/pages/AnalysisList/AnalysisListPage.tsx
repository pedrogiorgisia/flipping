import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, Calendar, Home } from 'lucide-react';

interface Analysis {
  id: string;
  name: string;
  region: string;
  createdAt: Date;
  propertiesCount: number;
}

const AnalysisListPage: React.FC = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<Analysis[]>([
    {
      id: '1',
      name: 'Análise Pinheiros I',
      region: 'Pinheiros',
      createdAt: new Date('2024-01-15'),
      propertiesCount: 45
    },
    {
      id: '2',
      name: 'Análise Moema',
      region: 'Moema',
      createdAt: new Date('2024-02-01'),
      propertiesCount: 32
    },
    {
      id: '3',
      name: 'Análise Vila Mariana',
      region: 'Vila Mariana',
      createdAt: new Date('2024-02-15'),
      propertiesCount: 28
    }
  ]);

  const [isNewAnalysisModalOpen, setIsNewAnalysisModalOpen] = useState(false);
  const [newAnalysisName, setNewAnalysisName] = useState('');
  const [newAnalysisRegion, setNewAnalysisRegion] = useState('');

  const handleCreateAnalysis = () => {
    const newAnalysis: Analysis = {
      id: (analyses.length + 1).toString(),
      name: newAnalysisName,
      region: newAnalysisRegion,
      createdAt: new Date(),
      propertiesCount: 0
    };

    setAnalyses([...analyses, newAnalysis]);
    setIsNewAnalysisModalOpen(false);
    setNewAnalysisName('');
    setNewAnalysisRegion('');
    navigate(`/analysis/${newAnalysis.id}/dashboard`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Minhas Análises</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie suas análises de oportunidades por região
            </p>
          </div>
          <button
            onClick={() => setIsNewAnalysisModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={20} className="mr-2" />
            Nova Análise
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/analysis/${analysis.id}/dashboard`)}
            >
              <div className="p-5">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <FolderOpen size={24} className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {analysis.name}
                    </h3>
                    <p className="text-sm text-gray-500">{analysis.region}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Home size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-900">{analysis.propertiesCount} imóveis</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-500">{formatDate(analysis.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Analysis Modal */}
      {isNewAnalysisModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Nova Análise</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="analysis-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Análise
                </label>
                <input
                  type="text"
                  id="analysis-name"
                  value={newAnalysisName}
                  onChange={(e) => setNewAnalysisName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Análise Pinheiros I"
                />
              </div>
              
              <div>
                <label htmlFor="analysis-region" className="block text-sm font-medium text-gray-700 mb-1">
                  Região
                </label>
                <input
                  type="text"
                  id="analysis-region"
                  value={newAnalysisRegion}
                  onChange={(e) => setNewAnalysisRegion(e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Pinheiros"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsNewAnalysisModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateAnalysis}
                disabled={!newAnalysisName || !newAnalysisRegion}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar Análise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisListPage;