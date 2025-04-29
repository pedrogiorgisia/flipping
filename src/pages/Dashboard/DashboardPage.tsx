
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import { Home, DollarSign } from 'lucide-react';
import DashboardStats from './DashboardStats';
import PropertyList from './PropertyList';
import toast from 'react-hot-toast';

interface DashboardSummary {
  reformados: number;
  preco_medio_reformado: number;
  nao_reformados: number;
  preco_medio_nao_reformado: number;
}

interface Property {
  imovel: {
    endereco: string;
    area: number;
    preco_anunciado: number;
    url: string;
  };
  id_simulacao: string;
  valor_compra: number;
  valor_m2_compra: number;
  reforma_rs: number;
  valor_m2_venda: number;
  roi_liquido: number;
}

const DashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const id_analise = id || (location.state as any)?.id_analise;
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [roiDistribution, setRoiDistribution] = useState<{range: string, count: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch summary data
        const summaryResponse = await fetch(`https://flippings.com.br/imoveis/resumo?id_analise=${id_analise}`);
        if (!summaryResponse.ok) throw new Error('Erro ao carregar resumo');
        const summaryData = await summaryResponse.json();
        setSummary(summaryData);

        // Fetch properties data
        const propertiesResponse = await fetch(`https://flippings.com.br/simulacoes?id_analise=${id_analise}&simulacao_principal=true`);
        if (!propertiesResponse.ok) throw new Error('Erro ao carregar simulações');
        const propertiesData = await propertiesResponse.json();
        setProperties(propertiesData);

        // Calculate ROI distribution
        const distribution = [
          { range: '>30%', count: propertiesData.filter((p: Property) => p.roi_liquido > 0.30).length },
          { range: '20-30%', count: propertiesData.filter((p: Property) => p.roi_liquido > 0.20 && p.roi_liquido <= 0.30).length },
          { range: '15-20%', count: propertiesData.filter((p: Property) => p.roi_liquido > 0.15 && p.roi_liquido <= 0.20).length },
          { range: '<15%', count: propertiesData.filter((p: Property) => p.roi_liquido <= 0.15).length }
        ];
        setRoiDistribution(distribution);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (id_analise) {
      fetchData();
    }
  }, [id_analise]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-600">Carregando...</div>
        </div>
      </MainLayout>
    );
  }

  const stats = summary ? [
    {
      label: 'Quantidade de Reformados',
      value: summary.reformados,
      icon: <Home size={20} className="text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      label: 'Preço Médio Reformados',
      value: formatCurrency(summary.preco_medio_reformado),
      icon: <DollarSign size={20} className="text-green-600" />,
      color: 'bg-green-100'
    },
    {
      label: 'Quantidade Não Reformados',
      value: summary.nao_reformados,
      icon: <Home size={20} className="text-purple-600" />,
      color: 'bg-purple-100'
    },
    {
      label: 'Preço Médio Não Reformados',
      value: formatCurrency(summary.preco_medio_nao_reformado),
      icon: <DollarSign size={20} className="text-orange-600" />,
      color: 'bg-orange-100'
    }
  ] : [];

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral da sua análise</p>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-3 bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Distribuição de ROI</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {roiDistribution.map((item) => (
                <div key={item.range} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500">{item.range} ROI</div>
                  <div className="text-lg font-medium text-gray-900">{item.count} imóveis</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {properties.length > 0 && (
        <div className="mt-6">
          <PropertyList properties={properties} />
        </div>
      )}
    </MainLayout>
  );
};

export default DashboardPage;
