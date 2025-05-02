import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import PropertyDetails from "./PropertyDetails";
import ReferenceProperties from "./ReferenceProperties";
import CalculationParameters from "./CalculationParameters";
import AnalysisResults from "./AnalysisResults";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getSimulacoes, getReferenciaSimulacao } from "../../api";

const AnalysisPage: React.FC = () => {
  // useParams().propertyId é o ID da simulação que você quer buscar
  const { propertyId: simulationId } = useParams<{ propertyId: string }>();

  const [simulacao, setSimulacao] = useState<any>(null);
  const [referenciasSimulacao, setReferenciasSimulacao] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedSections, setExpandedSections] = useState({
    propertyDetails: true,
    analysisAndParameters: true,
    referenceProperties: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!simulationId) {
        setError("ID da simulação não encontrado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // ----------------------------
        // 👉 Chama /simulacoes/<simulationId>
        const simulacaoData = await getSimulacoes(simulationId);
        console.log("Dados da simulação:", simulacaoData);
        setSimulacao(simulacaoData);

        // ----------------------------
        // 👉 Chama /referencia-simulacao?id_simulacao=<simulationId>
        const referenciasData = await getReferenciaSimulacao(simulationId);
        console.log("Dados das referências:", referenciasData);
        setReferenciasSimulacao(referenciasData);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError(
          `Erro ao carregar os dados da simulação: ${(err as Error).message}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [simulationId]);

  const handleParameterChange = (field: string, value: any) => {
    setSimulacao((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const recalculateValues = () => {
    console.log("Recalculating values with parameters:", simulacao);
    // Implemente a lógica de recálculo aqui
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  if (!simulacao) return <div>Nenhuma simulação encontrada</div>;

  const analysisResults = {
    acquisitionCosts: {
      downPayment: simulacao.valor_compra * (simulacao.entrada_pct / 100),
      itbi: simulacao.valor_compra * (simulacao.itbi_pct / 100),
      bankAppraisal: simulacao.avaliacao_banco_rs,
      registry: simulacao.cartorio_rs,
      total:
        simulacao.valor_compra * (simulacao.entrada_pct / 100) +
        simulacao.valor_compra * (simulacao.itbi_pct / 100) +
        simulacao.avaliacao_banco_rs +
        simulacao.cartorio_rs,
    },
    holdingCosts: {
      financing: simulacao.calc_parcelas_rs,
      condo: simulacao.calc_condominio_rs,
      utilities: simulacao.contas_gerais_rs,
      renovation: simulacao.reforma_rs,
      total:
        simulacao.calc_parcelas_rs +
        simulacao.calc_condominio_rs +
        simulacao.contas_gerais_rs +
        simulacao.reforma_rs,
    },
    sellingCosts: {
      financingPayoff: simulacao.calc_quitacao_rs,
      brokerage:
        simulacao.valor_compra * (simulacao.corretagem_venda_pct / 100),
      incomeTax: simulacao.ir_pago
        ? (simulacao.valor_compra * simulacao.valor_m2_venda -
            simulacao.valor_compra) *
          0.15
        : 0,
    },
    totalInvestment: simulacao.valor_compra,
    salePrice: simulacao.valor_compra * simulacao.valor_m2_venda,
    netProfit: simulacao.roi_liquido * simulacao.valor_compra,
    roi: simulacao.roi_liquido * 100,
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Simulação e Investimento
        </h1>

        <div className="space-y-8">
          <Section
            title="Detalhes do Imóvel"
            expanded={expandedSections.propertyDetails}
            onToggle={() => toggleSection("propertyDetails")}
          >
            <PropertyDetails property={simulacao.imovel} />
          </Section>

          <Section
            title="Análise e Parâmetros"
            expanded={expandedSections.analysisAndParameters}
            onToggle={() => toggleSection("analysisAndParameters")}
          >
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CalculationParameters
                  parameters={simulacao}
                  onParameterChange={handleParameterChange}
                  onRecalculate={recalculateValues}
                />
                <AnalysisResults results={analysisResults} />
              </div>
              {/* ... resumo do investimento ... */}
            </div>
          </Section>

          <Section
            title="Imóveis de Referência"
            expanded={expandedSections.referenceProperties}
            onToggle={() => toggleSection("referenceProperties")}
          >
            <ReferenceProperties references={referenciasSimulacao} />
          </Section>
        </div>
      </div>
    </MainLayout>
  );
};

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
}> = ({ title, children, expanded, onToggle }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div
      className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
      onClick={onToggle}
    >
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
    </div>
    {expanded && <div className="px-6 py-4">{children}</div>}
  </div>
);

const KPICard: React.FC<{
  title: string;
  value: string;
  highlight?: boolean;
}> = ({ title, value, highlight }) => (
  <div
    className={`p-3 rounded-lg ${
      highlight
        ? "bg-blue-100 border border-blue-300"
        : "bg-white border border-gray-200"
    }`}
  >
    <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
    <p
      className={`text-sm font-bold ${
        highlight ? "text-blue-800" : "text-gray-900"
      }`}
    >
      {value}
    </p>
  </div>
);

export default AnalysisPage;
