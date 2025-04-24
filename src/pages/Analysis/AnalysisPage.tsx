import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import { Property } from '../../types/property';
import PropertyDetails from './PropertyDetails';
import ReferenceProperties from './ReferenceProperties';
import { Download, Calculator, Share2, Plus, Trash } from 'lucide-react';

const AnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isAddReferenceModalOpen, setIsAddReferenceModalOpen] = useState(false);

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
    price: 500000,
    area: 120,
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

  const handleParameterChange = (field: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }));
    recalculateValues();
  };

  const recalculateValues = () => {
    // Placeholder for recalculation logic.  This would need to be implemented
    // based on the specific calculations required.  For now, it only logs a message.

    console.log("Recalculating values...");
  };

  const handleAddReference = (referenceProperty: Property) => {
    setReferences([...references, referenceProperty]);
    setIsAddReferenceModalOpen(false);
  };

  const handleRemoveReference = (referenceId: string) => {
    setReferences(references.filter(ref => ref.id !== referenceId));
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
          <div>
            <PropertyDetails property={property} />
          </div>
          <div>
            <ReferenceProperties references={references} onRemove={handleRemoveReference}/>
          </div>
        </div>


      </div>

      {/* Modal para adicionar referência */}
      {isAddReferenceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full">
            <h2 className="text-xl font-bold mb-4">Adicionar Referência</h2>
            {/* Adicione aqui o formulário para selecionar uma propriedade de referência */}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default AnalysisPage;