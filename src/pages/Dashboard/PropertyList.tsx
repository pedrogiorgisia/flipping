import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';

interface Property {
  imovel: {
    endereco: string;
    area: number;
    preco_anunciado: number;
    url: string;
  };
  id_simulacao: string;
  valor_compra: number;
  valor_m2_compra: number;
  reforma_rs: number;
  valor_m2_venda: number;
  roi_liquido: number;
}

interface PropertyListProps {
  properties: Property[];
}

const PropertyList: React.FC<PropertyListProps> = ({ properties }) => {
  const sortedProperties = [...properties].sort((a, b) => b.roi_liquido - a.roi_liquido);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1 }).format(value);
  };

  const handleAnalyze = async (id_simulacao: string) => {
    try {
      const response = await fetch(`https://flippings.com.br/simulacoes/${id_simulacao}`);
      const data = await response.json();
      // Handle the response data as needed
    } catch (error) {
      console.error('Error analyzing property:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Oportunidades</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endereço</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Área (m²)</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço Anunciado</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço de Compra</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço m² Compra</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Custo Reforma</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor m² Venda</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROI Estimado</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProperties.map((property, index) => (
              <tr key={property.id_simulacao || index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{property.imovel.endereco}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{property.imovel.area}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(property.imovel.preco_anunciado)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(property.valor_compra)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(property.valor_m2_compra)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(property.reforma_rs)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(property.valor_m2_venda)}</td>
                <td className="px-4 py-3 text-sm font-medium">{formatPercentage(property.roi_liquido)}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => window.open(property.imovel.url, '_blank')}
                    className="text-gray-500 hover:text-blue-600"
                    title="Ver anúncio"
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button
                    onClick={() => handleAnalyze(property.id_simulacao)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Analisar imóvel"
                  >
                    <FileText size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyList;