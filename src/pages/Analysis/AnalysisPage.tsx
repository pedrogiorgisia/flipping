import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  getSimulacoes,
  getReferenciaSimulacao,
  atualizarSimulacao,
} from "../../api";
import PropertyDetails from "./PropertyDetails";
import CalculationParameters from "./CalculationParameters";
import ReferenceProperties from "./ReferenceProperties";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

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

const AnalysisPage: React.FC = () => {
  const { propertyId: simulationId } = useParams<{ propertyId: string }>();
  const [simulacao, setSimulacao] = useState<any | null>(null);
  const [referenciasSimulacao, setReferenciasSimulacao] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedSections, setExpandedSections] = useState({
    propertyDetails: true,
    analysisAndParameters: true,
    referenceProperties: true,
  });

  const handleParameterChange = useCallback(
    (field: keyof any, value: any) => {
      setSimulacao((prev: any | null) => {
        if (!prev) return null;
        let updatedValue;
        if (field === "param_incide_ir") {
          updatedValue = Boolean(value);
        } else {
          updatedValue = parseFloat(value) || 0;
        }
        const updatedSimulacao = { ...prev, [field]: updatedValue };

        // Cálculos
        const valorCompra = updatedSimulacao.param_valor_compra;
        const valorVenda = updatedSimulacao.param_valor_venda;
        const entradaPct = updatedSimulacao.param_entrada_pct;
        const itbiPct = updatedSimulacao.param_itbi_pct;
        const registroCartorioPct =
          updatedSimulacao.param_registro_cartorio_pct;
        const taxaCET = updatedSimulacao.param_taxa_cet / 100 / 12;
        const prazoFinanciamento = updatedSimulacao.param_prazo_financiamento;
        const tempoVenda = updatedSimulacao.param_tempo_venda;
        const reformaRS = updatedSimulacao.param_custo_reforma;
        const avaliacaoBancaria = updatedSimulacao.param_avaliacao_bancaria;
        const contasGerais = updatedSimulacao.param_contas_gerais;
        const corretagemVendaPct = updatedSimulacao.param_corretagem_venda_pct;

        const valorEntrada = valorCompra * (entradaPct / 100);
        const valorItbi = valorCompra * (itbiPct / 100);
        const valorRegistroCartorio = valorCompra * (registroCartorioPct / 100);
        const custoAquisicao =
          valorEntrada + valorItbi + avaliacaoBancaria + valorRegistroCartorio;

        const valorFinanciado = valorCompra - valorEntrada;
        const amortizacaoMensal = valorFinanciado / prazoFinanciamento;

        let totalParcelas = 0;
        let saldoDevedor = valorFinanciado;
        for (let i = 0; i < tempoVenda; i++) {
          const jurosMensal = saldoDevedor * taxaCET;
          const parcela = amortizacaoMensal + jurosMensal;
          totalParcelas += parcela;
          saldoDevedor -= amortizacaoMensal;
        }

        const quitacao = saldoDevedor;
        const totalCondominio =
          (updatedSimulacao.imovel?.condominio_mensal || 0) * tempoVenda;
        const iptuTotal =
          ((updatedSimulacao.imovel?.iptu_anual || 0) / 12) * tempoVenda;
        const contasGeraisTotal = contasGerais * tempoVenda;
        const custosAteVenda =
          totalParcelas +
          totalCondominio +
          iptuTotal +
          contasGeraisTotal +
          reformaRS;

        const corretagem = valorVenda * (corretagemVendaPct / 100);
        const baseCalculoIR =
          valorVenda -
          custoAquisicao -
          quitacao -
          corretagem -
          (totalParcelas * 3) / 4 -
          reformaRS;
        const impostoRenda = updatedSimulacao.param_incide_ir
          ? Math.max(0, baseCalculoIR * 0.15)
          : 0;

        const investimentoTotal = custoAquisicao + custosAteVenda;
        const lucroLiquido =
          valorVenda - investimentoTotal - quitacao - corretagem - impostoRenda;
        const roi =
          investimentoTotal > 0 ? lucroLiquido / investimentoTotal : 0;

        return {
          ...updatedSimulacao,
          calc_entrada: valorEntrada,
          calc_itbi: valorItbi,
          valor_registro_cartorio: valorRegistroCartorio,
          calc_parcelas_rs: totalParcelas,
          calc_quitacao_rs: quitacao,
          calc_condominio_rs: totalCondominio,
          roi_liquido: roi,
          investimento_total: investimentoTotal,
          lucro_liquido: lucroLiquido,
          imposto_renda: impostoRenda,
          iptu_total: iptuTotal,
          contas_gerais_total: contasGeraisTotal,
          valor_compra: valorCompra,
          valor_venda: valorVenda,
        };
      });
    },
    [],
  );

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

        const [simulacaoData, referenciasData] = await Promise.all([
          getSimulacoes(simulationId),
          getReferenciaSimulacao(simulationId),
        ]);

        setSimulacao(simulacaoData);

        (Object.keys(simulacaoData) as Array<keyof any>).forEach(
          (param) => {
            if (param.startsWith("param_")) {
              handleParameterChange(param, simulacaoData[param]);
            }
          },
        );
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
  }, [simulationId, handleParameterChange]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const salvarSimulacao = async () => {
    if (!simulacao || !simulationId) return;

    const dadosParaAtualizar = {
      id_imovel: simulacao.imovel.id,
      param_valor_compra: simulacao.param_valor_compra,
      param_valor_venda: simulacao.param_valor_venda,
      param_entrada_pct: simulacao.param_entrada_pct,
      param_itbi_pct: simulacao.param_itbi_pct,
      param_avaliacao_bancaria: simulacao.param_avaliacao_bancaria,
      param_registro_cartorio_pct: simulacao.param_registro_cartorio_pct,
      param_contas_gerais: simulacao.param_contas_gerais,
      param_tempo_venda: simulacao.param_tempo_venda,
      param_custo_reforma: simulacao.param_custo_reforma,
      param_taxa_cet: simulacao.param_taxa_cet,
      param_prazo_financiamento: simulacao.param_prazo_financiamento,
      param_corretagem_venda_pct: simulacao.param_corretagem_venda_pct,
      param_incide_ir: simulacao.param_incide_ir,
      simulacao_principal: simulacao.simulacao_principal,
    };

    try {
      await atualizarSimulacao(simulationId, dadosParaAtualizar);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar a simulação:", error);
      setError("Falha ao salvar a simulação. Por favor, tente novamente.");
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  if (!simulacao) return <div>Nenhuma simulação encontrada</div>;

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
            <PropertyDetails
              property={simulacao.imovel}
              formatCurrency={formatCurrency}
            />
          </Section>

          <Section
            title="Análise e Parâmetros"
            expanded={expandedSections.analysisAndParameters}
            onToggle={() => toggleSection("analysisAndParameters")}
          >
            <CalculationParameters
              simulacao={simulacao}
              handleParameterChange={handleParameterChange}
              salvarSimulacao={salvarSimulacao}
              formatCurrency={formatCurrency}
            />
          </Section>

          <Section
            title="Imóveis de Referência"
            expanded={expandedSections.referenceProperties}
            onToggle={() => toggleSection("referenceProperties")}
          >
            <ReferenceProperties
              references={referenciasSimulacao}
              simulationId={simulationId}
              simulacao={simulacao}
              onUpdate={() => {
                getReferenciaSimulacao(simulationId).then((data) => {
                  setReferenciasSimulacao(data);
                });
              }}
            />
          </Section>
        </div>
      </div>
    </MainLayout>
  );
};

export default AnalysisPage;