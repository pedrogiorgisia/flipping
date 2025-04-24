import React from 'react';

interface AnalysisResultsProps {
  results: {
    totalInvestment: number;
    monthlyPayment: number;
    financingAmount: number;
    salePrice: number;
    netProfit: number;
    roi: number;
  };
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Custos do Investimento</h3>
        </div>
        <div className="px-6 py-5">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Investimento Total</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {formatCurrency(results.totalInvestment)}
              </p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">Valor do Financiamento</p>
              <p className="mt-1 text-2xl font-semibold text-indigo-600">
                {formatCurrency(results.financingAmount)}
              </p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">Parcela Mensal</p>
              <p className="mt-1 text-xl font-medium text-gray-900">
                {formatCurrency(results.monthlyPayment)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Resultados da Operação</h3>
        </div>
        <div className="px-6 py-5">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Preço de Venda</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {formatCurrency(results.salePrice)}
              </p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">Lucro Líquido</p>
              <p className="mt-1 text-2xl font-semibold text-green-600">
                {formatCurrency(results.netProfit)}
              </p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">ROI da Operação</p>
              <p className="mt-1 text-2xl font-semibold text-blue-600">
                {results.roi.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;