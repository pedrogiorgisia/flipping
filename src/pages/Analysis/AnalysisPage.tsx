import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { ChevronDown, ChevronUp, Plus, Home } from "lucide-react";
import {
  getSimulacoes,
  getReferenciaSimulacao,
  atualizarSimulacao,
} from "../../api";
import ReferenceProperties from "./ReferenceProperties";
import toast from "react-hot-toast";

interface Simulacao {
  id: string;
  param_valor_compra: string;
  param_valor_venda: string;
  param_entrada_pct: string;
  param_itbi_pct: string;
  param_avaliacao_bancaria: string;
  param_registro_cartorio_pct: string;
  param_contas_gerais: string;
  param_custo_reforma: string;
  param_taxa_cet: string;
  param_prazo_financiamento: string;
  param_tempo_venda: string;
  param_corretagem_venda_pct: string;
  param_incide_ir: boolean;
  valor_compra: string;
  valor_m2_venda: string;
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

// Função auxiliar para formatar moeda
const formatCurrencyInput = (value) => {
  if (!value) return "R$ 0,00";
  const number = parseFloat(value.replace(/\D/g, "")) / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number);
};

// Função auxiliar para parsear o valor formatado
const parseCurrencyInput = (value) => {
  return value.replace(/\D/g, "") || "0";
};

