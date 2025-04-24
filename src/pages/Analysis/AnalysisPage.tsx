import React, { useState, useEffect } from 'react';
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
  const [calculationResults, setCalculationResults] = useState({
    propertyPrice: 720000,
    propertyArea: 97,
    pricePerSqm: 7422.68,
    acquisitionCosts: {
      downPayment: 216000,
      itbi: 21600,
      bankAppraisal: 5000,
      registry: 10800,
      total: 253400
    },
    holdingCosts: {
      financing: 49849.80,
      condo: 15300,
      utilities: 2300,
      renovation: 151200,
      total: 218649.80
    },
    totalInvestment: 472049.80,
    salePrice: 1212500,
    sellingCosts: {
      financingPayoff: 493200,
      brokerage: 72750,
      incomeTax: 30684.40
    },
    netProfit: 143815.80,
    roi: 30.47
  });

  const [parameters, setParameters] = useState({
    downPaymentPercent: 20,
    saleTimeMonths: 3,
    cetRate: 14.25,
    financingMonths: 360,
    brokeragePercent: 5,
    hasIncomeTax: false,
    itbiPercent: 3,
    marketDiscountPercent: 8
  });

  const [property, setProperty] = useState<Property>({
    id: '1',
    url: 'https://example.com/property1',
    agency: 'Imobiliária Moderna',
    price: 720000,
    area: 97,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 1,
    condoFee: 500,
    yearlyTax: 2000,
    address: 'Rua Example, 123',
    code: 'PRO-001',
    createdAt: new Date('2023-01-15'),
    renovated: false,
  });

  const handleParameterChange = (field: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }));
    recalculateValues();
  };

  const recalculateValues = () => {
    // Implement calculation logic here based on the image
    console.log("Recalculating values with parameters:", parameters);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Análise de Investimento</h1>
            <p className="text-gray-600 mt-1">Análise detalhada para {property.code}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50">
              <Download size={16} className="mr-2" />
              Exportar PDF
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50">
              <Share2 size={16} className="mr-2" />
              Compartilhar
            </button>
            <button 
              onClick={recalculateValues}
              className="inline-flex items-center px-4 py-2 border border-transparent bg-blue-600 text-sm font-medium rounded-md text-white hover:bg-blue-700"
            >
              <Calculator size={16} className="mr-2" />
              Recalcular
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <PropertyDetails property={property} />
            <CalculationParameters 
              parameters={parameters}
              onParameterChange={handleParameterChange}
            />
          </div>
          <div className="space-y-6">
            <AnalysisResults results={calculationResults} />
            <ReferenceProperties />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AnalysisPage;