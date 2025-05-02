import React from "react";

interface AnalysisResultsProps {
  results: {
    propertyPrice: number;
    propertyArea: number;
    pricePerSqm: number;
    acquisitionCosts: {
      downPayment: number;
      itbi: number;
      bankAppraisal: number;
      registry: number;
      total: number;
    };
    holdingCosts: {
      financing: number;
      condo: number;
      utilities: number;
      renovation: number;
      total: number;
    };
    totalInvestment: number;
    salePrice: number;
    sellingCosts: {
      financingPayoff: number;
      brokerage: number;
      incomeTax: number;
    };
    netProfit: number;
    roi: number;
  };
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Análise de Viabilidade
      </h3>

      <div className="space-y-4">
        <ResultSection title="Custos de Aquisição">
          <ResultItem
            label="Entrada"
            value={formatCurrency(results.acquisitionCosts.downPayment)}
          />
          <ResultItem
            label="ITBI"
            value={formatCurrency(results.acquisitionCosts.itbi)}
          />
          <ResultItem
            label="Avaliação do Banco"
            value={formatCurrency(results.acquisitionCosts.bankAppraisal)}
          />
          <ResultItem
            label="Registro"
            value={formatCurrency(results.acquisitionCosts.registry)}
          />
          <ResultItem
            label="Total"
            value={formatCurrency(results.acquisitionCosts.total)}
            highlight
          />
        </ResultSection>

        <ResultSection title="Custos até a venda">
          <ResultItem
            label="Parcelas financiamento"
            value={formatCurrency(results.holdingCosts.financing)}
          />
          <ResultItem
            label="Condomínio"
            value={formatCurrency(results.holdingCosts.condo)}
          />
          <ResultItem
            label="Contas (IPTU, luz, água e etc)"
            value={formatCurrency(results.holdingCosts.utilities)}
          />
          <ResultItem
            label="Reforma"
            value={formatCurrency(results.holdingCosts.renovation)}
          />
          <ResultItem
            label="Total"
            value={formatCurrency(results.holdingCosts.total)}
            highlight
          />
        </ResultSection>

        <ResultSection title="Custos de Venda">
          <ResultItem
            label="Quitação financiamento"
            value={formatCurrency(results.sellingCosts.financingPayoff)}
          />
          <ResultItem
            label="Corretagem e venda"
            value={formatCurrency(results.sellingCosts.brokerage)}
          />
          <ResultItem
            label="Imposto de Renda"
            value={formatCurrency(results.sellingCosts.incomeTax)}
          />
        </ResultSection>
      </div>
    </div>
  );
};

const ResultSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <h4 className="text-md font-medium text-gray-700 mb-2">{title}</h4>
    <div className="bg-gray-50 rounded-lg p-4 space-y-2">{children}</div>
  </div>
);

const ResultItem: React.FC<{
  label: string;
  value: string;
  highlight?: boolean;
}> = ({ label, value, highlight }) => (
  <div className="flex justify-between">
    <span className="text-sm text-gray-600">{label}</span>
    <span
      className={`text-sm font-medium ${highlight ? "text-blue-600" : "text-gray-900"}`}
    >
      {value}
    </span>
  </div>
);

export default AnalysisResults;