const PropertyDetails: React.FC<{ property: Simulacao["imovel"] }> = ({
  property,
}) => {
  if (!property) return null;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Detalhes do Imóvel</h2>
        <a
          href={property.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Ver anúncio
        </a>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-500">Endereço</p>
          <p className="font-medium">{property.endereco}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Área</p>
          <p className="font-medium">{property.area} m²</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Preço Anunciado</p>
          <p className="font-medium">
            {formatCurrency(property.preco_anunciado)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Imobiliária</p>
          <p className="font-medium">{property.imobiliaria}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Data do Anúncio</p>
          <p className="font-medium">
            {property.data_anuncio
              ? new Date(property.data_anuncio).toLocaleDateString("pt-BR")
              : "Não disponível"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Código de Referência</p>
          <p className="font-medium">{property.codigo_ref_externo}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Quartos</p>
          <p className="font-medium">{property.quartos}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Banheiros</p>
          <p className="font-medium">{property.banheiros}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Vagas</p>
          <p className="font-medium">{property.vagas}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Condomínio Mensal</p>
          <p className="font-medium">
            {formatCurrency(property.condominio_mensal)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">IPTU Anual</p>
          <p className="font-medium">{formatCurrency(property.iptu_anual)}</p>
        </div>
      </div>
    </div>
  );
};

const AnalysisPage: React.FC = () => {
  const { propertyId: simulationId } = useParams<{ propertyId: string }>();
  const [simulacao, setSimulacao] = useState<any>(null);
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

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const handleParameterChange = useCallback(
    (field: keyof Simulacao, value: any) => {
      setSimulacao((prev: Simulacao | null) => {
        if (!prev) return null;
        const updatedSimulacao = { ...prev, [field]: value };

        // Converta todos os valores para números
        const valorCompra = parseFloat(
          updatedSimulacao.param_valor_compra || "0",
        );
        const valorVenda = parseFloat(
          updatedSimulacao.param_valor_venda || "0",
        );
        const entradaPct = parseFloat(
          updatedSimulacao.param_entrada_pct || "0",
        );
        const itbiPct = parseFloat(updatedSimulacao.param_itbi_pct || "0");
        const registroCartorioPct = parseFloat(
          updatedSimulacao.param_registro_cartorio_pct || "0",
        );
        const taxaCET =
          parseFloat(updatedSimulacao.param_taxa_cet || "0") / 100 / 12;
        const prazoFinanciamento = parseInt(
          updatedSimulacao.param_prazo_financiamento || "0",
        );
        const tempoVenda = parseInt(updatedSimulacao.param_tempo_venda || "0");
        const reformaRS = parseFloat(
          updatedSimulacao.param_custo_reforma || "0",
        );
        const avaliacaoBancaria = parseFloat(
          updatedSimulacao.param_avaliacao_bancaria || "0",
        );
        const contasGerais = parseFloat(
          updatedSimulacao.param_contas_gerais || "0",
        );
        const corretagemVendaPct = parseFloat(
          updatedSimulacao.param_corretagem_venda_pct || "0",
        );

        // Cálculos
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
          valor_compra: valorCompra.toString(),
          valor_venda: valorVenda.toString(),
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

        // Inicialize a simulação
        setSimulacao(simulacaoData);

        // Chame handleParameterChange para cada parâmetro relevante
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

  const recalculateValues = () => {
    console.log("Recalculating values with parameters:", simulacao);
    // Implemente a lógica de recálculo aqui
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const salvarSimulacao = async () => {
    if (!simulacao || !simulationId) return;

    const parseDecimal = (value) => {
      if (typeof value === "string") {
        return parseFloat(value.replace(/\D/g, "")) / 100;
      }
      return value;
    };

    const dadosParaAtualizar = {
      id_imovel: simulacao.imovel.id,
      param_valor_compra: parseDecimal(simulacao.param_valor_compra),
      param_valor_venda: parseDecimal(simulacao.param_valor_venda),
      param_entrada_pct: parseFloat(simulacao.param_entrada_pct),
      param_itbi_pct: parseFloat(simulacao.param_itbi_pct),
      param_avaliacao_bancaria: parseDecimal(
        simulacao.param_avaliacao_bancaria,
      ),
      param_registro_cartorio_pct: parseFloat(
        simulacao.param_registro_cartorio_pct,
      ),
      param_contas_gerais: parseDecimal(simulacao.param_contas_gerais),
      param_tempo_venda: parseInt(simulacao.param_tempo_venda),
      param_custo_reforma: parseDecimal(simulacao.param_custo_reforma),
      param_taxa_cet: parseFloat(simulacao.param_taxa_cet),
      param_prazo_financiamento: parseInt(simulacao.param_prazo_financiamento),
      param_corretagem_venda_pct: parseFloat(
        simulacao.param_corretagem_venda_pct,
      ),
      param_incide_ir: simulacao.param_incide_ir,
      simulacao_principal: simulacao.simulacao_principal,
    };

    try {
      await atualizarSimulacao(simulationId, dadosParaAtualizar);
      // Recarregar a página após salvar
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
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Simulação & Investimento
              </h1>
              <div className="text-sm text-gray-500 flex items-center space-x-2">
                <Link to="/dashboard" className="hover:text-gray-700">
                  <Home size={16} />
                </Link>
                <span>/</span>
                <span>Simulações</span>
                <span>/</span>
                <span className="text-gray-900">#{simulationId}</span>
              </div>
            </div>
            <button 
              onClick={salvarSimulacao}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus size={16} />
              <span>Nova Simulação</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Property Details Section */}
        <Section
          title="Informações do Imóvel"
          expanded={expandedSections.propertyDetails}
          onToggle={() => toggleSection("propertyDetails")}
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PropertyInfoCard
                icon="📍"
                title="Endereço"
                value={simulacao?.imovel?.endereco}
              />
              <PropertyInfoCard
                icon="📐"
                title="Área"
                value={`${simulacao?.imovel?.area} m²`}
              />
              <PropertyInfoCard
                icon="💰"
                title="Preço Anunciado"
                value={formatCurrency(simulacao?.imovel?.preco_anunciado)}
              />
              <PropertyInfoCard
                icon="🏢"
                title="Imobiliária"
                value={simulacao?.imovel?.imobiliaria}
              />
              <PropertyInfoCard
                icon="🛏️"
                title="Quartos"
                value={simulacao?.imovel?.quartos}
              />
              <PropertyInfoCard
                icon="🚿"
                title="Banheiros"
                value={simulacao?.imovel?.banheiros}
              />
              <PropertyInfoCard
                icon="🚗"
                title="Vagas"
                value={simulacao?.imovel?.vagas}
              />
              <PropertyInfoCard
                icon="📅"
                title="Data Anúncio"
                value={simulacao?.imovel?.data_anuncio ? new Date(simulacao?.imovel?.data_anuncio).toLocaleDateString("pt-BR") : "Não disponível"}
              />
              <PropertyInfoCard
                icon="💸"
                title="Condomínio"
                value={formatCurrency(simulacao?.imovel?.condominio_mensal)}
              />
              <PropertyInfoCard
                icon="📄"
                title="IPTU Anual"
                value={formatCurrency(simulacao?.imovel?.iptu_anual)}
              />
            </div>
          </div>
        </Section>

        {/* Analysis Parameters Section */}
        <Section
          title="Análise e Parâmetros"
          expanded={expandedSections.analysisAndParameters}
          onToggle={() => toggleSection("analysisAndParameters")}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Parameters Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Parâmetros de Compra</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Keep existing input fields but with updated styling */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Valor de compra (R$)
                    </label>
                    <input
                      type="text"
                      value={formatCurrencyInput(simulacao?.param_valor_compra)}
                      onChange={(e) => {
                        const rawValue = parseCurrencyInput(e.target.value);
                        handleParameterChange("param_valor_compra", rawValue);
                      }}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Entrada (%)
                    </label>
                    <input
                      type="number"
                      value={simulacao?.param_entrada_pct || ""}
                      onChange={(e) =>
                        handleParameterChange(
                          "param_entrada_pct",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      ITBI (%)
                    </label>
                    <input
                      type="number"
                      value={simulacao?.param_itbi_pct || ""}
                      onChange={(e) =>
                        handleParameterChange(
                          "param_itbi_pct",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Avaliação bancária (R$)
                    </label>
                    <input
                      type="text"
                      value={formatCurrencyInput(
                        simulacao?.param_avaliacao_bancaria,
                      )}
                      onChange={(e) => {
                        const rawValue = parseCurrencyInput(e.target.value);
                        handleParameterChange(
                          "param_avaliacao_bancaria",
                          rawValue,
                        );
                      }}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Registro em cartório (%)
                    </label>
                    <input
                      type="number"
                      value={simulacao?.param_registro_cartorio_pct || ""}
                      onChange={(e) =>
                        handleParameterChange(
                          "param_registro_cartorio_pct",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Contas gerais (agua, luz etc.) (R$)
                    </label>
                    <input
                      type="text"
                      value={formatCurrencyInput(simulacao?.param_contas_gerais)}
                      onChange={(e) => {
                        const rawValue = parseCurrencyInput(e.target.value);
                        handleParameterChange(
                          "param_contas_gerais",
                          rawValue,
                        );
                      }}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Financiamento e Venda</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Valor de venda (R$)
                    </label>
                    <input
                      type="text"
                      value={formatCurrencyInput(simulacao?.param_valor_venda)}
                      onChange={(e) => {
                        const rawValue = parseCurrencyInput(e.target.value);
                        handleParameterChange("param_valor_venda", rawValue);
                        if (simulacao && simulacao.imovel.area > 0) {
                          const newValorM2 =
                            parseFloat(rawValue) /
                            100 /
                            simulacao.imovel.area;
                          handleParameterChange(
                            "valor_m2_venda",
                            newValorM2.toString(),
                          );
                        }
                      }}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Tempo de venda (meses)
                    </label>
                    <input
                      type="number"
                      value={simulacao?.param_tempo_venda || ""}
                      onChange={(e) =>
                        handleParameterChange(
                          "param_tempo_venda",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Custo estimado reforma (R$)
                    </label>
                    <input
                      type="text"
                      value={formatCurrencyInput(simulacao?.param_custo_reforma)}
                      onChange={(e) => {
                        const rawValue = parseCurrencyInput(e.target.value);
                        handleParameterChange(
                          "param_custo_reforma",
                          rawValue,
                        );
                      }}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Taxa CET (%)
                    </label>
                    <input
                      type="number"
                      value={simulacao?.param_taxa_cet || ""}
                      onChange={(e) =>
                        handleParameterChange(
                          "param_taxa_cet",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Prazo financiamento (meses)
                    </label>
                    <input
                      type="number"
                      value={simulacao?.param_prazo_financiamento || ""}
                      onChange={(e) =>
                        handleParameterChange(
                          "param_prazo_financiamento",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Corretagem venda (%)
                    </label>
                    <input
                      type="number"
                      value={simulacao?.param_corretagem_venda_pct || ""}
                      onChange={(e) =>
                        handleParameterChange(
                          "param_corretagem_venda_pct",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={simulacao?.param_incide_ir || false}
                        onChange={(e) =>
                          handleParameterChange(
                            "param_incide_ir",
                            e.target.checked,
                          )
                        }
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Incide Imposto de Renda?
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Results Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Análise de Viabilidade</h3>
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-900 mb-3">Resumo do Investimento</h4>
                  <div className="space-y-3">
                    <ResultItem
                      label="Investimento Total"
                      value={formatCurrency(simulacao?.investimento_total)}
                    />
                    <ResultItem
                      label="Lucro Líquido"
                      value={formatCurrency(simulacao?.lucro_liquido)}
                    />
                    <ResultItem
                      label="ROI"
                      value={`${((simulacao?.roi_liquido || 0) * 100).toFixed(2)}%`}
                      highlight
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Custos de Aquisição</h4>
                  <p className="text-sm">
                    Entrada: {formatCurrency(simulacao.calc_entrada || 0)}
                  </p>
                  <p className="text-sm">
                    ITBI: {formatCurrency(simulacao.calc_itbi || 0)}
                  </p>
                  <p className="text-sm">
                    Avaliação do Banco:{" "}
                    {formatCurrency(
                      parseFloat(simulacao.param_avaliacao_bancaria) || 0,
                    )}
                  </p>
                  <p className="text-sm">
                    Registro:{" "}
                    {formatCurrency(simulacao.valor_registro_cartorio || 0)}
                  </p>
                  <p className="text-sm font-medium text-blue-600">
                    Total:{" "}
                    {formatCurrency(
                      (simulacao.calc_entrada || 0) +
                        (simulacao.calc_itbi || 0) +
                        (parseFloat(simulacao.param_avaliacao_bancaria) ||
                          0) +
                        (simulacao.valor_registro_cartorio || 0),
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Custos até a venda</h4>
                  <p className="text-sm">
                    Parcelas Financiamento:{" "}
                    {formatCurrency(simulacao.calc_parcelas_rs || 0)}
                  </p>
                  <p className="text-sm">
                    Condomínio:{" "}
                    {formatCurrency(simulacao.calc_condominio_rs || 0)}
                  </p>
                  <p className="text-sm">
                    IPTU: {formatCurrency(simulacao.iptu_total || 0)}
                  </p>
                  <p className="text-sm">
                    Contas gerais (água, luz, etc.):{" "}
                    {formatCurrency(simulacao.contas_gerais_total || 0)}
                  </p>
                  <p className="text-sm">
                    Reforma:{" "}
                    {formatCurrency(
                      parseFloat(simulacao.param_custo_reforma) || 0,
                    )}
                  </p>
                  <p className="text-sm font-medium text-blue-600">
                    Total:{" "}
                    {formatCurrency(
                      (simulacao.calc_parcelas_rs || 0) +
                        (simulacao.calc_condominio_rs || 0) +
                        (simulacao.iptu_total || 0) +
                        (simulacao.contas_gerais_total || 0) +
                        (parseFloat(simulacao.param_custo_reforma) || 0),
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Custos de Venda</h4>
                  <p className="text-sm">
                    Quitação do Financiamento:{" "}
                    {formatCurrency(simulacao.calc_quitacao_rs || 0)}
                  </p>
                  <p className="text-sm">
                    Corretagem:{" "}
                    {formatCurrency(
                      (parseFloat(simulacao.valor_venda) || 0) *
                        (parseFloat(simulacao.param_corretagem_venda_pct) /
                          100),
                    )}
                  </p>
                  <p className="text-sm">
                    Imposto de Renda:{" "}
                    {formatCurrency(simulacao.imposto_renda || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Reference Properties Section */}
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
              getReferenciaSimulacao(simulationId).then(data => {
                setReferenciasSimulacao(data);
              });
            }}
          />
        </Section>
      </div>
    </MainLayout>
  );
};

const PropertyInfoCard: React.FC<{
  icon: string;
  title: string;
  value: string | number;
}> = ({ icon, title, value }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  </div>
);

const ResultItem: React.FC<{
  label: string;
  value: string;
  highlight?: boolean;
}> = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}</span>
    <span className={`font-medium ${highlight ? 'text-blue-600' : ''}`}>
      {value}
    </span>
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