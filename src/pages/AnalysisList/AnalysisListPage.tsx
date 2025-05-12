import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen } from 'lucide-react';
import AnalysisWizard from '../../components/Analysis/AnalysisWizard';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface Analysis {
  id: string;
  nome: string;
}

const AnalysisListPage: React.FC = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalyses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://flippings.com.br/analises?usuario_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyses(data);
      } else {
        toast.error('Erro ao carregar análises');
      }
    } catch (error) {
      toast.error('Erro ao carregar análises');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, [userId]);

  const handleCreateAnalysis = async (wizardData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://flippings.com.br/analises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario: userId,
          nome: wizardData.nome.trim(),
          margem_area_pct: wizardData.margem_area_pct,
          reducao_pct: wizardData.reducao_pct,
          param_entrada_pct: wizardData.param_entrada_pct,
          param_itbi_pct: wizardData.param_itbi_pct,
          param_avaliacao_bancaria: wizardData.param_avaliacao_bancaria,
          param_registro_cartorio_pct: wizardData.param_registro_cartorio_pct,
          param_custo_reforma_pct: wizardData.param_custo_reforma_pct,
          param_taxa_cet: wizardData.param_taxa_cet,
          param_prazo_financiamento: wizardData.param_prazo_financiamento,
          param_tempo_venda: wizardData.param_tempo_venda,
          param_corretagem_venda_pct: wizardData.param_corretagem_venda_pct,
          param_desconto_valor_compra: wizardData.param_desconto_valor_compra
        })
      });

      if (response.ok) {
        setIsWizardOpen(false);
        fetchAnalyses();
        toast.success('Análise criada com sucesso');
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
            onClick={() => setIsWizardOpen(true)}
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
              onClick={() => navigate(`/analysis/${analysis.id}/dashboard`, { state: { id_analise: analysis.id } })}
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

      <AnalysisWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleCreateAnalysis}
      />
    </div>
  );
};

export default AnalysisListPage;