import React from "react";
import MainLayout from "../../components/Layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

interface Analysis {
  id: string;
  propertyName: string;
  address: string;
  purchasePrice: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  createdAt: Date;
}

const IndividualAnalysisPage: React.FC = () => {
  const navigate = useNavigate();

  const analyses: Analysis[] = [
    {
      id: "1",
      propertyName: "Apartamento Pinheiros",
      address: "Rua dos Pinheiros, 1000",
      purchasePrice: 720000,
      area: 68,
      bedrooms: 2,
      bathrooms: 1,
      parkingSpaces: 1,
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      propertyName: "Apartamento Vila Mariana",
      address: "Rua Vergueiro, 2000",
      purchasePrice: 950000,
      area: 85,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 1,
      createdAt: new Date("2024-02-01"),
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Análises Individuais
        </h1>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imóvel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endereço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Área
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quartos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyses.map((analysis) => (
                <tr
                  key={analysis.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/analysis/${analysis.id}/property`)}
                >
                  <td className="px-6 py-4">{analysis.propertyName}</td>
                  <td className="px-6 py-4">{analysis.address}</td>
                  <td className="px-6 py-4">
                    {formatCurrency(analysis.purchasePrice)}
                  </td>
                  <td className="px-6 py-4">{analysis.area}m²</td>
                  <td className="px-6 py-4">{analysis.bedrooms}</td>
                  <td className="px-6 py-4">
                    {analysis.createdAt.toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="Ver análise"
                    >
                      <FileText size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default IndividualAnalysisPage;
