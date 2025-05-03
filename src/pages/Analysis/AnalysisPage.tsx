import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getSimulacoes, getReferenciaSimulacao } from "../../api";
import ReferenceProperties, { ReferenceProperty } from "./ReferenceProperties";

interface Simulacao {
  id: string;
  criado_em: string;
  entrada_pct: string;
  itbi_pct: string;
  avaliacao_banco_rs: string;
  cartorio_rs: string;
  contas_gerais_rs: string;
  reforma_rs: string;
  valor_compra: string;
  taxa_juros_financiamento: string;
  prazo_financiamento_meses: number;
  prazo_venda_meses: number;
  valor_m2_venda: string;
  corretagem_venda_pct: string;
  ir_pago: boolean;
  simulacao_principal: boolean;
  calc_parcelas_rs: number;
  calc_condominio_rs: number;
  calc_quitacao_rs: number;
  roi_liquido: number;
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
  valor_m2_compra: number | null;
  investimento_total: number;
  lucro_operacao: number;
  valor_venda: string;
  valor_registro_cartorio: number; // Novo campo para o valor calculado
  lucro_liquido: number;
  imposto_renda: number;
  contas_gerais_mensais: string;
  iptu_total: number;
  contas_gerais_total: number;
}

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
            {new Date(property.data_anuncio).toLocaleDateString("pt-BR")}
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

  const calcularValoresSimulacao = useCallback(
    (simulacao: Simulacao): Simulacao => {
      const valorCompra = parseFloat(simulacao.valor_compra);
      const valorVenda = parseFloat(simulacao.valor_venda);
      const entradaPct = parseFloat(simulacao.entrada_pct);
      const itbiPct = parseFloat(simulacao.itbi_pct);
      const registroCartorioPct = parseFloat(simulacao.cartorio_rs);
      const taxaCET = parseFloat(simulacao.taxa_juros_financiamento) / 100 / 12; // Taxa mensal
      const prazoFinanciamento = simulacao.prazo_financiamento_meses;
      const tempoVenda = simulacao.prazo_venda_meses;

      // Custos de Aquisição
      const valorEntrada = valorCompra * (entradaPct / 100);
      const valorItbi = valorCompra * (itbiPct / 100);
      const valorRegistroCartorio = valorCompra * (registroCartorioPct / 100);
      const custoAquisicao =
        valorEntrada +
        valorItbi +
        parseFloat(simulacao.avaliacao_banco_rs) +
        valorRegistroCartorio;

      // Cálculo do financiamento
      const valorFinanciado = valorCompra - valorEntrada;
      const amortizacaoMensal = valorFinanciado / prazoFinanciamento;

      // Cálculo das parcelas (SAC)
      let totalParcelas = 0;
      let saldoDevedor = valorFinanciado;
      for (let i = 0; i < tempoVenda; i++) {
        const jurosMensal = saldoDevedor * taxaCET;
        const parcela = amortizacaoMensal + jurosMensal;
        totalParcelas += parcela;
        saldoDevedor -= amortizacaoMensal;
      }

      // Cálculo da quitação
      const quitacao = saldoDevedor;

      const totalCondominio = simulacao.imovel.condominio_mensal * tempoVenda;

      // Cálculo das contas
      const iptuTotal = (simulacao.imovel.iptu_anual / 10) * tempoVenda;
      const contasGeraisTotal =
        parseFloat(simulacao.contas_gerais_mensais) * tempoVenda;

      const custosAteVenda =
        totalParcelas +
        totalCondominio +
        iptuTotal +
        contasGeraisTotal +
        parseFloat(simulacao.reforma_rs);

      // Cálculo da corretagem
      const corretagem =
        valorVenda * (parseFloat(simulacao.corretagem_venda_pct) / 100);

      // Cálculo do imposto de renda (corrigido)
      const baseCalculoIR =
        valorVenda -
        custoAquisicao -
        quitacao -
        corretagem -
        (totalParcelas * 3) / 4 -
        parseFloat(simulacao.reforma_rs);
      const imposto = simulacao.ir_pago ? Math.max(0, baseCalculoIR * 0.15) : 0;

      const investimentoTotal = custoAquisicao + custosAteVenda;

      // Cálculo do lucro líquido (corrigido)
      const lucroLiquido =
        valorVenda - investimentoTotal - quitacao - corretagem - imposto;

      const roi = investimentoTotal > 0 ? lucroLiquido / investimentoTotal : 0;

      return {
        ...simulacao,
        calc_parcelas_rs: totalParcelas,
        calc_quitacao_rs: quitacao,
        calc_condominio_rs: totalCondominio,
        roi_liquido: roi,
        investimento_total: investimentoTotal,
        lucro_liquido: lucroLiquido,
        valor_venda: valorVenda.toString(),
        imposto_renda: imposto,
        iptu_total: iptuTotal,
        contas_gerais_total: contasGeraisTotal,
        valor_registro_cartorio: valorRegistroCartorio,
      };
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

        // Trigger handleParameterChange to calculate initial values
        const initialSimulacao = {
          ...simulacaoData,
          param_valor_compra: simulacaoData.valor_compra,
          param_valor_venda: simulacaoData.valor_venda,
          param_entrada_pct: simulacaoData.entrada_pct,
          param_itbi_pct: simulacaoData.itbi_pct,
          param_avaliacao_bancaria: simulacaoData.avaliacao_banco_rs,
          param_registro_cartorio_pct: simulacaoData.cartorio_rs,
          param_contas_gerais: simulacaoData.contas_gerais_rs,
          param_custo_reforma: simulacaoData.reforma_rs,
          param_taxa_cet: simulacaoData.taxa_juros_financiamento,
          param_prazo_financiamento: simulacaoData.prazo_financiamento_meses,
          param_tempo_venda: simulacaoData.prazo_venda_meses,
          param_corretagem_venda_pct: simulacaoData.corretagem_venda_pct,
          param_incide_ir: simulacaoData.ir_pago
        };
        setSimulacao(initialSimulacao);
        handleParameterChange('param_valor_compra', initialSimulacao.param_valor_compra);
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
  }, [simulationId, calcularValoresSimulacao]);

  const handleParameterChange = (field: string, value: any) => {
    setSimulacao((prev) => {
      if (!prev) return null;
      const updatedSimulacao = { ...prev, [field]: value };
      
      // Convert string values to numbers for calculation
      const valorCompra = parseFloat(updatedSimulacao.param_valor_compra || '0');
      const valorVenda = parseFloat(updatedSimulacao.param_valor_venda || '0');
      const entradaPct = parseFloat(updatedSimulacao.param_entrada_pct || '0');
      const itbiPct = parseFloat(updatedSimulacao.param_itbi_pct || '0');
      const registroCartorioPct = parseFloat(updatedSimulacao.param_registro_cartorio_pct || '0');
      const taxaCET = parseFloat(updatedSimulacao.param_taxa_cet || '0') / 100 / 12;
      const prazoFinanciamento = parseInt(updatedSimulacao.param_prazo_financiamento || '0');
      const tempoVenda = parseInt(updatedSimulacao.param_tempo_venda || '0');
      const reformaRS = parseFloat(updatedSimulacao.param_custo_reforma || '0');
      const avaliacaoBancaria = parseFloat(updatedSimulacao.param_avaliacao_bancaria || '0');
      const contasGerais = parseFloat(updatedSimulacao.param_contas_gerais || '0');
      const corretagemVendaPct = parseFloat(updatedSimulacao.param_corretagem_venda_pct || '0');

      // Calculate acquisition costs
      const valorEntrada = valorCompra * (entradaPct / 100);
      const valorItbi = valorCompra * (itbiPct / 100);
      const valorRegistroCartorio = valorCompra * (registroCartorioPct / 100);
      const custoAquisicao = valorEntrada + valorItbi + avaliacaoBancaria + valorRegistroCartorio;

      // Calculate financing
      const valorFinanciado = valorCompra - valorEntrada;
      const amortizacaoMensal = valorFinanciado / prazoFinanciamento;

      // Calculate monthly payments (SAC)
      let totalParcelas = 0;
      let saldoDevedor = valorFinanciado;
      for (let i = 0; i < tempoVenda; i++) {
        const jurosMensal = saldoDevedor * taxaCET;
        const parcela = amortizacaoMensal + jurosMensal;
        totalParcelas += parcela;
        saldoDevedor -= amortizacaoMensal;
      }

      // Calculate total costs
      const quitacao = saldoDevedor;
      const totalCondominio = (updatedSimulacao.imovel?.condominio_mensal || 0) * tempoVenda;
      const iptuTotal = ((updatedSimulacao.imovel?.iptu_anual || 0) / 12) * tempoVenda;
      const contasGeraisTotal = contasGerais * tempoVenda;
      const custosAteVenda = totalParcelas + totalCondominio + iptuTotal + contasGeraisTotal + reformaRS;

      // Calculate sale costs
      const corretagem = valorVenda * (corretagemVendaPct / 100);
      const baseCalculoIR = valorVenda - custoAquisicao - quitacao - corretagem - (totalParcelas * 3) / 4 - reformaRS;
      const impostoRenda = updatedSimulacao.param_incide_ir ? Math.max(0, baseCalculoIR * 0.15) : 0;

      // Calculate final results
      const investimentoTotal = custoAquisicao + custosAteVenda;
      const lucroLiquido = valorVenda - investimentoTotal - quitacao - corretagem - impostoRenda;
      const roi = investimentoTotal > 0 ? (lucroLiquido / investimentoTotal) : 0;

      return {
        ...updatedSimulacao,
        calc_parcelas_rs: totalParcelas,
        calc_quitacao_rs: quitacao,
        calc_condominio_rs: totalCondominio,
        roi_liquido: roi,
        investimento_total: investimentoTotal,
        lucro_liquido: lucroLiquido,
        valor_registro_cartorio: valorRegistroCartorio,
        imposto_renda: impostoRenda,
        iptu_total: iptuTotal,
        contas_gerais_total: contasGeraisTotal
      };
    });
  };

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
            <PropertyDetails property={simulacao.imovel} />
          </Section>

          <Section
            title="Análise e Parâmetros"
            expanded={expandedSections.analysisAndParameters}
            onToggle={() => toggleSection("analysisAndParameters")}
          >
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-2 gap-8">
                  {/* Coluna 1: Parâmetros de Compra */}
                  <div>
                    <h3 className="text-md font-medium mb-4 text-gray-700">
                      Parâmetros de Compra
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-500">
                          Valor de compra (R$)
                        </label>
                        <input
                          type="number"
                          value={simulacao?.param_valor_compra || ""}
                          onChange={(e) =>
                            handleParameterChange(
                              "param_valor_compra",
                              e.target.value,
                            )
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Valor do m²:{" "}
                          {formatCurrency(
                            parseFloat(simulacao?.valor_compra || "0") /
                              (simulacao?.imovel?.area || 1),
                          )}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">
                          Entrada (%)
                        </label>
                        <input
                          type="number"
                          value={simulacao?.param_entrada_pct || ""}
                          onChange={(e) =>
                            handleParameterChange("param_entrada_pct", e.target.value)
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">
                          ITBI (%)
                        </label>
                        <input
                          type="number"
                          value={simulacao?.param_itbi_pct || ""}
                          onChange={(e) =>
                            handleParameterChange("param_itbi_pct", e.target.value)
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">
                          Avaliação bancária (R$)
                        </label>
                        <input
                          type="number"
                          value={simulacao?.param_avaliacao_bancaria || ""}
                          onChange={(e) =>
                            handleParameterChange(
                              "param_avaliacao_bancaria",
                              e.target.value,
                            )
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">
                          Registro em cartório (%)
                        </label>
                        <input
                          type="number"
                          value={simulacao?.param_registro_cartorio_pct || ""}
                          onChange={(e) =>
                            handleParameterChange("param_registro_cartorio_pct", e.target.value)
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">
                          Contas gerais (agua, luz etc.) (R$)
                        </label>
                        <input
                          type="number"
                          value={simulacao?.param_contas_gerais || ""}
                          onChange={(e) =>
                            handleParameterChange(
                              "param_contas_gerais",
                              e.target.value,
                            )
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Coluna 2: Parâmetros de Financiamento e Venda */}
                  <div>
                    <h3 className="text-md font-medium mb-4 text-gray-700">
                      Financiamento e Venda
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-500">
                          Valor de venda (R$)
                        </label>
                        <input
                          type="number"
                          value={simulacao?.param_valor_venda || ""}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            handleParameterChange("param_valor_venda", newValue);
                            if (simulacao && simulacao.imovel.area > 0) {
                              const newValorM2 =
                                parseFloat(newValue) / simulacao.imovel.area;
                              handleParameterChange(
                                "valor_m2_venda",
                                newValorM2.toString(),
                              );
                            }
                          }}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Valor do m²:{" "}
                          {formatCurrency(
                            parseFloat(simulacao?.valor_m2_venda || "0"),
                          )}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">
                          Custo estimado reforma (R$)
                        </label>
                        <input
                          type="number"
                          value={simulacao?.param_custo_reforma || ""}
                          onChange={(e) =>
                            handleParameterChange("param_custo_reforma", e.target.value)
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={simulacao?.param_incide_ir || false}
                            onChange={(e) =>
                              handleParameterChange("param_incide_ir", e.target.checked)
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
                <button
                  onClick={recalculateValues}
                  className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Recalcular
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-md font-medium mb-2">
                  Análise de Viabilidade
                </h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">Custos de Aquisição</h4>
                    <p className="text-sm">
                      Entrada:{" "}
                      {formatCurrency(
                        parseFloat(simulacao.valor_compra) *
                          (parseFloat(simulacao.entrada_pct) / 100),
                      )}
                    </p>
                    <p className="text-sm">
                      ITBI:{" "}
                      {formatCurrency(
                        parseFloat(simulacao.valor_compra) *
                          (parseFloat(simulacao.itbi_pct) / 100),
                      )}
                    </p>
                    <p className="text-sm">
                      Avaliação do Banco:{" "}
                      {formatCurrency(parseFloat(simulacao.avaliacao_banco_rs))}
                    </p>
                    <p className="text-sm">
                      Registro:{" "}
                      {formatCurrency(simulacao.valor_registro_cartorio)}
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      Total:{" "}
                      {formatCurrency(
                        parseFloat(simulacao.valor_compra) *
                          (parseFloat(simulacao.entrada_pct) / 100) +
                          parseFloat(simulacao.valor_compra) *
                            (parseFloat(simulacao.itbi_pct) / 100) +
                          parseFloat(simulacao.avaliacao_banco_rs) +
                          simulacao.valor_registro_cartorio,
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Custos até a venda</h4>
                    <p className="text-sm">
                      Parcelas Financiamento:{" "}
                      {formatCurrency(simulacao.calc_parcelas_rs)}
                    </p>
                    <p className="text-sm">
                      Condomínio: {formatCurrency(simulacao.calc_condominio_rs)}
                    </p>
                    <p className="text-sm">
                      IPTU: {formatCurrency(simulacao.iptu_total)}
                    </p>
                    <p className="text-sm">
                      Contas gerais (água, luz, etc.):{" "}
                      {formatCurrency(simulacao.contas_gerais_total)}
                    </p>
                    <p className="text-sm">
                      Reforma:{" "}
                      {formatCurrency(parseFloat(simulacao.reforma_rs))}
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      Total:{" "}
                      {formatCurrency(
                        simulacao.calc_parcelas_rs +
                          simulacao.calc_condominio_rs +
                          simulacao.iptu_total +
                          simulacao.contas_gerais_total +
                          parseFloat(simulacao.reforma_rs),
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Custos de Venda</h4>
                    <p className="text-sm">
                      Quitação do Financiamento:{" "}
                      {formatCurrency(simulacao.calc_quitacao_rs)}
                    </p>
                    <p className="text-sm">
                      Corretagem:{" "}
                      {formatCurrency(
                        parseFloat(simulacao.valor_venda) *
                          (parseFloat(simulacao.corretagem_venda_pct) / 100),
                      )}
                    </p>
                    <p className="text-sm">
                      Imposto de Renda:{" "}
                      {formatCurrency(simulacao.imposto_renda)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Resultados</h4>
                    <p className="text-sm">
                      Investimento Total:{" "}
                      {formatCurrency(simulacao.investimento_total)}
                    </p>
                    <p className="text-sm">
                      Preço de Venda:{" "}
                      {formatCurrency(parseFloat(simulacao.valor_venda))}
                    </p>
                    <p className="text-sm">
                      Lucro Líquido: {formatCurrency(simulacao.lucro_liquido)}
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      ROI: {(simulacao.roi_liquido * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-4">
                Resumo do Investimento
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <KPICard
                  title="Valor de Compra"
                  value={formatCurrency(parseFloat(simulacao.valor_compra))}
                />
                <KPICard
                  title="Valor de Venda"
                  value={formatCurrency(parseFloat(simulacao.valor_venda))}
                />
                <KPICard
                  title="Investimento Total"
                  value={formatCurrency(simulacao.investimento_total)}
                />
                <KPICard
                  title="Lucro Líquido"
                  value={formatCurrency(simulacao.lucro_liquido)}
                />
                <KPICard
                  title="ROI da Operação"
                  value={`${(simulacao.roi_liquido * 100).toFixed(2)}%`}
                  highlight
                />
              </div>
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
