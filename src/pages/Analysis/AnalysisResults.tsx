import React from 'react';

interface AnalysisResultsProps {
  results: {
    propertyPrice: number;
    propertyArea: number;
    pricePerSqm: number;
    acquisitionCosts: {
      downPayment: number;
      itbi: number;
      bankAppraisal: number;
      registry: number;
      total: number;
    };
    holdingCosts: {
      financing: number;
      condo: number;
      utilities: number;
      renovation: number;
      total: number;
    };
    totalInvestment: number;
    salePrice: number;
    sellingCosts: {
      financingPayoff: number;
      brokerage: number;
      incomeTax: number;
    };
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
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Análise de Viabilidade</h3>
      </div>
      <div className="px-4 py-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <div className="font-medium text-gray-900 mb-2">Custos de Aquisição</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Entrada</div>
              <div className="text-right">{formatCurrency(results.acquisitionCosts.downPayment)}</div>
              <div className="text-gray-600">ITBI</div>
              <div className="text-right">{formatCurrency(results.acquisitionCosts.itbi)}</div>
              <div className="text-gray-600">Avaliação</div>
              <div className="text-right">{formatCurrency(results.acquisitionCosts.bankAppraisal)}</div>
              <div className="text-gray-600">Registro</div>
              <div className="text-right">{formatCurrency(results.acquisitionCosts.registry)}</div>
              <div className="font-medium text-gray-900">Total</div>
              <div className="text-right font-medium">{formatCurrency(results.acquisitionCosts.total)}</div>
            </div>
          </div>

          <div>
            <div className="font-medium text-gray-900 mb-2">Custos de Carregamento</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Financiamento</div>
              <div className="text-right">{formatCurrency(results.holdingCosts.financing)}</div>
              <div className="text-gray-600">Condomínio</div>
              <div className="text-right">{formatCurrency(results.holdingCosts.condo)}</div>
              <div className="text-gray-600">Contas</div>
              <div className="text-right">{formatCurrency(results.holdingCosts.utilities)}</div>
              <div className="text-gray-600">Reforma</div>
              <div className="text-right">{formatCurrency(results.holdingCosts.renovation)}</div>
              <div className="font-medium text-gray-900">Total</div>
              <div className="text-right font-medium">{formatCurrency(results.holdingCosts.total)}</div>
            </div>
          </div>

          <div>
            <div className="font-medium text-gray-900 mb-2">Custos de Venda</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Quitação</div>
              <div className="text-right">{formatCurrency(results.sellingCosts.financingPayoff)}</div>
              <div className="text-gray-600">Corretagem</div>
              <div className="text-right">{formatCurrency(results.sellingCosts.brokerage)}</div>
              <div className="text-gray-600">Imposto de Renda</div>
              <div className="text-right">{formatCurrency(results.sellingCosts.incomeTax)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;