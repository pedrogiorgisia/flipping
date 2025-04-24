import React, { useState } from 'react';
import { Property } from '../../types/property';
import { Pencil, Trash2, ExternalLink, Check, X } from 'lucide-react';

interface PropertyTableProps {
  properties: Property[];
  onDelete: (id: string) => void;
  onToggleRenovated: (id: string) => void;
}

const PropertyTable: React.FC<PropertyTableProps> = ({ properties, onDelete, onToggleRenovated }) => {
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState<string | number>('');

  const startEditing = (property: Property, field: string) => {
    setEditingCell({ id: property.id, field });
    setEditValue(property[field as keyof Property] as string | number);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
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
              Condo Fee
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
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
                {editingCell?.id === property.id && editingCell?.field === 'price' ? (
                  <input
                    type="number"
                    className="w-24 p-1 border rounded text-sm"
                    value={editValue}
                    onChange={(e) => setEditValue(parseFloat(e.target.value))}
                    onBlur={() => setEditingCell(null)}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                    onClick={() => startEditing(property, 'price')}
                  >
                    {formatCurrency(property.price)}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {editingCell?.id === property.id && editingCell?.field === 'area' ? (
                  <input
                    type="number"
                    className="w-16 p-1 border rounded text-sm"
                    value={editValue}
                    onChange={(e) => setEditValue(parseFloat(e.target.value))}
                    onBlur={() => setEditingCell(null)}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="text-sm text-gray-900 cursor-pointer hover:text-blue-600"
                    onClick={() => startEditing(property, 'area')}
                  >
                    {property.area}
                  </div>
                )}
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
                {editingCell?.id === property.id && editingCell?.field === 'condoFee' ? (
                  <input
                    type="number"
                    className="w-20 p-1 border rounded text-sm"
                    value={editValue}
                    onChange={(e) => setEditValue(parseFloat(e.target.value))}
                    onBlur={() => setEditingCell(null)}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="text-sm text-gray-900 cursor-pointer hover:text-blue-600"
                    onClick={() => startEditing(property, 'condoFee')}
                  >
                    {formatCurrency(property.condoFee)}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {formatDate(property.createdAt)}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    property.renovated
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {property.renovated ? 'Renovated' : 'Not Renovated'}
                </span>
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
                  onClick={() => onToggleRenovated(property.id)}
                  className={`${
                    property.renovated ? 'text-green-600 hover:text-green-800' : 'text-yellow-600 hover:text-yellow-800'
                  }`}
                  title={property.renovated ? 'Mark as not renovated' : 'Mark as renovated'}
                >
                  {property.renovated ? <Check size={16} /> : <Pencil size={16} />}
                </button>
                <button
                  onClick={() => onDelete(property.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyTable;