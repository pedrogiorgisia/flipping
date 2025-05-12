
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { Save, HelpCircle } from "lucide-react";
import * as Tooltip from '@radix-ui/react-tooltip';
import toast from 'react-hot-toast';
import {
  getParametrosAnalise,
  updateParametrosAnalise,
  ParametrosAnalise,
} from "../../api";

const parameterGroups = [
  {
    title: "Parâmetros Básicos",
    description: "Configurações fundamentais da análise",
    parameters: ["margem_area_pct", "reducao_pct"]
  },
  {
    title: "Parâmetros de Financiamento",
    description: "Configurações relacionadas ao financiamento do imóvel",
    parameters: ["param_entrada_pct", "param_taxa_cet", "param_prazo_financiamento"]
  },
  {
    title: "Custos de Transação",
    description: "Custos envolvidos na compra e registro do imóvel",
    parameters: ["param_itbi_pct", "param_avaliacao_bancaria", "param_registro_cartorio_pct", "param_custo_reforma_pct"]
  },
  {
    title: "Parâmetros de Venda",
    description: "Configurações relacionadas à venda do imóvel",
    parameters: ["param_tempo_venda", "param_corretagem_venda_pct", "param_desconto_valor_compra"]
  }
];

const parameterDescriptions = {
  margem_area_pct: {
    label: "Margem de Área",
    description: "Este percentual define a variação permitida na área do imóvel ao buscar propriedades comparáveis. Por exemplo: Se escolher 10% e o imóvel tem 100m², serão considerados imóveis de 90m² a 110m².",
    unit: "%",
  },
  reducao_pct: {
    label: "Redução no Preço de Referência",
    description: "Percentual de redução aplicado ao preço médio das propriedades de referência para calcular o valor sugerido de venda. Por exemplo: Se os imóveis similares têm média de R$ 1.000.000 e esse percentual for 8%, o preço sugerido será R$ 920.000.",
    unit: "%",
  },
  param_entrada_pct: {
    label: "Percentual de Entrada",
    description: "Percentual do valor do imóvel exigido como entrada no financiamento. Atualmente, os bancos praticam entre 20% e 30%.",
    unit: "%",
  },
  param_itbi_pct: {
    label: "ITBI",
    description: "Imposto sobre Transmissão de Bens Imóveis, cobrado na transferência do imóvel.",
    unit: "%",
  },
  param_avaliacao_bancaria: {
    label: "Avaliação Bancária",
    description: "Custo cobrado pelo banco para realizar a avaliação do imóvel no processo de financiamento.",
    unit: "R$",
  },
  param_registro_cartorio_pct: {
    label: "Registro em Cartório",
    description: "Percentual do valor do imóvel para custos de registro em cartório.",
    unit: "%",
  },
  param_custo_reforma_pct: {
    label: "Custo de Reforma",
    description: "Estimativa do custo de reforma como percentual do valor do imóvel.",
    unit: "%",
  },
  param_taxa_cet: {
    label: "Taxa CET",
    description: "Custo Efetivo Total da operação, que representa a taxa de juros total aplicada pelo banco no financiamento.",
    unit: "% a.a.",
  },
  param_prazo_financiamento: {
    label: "Prazo de Financiamento",
    description: "Duração total do financiamento imobiliário em meses. O padrão é 420 meses (35 anos).",
    unit: "meses",
  },
  param_tempo_venda: {
    label: "Tempo Estimado de Venda",
    description: "Estimativa do tempo necessário para vender o imóvel após a conclusão da reforma.",
    unit: "meses",
  },
  param_corretagem_venda_pct: {
    label: "Corretagem de Venda",
    description: "Percentual cobrado pelo corretor para intermediar a venda do imóvel.",
    unit: "%",
  },
  param_desconto_valor_compra: {
    label: "Desconto na Compra",
    description: "Desconto estimado a ser negociado no valor de compra do imóvel. Recomenda-se entre 5% e 8%.",
    unit: "%",
  },
};

const FormField = ({ id, value, onChange, label, description, unit }: {
  id: string;
  value: any;
  onChange: (value: any) => void;
  label: string;
  description: string;
  unit: string;
}) => (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>
          <button type="button" className="text-gray-400 hover:text-gray-600">
            <HelpCircle size={16} />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content
          className="max-w-xs p-2 text-sm text-white bg-gray-900 rounded shadow-lg z-50"
          sideOffset={5}
        >
          {description}
          <Tooltip.Arrow className="fill-gray-900" />
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
    <div className="relative">
      <input
        type="number"
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
      />
      {unit && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 text-sm">{unit}</span>
        </div>
      )}
    </div>
  </div>
);

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
          const { id, id_analise, diferenca_max_m2, condominio_max, valor_maximo_imovel, ...filteredData } = data;
          setSettings(filteredData);
        } catch (error) {
          console.error("Erro ao carregar configurações:", error);
          setError("Erro ao carregar as configurações. Por favor, tente novamente.");
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
        toast.success("Configurações salvas com sucesso!");
        setSettingsChanged(false);
      } catch (error) {
        console.error("Erro ao salvar as configurações:", error);
        toast.error("Erro ao salvar as configurações. Por favor, tente novamente.");
      }
    }
  };

  if (loading) return (
    <MainLayout>
      <div className="text-center py-12">Carregando...</div>
    </MainLayout>
  );
  
  if (error) return (
    <MainLayout>
      <div className="text-center py-12 text-red-600">{error}</div>
    </MainLayout>
  );
  
  if (!settings) return (
    <MainLayout>
      <div className="text-center py-12">Nenhuma configuração encontrada.</div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <Tooltip.Provider>
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
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <Save className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Salvar Alterações
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {parameterGroups.map((group) => (
              <div key={group.title} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">{group.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{group.description}</p>
                </div>
                <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.parameters.map((paramKey) => {
                    const description = parameterDescriptions[paramKey];
                    if (description) {
                      return (
                        <FormField
                          key={paramKey}
                          id={paramKey}
                          value={settings[paramKey]}
                          onChange={(value) => handleChange(paramKey, value)}
                          label={description.label}
                          description={description.description}
                          unit={description.unit}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Tooltip.Provider>
    </MainLayout>
  );
};

export default SettingsPage;
