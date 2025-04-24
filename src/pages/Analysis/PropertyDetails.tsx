import React from 'react';
import { Property } from '../../types/property';
import { Home, DollarSign, MapPin, Calendar, ExternalLink } from 'lucide-react';

interface PropertyDetailsProps {
  property: Property;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Home size={20} className="mr-2 text-blue-600" />
            Property Details
          </h3>
          <a
            href={property.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ExternalLink size={16} className="mr-1" />
            View Listing
          </a>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Code</dt>
            <dd className="mt-1 text-sm text-gray-900">{property.code}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Agency</dt>
            <dd className="mt-1 text-sm text-gray-900">{property.agency}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Price</dt>
            <dd className="mt-1 text-sm text-gray-900 font-medium flex items-center">
              <DollarSign size={16} className="mr-1 text-green-600" />
              {formatCurrency(property.price)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Price/m²</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatCurrency(property.price / property.area)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Area</dt>
            <dd className="mt-1 text-sm text-gray-900">{property.area} m²</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Beds/Baths</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {property.bedrooms} / {property.bathrooms}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Parking</dt>
            <dd className="mt-1 text-sm text-gray-900">{property.parkingSpaces} space(s)</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Condo Fee</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatCurrency(property.condoFee)}/month</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Yearly Tax</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatCurrency(property.yearlyTax)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Listed On</dt>
            <dd className="mt-1 text-sm text-gray-900 flex items-center">
              <Calendar size={16} className="mr-1 text-gray-400" />
              {formatDate(property.createdAt)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Address</dt>
            <dd className="mt-1 text-sm text-gray-900 flex items-start">
              <MapPin size={16} className="mr-1 mt-0.5 flex-shrink-0 text-gray-400" />
              <span>{property.address}</span>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  property.renovated
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {property.renovated ? 'Renovated' : 'Not Renovated'}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default PropertyDetails;