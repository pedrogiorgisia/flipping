import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, FileText } from 'lucide-react';

interface Property {
  id: string;
  code: string;
  agency: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  roi: number;
  url: string;
}

interface PropertyListProps {
  selectedRoiRange: string | null;
}

const PropertyList: React.FC<PropertyListProps> = ({ selectedRoiRange }) => {
  const navigate = useNavigate();
  
  // Dados mockados para demonstração
  const properties: Property[] = [
    {
      id: '1',
      code: 'PIN-001',
      agency: 'Imobiliária Moderna',
      price: 500000,
      area: 120,
      bedrooms: 3,
      bathrooms: 2,
      roi: 32.5,
      url: 'https://example.com/property1',
    },
    {
      id: '2',
      code: 'PIN-002',
      agency: 'Imóveis Elite',
      price: 450000,
      area: 95,
      bedrooms: 2,
      bathrooms: 2,
      roi: 28.7,
      url: 'https://example.com/property2',
    },
    {
      id: '3',
      code: 'PIN-003',
      agency: 'Casa & Cia',
      price: 620000,
      area: 150,
      bedrooms: 3,
      bathrooms: 2,
      roi: 25.3,
      url: 'https://example.com/property3',
    },
    {
      id: '4',
      code: 'PIN-004',
      agency: 'Imobiliária Central',
      price: 380000,
      area: 85,
      bedrooms: 2,
      bathrooms: 1,
      roi: 22.8,
      url: 'https://example.com/property4',
    },
    {
      id: '5',
      code: 'PIN-005',
      agency: 'Novo Lar',
      price: 550000,
      area: 110,
      bedrooms: 3,
      bathrooms: 2,
      roi: 19.5,
      url: 'https://example.com/property5',
    },
  ].sort((a, b) => b.roi - a.roi);

  const filteredProperties = selectedRoiRange
    ? properties.filter(property => {
        switch (selectedRoiRange) {
          case '>30%':
            return property.roi > 30;
          case '20-30%':
            return property.roi >= 20 && property.roi <= 30;
          case '15-20%':
            return property.roi >= 15 && property.roi < 20;
          case '<15%':
            return property.roi < 15;
          default:
            return true;
        }
      })
    : properties;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleAnalyze = (propertyId: string) => {
    navigate(`/analysis/1/property/${propertyId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Código
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imobiliária
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preço
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Área (m²)
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              R$/m²
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quartos/Banheiros
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ROI Est.
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredProperties.map((property) => (
            <tr key={property.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">{property.code}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">{property.agency}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(property.price)}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">{property.area}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatCurrency(property.price / property.area)}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {property.bedrooms} / {property.bathrooms}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className={`text-sm font-medium ${
                  property.roi >= 30 ? 'text-green-600' : 
                  property.roi >= 20 ? 'text-blue-600' : 
                  property.roi >= 15 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {property.roi.toFixed(1)}%
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => window.open(property.url, '_blank')}
                  className="text-gray-500 hover:text-blue-600"
                  title="Ver anúncio"
                >
                  <ExternalLink size={16} />
                </button>
                <button
                  onClick={() => handleAnalyze(property.id)}
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
  );
};

export default PropertyList;