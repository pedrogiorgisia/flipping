
import React from "react";
import { FaBed, FaBath, FaCar, FaRulerCombined } from "react-icons/fa";

interface PropertyDetailsProps {
  property: any;
  formatCurrency: (value: number) => string;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
  formatCurrency,
}) => {
  if (!property) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-gray-800">
          {formatCurrency(property.preco_anunciado)}
        </h2>
        <a
          href={property.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Ver anúncio
        </a>
      </div>

      <div className="mb-4">
        <p className="font-bold text-gray-700 mb-1">Endereço</p>
        <p className="text-gray-600">{property.endereco}</p>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center">
          <FaRulerCombined className="text-gray-400 mr-2" />
          <span>{property.area} m²</span>
        </div>
        <div className="flex items-center">
          <FaBed className="text-gray-400 mr-2" />
          <span>{property.quartos}</span>
        </div>
        <div className="flex items-center">
          <FaBath className="text-gray-400 mr-2" />
          <span>{property.banheiros}</span>
        </div>
        <div className="flex items-center">
          <FaCar className="text-gray-400 mr-2" />
          <span>{property.vagas}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Condomínio</p>
          <p className="font-medium">
            {formatCurrency(property.condominio_mensal)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">IPTU Anual</p>
          <p className="font-medium">{formatCurrency(property.iptu_anual)}</p>
        </div>
      </div>

      {property.comentarios && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-500">Comentários</p>
          <p className="font-medium text-gray-800 whitespace-pre-line">
            {property.comentarios}
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
