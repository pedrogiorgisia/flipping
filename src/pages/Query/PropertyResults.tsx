import React from 'react';
import { Property } from '../../types/property';
import { ExternalLink, FileText, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PropertyResultsProps {
  properties: Property[];
  isRenovated: boolean;
}

const PropertyResults: React.FC<PropertyResultsProps> = ({ properties, isRenovated }) => {
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleAnalyze = (propertyId: string) => {
    // In a real app, navigate to the analysis page with the property ID
    navigate(`/analysis/${propertyId}`);
  };

  if (properties.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <TrendingUp size={24} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No properties found</h3>
        <p className="text-gray-500">
          Try adjusting your filters to see more results
        </p>
      </div>
    );
  }

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
            {!isRenovated && (
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Est. ROI
              </th>
            )}
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {properties.map((property) => (
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
              {!isRenovated && property.estimatedRoi && (
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    property.estimatedRoi >= 20 ? 'text-green-600' : 
                    property.estimatedRoi >= 15 ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {property.estimatedRoi.toFixed(1)}%
                  </div>
                </td>
              )}
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

export default PropertyResults;