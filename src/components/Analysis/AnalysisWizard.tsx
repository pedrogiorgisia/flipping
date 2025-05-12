
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface WizardStep {
  title: string;
  description: string;
}

const steps: WizardStep[] = [
  { title: 'Nome da Análise', description: 'Dê um nome para sua análise' },
  { title: 'Parâmetros de Preço', description: 'Configure os parâmetros para cálculo do preço de venda' },
  { title: 'Financiamento', description: 'Configure os parâmetros de financiamento' },
  { title: 'Custos', description: 'Configure os custos gerais' },
  { title: 'Outros', description: 'Configure parâmetros adicionais' }
];

interface AnalysisWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

const AnalysisWizard: React.FC<AnalysisWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nome: '',
    margem_area_pct: 10,
    reducao_pct: 8,
    param_entrada_pct: 20,
    param_avaliacao_bancaria: 2500,
    param_taxa_cet: 9.5,
    param_prazo_financiamento: 420,
    param_itbi_pct: 3,
    param_registro_cartorio_pct: 1.5,
    param_custo_reforma_pct: 15,
    param_tempo_venda: 6,
    param_corretagem_venda_pct: 6,
    param_desconto_valor_compra: 5
  });

  if (!isOpen) return null;

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      onComplete(formData);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Nome da Análise</span>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ex: Análise Pinheiros I"
              />
            </label>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Margem de Área (%)
                <input
                  type="number"
                  value={formData.margem_area_pct}
                  onChange={(e) => handleChange('margem_area_pct', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Variação percentual permitida na área do imóvel ao buscar propriedades comparáveis.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Redução no Preço de Referência (%)
                <input
                  type="number"
                  value={formData.reducao_pct}
                  onChange={(e) => handleChange('reducao_pct', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Percentual de redução aplicado ao preço médio das propriedades de referência.
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Percentual de Entrada (%)
                <input
                  type="number"
                  value={formData.param_entrada_pct}
                  onChange={(e) => handleChange('param_entrada_pct', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Avaliação Bancária (R$)
                <input
                  type="number"
                  value={formData.param_avaliacao_bancaria}
                  onChange={(e) => handleChange('param_avaliacao_bancaria', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Taxa CET (% a.a.)
                <input
                  type="number"
                  value={formData.param_taxa_cet}
                  onChange={(e) => handleChange('param_taxa_cet', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prazo de Financiamento (meses)
                <input
                  type="number"
                  value={formData.param_prazo_financiamento}
                  onChange={(e) => handleChange('param_prazo_financiamento', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ITBI (%)
                <input
                  type="number"
                  value={formData.param_itbi_pct}
                  onChange={(e) => handleChange('param_itbi_pct', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Registro em Cartório (%)
                <input
                  type="number"
                  value={formData.param_registro_cartorio_pct}
                  onChange={(e) => handleChange('param_registro_cartorio_pct', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Custo de Reforma (%)
                <input
                  type="number"
                  value={formData.param_custo_reforma_pct}
                  onChange={(e) => handleChange('param_custo_reforma_pct', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tempo Estimado de Venda (meses)
                <input
                  type="number"
                  value={formData.param_tempo_venda}
                  onChange={(e) => handleChange('param_tempo_venda', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Corretagem de Venda (%)
                <input
                  type="number"
                  value={formData.param_corretagem_venda_pct}
                  onChange={(e) => handleChange('param_corretagem_venda_pct', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Desconto na Compra (%)
                <input
                  type="number"
                  value={formData.param_desconto_valor_compra}
                  onChange={(e) => handleChange('param_desconto_valor_compra', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Nova Análise</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 w-12 mx-2 ${
                        index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">{steps[currentStep].title}</h3>
              <p className="text-sm text-gray-500">{steps[currentStep].description}</p>
            </div>
          </div>

          <div className="mb-8">{renderStepContent()}</div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Voltar
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === 0 && !formData.nome.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisWizard;
