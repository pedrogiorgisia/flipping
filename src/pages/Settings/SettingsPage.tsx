import React, { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import { Save, RefreshCw, AlertTriangle, Info } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    areaMargin: 10,
    maxPriceDifference: 1000,
    maxCondoFee: 800,
    maxPropertyValue: 1000000,
    referencePriceReduction: 5,
    renovationPercentage: 15
  });
  
  const [settingsChanged, setSettingsChanged] = useState(false);
  
  const handleChange = (key: string, value: number) => {
    setSettings({
      ...settings,
      [key]: value
    });
    setSettingsChanged(true);
  };
  
  const handleSave = () => {
    // In a real app, this would save to a backend
    alert('Settings saved!');
    setSettingsChanged(false);
  };
  
  const handleReset = () => {
    setSettings({
      areaMargin: 10,
      maxPriceDifference: 1000,
      maxCondoFee: 800,
      maxPropertyValue: 1000000,
      referencePriceReduction: 5,
      renovationPercentage: 15
    });
    setSettingsChanged(true);
  };

  return (
    <MainLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parâmetros do Sistema</h1>
          <p className="text-gray-600 mt-1">Configure os parâmetros globais de análise</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw size={16} className="mr-2" />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={!settingsChanged}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              settingsChanged
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Calculation Parameters</h2>
          <p className="mt-1 text-sm text-gray-500">
            These parameters affect how the system identifies and analyzes flipping opportunities.
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label htmlFor="area-margin" className="block text-sm font-medium text-gray-700 mb-1">
                Margin of reference area (%)
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  id="area-margin"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={settings.areaMargin}
                  onChange={(e) => handleChange('areaMargin', Number(e.target.value))}
                />
                <span className="ml-2 text-gray-500">%</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Percentage variation allowed in property area when finding comparable renovated properties.
              </p>
            </div>
            
            <div>
              <label htmlFor="max-price-diff" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum price difference per m² for potential (R$)
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-gray-500">R$</span>
                <input
                  type="number"
                  id="max-price-diff"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={settings.maxPriceDifference}
                  onChange={(e) => handleChange('maxPriceDifference', Number(e.target.value))}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Maximum R$/m² difference allowed between target and reference to flag as potential opportunity.
              </p>
            </div>
            
            <div>
              <label htmlFor="max-condo" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum acceptable condo fee (R$)
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-gray-500">R$</span>
                <input
                  type="number"
                  id="max-condo"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={settings.maxCondoFee}
                  onChange={(e) => handleChange('maxCondoFee', Number(e.target.value))}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Maximum monthly condo fee amount for a property to be considered viable.
              </p>
            </div>
            
            <div>
              <label htmlFor="max-value" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum target property value (R$)
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-gray-500">R$</span>
                <input
                  type="number"
                  id="max-value"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={settings.maxPropertyValue}
                  onChange={(e) => handleChange('maxPropertyValue', Number(e.target.value))}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Maximum price threshold for properties to be included in ROI analysis.
              </p>
            </div>
            
            <div>
              <label htmlFor="reference-reduction" className="block text-sm font-medium text-gray-700 mb-1">
                Reduction percentage on reference sale price (%)
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  id="reference-reduction"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={settings.referencePriceReduction}
                  onChange={(e) => handleChange('referencePriceReduction', Number(e.target.value))}
                />
                <span className="ml-2 text-gray-500">%</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Discount applied to the average reference property price to account for market conditions.
              </p>
            </div>
            
            <div>
              <label htmlFor="renovation-pct" className="block text-sm font-medium text-gray-700 mb-1">
                Default renovation cost percentage (%)
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  id="renovation-pct"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={settings.renovationPercentage}
                  onChange={(e) => handleChange('renovationPercentage', Number(e.target.value))}
                />
                <span className="ml-2 text-gray-500">%</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Percentage of purchase price used to estimate renovation costs when no custom value is provided.
              </p>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-4 sm:px-6 bg-blue-50 flex items-start">
          <div className="flex-shrink-0">
            <Info size={20} className="text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Parameter Impact</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                These parameters significantly affect how opportunities are identified and ROI is calculated. 
                Adjust them based on your investment strategy and market conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;