import React, { useState } from 'react';
import { Property } from '../../types/property';
import { ChevronLeft, ChevronRight, Trash } from 'lucide-react';

interface ReferencePropertiesProps {
  references?: Property[];
  onRemove?: (id: string) => void;
}

const ReferenceProperties: React.FC<ReferencePropertiesProps> = ({ references = mockReferences, onRemove }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockReferences.length / itemsPerPage);

  const currentItems = mockReferences.slice(
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
    <div className="bg-white rounded-lg shadow mt-6">
      <div className="px-4 py-3"> {/*This line has been updated*/}
        {/*<h3 className="text-lg font-medium text-gray-900">Imóveis de Referência</h3>
        <p className="mt-1 text-sm text-gray-500">Comparativo com imóveis similares na região</p>*/}
      </div>
      <div className="overflow-x-auto">

      <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Imóveis de Referência</h3>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Adicionar Referência
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Adicionar Imóvel de Referência</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {/* Add your form fields here */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Selecione o Imóvel</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                  <option value="">Selecione...</option>
                  {/* Add your options here */}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Add your logic here
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Código</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Endereço</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Área</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Quartos</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Preço</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">R$/m²</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{property.code}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{property.address}</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">{property.area}m²</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">{property.bedrooms}</td>
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
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const mockReferences = [
  {
    id: '1',
    code: 'REF001',
    address: 'Rua Augusta, 1000',
    area: 95,
    bedrooms: 3,
    price: 850000,
    url: '#'
  },
  {
    id: '2',
    code: 'REF002',
    address: 'Av. Paulista, 1500',
    area: 92,
    bedrooms: 3,
    price: 920000,
    url: '#'
  },
  {
    id: '3',
    code: 'REF003',
    address: 'Rua Oscar Freire, 500',
    area: 88,
    bedrooms: 2,
    price: 780000,
    url: '#'
  },
  {
    id: '4',
    code: 'REF004',
    address: 'Al. Santos, 800',
    area: 98,
    bedrooms: 3,
    price: 890000,
    url: '#'
  },
  {
    id: '5',
    code: 'REF005',
    address: 'Rua Bela Cintra, 300',
    area: 85,
    bedrooms: 2,
    price: 750000,
    url: '#'
  }
] as Property[];

export default ReferenceProperties;