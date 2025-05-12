import React, { useState } from "react";
import { FaInfoCircle, FaTimes } from "react-icons/fa";

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
  console.log("Simulação:", simulacao);
  console.log("Investimento total:", simulacao.investimento_total);

  const [showDetails, setShowDetails] = useState(false);

  const parameters = [
    [
      {
        label: "Valor de venda",
        param: "param_valor_venda",
        prefix: "R$",
        step: 1000,
      },
      {
        label: "Valor de compra",
        param: "param_valor_compra",
        prefix: "R$",
        step: 1000,
      },
      {
        label: "Custo reforma",
        param: "param_custo_reforma",
        prefix: "R$",
        step: 1000,
      },
    ],
    [
      { label: "Entrada", param: "param_entrada_pct", suffix: "%", step: 1 },
      {
        label: "Tempo de venda",
        param: "param_tempo_venda",
        suffix: " meses",
        step: 1,
      },
      { label: "Taxa CET", param: "param_taxa_cet", suffix: "%", step: 0.1 },
    ],
    [
      { label: "ITBI", param: "param_itbi_pct", suffix: "%", step: 0.1 },
      {
        label: "Avaliação bancária",
        param: "param_avaliacao_bancaria",
        prefix: "R$",
        step: 100,
      },
      {
        label: "Registro em cartório",
        param: "param_registro_cartorio_pct",
        suffix: "%",
        step: 0.1,
      },
    ],
    [
      {
        label: "Contas gerais",
        param: "param_contas_gerais",
        prefix: "R$",
        step: 100,
      },
      {
        label: "Prazo financiamento",
        param: "param_prazo_financiamento",
        suffix: " meses",
        step: 1,
      },
      {
        label: "Corretagem venda",
        param: "param_corretagem_venda_pct",
        suffix: "%",
        step: 0.1,
      },
    ],
  ];

  const custosAquisicao =
    parseFloat(simulacao.calc_entrada) +
    parseFloat(simulacao.calc_itbi) +
    parseFloat(simulacao.param_avaliacao_bancaria) +
    parseFloat(simulacao.calc_registro_cartorio);

  const custosAteVenda =
    parseFloat(simulacao.calc_quitacao_financiamento) +
    simulacao.imovel.condominio_mensal * simulacao.param_tempo_venda +
    (simulacao.imovel.iptu_anual / 12) * simulacao.param_tempo_venda +
    parseFloat(simulacao.param_contas_gerais) * simulacao.param_tempo_venda +
    parseFloat(simulacao.param_custo_reforma);

  const investimentoTotal = custosAquisicao + custosAteVenda;

  const custosVenda =
    parseFloat(simulacao.calc_quitacao_financiamento) +
    parseFloat(simulacao.calc_corretagem) +
    parseFloat(simulacao.calc_imposto_renda);

  const lucroLiquido =
    parseFloat(simulacao.param_valor_venda) - investimentoTotal - custosVenda;

  const roi = lucroLiquido / investimentoTotal;

  const viabilityAnalysis = [
    {
      title: "Custos de Aquisição",
      items: [
        { label: "Entrada", value: parseFloat(simulacao.calc_entrada) },
        { label: "ITBI", value: parseFloat(simulacao.calc_itbi) },
        {
          label: "Avaliação do Banco",
          value: parseFloat(simulacao.param_avaliacao_bancaria),
        },
        {
          label: "Registro",
          value: parseFloat(simulacao.calc_registro_cartorio),
        },
      ],
      total: custosAquisicao,
    },
    {
      title: "Custos até a venda",
      items: [
        {
          label: "Parcelas Financiamento",
          value: parseFloat(simulacao.calc_quitacao_financiamento),
        },
        {
          label: "Condomínio",
          value:
            simulacao.imovel.condominio_mensal * simulacao.param_tempo_venda,
        },
        {
          label: "IPTU",
          value:
            (simulacao.imovel.iptu_anual / 12) * simulacao.param_tempo_venda,
        },
        {
          label: "Contas gerais",
          value:
            parseFloat(simulacao.param_contas_gerais) *
            simulacao.param_tempo_venda,
        },
        { label: "Reforma", value: parseFloat(simulacao.param_custo_reforma) },
      ],
      total: custosAteVenda,
    },
    {
      title: "Custos de Venda",
      items: [
        {
          label: "Quitação do Financiamento",
          value: parseFloat(simulacao.calc_quitacao_financiamento),
        },
        { label: "Corretagem", value: parseFloat(simulacao.calc_corretagem) },
        {
          label: "Imposto de Renda",
          value: parseFloat(simulacao.calc_imposto_renda),
        },
      ],
      total: custosVenda,
    },
    {
      title: "Resultados",
      items: [
        {
          label: "Preço de venda (+)",
          value: parseFloat(simulacao.param_valor_venda),
        },
        { label: "Investimento total (-)", value: -investimentoTotal },
        { label: "Custo de venda (-)", value: -custosVenda },
        { label: "Lucro líquido (=)", value: lucroLiquido },
        { label: "ROI (=)", value: roi, isPercentage: true },
      ],
    },
  ];

  const kpis = [
    { label: "Preço de venda", value: parseFloat(simulacao.param_valor_venda) },
    { label: "Investimento total", value: investimentoTotal },
    { label: "Custo de venda", value: custosVenda },
    { label: "Lucro líquido", value: lucroLiquido },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Calculadora ROI</h2>

      {/* ROI Card */}
      <div className="bg-blue-100 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold text-blue-800">ROI da Operação</p>
        <p className="text-3xl font-bold text-blue-600">
          {(roi * 100).toFixed(2)}%
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-gray-100 p-3 rounded-lg">
            <p className="text-xs font-semibold text-gray-600">{kpi.label}</p>
            <p className="text-sm font-bold text-gray-800">
              {formatCurrency(kpi.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Viability Analysis Details Button */}
      <button
        onClick={() => setShowDetails(true)}
        className="w-full mb-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
      >
        <FaInfoCircle className="inline-block mr-2" />
        Ver detalhes da análise de viabilidade
      </button>

      {/* Parameters */}
      <div className="space-y-6">
        {parameters.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3 gap-4">
            {row.map((param) => (
              <div key={param.param} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {param.label}
                </label>
                <div className="flex items-center">
                  {param.prefix && (
                    <span className="text-gray-500 mr-2">{param.prefix}</span>
                  )}
                  <input
                    type="number"
                    step={param.step}
                    value={simulacao[param.param] || ""}
                    onChange={(e) =>
                      handleParameterChange(param.param, e.target.value)
                    }
                    className="w-full border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-blue-500 text-lg appearance-none"
                  />
                  {param.suffix && (
                    <span className="text-gray-500 ml-2">{param.suffix}</span>
                  )}
                </div>
                {(param.param === "param_valor_venda" ||
                  param.param === "param_valor_compra") &&
                  simulacao.imovel &&
                  simulacao.imovel.area && (
                    <p className="text-xs text-gray-500 mt-1">
                      Valor do m²:{" "}
                      {formatCurrency(
                        (simulacao[param.param] || 0) / simulacao.imovel.area,
                      )}
                    </p>
                  )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center my-6">
        <input
          type="checkbox"
          checked={simulacao.param_incide_ir === true}
          onChange={(e) =>
            handleParameterChange("param_incide_ir", e.target.checked)
          }
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        <span className="ml-2 text-sm text-gray-700">
          Incide Imposto de Renda?
        </span>
      </div>

      <button
        onClick={salvarSimulacao}
        className="w-full mt-6 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out"
      >
        Salvar simulação
      </button>

      {/* Viability Analysis Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Análise de Viabilidade
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            {viabilityAnalysis.map((section, index) => (
              <div
                key={index}
                className="mb-6 last:mb-0 bg-gray-50 p-4 rounded-lg"
              >
                <h4 className="font-semibold text-gray-800 mb-2">
                  {section.title}
                </h4>
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex justify-between text-sm mb-1"
                  >
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium">
                      {item.isPercentage
                        ? `${(item.value * 100).toFixed(2)}%`
                        : formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
                {section.total !== undefined && (
                  <div className="flex justify-between text-sm font-semibold mt-2 pt-2 border-t border-gray-300">
                    <span>Total:</span>
                    <span>{formatCurrency(section.total)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculationParameters;
