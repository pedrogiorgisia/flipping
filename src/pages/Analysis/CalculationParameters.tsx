
import React from 'react';
import { Settings, Percent, Calendar } from 'lucide-react';

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
  };
  onParameterChange: (field: string, value: number | boolean) => void;
}

const CalculationParameters: React.FC<CalculationParametersProps> = ({ 
  parameters, 
  onParameterChange 
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Settings size={20} className="mr-2 text-blue-600" />
          Parâmetros de Cálculo
        </h3>
      </div>
      <div className="px-4 py-5 sm:p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="down-payment" className="text-sm font-medium text-gray-700 flex items-center">
              <Percent size={16} className="mr-1 text-gray-400" />
              Entrada (%)
            </label>
            <span className="text-sm text-gray-500">{parameters.downPaymentPercent}%</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="range"
              id="down-payment"
              min="10"
              max="50"
              step="5"
              value={parameters.downPaymentPercent}
              onChange={(e) => onParameterChange('downPaymentPercent', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={parameters.downPaymentPercent}
                onChange={(e) => onParameterChange('downPaymentPercent', parseInt(e.target.value))}
                className="w-20 px-2 py-1 text-sm border rounded"
              />
              <span className="text-sm text-gray-500">=</span>
              <span className="text-sm text-gray-700">{formatCurrency(parameters.propertyPrice * (parameters.downPaymentPercent / 100))}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="sale-time" className="text-sm font-medium text-gray-700 flex items-center">
              <Calendar size={16} className="mr-1 text-gray-400" />
              Tempo para Venda (meses)
            </label>
            <span className="text-sm text-gray-500">{parameters.saleTimeMonths} meses</span>
          </div>
          <input
            type="range"
            id="sale-time"
            min="1"
            max="24"
            value={parameters.saleTimeMonths}
            onChange={(e) => onParameterChange('saleTimeMonths', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="cet-rate" className="text-sm font-medium text-gray-700">
              CET (Taxa de Juros %)
            </label>
            <span className="text-sm text-gray-500">{parameters.cetRate}%</span>
          </div>
          <input
            type="range"
            id="cet-rate"
            min="8"
            max="20"
            step="0.25"
            value={parameters.cetRate}
            onChange={(e) => onParameterChange('cetRate', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="financing-months" className="text-sm font-medium text-gray-700">
              Prazo do Financiamento (meses)
            </label>
            <span className="text-sm text-gray-500">{parameters.financingMonths} meses</span>
          </div>
          <input
            type="range"
            id="financing-months"
            min="120"
            max="420"
            step="60"
            value={parameters.financingMonths}
            onChange={(e) => onParameterChange('financingMonths', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="brokerage" className="text-sm font-medium text-gray-700">
              Corretagem (%)
            </label>
            <span className="text-sm text-gray-500">{parameters.brokeragePercent}%</span>
          </div>
          <input
            type="range"
            id="brokerage"
            min="2"
            max="6"
            step="0.5"
            value={parameters.brokeragePercent}
            onChange={(e) => onParameterChange('brokeragePercent', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="income-tax" className="text-sm font-medium text-gray-700">
              Imposto de Renda
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="income-tax"
                checked={parameters.hasIncomeTax}
                onChange={(e) => onParameterChange('hasIncomeTax', e.target.checked)}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="income-tax"
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="itbi" className="text-sm font-medium text-gray-700">
              ITBI (%)
            </label>
            <span className="text-sm text-gray-500">{parameters.itbiPercent}%</span>
          </div>
          <input
            type="range"
            id="itbi"
            min="2"
            max="5"
            step="0.1"
            value={parameters.itbiPercent}
            onChange={(e) => onParameterChange('itbiPercent', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="market-discount" className="text-sm font-medium text-gray-700">
              Desconto do Mercado (%)
            </label>
            <span className="text-sm text-gray-500">{parameters.marketDiscountPercent}%</span>
          </div>
          <input
            type="range"
            id="market-discount"
            min="5"
            max="15"
            step="1"
            value={parameters.marketDiscountPercent}
            onChange={(e) => onParameterChange('marketDiscountPercent', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default CalculationParameters;
