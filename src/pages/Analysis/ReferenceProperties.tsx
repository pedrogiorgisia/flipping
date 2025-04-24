import React from 'react';
import { Property } from '../../types/property';
import { Trash } from 'lucide-react';

interface ReferencePropertiesProps {
  references: Property[];
  onRemove: (id: string) => void;
}

const ReferenceProperties: React.FC<ReferencePropertiesProps> = ({ references, onRemove }) => {
  if (!references || references.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Imóveis de Referência</h2>
        <p className="text-gray-500">Nenhum imóvel de referência adicionado.</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Imóveis de Referência</h2>
        <div className="space-y-4">
          {references.map((property) => (
            <div key={property.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{property.address}</h3>
                  <p className="text-sm text-gray-500">{property.code}</p>
                </div>
                <button
                  onClick={() => onRemove(property.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash size={16} />
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Preço:</span>
                  <span className="ml-1 font-medium">{formatCurrency(property.price)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Área:</span>
                  <span className="ml-1 font-medium">{property.area}m²</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferenceProperties;