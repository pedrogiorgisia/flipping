
import React, { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import { Save, RefreshCw, Info } from 'lucide-react';

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
    alert('Configurações salvas!');
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
            Restaurar Padrões
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
            Salvar Alterações
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Parâmetros de Cálculo</h2>
          <p className="mt-1 text-sm text-gray-500">
            Esses parâmetros afetam como o sistema identifica e analisa oportunidades de flipping imobiliário.
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label htmlFor="area-margin" className="block text-sm font-medium text-gray-700 mb-1">
                Margem da área de referência (%)
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
                Variação percentual permitida na área do imóvel ao buscar propriedades reformadas comparáveis.
              </p>
            </div>
            
            <div>
              <label htmlFor="max-price-diff" className="block text-sm font-medium text-gray-700 mb-1">
                Diferença máxima de preço por m² para potencial (R$)
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
                Diferença máxima em R$/m² permitida entre o imóvel alvo e o imóvel de referência.
              </p>
            </div>
            
            <div>
              <label htmlFor="max-condo" className="block text-sm font-medium text-gray-700 mb-1">
                Valor máximo aceitável de condomínio (R$)
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
                Valor máximo da taxa mensal de condomínio para que o imóvel seja considerado viável.
              </p>
            </div>
            
            <div>
              <label htmlFor="max-value" className="block text-sm font-medium text-gray-700 mb-1">
                Valor máximo do imóvel alvo (R$)
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
                Valor máximo permitido para que os imóveis sejam incluídos na análise de ROI.
              </p>
            </div>
            
            <div>
              <label htmlFor="reference-reduction" className="block text-sm font-medium text-gray-700 mb-1">
                Percentual de redução sobre o preço de venda de referência (%)
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
                Desconto aplicado sobre o preço médio das propriedades de referência para refletir as condições do mercado.
              </p>
            </div>
            
            <div>
              <label htmlFor="renovation-pct" className="block text-sm font-medium text-gray-700 mb-1">
                Percentual padrão de custo de reforma (%)
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
                Percentual do valor de compra utilizado para estimar o custo da reforma quando nenhum valor personalizado for fornecido.
              </p>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-4 sm:px-6 bg-blue-50 flex items-start">
          <div className="flex-shrink-0">
            <Info size={20} className="text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Impacto dos Parâmetros</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Esses parâmetros influenciam significativamente como as oportunidades são identificadas e como o ROI é calculado.
                Ajuste-os conforme sua estratégia de investimento e as condições do mercado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
