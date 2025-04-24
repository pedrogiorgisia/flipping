import React from 'react';

interface Props {
  parameters: {
    downPaymentPercent: number;
    saleTimeMonths: number;
    cetRate: number;
    financingMonths: number;
    brokeragePercent: number;
    hasIncomeTax: boolean;
    itbiPercent: number;
    marketDiscountPercent: number;
  };
  onParameterChange: (field: string, value: any) => void;
}

const CalculationParameters: React.FC<Props> = ({ parameters, onParameterChange }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Parâmetros de Cálculo</h3>
      </div>
      <div className="px-4 py-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="text-sm text-gray-600">Entrada</label>
            <input
              type="number"
              value={parameters.downPaymentPercent}
              onChange={(e) => onParameterChange('downPaymentPercent', parseFloat(e.target.value))}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="text-sm text-gray-600">Taxa (CET)</label>
            <input
              type="number"
              value={parameters.cetRate}
              onChange={(e) => onParameterChange('cetRate', parseFloat(e.target.value))}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="text-sm text-gray-600">Prazo (meses)</label>
            <input
              type="number"
              value={parameters.financingMonths}
              onChange={(e) => onParameterChange('financingMonths', parseInt(e.target.value))}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="text-sm text-gray-600">ITBI (%)</label>
            <input
              type="number"
              value={parameters.itbiPercent}
              onChange={(e) => onParameterChange('itbiPercent', parseFloat(e.target.value))}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="text-sm text-gray-600">Corretagem (%)</label>
            <input
              type="number"
              value={parameters.brokeragePercent}
              onChange={(e) => onParameterChange('brokeragePercent', parseFloat(e.target.value))}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="text-sm text-gray-600">Tempo de venda (meses)</label>
            <input
              type="number"
              value={parameters.saleTimeMonths}
              onChange={(e) => onParameterChange('saleTimeMonths', parseInt(e.target.value))}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="text-sm text-gray-600">Desconto de mercado (%)</label>
            <input
              type="number"
              value={parameters.marketDiscountPercent}
              onChange={(e) => onParameterChange('marketDiscountPercent', parseFloat(e.target.value))}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>
          <button
            onClick={() => onParameterChange('recalculate', true)}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-medium"
          >
            Recalcular
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculationParameters;