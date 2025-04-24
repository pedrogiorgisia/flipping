import React from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import { useParams } from 'react-router-dom';
import { 
  Building, 
  DollarSign, 
  Calendar, 
  Percent,
  TrendingUp,
  Calculator,
  FileText,
  AlertTriangle
} from 'lucide-react';

const PropertyDetailsPage: React.FC = () => {
  const { propertyId } = useParams();

  // Dados mockados para demonstração
  const analysis = {
    propertyInfo: {
      address: "Rua Exemplo, 123 - Pinheiros",
      price: 720000,
      area: 97,
      pricePerSqm: 7422.68,
      reduction: -41
    },
    acquisition: {
      downPayment: 216000,
      propertyTax: 21600,
      bankAppraisal: 5000,
      registration: 10800,
      totalAcquisitionCosts: 253400
    },
    costs: {
      monthlyPayments: 49849.80,
      condo: 15300,
      utilities: 2300,
      renovation: 151200,
      totalCostsUntilSale: 218649.80
    },
    totalInvestment: 472049.80,
    sale: {
      salePrice: 1212500,
      pricePerSqmSale: 12500
    },
    financing: {
      payoff: 493200,
      brokerFee: 72750,
      incomeTax: 30684.40
    },
    profitability: {
      profit: 143815.80,
      roi: 30.5
    },
    financing_details: {
      cet: 14.20,
      term: 420,
      saleTime: 9,
      gracePeriod: 2,
      financedAmount: 504000
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Análise de Viabilidade</h1>
          <p className="text-gray-600">Cenário de compra com financiamento</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Imóvel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="mr-2 text-blue-600" size={20} />
              Informações do Imóvel
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Valor de compra</p>
                  <p className="text-lg font-medium">{formatCurrency(analysis.propertyInfo.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Área útil</p>
                  <p className="text-lg font-medium">{analysis.propertyInfo.area} m²</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor por m²</p>
                  <p className="text-lg font-medium">{formatCurrency(analysis.propertyInfo.pricePerSqm)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Redução</p>
                  <p className="text-lg font-medium text-red-600">{analysis.propertyInfo.reduction}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Custos de Aquisição */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="mr-2 text-blue-600" size={20} />
              Custos de Aquisição
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Entrada (30%)</p>
                <p className="text-lg font-medium">{formatCurrency(analysis.acquisition.downPayment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ITBI</p>
                <p className="text-lg font-medium">{formatCurrency(analysis.acquisition.propertyTax)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avaliação bancária</p>
                <p className="text-lg font-medium">{formatCurrency(analysis.acquisition.bankAppraisal)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registro</p>
                <p className="text-lg font-medium">{formatCurrency(analysis.acquisition.registration)}</p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-900">Total de Custos de Aquisição</p>
                <p className="text-xl font-semibold text-blue-600">
                  {formatCurrency(analysis.acquisition.totalAcquisitionCosts)}
                </p>
              </div>
            </div>
          </div>

          {/* Custos até a Venda */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="mr-2 text-blue-600" size={20} />
              Custos até a Venda
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Parcelas do financiamento (9 meses)</p>
                <p className="text-lg font-medium">{formatCurrency(analysis.costs.monthlyPayments)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Condomínio (9 meses)</p>
                <p className="text-lg font-medium">{formatCurrency(analysis.costs.condo)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contas (IPTU, luz e água)</p>
                <p className="text-lg font-medium">{formatCurrency(analysis.costs.utilities)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Custo estimado da reforma (21%)</p>
                <p className="text-lg font-medium">{formatCurrency(analysis.costs.renovation)}</p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-900">Total de Custos até a Venda</p>
                <p className="text-xl font-semibold text-blue-600">
                  {formatCurrency(analysis.costs.totalCostsUntilSale)}
                </p>
              </div>
            </div>
          </div>

          {/* Custos Totais e Venda */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calculator className="mr-2 text-blue-600" size={20} />
              Custos Totais e Venda
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-900">Custos Totais Desembolsados</p>
                <p className="text-xl font-semibold text-blue-600">
                  {formatCurrency(analysis.totalInvestment)}
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">Valor de venda do imóvel</p>
                <p className="text-lg font-medium">{formatCurrency(analysis.sale.salePrice)}</p>
                <p className="text-sm text-gray-500 mt-2">Valor por m² de venda</p>
                <p className="text-lg font-medium">{formatCurrency(analysis.sale.pricePerSqmSale)}</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">Quitação do financiamento</p>
                <p className="text-lg font-medium">{formatCurrency(analysis.financing.payoff)}</p>
                <p className="text-sm text-gray-500 mt-2">Valor da corretagem (6%)</p>
                <p className="text-lg font-medium">{formatCurrency(analysis.financing.brokerFee)}</p>
                <p className="text-sm text-gray-500 mt-2">Imposto de Renda</p>
                <p className="text-lg font-medium">{formatCurrency(analysis.financing.incomeTax)}</p>
              </div>
            </div>
          </div>

          {/* Resultado da Operação */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="mr-2 text-blue-600" size={20} />
              Resultado da Operação
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Lucro da Operação</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(analysis.profitability.profit)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ROI da Operação</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatPercent(analysis.profitability.roi)}
                </p>
              </div>
            </div>
          </div>

          {/* Detalhes do Financiamento */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="mr-2 text-blue-600" size={20} />
              Detalhes do Financiamento
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div>
                <p className="text-sm text-gray-500">CET</p>
                <p className="text-lg font-medium">{formatPercent(analysis.financing_details.cet)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prazo</p>
                <p className="text-lg font-medium">{analysis.financing_details.term} meses</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tempo para venda</p>
                <p className="text-lg font-medium">{analysis.financing_details.saleTime} meses</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Carência</p>
                <p className="text-lg font-medium">{analysis.financing_details.gracePeriod} meses</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor financiado</p>
                <p className="text-lg font-medium">{formatCurrency(analysis.financing_details.financedAmount)}</p>
              </div>
            </div>
          </div>

          {/* Alertas e Observações */}
          <div className="bg-yellow-50 rounded-lg shadow p-6 lg:col-span-2">
            <div className="flex items-start">
              <AlertTriangle className="text-yellow-600 mr-3 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-lg font-medium text-yellow-800">Observações Importantes</h3>
                <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                  <li>• Os valores de IPTU e condomínio são estimativas baseadas em imóveis similares da região</li>
                  <li>• O custo de reforma pode variar dependendo do estado real do imóvel e escopo do projeto</li>
                  <li>• O tempo de venda estimado considera a média do mercado local</li>
                  <li>• Valores de impostos e taxas podem sofrer alterações</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PropertyDetailsPage;