import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { Save } from "lucide-react";
import {
  getParametrosAnalise,
  updateParametrosAnalise,
  ParametrosAnalise,
} from "../../api";

const parameterDescriptions: {
  [key: string]: { label: string; description: string; unit: string };
} = {
  margem_area_pct: {
    label: "Margem de Área",
    description:
      "Variação percentual permitida na área do imóvel ao buscar propriedades comparáveis.",
    unit: "%",
  },
  diferenca_max_m2: {
    label: "Diferença Máxima de Preço por m²",
    description:
      "Diferença máxima permitida no preço por m² entre o imóvel alvo e as referências.",
    unit: "R$/m²",
  },
  condominio_max: {
    label: "Condomínio Máximo",
    description: "Valor máximo aceitável para a taxa de condomínio mensal.",
    unit: "R$",
  },
  valor_maximo_imovel: {
    label: "Valor Máximo do Imóvel",
    description: "Preço máximo considerado para aquisição de um imóvel.",
    unit: "R$",
  },
  reducao_pct: {
    label: "Redução no Preço de Referência",
    description:
      "Percentual de redução aplicado ao preço médio das propriedades de referência.",
    unit: "%",
  },
  param_entrada_pct: {
    label: "Percentual de Entrada",
    description: "Porcentagem do valor do imóvel a ser paga como entrada.",
    unit: "%",
  },
  param_itbi_pct: {
    label: "ITBI",
    description: "Percentual do Imposto sobre Transmissão de Bens Imóveis.",
    unit: "%",
  },
  param_avaliacao_bancaria: {
    label: "Avaliação Bancária",
    description: "Custo estimado para a avaliação bancária do imóvel.",
    unit: "R$",
  },
  param_registro_cartorio_pct: {
    label: "Registro em Cartório",
    description:
      "Percentual do valor do imóvel para custos de registro em cartório.",
    unit: "%",
  },
  param_contas_gerais: {
    label: "Contas Gerais Mensais",
    description:
      "Estimativa de gastos mensais com contas gerais (água, luz, etc).",
    unit: "R$",
  },
  param_custo_reforma_pct: {
    label: "Custo de Reforma",
    description:
      "Percentual do valor do imóvel estimado para custos de reforma.",
    unit: "%",
  },
  param_taxa_cet: {
    label: "Taxa CET",
    description: "Custo Efetivo Total do financiamento ao ano.",
    unit: "%",
  },
  param_prazo_financiamento: {
    label: "Prazo de Financiamento",
    description: "Duração do financiamento imobiliário.",
    unit: "meses",
  },
  param_tempo_venda: {
    label: "Tempo Estimado de Venda",
    description: "Tempo estimado para vender o imóvel após a reforma.",
    unit: "meses",
  },
  param_incide_ir: {
    label: "Incidência de IR",
    description: "Indica se há incidência de Imposto de Renda na operação.",
    unit: "",
  },
  param_corretagem_venda_pct: {
    label: "Corretagem de Venda",
    description: "Percentual cobrado pelo corretor na venda do imóvel.",
    unit: "%",
  },
  param_desconto_valor_compra: {
    label: "Desconto na Compra",
    description: "Percentual de desconto esperado na negociação de compra.",
    unit: "%",
  },
};

const SettingsPage: React.FC = () => {
  const { id: analiseId } = useParams<{ id: string }>();
  const [settings, setSettings] = useState<ParametrosAnalise | null>(null);
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (analiseId) {
        try {
          setLoading(true);
          const data = await getParametrosAnalise(analiseId);
          // Remove 'id' and 'id_analise' from the settings
          const { id, id_analise, ...filteredData } = data;
          setSettings(filteredData);
        } catch (error) {
          console.error("Erro ao carregar configurações:", error);
          setError(
            "Erro ao carregar as configurações. Por favor, tente novamente.",
          );
        } finally {
          setLoading(false);
        }
      } else {
        setError("ID da análise não encontrado");
        setLoading(false);
      }
    };

    fetchSettings();
  }, [analiseId]);

  const handleChange = (key: string, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
      setSettingsChanged(true);
    }
  };

  const handleSave = async () => {
    if (settings && analiseId) {
      try {
        await updateParametrosAnalise(analiseId, settings);
        alert("Configurações salvas com sucesso!");
        setSettingsChanged(false);
      } catch (error) {
        console.error("Erro ao salvar as configurações:", error);
        alert("Erro ao salvar as configurações. Por favor, tente novamente.");
      }
    }
  };

  const renderInput = (key: string, value: any) => {
    const description = parameterDescriptions[key] || {
      label: key,
      description: "",
      unit: "",
    };
    const { label, description: desc, unit } = description;
    const type = typeof value === "boolean" ? "checkbox" : "number";

    return (
      <div key={key} className="mb-4 p-4 bg-white rounded-lg shadow">
        <label
          htmlFor={key}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          {type === "number" && unit === "R$" && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
          )}
          <input
            type={type}
            id={key}
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            value={value}
            onChange={(e) =>
              handleChange(
                key,
                type === "number" ? Number(e.target.value) : e.target.checked,
              )
            }
            checked={type === "checkbox" ? value : undefined}
          />
          {type === "number" && unit !== "R$" && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{unit}</span>
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-500">{desc}</p>
      </div>
    );
  };

  if (loading)
    return (
      <MainLayout>
        <div className="text-center py-12">Carregando...</div>
      </MainLayout>
    );
  if (error)
    return (
      <MainLayout>
        <div className="text-center py-12 text-red-600">{error}</div>
      </MainLayout>
    );
  if (!settings)
    return (
      <MainLayout>
        <div className="text-center py-12">
          Nenhuma configuração encontrada.
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Parâmetros da Análise
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={!settingsChanged}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                settingsChanged
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-300 cursor-not-allowed"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <Save className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Salvar Alterações
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(settings).map(([key, value]) =>
              renderInput(key, value),
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
