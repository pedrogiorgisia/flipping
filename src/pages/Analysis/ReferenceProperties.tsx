
import React, { useState } from "react";
import { Trash, PlusCircle, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

export interface ReferenceProperty {
  id: string;
  imovel: {
    id: string;
    url: string;
    imobiliaria: string;
    preco_anunciado: number;
    area: number;
    quartos: number;
    banheiros: number;
    vagas: number;
    condominio_mensal: number;
    iptu_anual: number;
    endereco: string;
    codigo_ref_externo: string;
    comentarios: string | null;
    reformado: boolean;
    preco_m2: number;
  };
}

interface ReferencePropertiesProps {
  references: ReferenceProperty[];
  onRemove?: (id: string) => void;
}

const ReferenceProperties: React.FC<ReferencePropertiesProps> = ({
  references,
  onRemove,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [referenceToDelete, setReferenceToDelete] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`https://flippings.com.br/referencia-simulacao/${id}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir referência');
      }

      onRemove?.(id);
      setIsDeleteModalOpen(false);
      setReferenceToDelete(null);
      window.location.reload();
    } catch (error) {
      toast.error('Erro ao excluir referência');
    }
  };

  const calculateAveragePrice = () => {
    if (!references.length) return 0;
    const total = references.reduce(
      (sum, ref) => sum + ref.imovel.preco_anunciado,
      0,
    );
    return total / references.length;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 inline-block">
          <p className="text-xs font-medium text-gray-500 mb-1">
            Preço de Venda Sugerido
          </p>
          <p className="text-sm font-bold text-gray-900">
            {formatCurrency(calculateAveragePrice())}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
        >
          <PlusCircle size={14} className="inline-block mr-1" />
          Adicionar Referência
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-2 py-2 text-left">Endereço</th>
              <th className="px-2 py-2 text-right">Valor</th>
              <th className="px-2 py-2 text-right">Área</th>
              <th className="px-2 py-2 text-center">Qts</th>
              <th className="px-2 py-2 text-center">Ban</th>
              <th className="px-2 py-2 text-center">Vgs</th>
              <th className="px-2 py-2 text-right">Cond.</th>
              <th className="px-2 py-2 text-right">IPTU</th>
              <th className="px-2 py-2 text-right">R$/m²</th>
              <th className="px-2 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {references.map((reference) => (
              <tr key={reference.id} className="hover:bg-gray-50 text-sm">
                <td className="px-2 py-2 text-gray-900 truncate max-w-xs">
                  {reference.imovel.endereco}
                </td>
                <td className="px-2 py-2 text-gray-900 text-right">
                  {formatCurrency(reference.imovel.preco_anunciado)}
                </td>
                <td className="px-2 py-2 text-gray-900 text-right">
                  {reference.imovel.area}m²
                </td>
                <td className="px-2 py-2 text-gray-900 text-center">
                  {reference.imovel.quartos}
                </td>
                <td className="px-2 py-2 text-gray-900 text-center">
                  {reference.imovel.banheiros}
                </td>
                <td className="px-2 py-2 text-gray-900 text-center">
                  {reference.imovel.vagas}
                </td>
                <td className="px-2 py-2 text-gray-900 text-right">
                  {formatCurrency(reference.imovel.condominio_mensal)}
                </td>
                <td className="px-2 py-2 text-gray-900 text-right">
                  {formatCurrency(reference.imovel.iptu_anual)}
                </td>
                <td className="px-2 py-2 text-gray-900 text-right">
                  {formatCurrency(reference.imovel.preco_m2)}
                </td>
                <td className="px-2 py-2 text-gray-900 text-center">
                  <div className="flex justify-center space-x-2">
                    <a
                      href={reference.imovel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink size={16} />
                    </a>
                    <button
                      onClick={() => {
                        setReferenceToDelete(reference.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AddReferenceModal onClose={() => setIsModalOpen(false)} />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar exclusão
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Deseja realmente excluir esta referência?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setReferenceToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={() =>
                  referenceToDelete && handleRemove(referenceToDelete)
                }
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AddReferenceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Adicionar Imóvel de Referência
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
        >
          ✕
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selecione o Imóvel
          </label>
          <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">Selecione...</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="btn btn-outline btn-sm">
            Cancelar
          </button>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Adicionar
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ReferenceProperties;
