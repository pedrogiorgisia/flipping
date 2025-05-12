import React, { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

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

const FormField = ({ label, tooltip, children }: { label: string; tooltip: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>
          <button type="button" className="text-gray-400 hover:text-gray-600">
            <HelpCircle size={16} />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content
          className="max-w-xs p-2 text-sm text-white bg-gray-900 rounded shadow-lg z-50"
          sideOffset={5}
        >
          {tooltip}
          <Tooltip.Arrow className="fill-gray-900" />
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
    {children}
  </div>
);

const AnalysisWizard: React.FC<AnalysisWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nome: '',
    margem_area_pct: 10,
    reducao_pct: 8,
    param_entrada_pct: 20,
    param_avaliacao_bancaria: 0,
    param_taxa_cet: 11.5,
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

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return formData.nome.trim() !== '';
      case 1:
        return formData.margem_area_pct !== undefined && formData.margem_area_pct !== null &&
               formData.reducao_pct !== undefined && formData.reducao_pct !== null;
      case 2:
        return formData.param_entrada_pct !== undefined && formData.param_entrada_pct !== null &&
               formData.param_avaliacao_bancaria !== undefined && formData.param_avaliacao_bancaria !== null &&
               formData.param_taxa_cet !== undefined && formData.param_taxa_cet !== null &&
               formData.param_prazo_financiamento !== undefined && formData.param_prazo_financiamento !== null;
      case 3:
        return formData.param_itbi_pct !== undefined && formData.param_itbi_pct !== null &&
               formData.param_registro_cartorio_pct !== undefined && formData.param_registro_cartorio_pct !== null &&
               formData.param_custo_reforma_pct !== undefined && formData.param_custo_reforma_pct !== null;
      case 4:
        return formData.param_tempo_venda !== undefined && formData.param_tempo_venda !== null &&
               formData.param_corretagem_venda_pct !== undefined && formData.param_corretagem_venda_pct !== null &&
               formData.param_desconto_valor_compra !== undefined && formData.param_desconto_valor_compra !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (currentStep === steps.length - 1) {
      onComplete(formData);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const renderInput = (id: string, value: string | number, onChange: (value: string | number) => void, type: string = "number") => (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
    />
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <FormField
            label="Nome da Análise"
            tooltip="Digite um nome descritivo para identificar sua análise"
          >
            {renderInput('nome', formData.nome, (value) => handleChange('nome', value), 'text')}
          </FormField>
        );
      case 1:
        return (
          <div className="space-y-6">
            <FormField
              label="Margem de Área (%)"
              tooltip="Este percentual define a variação permitida na área do imóvel ao buscar propriedades comparáveis. Por exemplo: Se escolher 10% e o imóvel tem 100m², serão considerados imóveis de 90m² a 110m²."
            >
              {renderInput('margem_area_pct', formData.margem_area_pct, (value) => handleChange('margem_area_pct', value))}
            </FormField>
            <FormField
              label="Redução no Preço de Referência (%)"
              tooltip="Percentual de redução aplicado ao preço médio das propriedades de referência para calcular o valor sugerido de venda. Por exemplo: Se os imóveis similares têm média de R$ 1.000.000 e esse percentual for 8%, o preço sugerido será R$ 920.000."
            >
              {renderInput('reducao_pct', formData.reducao_pct, (value) => handleChange('reducao_pct', value))}
            </FormField>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <FormField
              label="Percentual de Entrada (%)"
              tooltip="Percentual do valor do imóvel exigido como entrada no financiamento. Atualmente, os bancos praticam entre 20% e 30%."
            >
              {renderInput('param_entrada_pct', formData.param_entrada_pct, (value) => handleChange('param_entrada_pct', value))}
            </FormField>
            <FormField
              label="Avaliação Bancária (R$)"
              tooltip="Custo cobrado pelo banco para realizar a avaliação do imóvel no processo de financiamento."
            >
              {renderInput('param_avaliacao_bancaria', formData.param_avaliacao_bancaria, (value) => handleChange('param_avaliacao_bancaria', value))}
            </FormField>
            <FormField
              label="Taxa CET (% a.a.)"
              tooltip="Custo Efetivo Total da operação, que representa a taxa de juros total aplicada pelo banco no financiamento."
            >
              {renderInput('param_taxa_cet', formData.param_taxa_cet, (value) => handleChange('param_taxa_cet', value))}
            </FormField>
            <FormField
              label="Prazo de Financiamento (meses)"
              tooltip="Duração total do financiamento imobiliário em meses. O padrão é 420 meses (35 anos)."
            >
              {renderInput('param_prazo_financiamento', formData.param_prazo_financiamento, (value) => handleChange('param_prazo_financiamento', value))}
            </FormField>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <FormField
              label="ITBI (%)"
              tooltip="Imposto sobre Transmissão de Bens Imóveis, cobrado na transferência do imóvel."
            >
              {renderInput('param_itbi_pct', formData.param_itbi_pct, (value) => handleChange('param_itbi_pct', value))}
            </FormField>
            <FormField
              label="Registro em Cartório (%)"
              tooltip="Percentual cobrado pelo cartório para registro da transferência do imóvel."
            >
              {renderInput('param_registro_cartorio_pct', formData.param_registro_cartorio_pct, (value) => handleChange('param_registro_cartorio_pct', value))}
            </FormField>
            <FormField
              label="Custo de Reforma (%)"
              tooltip="Estimativa do custo de reforma como percentual do valor do imóvel."
            >
              {renderInput('param_custo_reforma_pct', formData.param_custo_reforma_pct, (value) => handleChange('param_custo_reforma_pct', value))}
            </FormField>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <FormField
              label="Tempo Estimado de Venda (meses)"
              tooltip="Estimativa do tempo necessário para vender o imóvel após a conclusão da reforma."
            >
              {renderInput('param_tempo_venda', formData.param_tempo_venda, (value) => handleChange('param_tempo_venda', value))}
            </FormField>
            <FormField
              label="Corretagem de Venda (%)"
              tooltip="Percentual cobrado pelo corretor para intermediar a venda do imóvel."
            >
              {renderInput('param_corretagem_venda_pct', formData.param_corretagem_venda_pct, (value) => handleChange('param_corretagem_venda_pct', value))}
            </FormField>
            <FormField
              label="Desconto na Compra (%)"
              tooltip="Desconto estimado a ser negociado no valor de compra do imóvel. Recomenda-se entre 5% e 8%."
            >
              {renderInput('param_desconto_valor_compra', formData.param_desconto_valor_compra, (value) => handleChange('param_desconto_valor_compra', value))}
            </FormField>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Tooltip.Provider>
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
                disabled={!validateCurrentStep()}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
};

export default AnalysisWizard;