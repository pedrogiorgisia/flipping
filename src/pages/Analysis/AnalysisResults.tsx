import React from 'react';

interface AnalysisResultsProps {
  results: {
    totalInvestment: number;
    monthlyPayment: number;
    financingAmount: number;
    salePrice: number;
    netProfit: number;
    roi: number;
    monthlyPayments: Array<{
      month: number;
      initialBalance: number;
      amortization: number;
      interest: number;
      monthlyPayment: number;
      finalBalance: number;
    }>;
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
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Análise de Investimento</h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Custos do Investimento</h4>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-600">Investimento Total:</dt>
                <dd className="font-medium">{formatCurrency(results.totalInvestment)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Valor do Financiamento:</dt>
                <dd className="font-medium">{formatCurrency(results.financingAmount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Parcela Mensal:</dt>
                <dd className="font-medium">{formatCurrency(results.monthlyPayment)}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Resultados</h4>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-600">Preço de Venda:</dt>
                <dd className="font-medium">{formatCurrency(results.salePrice)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Lucro Líquido:</dt>
                <dd className="font-medium text-green-600">{formatCurrency(results.netProfit)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">ROI:</dt>
                <dd className="font-medium text-blue-600">{results.roi.toFixed(2)}%</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="font-medium text-gray-900 mb-4">Tabela de Amortização</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Mês</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Saldo Devedor Inicial</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Amortização</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Juros</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Parcela</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Saldo Devedor Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.monthlyPayments.map((payment) => (
                  <tr key={payment.month}>
                    <td className="px-4 py-3 text-sm text-gray-900">{payment.month}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(payment.initialBalance)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(payment.amortization)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(payment.interest)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(payment.monthlyPayment)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(payment.finalBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;