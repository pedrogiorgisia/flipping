import React from 'react';

interface AnalysisResultsProps {
  results: {
    totalInvestment: number;
    monthlyPayment: number;
    financingAmount: number;
    salePrice: number;
    netProfit: number;
    roi: number;
    propertyArea: number;
    propertyPrice: number;
    pricePerSqm: number;
    acquisitionCosts: {
      downPayment: number;
      itbi: number;
      bankAppraisal: number;
      registry: number;
      total: number
    };
    holdingCosts: {
      financing: number;
      condo: number;
      utilities: number;
      renovation: number;
      total: number
    };
    sellingCosts: {
      financingPayoff: number;
      brokerage: number;
      incomeTax: number
    }
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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 sm:px-6 border-b border-gray-200"> {/* Reduced padding */}
        <h3 className="text-lg font-medium text-gray-900">Análise de Viabilidade</h3>
        <p className="mt-1 text-sm text-gray-500">Custos e retorno esperado</p>
      </div>
      <div className="grid grid-cols-1 gap-4"> {/* Reduced gap */}
        {/* Dados do Imóvel */}
        <div className="border rounded-lg p-3 bg-gray-50"> {/* Reduced padding */}
          <h3 className="font-semibold text-gray-700 mb-2">Dados do Imóvel</h3>
          <div className="grid grid-cols-3 gap-2"> {/* Reduced gap */}
            <div>
              <p className="text-xs text-gray-500">Valor do Imóvel</p> {/* Smaller text, clearer label */}
              <p className="text-base font-semibold">{formatCurrency(results.propertyPrice)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Área útil</p>
              <p className="text-base font-semibold">{results.propertyArea} m²</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Valor por m²</p>
              <p className="text-base font-semibold">{formatCurrency(results.pricePerSqm)}</p>
            </div>
          </div>
        </div>

        {/* Custos de Aquisição */}
        <div className="border rounded-lg p-3"> {/* Reduced padding */}
          <h3 className="font-semibold text-gray-700 mb-2">Custos de Aquisição</h3>
          <div className="space-y-1"> {/* Reduced gap */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Entrada</span>
              <span>{formatCurrency(results.acquisitionCosts.downPayment)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">ITBI</span>
              <span>{formatCurrency(results.acquisitionCosts.itbi)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avaliação/Escritura</span>
              <span>{formatCurrency(results.acquisitionCosts.bankAppraisal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Registro</span>
              <span>{formatCurrency(results.acquisitionCosts.registry)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-1 border-t"> {/* Reduced padding */}
              <span>Total</span>
              <span>{formatCurrency(results.acquisitionCosts.total)}</span>
            </div>
          </div>
        </div>

        {/* Custos até a Venda */}
        <div className="border rounded-lg p-3"> {/* Reduced padding */}
          <h3 className="font-semibold text-gray-700 mb-2">Custos até a Venda</h3>
          <div className="space-y-1"> {/* Reduced gap */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Financiamento</span>
              <span>{formatCurrency(results.holdingCosts.financing)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Condomínio</span>
              <span>{formatCurrency(results.holdingCosts.condo)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">IPTU, Luz, Água</span>
              <span>{formatCurrency(results.holdingCosts.utilities)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Reforma</span>
              <span>{formatCurrency(results.holdingCosts.renovation)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-1 border-t"> {/* Reduced padding */}
              <span>Total</span>
              <span>{formatCurrency(results.holdingCosts.total)}</span>
            </div>
          </div>
        </div>

        {/* Custos Totais */}
        <div className="border rounded-lg p-3 bg-amber-50">
          <div className="flex justify-between font-semibold text-sm"> {/* Reduced font size */}
            <span>Custos Totais</span>
            <span>{formatCurrency(results.totalInvestment)}</span>
          </div>
        </div>

        {/* Valor de Venda */}
        <div className="border rounded-lg p-3 bg-blue-50">
          <h3 className="font-semibold text-gray-700 mb-2">Valor de Venda</h3>
          <div className="space-y-1"> {/* Reduced gap */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Valor de Venda</span>
              <span>{formatCurrency(results.salePrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Valor/m²</span>
              <span>{formatCurrency(results.salePrice / results.propertyArea)}</span>
            </div>
          </div>
        </div>

        {/* Custos na Venda */}
        <div className="border rounded-lg p-3">
          <h3 className="font-semibold text-gray-700 mb-2">Custos na Venda</h3>
          <div className="space-y-1"> {/* Reduced gap */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Quitação Financiamento</span>
              <span>{formatCurrency(results.sellingCosts.financingPayoff)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Corretagem</span>
              <span>{formatCurrency(results.sellingCosts.brokerage)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Imposto de Renda</span>
              <span>{formatCurrency(results.sellingCosts.incomeTax)}</span>
            </div>
          </div>
        </div>

        {/* Lucro da Operação */}
        <div className="border rounded-lg p-3 bg-green-50">
          <div className="flex justify-between font-semibold text-base"> {/* Reduced font size */}
            <span>Lucro da Operação</span>
            <span className="text-green-600">{formatCurrency(results.netProfit)}</span>
          </div>
          <div className="flex justify-between mt-1 font-medium text-sm"> {/* Reduced font size, reduced margin */}
            <span>ROI</span>
            <span className="text-blue-600">{results.roi.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;