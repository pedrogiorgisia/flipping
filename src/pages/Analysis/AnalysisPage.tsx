import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import { Property } from '../../types/property';
import PropertyDetails from './PropertyDetails';
import ReferenceProperties from './ReferenceProperties';
import CalculationParameters from './CalculationParameters';
import AnalysisResults from './AnalysisResults';
import { Download, Calculator, Share2 } from 'lucide-react';

const AnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock data for demonstration
  const [property, setProperty] = useState<Property>({
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
  });
  
  const [references, setReferences] = useState<Property[]>([
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
  ]);
  
  const [calculations, setCalculations] = useState({
    renovationPercent: 15,
    sellingTimeMonths: 3,
    areaMatchTolerance: 10,
    estimatedSalePrice: 650000,
    acquisitionCosts: 25000,
    holdingCosts: 7500,
    renovationCosts: 75000,
    sellingCosts: 32500,
    totalCosts: 140000,
    profit: 110000,
    roi: 22.0
  });
  
  const [selectedReferences, setSelectedReferences] = useState<string[]>(['2', '5']);
  
  const handleReferenceToggle = (id: string) => {
    if (selectedReferences.includes(id)) {
      setSelectedReferences(selectedReferences.filter(refId => refId !== id));
    } else {
      setSelectedReferences([...selectedReferences, id]);
    }
  };
  
  const handleParameterChange = (field: string, value: number) => {
    // In a real app, this would recalculate all the values
    // For now, just update the parameter
    setCalculations({
      ...calculations,
      [field]: value
    });
  };
  
  const handleRecalculate = () => {
    // In a real app, this would perform a complete recalculation
    // For now, just update a few values for demonstration
    setCalculations({
      ...calculations,
      renovationCosts: property.price * (calculations.renovationPercent / 100),
      holdingCosts: property.condoFee * calculations.sellingTimeMonths,
      // Other calculations would be done here
    });
  };

  return (
    <MainLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Analysis</h1>
          <p className="text-gray-600 mt-1">Detailed investment analysis for {property.code}</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download size={16} className="mr-2" />
            Export PDF
          </button>
          <button 
            className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Share2 size={16} className="mr-2" />
            Share
          </button>
          <button 
            onClick={handleRecalculate}
            className="inline-flex items-center px-4 py-2 border border-transparent bg-blue-600 text-sm font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Calculator size={16} className="mr-2" />
            Recalculate
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <PropertyDetails property={property} />
          <CalculationParameters 
            parameters={calculations} 
            onParameterChange={handleParameterChange}
          />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <ReferenceProperties 
            references={references}
            selectedReferences={selectedReferences}
            onReferenceToggle={handleReferenceToggle}
          />
          <AnalysisResults calculations={calculations} />
        </div>
      </div>
    </MainLayout>
  );
};

export default AnalysisPage;