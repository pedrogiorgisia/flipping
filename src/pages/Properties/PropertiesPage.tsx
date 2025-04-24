import React, { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import { Plus, Upload, Filter, Download, Trash2, RefreshCw } from 'lucide-react';
import PropertyTable from './PropertyTable';
import { Property } from '../../types/property';

const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: '1',
      url: 'https://example.com/property1',
      agency: 'Modern Realty',
      price: 500000,
      area: 120,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 1,
      condoFee: 500,
      yearlyTax: 2000,
      address: '123 Main St, Cityville',
      code: 'PRO-001',
      createdAt: new Date('2023-01-15'),
      renovated: false,
    },
    {
      id: '2',
      url: 'https://example.com/property2',
      agency: 'Luxury Homes',
      price: 750000,
      area: 200,
      bedrooms: 4,
      bathrooms: 3,
      parkingSpaces: 2,
      condoFee: 800,
      yearlyTax: 3500,
      address: '456 Park Ave, Townsburg',
      code: 'PRO-002',
      createdAt: new Date('2023-02-20'),
      renovated: true,
    },
    {
      id: '3',
      url: 'https://example.com/property3',
      agency: 'City Properties',
      price: 350000,
      area: 85,
      bedrooms: 2,
      bathrooms: 1,
      parkingSpaces: 1,
      condoFee: 400,
      yearlyTax: 1500,
      address: '789 Oak St, Metropolis',
      code: 'PRO-003',
      createdAt: new Date('2023-03-10'),
      renovated: false,
    }
  ]);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isNewPropertyModalOpen, setIsNewPropertyModalOpen] = useState(false);

  const handleImportHTML = () => {
    setIsImportModalOpen(true);
  };

  const handleAddNewProperty = () => {
    setIsNewPropertyModalOpen(true);
  };

  const closeModals = () => {
    setIsImportModalOpen(false);
    setIsNewPropertyModalOpen(false);
  };

  const deleteProperty = (id: string) => {
    setProperties(properties.filter(property => property.id !== id));
  };

  const toggleRenovated = (id: string) => {
    setProperties(properties.map(property => 
      property.id === id ? { ...property, renovated: !property.renovated } : property
    ));
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Property Database</h1>
        <p className="text-gray-600 mt-1">Manage and organize your property listings</p>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200 px-4 py-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleImportHTML}
              className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Upload size={16} className="mr-2" />
              Import HTML
            </button>
            <button
              onClick={handleAddNewProperty}
              className="inline-flex items-center px-4 py-2 border border-transparent bg-blue-600 text-sm font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-2" />
              New Property
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Filter size={16} className="mr-2" />
              Filter
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Download size={16} className="mr-2" />
              Export
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <PropertyTable 
          properties={properties} 
          onDelete={deleteProperty}
          onToggleRenovated={toggleRenovated}
        />
      </div>

      {/* Import HTML Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Import HTML</h2>
            <p className="text-gray-600 mb-4">Upload an HTML file from a real estate listing to automatically import property details.</p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Drag and drop an HTML file, or click to browse</p>
              <input type="file" className="hidden" id="html-upload" accept=".html,.htm" />
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                Select File
              </button>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={closeModals}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Process HTML
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Property Modal */}
      {isNewPropertyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Property</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  id="url"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/property"
                />
              </div>
              
              <div>
                <label htmlFor="agency" className="block text-sm font-medium text-gray-700 mb-1">
                  Agency
                </label>
                <input
                  type="text"
                  id="agency"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Agency name"
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (R$)
                </label>
                <input
                  type="number"
                  id="price"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="500000"
                />
              </div>
              
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                  Area (m²)
                </label>
                <input
                  type="number"
                  id="area"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="100"
                />
              </div>
              
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3"
                />
              </div>
              
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="2"
                />
              </div>
              
              <div>
                <label htmlFor="parking" className="block text-sm font-medium text-gray-700 mb-1">
                  Parking Spaces
                </label>
                <input
                  type="number"
                  id="parking"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1"
                />
              </div>
              
              <div>
                <label htmlFor="condo" className="block text-sm font-medium text-gray-700 mb-1">
                  Condo Fee (R$/month)
                </label>
                <input
                  type="number"
                  id="condo"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="500"
                />
              </div>
              
              <div>
                <label htmlFor="tax" className="block text-sm font-medium text-gray-700 mb-1">
                  Yearly Tax (R$)
                </label>
                <input
                  type="number"
                  id="tax"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="2000"
                />
              </div>
              
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Code
                </label>
                <input
                  type="text"
                  id="code"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="PRO-001"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Main St, Cityville"
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    id="renovated"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="renovated" className="ml-2 block text-sm text-gray-700">
                    Renovated property
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={closeModals}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Add Property
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default PropertiesPage;