import React from "react";
import { ExternalLink, FileText, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffectiveAnalysisId } from "../../hooks/useEffectiveAnalysisId";
import { useAnalysisContext } from "../../context/AnalysisContext";

interface Property {
  id: string; // Adicionado este campo
  imovel: {
    endereco: string;
    area: number;
    preco_anunciado: number;
    url: string;
  };
  param_valor_compra: number;
  valor_m2_compra: number;
  param_custo_reforma: number;
  valor_m2_venda: number;
  calc_roi: number;
}

interface PropertyListProps {
  properties: Property[];
  onEdit?: (property: Property) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, onEdit }) => {
  const navigate = useNavigate();
  const effectiveAnalysisId = useEffectiveAnalysisId();
  const { currentAnalysisId } = useAnalysisContext();

  const sortedProperties = [...properties].sort(
    (a, b) => b.calc_roi - a.calc_roi,
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAnalyze = async (id: string) => {
    try {
      const idAnalise =
        effectiveAnalysisId ||
        currentAnalysisId ||
        sessionStorage.getItem("idAnalise");
      console.log("handleAnalyze - id_simulacao:", id);
      console.log("handleAnalyze - idAnalise:", idAnalise);

      if (!idAnalise) {
        throw new Error("ID da análise não encontrado");
      }
      if (!id) {
        throw new Error("ID da simulação não encontrado");
      }
      navigate(`/analysis/${idAnalise}/property/${id}`);
    } catch (error) {
      console.error("Error navigating to analysis:", error);
      // Adicione um alerta ou notificação para o usuário aqui
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Endereço
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Área (m²)
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Preço Anunciado
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Preço de Compra
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Preço m² Compra
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Custo Reforma
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Valor m² Venda
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                ROI Estimado
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProperties.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {property.imovel.endereco}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {property.imovel.area}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatCurrency(property.imovel.preco_anunciado)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatCurrency(property.param_valor_compra)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatCurrency(property.valor_m2_compra)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatCurrency(property.param_custo_reforma)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatCurrency(property.valor_m2_venda)}
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  {formatPercentage(property.calc_roi)}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => window.open(property.imovel.url, "_blank")}
                    className="text-gray-500 hover:text-blue-600"
                    title="Ver anúncio"
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button
                    onClick={() => handleAnalyze(property.id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Analisar imóvel"
                  >
                    <FileText size={16} />
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(property)}
                      className="text-gray-500 hover:text-blue-600"
                      title="Editar imóvel"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyList;
