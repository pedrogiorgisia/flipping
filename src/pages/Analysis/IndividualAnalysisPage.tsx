
import React from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import { useNavigate } from 'react-router-dom';

interface Analysis {
  id: string;
  propertyName: string;
  purchasePrice: number;
  renovationCost: number;
  expectedSalePrice: number;
  roi: number;
  date: Date;
}

const IndividualAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  
  const analyses: Analysis[] = [
    {
      id: '1',
      propertyName: 'Apartamento Pinheiros',
      purchasePrice: 720000,
      renovationCost: 151200,
      expectedSalePrice: 1312500,
      roi: 50.5,
      date: new Date('2024-01-15')
    },
    // Adicione mais análises conforme necessário
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Análises Individuais</h1>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imóvel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço de Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Custo Reforma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço Venda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyses.map((analysis) => (
                <tr 
                  key={analysis.id}
                  onClick={() => navigate(`/analysis/${analysis.id}/details`)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{analysis.propertyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(analysis.purchasePrice)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(analysis.renovationCost)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(analysis.expectedSalePrice)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{analysis.roi.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {analysis.date.toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default IndividualAnalysisPage;
