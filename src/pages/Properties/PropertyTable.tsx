import React from "react";
import { Property } from "../../types/property";
import { Pencil, Trash2, ExternalLink } from "lucide-react";

interface PropertyTableProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
}

const PropertyTable: React.FC<PropertyTableProps> = ({
  properties,
  onEdit,
  onDelete,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  const truncateText = (text: string, maxLength: number = 30) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Endereço
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Preço Anunciado
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Área (m²)
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Qts/Ban/Vag
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Condomínio
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              IPTU Anual
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Comentários
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {properties.map((property) => (
            <tr key={property.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">{property.endereco}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatCurrency(property.preco_anunciado)}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">{property.area}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {`${property.quartos}/${property.banheiros}/${property.vagas}`}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatCurrency(property.condominio_mensal)}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatCurrency(property.iptu_anual)}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {truncateText(property.comentarios || "")}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                {property.url && (
                  <button
                    onClick={() => window.open(property.url!, "_blank")}
                    className="text-gray-500 hover:text-blue-600"
                    title="Ver anúncio"
                  >
                    <ExternalLink size={16} />
                  </button>
                )}
                <button
                  onClick={() => onEdit(property)}
                  className="text-blue-600 hover:text-blue-900"
                  title="Editar"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(property.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Excluir"
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