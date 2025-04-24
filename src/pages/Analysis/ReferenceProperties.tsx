import React from 'react';
import { Property } from '../../types/property';
import { Home, Check, X, Plus } from 'lucide-react';

interface ReferencePropertiesProps {
  references: Property[];
  selectedReferences: string[];
  onReferenceToggle: (id: string) => void;
}

const ReferenceProperties: React.FC<ReferencePropertiesProps> = ({ 
  references, 
  selectedReferences,
  onReferenceToggle 
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Home size={20} className="mr-2 text-blue-600" />
          Reference Properties
        </h3>
        <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
          <Plus size={16} className="mr-1" />
          Add Reference
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Include
              </th>
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
                Area Diff
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {references.map((property) => {
              const isSelected = selectedReferences.includes(property.id);
              const areaDiff = ((property.area - 120) / 120) * 100; // Assuming target property area is 120
              
              return (
                <tr key={property.id} className={isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => onReferenceToggle(property.id)}
                      className={`h-5 w-5 rounded flex items-center justify-center ${
                        isSelected 
                          ? 'bg-blue-600 text-white' 
                          : 'border border-gray-300 bg-white text-gray-500 hover:border-blue-500'
                      }`}
                    >
                      {isSelected && <Check size={12} />}
                    </button>
                  </td>
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
                      Math.abs(areaDiff) <= 10 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {areaDiff > 0 ? '+' : ''}{areaDiff.toFixed(1)}%
                    </div>
                  </td>
                </tr>
              );
            })}
            {references.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No reference properties added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {references.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          Average price of selected references: <span className="font-medium">{formatCurrency(
            selectedReferences.length > 0 
              ? references
                  .filter(ref => selectedReferences.includes(ref.id))
                  .reduce((sum, ref) => sum + ref.price, 0) / selectedReferences.length
              : 0
          )}</span>
        </div>
      )}
    </div>
  );
};

export default ReferenceProperties;