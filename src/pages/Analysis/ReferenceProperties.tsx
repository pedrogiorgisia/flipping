
import React, { useState } from 'react';
import { Property } from '../../types/property';
import { ChevronLeft, ChevronRight, Trash } from 'lucide-react';

interface ReferencePropertiesProps {
  references?: Property[];
  onRemove?: (id: string) => void;
}

const ReferenceProperties: React.FC<ReferencePropertiesProps> = ({ references = [], onRemove }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(references.length / itemsPerPage);
  
  const currentItems = references.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Imóveis de Referência</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Código</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Endereço</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Área</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Preço</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">R$/m²</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((property) => (
              <tr key={property.id}>
                <td className="px-4 py-3 text-sm text-gray-900">{property.code}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{property.address}</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">{property.area}m²</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(property.price)}</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {formatCurrency(property.price / property.area)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-center">
                  <button
                    onClick={() => onRemove?.(property.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded text-sm disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded text-sm disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReferenceProperties;
