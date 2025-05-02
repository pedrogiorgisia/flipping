import React from "react";
import { Calculator } from "lucide-react";

interface CalculationParametersProps {
  parameters: {
    downPaymentPercent: number;
    saleTimeMonths: number;
    cetRate: number;
    financingMonths: number;
    brokeragePercent: number;
    hasIncomeTax: boolean;
    itbiPercent: number;
    marketDiscountPercent: number;
    estimatedRenovationCost: number;
    bankAppraisalCost: number;
  };
  onParameterChange: (field: string, value: any) => void;
  onRecalculate: () => void;
}

const CalculationParameters: React.FC<CalculationParametersProps> = ({
  parameters,
  onParameterChange,
  onRecalculate,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Parâmetros de Cálculo
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Entrada (%)"
          value={parameters.downPaymentPercent}
          onChange={(value) => onParameterChange("downPaymentPercent", value)}
          type="number"
        />
        <InputField
          label="Tempo até venda (meses)"
          value={parameters.saleTimeMonths}
          onChange={(value) => onParameterChange("saleTimeMonths", value)}
          type="number"
        />
        <InputField
          label="Taxa CET (%)"
          value={parameters.cetRate}
          onChange={(value) => onParameterChange("cetRate", value)}
          type="number"
          step="0.01"
        />
        <InputField
          label="Prazo financiamento (meses)"
          value={parameters.financingMonths}
          onChange={(value) => onParameterChange("financingMonths", value)}
          type="number"
        />
        <InputField
          label="Corretagem e venda (%)"
          value={parameters.brokeragePercent}
          onChange={(value) => onParameterChange("brokeragePercent", value)}
          type="number"
          step="0.01"
        />
        <InputField
          label="ITBI (%)"
          value={parameters.itbiPercent}
          onChange={(value) => onParameterChange("itbiPercent", value)}
          type="number"
          step="0.01"
        />
        <InputField
          label="Desconto de mercado (%)"
          value={parameters.marketDiscountPercent}
          onChange={(value) =>
            onParameterChange("marketDiscountPercent", value)
          }
          type="number"
          step="0.01"
        />
        <InputField
          label="Custo estimado de reforma (R$)"
          value={parameters.estimatedRenovationCost}
          onChange={(value) =>
            onParameterChange("estimatedRenovationCost", value)
          }
          type="number"
        />
        <InputField
          label="Custo avaliação banco (R$)"
          value={parameters.bankAppraisalCost}
          onChange={(value) => onParameterChange("bankAppraisalCost", value)}
          type="number"
        />
        <div className="col-span-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={parameters.hasIncomeTax}
              onChange={(e) =>
                onParameterChange("hasIncomeTax", e.target.checked)
              }
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-700">
              Incide Imposto de Renda?
            </span>
          </label>
        </div>
      </div>
      <button
        onClick={onRecalculate}
        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Calculator size={16} className="inline-block mr-2" />
        Recalcular
      </button>
    </div>
  );
};

const InputField: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  type: string;
  step?: string;
}> = ({ label, value, onChange, type, step }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      step={step}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>
);

export default CalculationParameters;
