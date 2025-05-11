import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { Home, DollarSign, Plus } from "lucide-react";
import PropertyList from "./PropertyList";
import toast from "react-hot-toast";
import NewPropertyModal from "../../components/Properties/NewPropertyModal";

interface DashboardSummary {
  reformados: number;
  calc_roi;
  preco_m2_medio_reformado: number;
  nao_reformados: number;
  preco_m2_medio_nao_reformado: number;
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
  param_custo_reforma: number;
  valor_m2_venda: number;
  calc_roi: number;
}

const useEffectiveAnalysisId = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const analysisIdFromParams = id;
  const analysisIdFromState = (location.state as any)?.id_analise;

  return analysisIdFromParams || analysisIdFromState || null;
};



const DashboardPage: React.FC = () => {
  const effectiveAnalysisId = useEffectiveAnalysisId();

  useEffect(() => {
    if (effectiveAnalysisId) {
      sessionStorage.setItem("idAnalise", effectiveAnalysisId);
    }
  }, [effectiveAnalysisId]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [roiDistribution, setRoiDistribution] = useState<
    { range: string; count: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoiRange, setSelectedRoiRange] = useState<string | null>(null);
  const [enderecoFilter, setEnderecoFilter] = useState("");
  const [areaMinFilter, setAreaMinFilter] = useState("");
  const [areaMaxFilter, setAreaMaxFilter] = useState("");
  const [precoAnunciadoMinFilter, setPrecoAnunciadoMinFilter] = useState("");
  const [precoAnunciadoMaxFilter, setPrecoAnunciadoMaxFilter] = useState("");
  const [roiMinFilter, setRoiMinFilter] = useState("");
    const [isNewPropertyModalOpen, setIsNewPropertyModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const summaryResponse = await fetch(
          `https://flippings.com.br/imoveis/resumo?id_analise=${effectiveAnalysisId}`,
        );
        if (!summaryResponse.ok) throw new Error("Erro ao carregar resumo");
        const summaryData = await summaryResponse.json();
        setSummary(summaryData);

        const propertiesResponse = await fetch(
          `https://flippings.com.br/simulacoes?id_analise=${effectiveAnalysisId}&simulacao_principal=true&reformado=false`,
        );
        if (!propertiesResponse.ok)
          throw new Error("Erro ao carregar simulações");
        const propertiesData = await propertiesResponse.json();
        setProperties(propertiesData);

        const distribution = [
          {
            range: ">30%",
            count: propertiesData.filter((p: Property) => p.calc_roi > 0.3)
              .length,
          },
          {
            range: "20-30%",
            count: propertiesData.filter(
              (p: Property) => p.calc_roi > 0.2 && p.calc_roi <= 0.3,
            ).length,
          },
          {
            range: "15-20%",
            count: propertiesData.filter(
              (p: Property) => p.calc_roi > 0.15 && p.calc_roi <= 0.2,
            ).length,
          },
          {
            range: "<15%",
            count: propertiesData.filter((p: Property) => p.calc_roi <= 0.15)
              .length,
          },
        ];
        setRoiDistribution(distribution);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Erro ao carregar dados do dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    if (effectiveAnalysisId) {
      fetchData();
    }
  }, [effectiveAnalysisId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getFilteredProperties = useCallback(() => {
    return properties.filter((property) => {
      const roiPercentage = property.calc_roi * 100;
      return (
        property.imovel.endereco
          .toLowerCase()
          .includes(enderecoFilter.toLowerCase()) &&
        (areaMinFilter === "" ||
          property.imovel.area >= parseFloat(areaMinFilter)) &&
        (areaMaxFilter === "" ||
          property.imovel.area <= parseFloat(areaMaxFilter)) &&
        (precoAnunciadoMinFilter === "" ||
          property.imovel.preco_anunciado >=
            parseFloat(precoAnunciadoMinFilter)) &&
        (precoAnunciadoMaxFilter === "" ||
          property.imovel.preco_anunciado <=
            parseFloat(precoAnunciadoMaxFilter)) &&
        (roiMinFilter === "" || roiPercentage >= parseFloat(roiMinFilter))
      );
    });
  }, [
    properties,
    enderecoFilter,
    areaMinFilter,
    areaMaxFilter,
    precoAnunciadoMinFilter,
    precoAnunciadoMaxFilter,
    roiMinFilter,
  ]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-600">Carregando...</div>
        </div>
      </MainLayout>
    );
  }

  const stats = summary
    ? [
        {
          label: "Quantidade de Reformados",
          value: summary.reformados,
          icon: <Home size={20} className="text-blue-600" />,
          color: "bg-blue-100",
        },
        {
          label: "Valor médio m² Reformados",
          value: formatCurrency(summary.preco_m2_medio_reformado),
          icon: <DollarSign size={20} className="text-green-600" />,
          color: "bg-green-100",
        },
        {
          label: "Quantidade Não Reformados",
          value: summary.nao_reformados,
          icon: <Home size={20} className="text-purple-600" />,
          color: "bg-purple-100",
        },
        {
          label: "Valor médio m² Não Reformados",
          value: formatCurrency(summary.preco_m2_medio_nao_reformado),
          icon: <DollarSign size={20} className="text-orange-600" />,
          color: "bg-orange-100",
        },
      ]
    : [];

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral da sua análise</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-lg p-4 shadow`}>
            <div className="flex items-center">
              <div className={`${stat.color} rounded-full p-2 mr-3`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Oportunidades</h2>
            <p className="text-gray-600">
              Lista de simulações de investimento para os apartamentos não
              reformados
            </p>
          </div>
          <button
            onClick={() => setIsNewPropertyModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent bg-blue-600 text-sm font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-2" />
            Novo Imóvel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
          <div>
            <label
              htmlFor="enderecoFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Endereço
            </label>
            <input
              type="text"
              id="enderecoFilter"
              value={enderecoFilter}
              onChange={(e) => setEnderecoFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Filtrar por endereço"
            />
          </div>
          <div>
            <label
              htmlFor="areaMinFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Área Mínima (m²)
            </label>
            <input
              type="number"
              id="areaMinFilter"
              value={areaMinFilter}
              onChange={(e) => setAreaMinFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Área mínima"
            />
          </div>
          <div>
            <label
              htmlFor="areaMaxFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Área Máxima (m²)
            </label>
            <input
              type="number"
              id="areaMaxFilter"
              value={areaMaxFilter}
              onChange={(e) => setAreaMaxFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Área máxima"
            />
          </div>
          <div>
            <label
              htmlFor="precoAnunciadoMinFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Preço Anunciado Mín.
            </label>
            <input
              type="number"
              id="precoAnunciadoMinFilter"
              value={precoAnunciadoMinFilter}
              onChange={(e) => setPrecoAnunciadoMinFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Preço mínimo"
            />
          </div>
          <div>
            <label
              htmlFor="precoAnunciadoMaxFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Preço Anunciado Máx.
            </label>
            <input
              type="number"
              id="precoAnunciadoMaxFilter"
              value={precoAnunciadoMaxFilter}
              onChange={(e) => setPrecoAnunciadoMaxFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Preço máximo"
            />
          </div>
          <div>
            <label
              htmlFor="roiMinFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ROI Mínimo (%)
            </label>
            <input
              type="number"
              id="roiMinFilter"
              value={roiMinFilter}
              onChange={(e) => setRoiMinFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="ROI mínimo"
            />
          </div>
        </div>

        {properties.length > 0 && (
          <PropertyList properties={getFilteredProperties()} />
        )}
      </div>
      
      <NewPropertyModal
          isOpen={isNewPropertyModalOpen}
          onClose={() => setIsNewPropertyModalOpen(false)}
          onSave={() => {
            fetchData();
            setIsNewPropertyModalOpen(false);
          }}
          isReformed={false}
        />
    </MainLayout>
  );
};

export default DashboardPage;