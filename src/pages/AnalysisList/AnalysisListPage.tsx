import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';

interface Analysis {
  id: string;
  nome: string;
}

const AnalysisListPage: React.FC = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isNewAnalysisModalOpen, setIsNewAnalysisModalOpen] = useState(false);
  const [newAnalysisName, setNewAnalysisName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalyses = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://flippings.com.br/analises?usuario_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyses(data);
      } else {
        toast.error('Erro ao carregar análises');
      }
    } catch (error) {
      toast.error('Erro ao carregar análises');
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const handleCreateAnalysis = async () => {
    if (!newAnalysisName.trim()) return;

    setIsLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('https://flippings.com.br/analises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario: userId,
          nome: newAnalysisName.trim()
        })
      });

      if (response.ok) {
        setIsNewAnalysisModalOpen(false);
        setNewAnalysisName('');
        fetchAnalyses();
      } else {
        toast.error('Erro ao criar análise');
      }
    } catch (error) {
      toast.error('Erro ao criar análise');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Minhas Análises</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie suas análises de oportunidades
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
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <FolderOpen size={24} className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {analysis.nome}
                    </h3>
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

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsNewAnalysisModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateAnalysis}
                disabled={!newAnalysisName.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Criando...' : 'Criar Análise'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisListPage;