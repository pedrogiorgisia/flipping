import React, { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import { Filter, Download, Search, BarChart2, ArrowRight } from 'lucide-react';
import PropertyResults from './PropertyResults';
import { Property } from '../../types/property';

const QueryPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'not-renovated' | 'renovated'>('not-renovated');
  const [minRoi, setMinRoi] = useState<number>(15);
  const [minPrice, setMinPrice] = useState<number>(200000);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [minArea, setMinArea] = useState<number>(50);
  const [maxArea, setMaxArea] = useState<number>(200);
  
  // Sample data for demonstration
  const properties: Property[] = [
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
      estimatedRoi: 22.5,
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
      estimatedRoi: 18.3,
    },
    {
      id: '4',
      url: 'https://example.com/property4',
      agency: 'Urban Living',
      price: 425000,
      area: 95,
      bedrooms: 2,
      bathrooms: 2,
      parkingSpaces: 1,
      condoFee: 450,
      yearlyTax: 1800,
      address: '101 Center Ave, Downtown',
      code: 'PRO-004',
      createdAt: new Date('2023-04-05'),
      renovated: false,
      estimatedRoi: 16.7,
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
      id: '5',
      url: 'https://example.com/property5',
      agency: 'Elite Realty',
      price: 850000,
      area: 180,
      bedrooms: 3,
      bathrooms: 3,
      parkingSpaces: 2,
      condoFee: 900,
      yearlyTax: 4000,
      address: '222 Luxury Blvd, Richtown',
      code: 'PRO-005',
      createdAt: new Date('2023-05-15'),
      renovated: true,
    }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesRenovationStatus = property.renovated === (viewMode === 'renovated');
    const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
    const matchesArea = property.area >= minArea && property.area <= maxArea;
    const matchesRoi = !property.estimatedRoi || property.estimatedRoi >= minRoi;
    
    return matchesRenovationStatus && matchesPrice && matchesArea && matchesRoi;
  });

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Property Query</h1>
        <p className="text-gray-600 mt-1">Find and analyze potential flipping opportunities</p>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex rounded-md overflow-hidden border border-gray-300">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'not-renovated'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setViewMode('not-renovated')}
              >
                Not Renovated
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'renovated'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setViewMode('renovated')}
              >
                Renovated
              </button>
            </div>
            
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Filter size={16} className="mr-2" />
              Advanced Filters
            </button>
            
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Download size={16} className="mr-2" />
              Export Results
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Price Range</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Min"
                />
                <ArrowRight size={16} className="text-gray-400" />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Max"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Area Range (m²)</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={minArea}
                  onChange={(e) => setMinArea(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Min"
                />
                <ArrowRight size={16} className="text-gray-400" />
                <input
                  type="number"
                  value={maxArea}
                  onChange={(e) => setMaxArea(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Max"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Min. ROI (%)</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={minRoi}
                  onChange={(e) => setMinRoi(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="15"
                />
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <Search size={16} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <PropertyResults 
          properties={filteredProperties} 
          isRenovated={viewMode === 'renovated'} 
        />
      </div>
    </MainLayout>
  );
};

export default QueryPage;