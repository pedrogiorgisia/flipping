
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Análise de Viabilidade</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Dados do Imóvel */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-700 mb-3">Dados do Imóvel</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Valor de compra</p>
              <p className="text-lg font-semibold">{formatCurrency(results.propertyPrice)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Área útil</p>
              <p className="text-lg font-semibold">{results.propertyArea} m²</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Valor por m²</p>
              <p className="text-lg font-semibold">{formatCurrency(results.pricePerSqm)}</p>
            </div>
          </div>
        </div>

        {/* Custos de Aquisição */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-3">A. Custos de Aquisição</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Entrada</span>
              <span>{formatCurrency(results.acquisitionCosts.downPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ITBI</span>
              <span>{formatCurrency(results.acquisitionCosts.itbi)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avaliação bancária/escritura</span>
              <span>{formatCurrency(results.acquisitionCosts.bankAppraisal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Registro em cartório/RGI</span>
              <span>{formatCurrency(results.acquisitionCosts.registry)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total de Custos de Aquisição</span>
              <span>{formatCurrency(results.acquisitionCosts.total)}</span>
            </div>
          </div>
        </div>

        {/* Custos até a Venda */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-3">B. Custos até a Venda</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Parcelas do financiamento</span>
              <span>{formatCurrency(results.holdingCosts.financing)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Condomínio</span>
              <span>{formatCurrency(results.holdingCosts.condo)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contas (IPTU, luz e água)</span>
              <span>{formatCurrency(results.holdingCosts.utilities)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Custo estimado da reforma</span>
              <span>{formatCurrency(results.holdingCosts.renovation)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total de Custos até a Venda</span>
              <span>{formatCurrency(results.holdingCosts.total)}</span>
            </div>
          </div>
        </div>

        {/* Custos Totais */}
        <div className="border rounded-lg p-4 bg-amber-50">
          <div className="flex justify-between font-semibold">
            <span>C = A+B. Custos Totais Desembolsados</span>
            <span>{formatCurrency(results.totalInvestment)}</span>
          </div>
        </div>

        {/* Valor de Venda */}
        <div className="border rounded-lg p-4 bg-blue-50">
          <h3 className="font-semibold text-gray-700 mb-3">D. Valor de Venda</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Valor de venda do imóvel</span>
              <span>{formatCurrency(results.salePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Valor por m² de venda</span>
              <span>{formatCurrency(results.salePrice / results.propertyArea)}</span>
            </div>
          </div>
        </div>

        {/* Custos na Venda */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-3">E. Custos na Venda</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Quitação do financiamento</span>
              <span>{formatCurrency(results.sellingCosts.financingPayoff)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Valor da corretagem</span>
              <span>{formatCurrency(results.sellingCosts.brokerage)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Imposto de Renda</span>
              <span>{formatCurrency(results.sellingCosts.incomeTax)}</span>
            </div>
          </div>
        </div>

        {/* Lucro da Operação */}
        <div className="border rounded-lg p-4 bg-green-50">
          <div className="flex justify-between font-semibold text-lg">
            <span>F = D-C-E. Lucro da Operação</span>
            <span className="text-green-600">{formatCurrency(results.netProfit)}</span>
          </div>
          <div className="flex justify-between mt-2 font-medium">
            <span>ROI da Operação</span>
            <span className="text-blue-600">{results.roi.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
