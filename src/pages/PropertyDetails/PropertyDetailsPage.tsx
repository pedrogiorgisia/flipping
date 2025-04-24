import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import { FileText, Calculator } from 'lucide-react';

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock data - replace with real data
  const analysis = {
    totalInvestment: 427098,
    financing: {
      payoff: 491200,
      brokerFee: 72750,
      incomeTax: 0
    },
    financing_details: {
      cet: 14.25,
      term: 360,
      saleTime: 3,
      gracePeriod: 6,
      financedAmount: 504000
    },
    sale: {
      salePrice: 1312500,
      pricePerSqM: 7450
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value}%`;
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Análise de Viabilidade</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="mr-2 text-blue-600" size={20} />
              Custos de Aquisição
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Valor do imóvel</p>
                <p className="text-lg font-medium">{formatCurrency(720000)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ITBI</p>
                <p className="text-lg font-medium">{formatCurrency(21600)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Escritura</p>
                <p className="text-lg font-medium">{formatCurrency(5000)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Detalhes do Financiamento
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">CET</p>
                <p className="text-lg font-medium">{formatPercent(analysis.financing_details.cet)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prazo</p>
                <p className="text-lg font-medium">{analysis.financing_details.term} meses</p>
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

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Custos Totais e Venda
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Custos Totais Desembolsados</p>
                <p className="text-xl font-semibold text-blue-600">
                  {formatCurrency(analysis.totalInvestment)}
                </p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">Valor de venda</p>
                <p className="text-lg font-medium">{formatCurrency(analysis.sale.salePrice)}</p>
                <p className="text-sm text-gray-500 mt-2">Valor por m²</p>
                <p className="text-lg font-medium">{formatCurrency(analysis.sale.pricePerSqM)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PropertyDetailsPage;