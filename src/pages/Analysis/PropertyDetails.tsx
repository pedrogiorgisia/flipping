import React from "react";
import { Property } from "../../types/property";
import { Home, DollarSign, MapPin, Calendar, ExternalLink } from "lucide-react";

interface PropertyDetailsProps {
  property: Property;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Home size={20} className="mr-2 text-blue-600" />
            Detalhes do Imóvel
          </h3>
          <a
            href={property.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ExternalLink size={16} className="mr-1" />
            Ver Anúncio
          </a>
        </div>
      </div>
      <div className="px-4 py-3">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2">
          <div>
            <dt className="text-xs font-medium text-gray-500">Código</dt>
            <dd className="text-sm text-gray-900">{property.code}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Imobiliária</dt>
            <dd className="text-sm text-gray-900">{property.agency}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Preço</dt>
            <dd className="text-sm text-gray-900 font-medium flex items-center">
              <DollarSign size={14} className="mr-1 text-green-600" />
              {formatCurrency(property.price)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Preço/m²</dt>
            <dd className="text-sm text-gray-900">
              {formatCurrency(property.price / property.area)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Área</dt>
            <dd className="text-sm text-gray-900">{property.area} m²</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">
              Quartos/Banheiros
            </dt>
            <dd className="text-sm text-gray-900">
              {property.bedrooms} / {property.bathrooms}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Vagas</dt>
            <dd className="text-sm text-gray-900">{property.parkingSpaces}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Condomínio</dt>
            <dd className="text-sm text-gray-900">
              {formatCurrency(property.condoFee)}/mês
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">IPTU</dt>
            <dd className="text-sm text-gray-900">
              {formatCurrency(property.yearlyTax)}/ano
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Anunciado em</dt>
            <dd className="text-sm text-gray-900 flex items-center">
              <Calendar size={14} className="mr-1 text-gray-400" />
              {formatDate(property.createdAt)}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs font-medium text-gray-500">Endereço</dt>
            <dd className="text-sm text-gray-900 flex items-start">
              <MapPin
                size={14}
                className="mr-1 mt-0.5 flex-shrink-0 text-gray-400"
              />
              <span>{property.address}</span>
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-gray-500">Status</dt>
            <dd className="mt-0.5">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Reformado
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default PropertyDetails;
