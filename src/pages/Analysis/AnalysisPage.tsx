
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import {
  getSimulacoes,
  getReferenciaSimulacao,
  atualizarSimulacao,
} from "../../api";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const AnalysisPage: React.FC = () => {
  const { propertyId: simulationId } = useParams<{ propertyId: string }>();
  const [simulacao, setSimulacao] = useState<any | null>(null);
  const [referenciasSimulacao, setReferenciasSimulacao] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("calculadora");

  useEffect(() => {
    const fetchData = async () => {
      if (!simulationId) {
        setError("ID da simulação não encontrado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [simulacaoData, referenciasData] = await Promise.all([
          getSimulacoes(simulationId),
          getReferenciaSimulacao(simulationId),
        ]);

        setSimulacao(simulacaoData);
        setReferenciasSimulacao(referenciasData);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError(
          `Erro ao carregar os dados da simulação: ${(err as Error).message}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [simulationId]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  if (!simulacao) return <div>Nenhuma simulação encontrada</div>;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "calculadora"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("calculadora")}
          >
            Calculadora ROI
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "referencias"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("referencias")}
          >
            Imóveis Referência
          </button>
        </div>

        {activeTab === "calculadora" && (
          <div className="grid grid-cols-3 gap-6">
            {/* Parâmetros de Compra */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Parâmetros de Compra</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Valor de compra</label>
                  <div className="text-lg font-medium">
                    {formatCurrency(simulacao.param_valor_compra)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Entrada (%)</label>
                  <div className="text-lg font-medium">
                    {simulacao.param_entrada_pct}%
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">ITBI (%)</label>
                  <div className="text-lg font-medium">
                    {simulacao.param_itbi_pct}%
                  </div>
                </div>
              </div>
            </div>

            {/* Financiamento e Venda */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Financiamento e Venda</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Valor de venda</label>
                  <div className="text-lg font-medium">
                    {formatCurrency(simulacao.param_valor_venda)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Tempo de venda (meses)
                  </label>
                  <div className="text-lg font-medium">
                    {simulacao.param_tempo_venda}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Taxa CET (%)</label>
                  <div className="text-lg font-medium">
                    {simulacao.param_taxa_cet}%
                  </div>
                </div>
              </div>
            </div>

            {/* Análise de Viabilidade */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Análise de Viabilidade</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">
                    Investimento Total
                  </label>
                  <div className="text-lg font-medium">
                    {formatCurrency(simulacao.investimento_total || 0)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Lucro Líquido</label>
                  <div className="text-lg font-medium">
                    {formatCurrency(simulacao.lucro_liquido || 0)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">ROI (%)</label>
                  <div className="text-lg font-medium text-green-600">
                    {((simulacao.roi_liquido || 0) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "referencias" && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Imóveis de Referência</h3>
              <p className="text-sm text-gray-500">
                Compare com imóveis similares na região
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Endereço
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Área
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quartos
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      R$/m²
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {referenciasSimulacao.map((ref: any) => (
                    <tr key={ref.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ref.imovel.endereco}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {formatCurrency(ref.imovel.preco_anunciado)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {ref.imovel.area}m²
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {ref.imovel.quartos}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {formatCurrency(ref.imovel.preco_m2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resumo do Investimento */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Resumo do Investimento</h3>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-gray-600">Valor de Compra</p>
              <p className="text-lg font-medium">
                {formatCurrency(simulacao.param_valor_compra)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Valor de Venda</p>
              <p className="text-lg font-medium">
                {formatCurrency(simulacao.param_valor_venda)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Investimento Total</p>
              <p className="text-lg font-medium">
                {formatCurrency(simulacao.investimento_total || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lucro Líquido</p>
              <p className="text-lg font-medium">
                {formatCurrency(simulacao.lucro_liquido || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ROI de Geração</p>
              <p className="text-lg font-medium text-green-600">
                {((simulacao.roi_liquido || 0) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AnalysisPage;
