
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { Home, DollarSign, Filter } from "lucide-react";
import DashboardStats from "./DashboardStats";
import PropertyList from "./PropertyList";
import toast from "react-hot-toast";

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
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    minROI: "",
    maxROI: "",
    minArea: "",
    maxArea: "",
    minPrice: "",
    maxPrice: "",
    renovated: "all",
    sortBy: "roi",
  });

  useEffect(() => {
    if (effectiveAnalysisId) {
      sessionStorage.setItem("idAnalise", effectiveAnalysisId);
    }
  }, [effectiveAnalysisId]);

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

  const getFilteredProperties = () => {
    return properties.filter((property) => {
      const meetsROIFilter =
        (!filters.minROI || property.calc_roi >= Number(filters.minROI) / 100) &&
        (!filters.maxROI || property.calc_roi <= Number(filters.maxROI) / 100);

      const meetsAreaFilter =
        (!filters.minArea || property.imovel.area >= Number(filters.minArea)) &&
        (!filters.maxArea || property.imovel.area <= Number(filters.maxArea));

      const meetsPriceFilter =
        (!filters.minPrice ||
          property.imovel.preco_anunciado >= Number(filters.minPrice)) &&
        (!filters.maxPrice ||
          property.imovel.preco_anunciado <= Number(filters.maxPrice));

      return meetsROIFilter && meetsAreaFilter && meetsPriceFilter;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case "roi":
          return b.calc_roi - a.calc_roi;
        case "price":
          return b.imovel.preco_anunciado - a.imovel.preco_anunciado;
        case "area":
          return b.imovel.area - a.imovel.area;
        default:
          return 0;
      }
    });
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

  const stats = summary
    ? [
        {
          label: "Imóveis Analisados",
          value: summary.reformados + summary.nao_reformados,
          secondaryLabel: "Total de imóveis",
          icon: <Home size={20} className="text-blue-600" />,
          color: "bg-blue-100",
        },
        {
          label: "Valor médio m² Total",
          value: formatCurrency(
            (summary.preco_m2_medio_reformado +
              summary.preco_m2_medio_nao_reformado) /
              2,
          ),
          secondaryLabel: "Média geral",
          icon: <DollarSign size={20} className="text-green-600" />,
          color: "bg-green-100",
        },
        {
          label: "ROI Médio",
          value: summary.calc_roi
            ? `${(summary.calc_roi * 100).toFixed(1)}%`
            : "N/A",
          secondaryLabel: "Retorno sobre investimento",
          icon: <DollarSign size={20} className="text-purple-600" />,
          color: "bg-purple-100",
        },
      ]
    : [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral da sua análise</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-full p-3 ${stat.color}`}>{stat.icon}</div>
                <span className="text-sm text-gray-500">
                  {stat.secondaryLabel}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Oportunidades
              </h2>
              <button
                onClick={() =>
                  document
                    .getElementById("filtersSection")
                    ?.classList.toggle("hidden")
                }
                className="text-gray-600 hover:text-gray-900"
              >
                <Filter size={20} />
              </button>
            </div>

            <div id="filtersSection" className="hidden space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-700">ROI (%)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minROI}
                      onChange={(e) =>
                        setFilters({ ...filters, minROI: e.target.value })
                      }
                      placeholder="Min"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="number"
                      value={filters.maxROI}
                      onChange={(e) =>
                        setFilters({ ...filters, maxROI: e.target.value })
                      }
                      placeholder="Max"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700">Área (m²)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minArea}
                      onChange={(e) =>
                        setFilters({ ...filters, minArea: e.target.value })
                      }
                      placeholder="Min"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="number"
                      value={filters.maxArea}
                      onChange={(e) =>
                        setFilters({ ...filters, maxArea: e.target.value })
                      }
                      placeholder="Max"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700">Preço</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, minPrice: e.target.value })
                      }
                      placeholder="Min"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value })
                      }
                      placeholder="Max"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value })
                    }
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="roi">Ordenar por ROI</option>
                    <option value="price">Ordenar por Preço</option>
                    <option value="area">Ordenar por Área</option>
                  </select>
                </div>
                <button
                  onClick={() =>
                    setFilters({
                      minROI: "",
                      maxROI: "",
                      minArea: "",
                      maxArea: "",
                      minPrice: "",
                      maxPrice: "",
                      renovated: "all",
                      sortBy: "roi",
                    })
                  }
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          </div>

          <PropertyList properties={getFilteredProperties()} />
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
