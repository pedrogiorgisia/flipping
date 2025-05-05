import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { ChevronDown, ChevronUp, Plus, Home, ArrowLeft } from "lucide-react";
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
  calc_entrada?: number;
  calc_itbi?: number;
}

// Função auxiliar para formatar moeda
const formatCurrencyInput = (value: string | undefined) => {
  if (!value) return "R$ 0,00";
  const number = parseFloat(value.replace(/\D/g, "")) / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number);
};

// Função auxiliar para parsear o valor formatado
const parseCurrencyInput = (value: string) => {
  return value.replace(/\D/g, "") || "0";
};

const AnalysisPage: React.FC = () => {
  const { propertyId: simulationId } = useParams<{ propertyId: string }>();
  const [simulacao, setSimulacao] = useState<Simulacao | null>(null);
  const [referenciasSimulacao, setReferenciasSimulacao] = useState<
    ReferenceProperty[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


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

  const salvarSimulacao = async () => {
    if (!simulacao || !simulationId) return;

    const parseDecimal = (value: string | number) => {
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
      {/* Cabeçalho Fixo */}
      <div className="sticky-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col space-y-1">
              <div className="breadcrumb">
                <Link to="/dashboard" className="breadcrumb-item">
                  <Home size={16} />
                </Link>
                <span className="breadcrumb-separator">/</span>
                <Link to="/analyses" className="breadcrumb-item">
                  Simulações
                </Link>
                <span className="breadcrumb-separator">/</span>
                <span className="text-gray-900">#{simulationId}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Simulação & Investimento
              </h1>
            </div>
            <button className="btn-primary">
              <Plus size={16} />
              <span>Nova Simulação</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Informações do Imóvel */}
        <section className="card">
          <h2 className="section-title">Informações do Imóvel</h2>
          <div className="property-info-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </section>

        {/* Parâmetros da Simulação */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="card">
              <h2 className="section-title">Parâmetros de Compra</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Valor de compra (R$)"
                  value={formatCurrencyInput(simulacao?.param_valor_compra)}
                  onChange={(e) => {
                    const rawValue = parseCurrencyInput(e.target.value);
                    handleParameterChange("param_valor_compra", rawValue);
                  }}
                />
                <InputField
                  label="Entrada (%)"
                  type="number"
                  value={simulacao?.param_entrada_pct}
                  onChange={(e) =>
                    handleParameterChange("param_entrada_pct", e.target.value)
                  }
                />
                <InputField
                  label="ITBI (%)"
                  type="number"
                  value={simulacao?.param_itbi_pct}
                  onChange={(e) =>
                    handleParameterChange("param_itbi_pct", e.target.value)
                  }
                />
                <InputField
                  label="Avaliação bancária (R$)"
                  value={formatCurrencyInput(simulacao?.param_avaliacao_bancaria)}
                  onChange={(e) => {
                    const rawValue = parseCurrencyInput(e.target.value);
                    handleParameterChange("param_avaliacao_bancaria", rawValue);
                  }}
                />
                <InputField
                  label="Registro em cartório (%)"
                  type="number"
                  value={simulacao?.param_registro_cartorio_pct}
                  onChange={(e) =>
                    handleParameterChange(
                      "param_registro_cartorio_pct",
                      e.target.value,
                    )
                  }
                />
                <InputField
                  label="Contas gerais (agua, luz etc.) (R$)"
                  value={formatCurrencyInput(simulacao?.param_contas_gerais)}
                  onChange={(e) => {
                    const rawValue = parseCurrencyInput(e.target.value);
                    handleParameterChange("param_contas_gerais", rawValue);
                  }}
                />
              </div>
            </section>

            <section className="card">
              <h2 className="section-title">Financiamento e Venda</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Valor de venda (R$)"
                  value={formatCurrencyInput(simulacao?.param_valor_venda)}
                  onChange={(e) => {
                    const rawValue = parseCurrencyInput(e.target.value);
                    handleParameterChange("param_valor_venda", rawValue);
                    if (simulacao && simulacao.imovel.area > 0) {
                      const newValorM2 =
                        parseFloat(rawValue) / 100 / simulacao.imovel.area;
                      handleParameterChange(
                        "valor_m2_venda",
                        newValorM2.toString(),
                      );
                    }
                  }}
                />
                <InputField
                  label="Tempo de venda (meses)"
                  type="number"
                  value={simulacao?.param_tempo_venda}
                  onChange={(e) =>
                    handleParameterChange("param_tempo_venda", e.target.value)
                  }
                />
                <InputField
                  label="Custo estimado reforma (R$)"
                  value={formatCurrencyInput(simulacao?.param_custo_reforma)}
                  onChange={(e) => {
                    const rawValue = parseCurrencyInput(e.target.value);
                    handleParameterChange("param_custo_reforma", rawValue);
                  }}
                />
                <InputField
                  label="Taxa CET (%)"
                  type="number"
                  value={simulacao?.param_taxa_cet}
                  onChange={(e) =>
                    handleParameterChange("param_taxa_cet", e.target.value)
                  }
                />
                <InputField
                  label="Prazo financiamento (meses)"
                  type="number"
                  value={simulacao?.param_prazo_financiamento}
                  onChange={(e) =>
                    handleParameterChange(
                      "param_prazo_financiamento",
                      e.target.value,
                    )
                  }
                />
                <InputField
                  label="Corretagem venda (%)"
                  type="number"
                  value={simulacao?.param_corretagem_venda_pct}
                  onChange={(e) =>
                    handleParameterChange(
                      "param_corretagem_venda_pct",
                      e.target.value,
                    )
                  }
                />
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
            </section>
          </div>

          {/* Análise de Viabilidade */}
          <section className="card">
            <h2 className="section-title">Análise de Viabilidade</h2>
            <div className="analysis-card mb-4">
              <h3 className="text-sm font-medium text-blue-900 mb-3">
                Resumo do Investimento
              </h3>
              <div className="space-y-3">
                <ResultRow
                  label="Investimento Total"
                  value={formatCurrency(simulacao?.investimento_total)}
                />
                <ResultRow
                  label="Lucro Líquido"
                  value={formatCurrency(simulacao?.lucro_liquido)}
                />
                <ResultRow
                  label="ROI"
                  value={`${((simulacao?.roi_liquido || 0) * 100).toFixed(
                    2,
                  )}%`}
                  highlight
                />
              </div>
            </div>

            <div className="space-y-4">
              <CostSection
                title="Custos de Aquisição"
                items={[
                  {
                    label: "Entrada",
                    value: formatCurrency(simulacao?.calc_entrada || 0),
                  },
                  {
                    label: "ITBI",
                    value: formatCurrency(simulacao?.calc_itbi || 0),
                  },
                  {
                    label: "Avaliação do Banco",
                    value: formatCurrency(
                      parseFloat(simulacao?.param_avaliacao_bancaria || "0") || 0,
                    ),
                  },
                  {
                    label: "Registro",
                    value: formatCurrency(simulacao?.valor_registro_cartorio || 0),
                  },
                ]}
              />

              <CostSection
                title="Custos até a venda"
                items={[
                  {
                    label: "Parcelas Financiamento",
                    value: formatCurrency(simulacao?.calc_parcelas_rs || 0),
                  },
                  {
                    label: "Condomínio",
                    value: formatCurrency(simulacao?.calc_condominio_rs || 0),
                  },
                  {
                    label: "IPTU",
                    value: formatCurrency(simulacao?.iptu_total || 0),
                  },
                  {
                    label: "Contas gerais (água, luz, etc.)",
                    value: formatCurrency(simulacao?.contas_gerais_total || 0),
                  },
                  {
                    label: "Reforma",
                    value: formatCurrency(
                      parseFloat(simulacao?.param_custo_reforma || "0") || 0,
                    ),
                  },
                ]}
              />

              <CostSection
                title="Custos de Venda"
                items={[
                  {
                    label: "Quitação do Financiamento",
                    value: formatCurrency(simulacao?.calc_quitacao_rs || 0),
                  },
                  {
                    label: "Corretagem",
                    value: formatCurrency(
                      (parseFloat(simulacao?.param_valor_venda || "0") || 0) *
                        (parseFloat(simulacao?.param_corretagem_venda_pct || "0") / 100),
                    ),
                  },
                  {
                    label: "Imposto de Renda",
                    value: formatCurrency(simulacao?.imposto_renda || 0),
                  },
                ]}
              />
            </div>
          </section>
        </div>

        {/* Imóveis de Referência */}
        <section className="card">
          <h2 className="section-title">Imóveis de Referência</h2>
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
        </section>
      </div>
    </MainLayout>
  );
};


const InputField: React.FC<{
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}> = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="input-field w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
  </div>
);

const PropertyInfoCard: React.FC<{
  icon: string;
  title: string;
  value: string | number;
}> = ({ icon, title, value }) => (
  <div className="info-card p-4 bg-gray-50 rounded-lg">
    <span className="info-icon text-xl">{icon}</span>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const ResultRow: React.FC<{
  label: string;
  value: string;
  highlight?: boolean;
}> = ({ label, value, highlight }) => (
  <div className="result-row flex justify-between items-center">
    <span className="result-label text-sm text-gray-600">{label}</span>
    <span className={`result-value ${highlight ? 'result-highlight text-blue-600' : ''}`}>
      {value}
    </span>
  </div>
);

const CostSection: React.FC<{
  title: string;
  items: Array<{ label: string; value: string }>;
}> = ({ title, items }) => (
  <div>
    <h4 className="text-sm font-medium mb-2">{title}</h4>
    <div className="space-y-1">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between text-sm">
          <span className="text-gray-600">{item.label}</span>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

//Type definition for ReferenceProperty is missing in original and edited code, so I'm adding a placeholder.  You'll need to replace this with the actual type.
interface ReferenceProperty {
  id: string;
  // Add other properties as needed
}

export default AnalysisPage;