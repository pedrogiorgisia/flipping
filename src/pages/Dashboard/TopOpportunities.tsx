import React from 'react';
import { Property } from '../../types/property';
import { ExternalLink, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopOpportunities: React.FC = () => {
  const navigate = useNavigate();
  
  // Sample properties for demonstration
  const topProperties: Property[] = [
    {
      id: '1',
      url: 'https://example.com/property1',
      agency: 'Modern Realty',
      price: 500000,
      area: 120,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 1,
      condoFee: 500,
      yearlyTax: 2000,
      address: '123 Main St, Cityville',
      code: 'PRO-001',
      createdAt: new Date('2023-01-15'),
      renovated: false,
      estimatedRoi: 22.5,
    },
    {
      id: '3',
      url: 'https://example.com/property3',
      agency: 'City Properties',
      price: 350000,
      area: 85,
      bedrooms: 2,
      bathrooms: 1,
      parkingSpaces: 1,
      condoFee: 400,
      yearlyTax: 1500,
      address: '789 Oak St, Metropolis',
      code: 'PRO-003',
      createdAt: new Date('2023-03-10'),
      renovated: false,
      estimatedRoi: 21.3,
    },
    {
      id: '4',
      url: 'https://example.com/property4',
      agency: 'Urban Living',
      price: 425000,
      area: 95,
      bedrooms: 2,
      bathrooms: 2,
      parkingSpaces: 1,
      condoFee: 450,
      yearlyTax: 1800,
      address: '101 Center Ave, Downtown',
      code: 'PRO-004',
      createdAt: new Date('2023-04-05'),
      renovated: false,
      estimatedRoi: 19.7,
    },
    {
      id: '6',
      url: 'https://example.com/property6',
      agency: 'Sunset Realty',
      price: 580000,
      area: 135,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 2,
      condoFee: 650,
      yearlyTax: 2400,
      address: '303 West Blvd, Beachside',
      code: 'PRO-006',
      createdAt: new Date('2023-06-18'),
      renovated: false,
      estimatedRoi: 18.5,
    },
    {
      id: '7',
      url: 'https://example.com/property7',
      agency: 'Mountain View',
      price: 410000,
      area: 90,
      bedrooms: 2,
      bathrooms: 1,
      parkingSpaces: 1,
      condoFee: 380,
      yearlyTax: 1700,
      address: '505 Highland Dr, Hilltop',
      code: 'PRO-007',
      createdAt: new Date('2023-07-02'),
      renovated: false,
      estimatedRoi: 17.2,
    },
  ];

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
              Code
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Agency
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Area (m²)
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              R$/m²
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Beds/Baths
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Est. ROI
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {topProperties.map((property) => (
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
                  property.estimatedRoi && property.estimatedRoi >= 20 ? 'text-green-600' : 
                  property.estimatedRoi && property.estimatedRoi >= 15 ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {property.estimatedRoi?.toFixed(1)}%
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => window.open(property.url, '_blank')}
                  className="text-gray-500 hover:text-blue-600"
                  title="View listing"
                >
                  <ExternalLink size={16} />
                </button>
                <button
                  onClick={() => handleAnalyze(property.id)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Analyze property"
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

export default TopOpportunities;