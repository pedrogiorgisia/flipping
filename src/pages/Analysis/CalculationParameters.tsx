
import React from "react";
import { KPICard } from "./components/KPICard";

interface CalculationParametersProps {
  simulacao: any;
  handleParameterChange: (field: string, value: any) => void;
  salvarSimulacao: () => void;
  formatCurrency: (value: number) => string;
}

const CalculationParameters: React.FC<CalculationParametersProps> = ({
  simulacao,
  handleParameterChange,
  salvarSimulacao,
  formatCurrency,
}) => {
  return (
    <div className="space-y-8">
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
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">
          Resumo do Investimento
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <KPICard
            title="Valor de Compra"
            value={formatCurrency(simulacao.param_valor_compra)}
          />
          <KPICard
            title="Valor de Venda"
            value={formatCurrency(simulacao.param_valor_venda)}
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
    </div>
  );
};

export default CalculationParameters;
