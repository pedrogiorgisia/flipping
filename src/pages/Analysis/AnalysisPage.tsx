import {
  FaBed,
  FaBath,
  FaCar,
  FaRulerCombined,
  FaCalendarAlt,
  FaBuilding,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaHashtag,
} from "react-icons/fa";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  getSimulacoes,
  getReferenciaSimulacao,
  atualizarSimulacao,
} from "../../api";
import ReferenceProperties, { ReferenceProperty } from "./ReferenceProperties";

interface Simulacao {
  id: string;
  param_valor_compra: number;
  param_valor_venda: number;
  param_entrada_pct: number;
  param_itbi_pct: number;
  param_avaliacao_bancaria: number;
  param_registro_cartorio_pct: number;
  param_contas_gerais: number;
  param_custo_reforma: number;
  param_taxa_cet: number;
  param_prazo_financiamento: number;
  param_tempo_venda: number;
  param_corretagem_venda_pct: number;
  param_incide_ir: boolean;
  valor_compra: number;
  valor_m2_venda: number;
  imovel: {
    id: string;
    id_analise: string;
    url: string;
    imobiliaria: string;
    preco_anunciado: number;
    area: number;
    quartos: number;
    banheiros: number;
    vagas: number;
    condominio_mensal: number;
    iptu_anual: number;
    endereco: string;
    codigo_ref_externo: string;
    data_anuncio: string;
    comentarios: string;
    criado_em: string;
    reformado: boolean;
    preco_m2: number;
  };
  // Campos calculados
  calc_parcelas_rs: number;
  calc_quitacao_rs: number;
  calc_condominio_rs: number;
  roi_liquido: number;
  investimento_total: number;
  lucro_liquido: number;
  valor_registro_cartorio: number;
  imposto_renda: number;
  iptu_total: number;
  contas_gerais_total: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const PropertyDetails: React.FC<{
  property: Simulacao["imovel"];
  formatCurrency: (value: number) => string;
}> = ({
  property,
  formatCurrency,
}) => {
  if (!property) return null;

  const detailItems = [
    { icon: <FaMapMarkerAlt />, label: "Endereço", value: property.endereco },
    { icon: <FaRulerCombined />, label: "Área", value: `${property.area} m²` },
    {
      icon: <FaMoneyBillWave />,
      label: "Preço Anunciado",
      value: formatCurrency(property.preco_anunciado),
    },
    { icon: <FaBuilding />, label: "Imobiliária", value: property.imobiliaria },
    {
      icon: <FaCalendarAlt />,
      label: "Data do Anúncio",
      value: property.data_anuncio
        ? new Date(property.data_anuncio).toLocaleDateString("pt-BR")
        : "Não disponível",
    },
    {
      icon: <FaHashtag />,
      label: "Código de Referência",
      value: property.codigo_ref_externo,
    },
    { icon: <FaBed />, label: "Quartos", value: property.quartos },
    { icon: <FaBath />, label: "Banheiros", value: property.banheiros },
    { icon: <FaCar />, label: "Vagas", value: property.vagas },
    {
      icon: <FaMoneyBillWave />,
      label: "Condomínio Mensal",
      value: formatCurrency(property.condominio_mensal),
    },
    {
      icon: <FaFileInvoiceDollar />,
      label: "IPTU Anual",
      value: formatCurrency(property.iptu_anual),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Detalhes do Imóvel</h2>
        <a
          href={property.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Ver anúncio
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {detailItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="text-blue-600 text-xl">{item.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="font-medium text-gray-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CalculationParameters: React.FC<{
  simulacao: Simulacao | null;
  handleParameterChange: (field: string, value: any) => void;
  salvarSimulacao: () => void;
  formatCurrency: (value: number) => string;
}> = ({ simulacao, handleParameterChange, salvarSimulacao, formatCurrency }) => {
  if (!simulacao) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Coluna 1: Parâmetros de Compra */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-700 mb-4">
              Parâmetros de Compra
            </h4>
            {[
              {
                label: "Valor de compra (R$)",
                param: "param_valor_compra",
              },
              { label: "Entrada (%)", param: "param_entrada_pct" },
              { label: "ITBI (%)", param: "param_itbi_pct" },
              {
                label: "Avaliação bancária (R$)",
                param: "param_avaliacao_bancaria",
              },
              {
                label: "Registro em cartório (%)",
                param: "param_registro_cartorio_pct",
              },
              {
                label: "Contas gerais (R$)",
                param: "param_contas_gerais",
              },
            ].map((item) => (
              <div
                key={item.param}
                className="bg-gray-50 p-4 rounded-md"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {item.label}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={simulacao[item.param] || ""}
                  onChange={(e) =>
                    handleParameterChange(item.param, e.target.value)
                  }
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {item.param === "param_valor_compra" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Valor do m²:{" "}
                    {formatCurrency(
                      simulacao.param_valor_compra /
                        simulacao.imovel.area,
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Coluna 2: Parâmetros de Financiamento e Venda */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-700 mb-4">
              Financiamento e Venda
            </h4>
            {[
              {
                label: "Valor de venda (R$)",
                param: "param_valor_venda",
              },
              {
                label: "Tempo de venda (meses)",
                param: "param_tempo_venda",
              },
              {
                label: "Custo estimado reforma (R$)",
                param: "param_custo_reforma",
              },
              { label: "Taxa CET (%)", param: "param_taxa_cet" },
              {
                label: "Prazo financiamento (meses)",
                param: "param_prazo_financiamento",
              },
              {
                label: "Corretagem venda (%)",
                param: "param_corretagem_venda_pct",
              },
            ].map((item) => (
              <div
                key={item.param}
                className="bg-gray-50 p-4 rounded-md"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {item.label}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={simulacao[item.param] || ""}
                  onChange={(e) =>
                    handleParameterChange(item.param, e.target.value)
                  }
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {item.param === "param_valor_venda" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Valor do m²:{" "}
                    {formatCurrency(
                      simulacao.param_valor_venda /
                        simulacao.imovel.area,
                    )}
                  </p>
                )}
              </div>
            ))}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="incide_ir"
                  checked={simulacao.param_incide_ir === true}
                  onChange={(e) =>
                    handleParameterChange(
                      "param_incide_ir",
                      e.target.checked,
                    )
                  }
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="incide_ir"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Incide Imposto de Renda?
                </label>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={salvarSimulacao}
          className="mt-8 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Salvar simulação
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Análise de Viabilidade
        </h3>
        <div className="space-y-6">
          {[
            {
              title: "Custos de Aquisição",
              items: [
                { label: "Entrada", value: simulacao.calc_entrada },
                { label: "ITBI", value: simulacao.calc_itbi },
                {
                  label: "Avaliação do Banco",
                  value: simulacao.param_avaliacao_bancaria,
                },
                {
                  label: "Registro",
                  value: simulacao.valor_registro_cartorio,
                },
              ],
              total:
                simulacao.calc_entrada +
                simulacao.calc_itbi +
                simulacao.param_avaliacao_bancaria +
                simulacao.valor_registro_cartorio,
            },
            {
              title: "Custos até a venda",
              items: [
                {
                  label: "Parcelas Financiamento",
                  value: simulacao.calc_parcelas_rs,
                },
                {
                  label: "Condomínio",
                  value: simulacao.calc_condominio_rs,
                },
                { label: "IPTU", value: simulacao.iptu_total },
                {
                  label: "Contas gerais",
                  value: simulacao.contas_gerais_total,
                },
                {
                  label: "Reforma",
                  value: simulacao.param_custo_reforma,
                },
              ],
              total:
                simulacao.calc_parcelas_rs +
                simulacao.calc_condominio_rs +
                simulacao.iptu_total +
                simulacao.contas_gerais_total +
                simulacao.param_custo_reforma,
            },
            {
              title: "Custos de Venda",
              items: [
                {
                  label: "Quitação do Financiamento",
                  value: simulacao.calc_quitacao_rs,
                },
                {
                  label: "Corretagem",
                  value:
                    simulacao.param_valor_venda *
                    (simulacao.param_corretagem_venda_pct / 100),
                },
                {
                  label: "Imposto de Renda",
                  value: simulacao.imposto_renda,
                },
              ],
              total:
                simulacao.calc_quitacao_rs +
                simulacao.param_valor_venda *
                  (simulacao.param_corretagem_venda_pct / 100) +
                simulacao.imposto_renda,
            },
            {
              title: "Resultados",
              items: [
                {
                  label: "Preço de venda (+)",
                  value: simulacao.param_valor_venda,
                },
                {
                  label: "Investimento total (-)",
                  value: -simulacao.investimento_total,
                },
                {
                  label: "Custo de venda (-)",
                  value: -(
                    simulacao.calc_quitacao_rs +
                    simulacao.param_valor_venda *
                      (simulacao.param_corretagem_venda_pct / 100) +
                    simulacao.imposto_renda
                  ),
                },
                {
                  label: "Lucro líquido (=)",
                  value: simulacao.lucro_liquido,
                  highlight: true,
                },
                {
                  label: "ROI (=)",
                  value: `${(simulacao.roi_liquido * 100).toFixed(2)}%`,
                  highlight: true,
                },
              ],
            },
          ].map((section, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-medium text-gray-700 mb-2">
                {section.title}
              </h4>
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-600">{item.label}</span>
                  <span
                    className={`font-medium ${
                      item.highlight
                        ? typeof item.value === "number"
                          ? item.value >= 0
                            ? "text-blue-600"
                            : "text-red-600"
                          : "text-blue-600"
                        : "text-gray-800"
                    }`}
                  >
                    {typeof item.value === "number"
                      ? formatCurrency(item.value)
                      : item.value}
                  </span>
                </div>
              ))}
              {section.total !== undefined && (
                <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-600 font-medium">
                    Total:
                  </span>
                  <span className="font-medium text-blue-600">
                    {formatCurrency(section.total)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
  const [simulacao, setSimulacao] = useState<Simulacao | null>(null);
  const [referenciasSimulacao, setReferenciasSimulacao] = useState<
    ReferenceProperty[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedSections, setExpandedSections] = useState({
    propertyDetails: true,
    analysisAndParameters: true,
    referenceProperties: true,
  });

  const handleParameterChange = useCallback(
    (field: keyof Simulacao, value: any) => {
      setSimulacao((prev: Simulacao | null) => {
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

        (Object.keys(simulacaoData) as Array<keyof Simulacao>).forEach(
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