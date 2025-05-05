import React, { useState, useEffect } from "react";
import { Trash, PlusCircle, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { useEffectiveAnalysisId } from "../../hooks/useEffectiveAnalysisId";

export interface ReferenceProperty {
  id: string;
  imovel: {
    id: string;
    id_analise: string;
    url: string;
    imobiliaria: string;
    preco_anunciado: number;
    area: number;
    quartos: number;
    banheiros: number;
    vagas: number;
    condominio_mensal: number;
    iptu_anual: number;
    endereco: string;
    codigo_ref_externo: string;
    comentarios: string | null;
    reformado: boolean;
    preco_m2: number;
  };
}

interface ReferencePropertiesProps {
  references: ReferenceProperty[];
  onRemove?: (id: string) => void;
  simulationId: string;
  simulacao: any;
}

const ReferenceProperties: React.FC<ReferencePropertiesProps> = ({
  references: initialReferences,
  onRemove,
  simulationId,
  simulacao,
}) => {
  const [references, setReferences] = useState(initialReferences);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [referenceToDelete, setReferenceToDelete] = useState<string | null>(
    null,
  );

  const fetchReferences = async () => {
    try {
      const response = await fetch(
        `https://flippings.com.br/referencia-simulacao?id_simulacao=${simulationId}`,
      );
      if (!response.ok) throw new Error("Erro ao carregar referências");
      const data = await response.json();
      setReferences(data);
    } catch (error) {
      toast.error("Erro ao carregar referências");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReferences();
  }, [simulationId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(
        `https://flippings.com.br/referencia-simulacao/${id}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir referência");
      }

      onRemove?.(id);
      setIsDeleteModalOpen(false);
      setReferenceToDelete(null);
      fetchReferences(); // Atualiza a lista de referências após a exclusão
    } catch (error) {
      toast.error("Erro ao excluir referência");
    }
  };

  const [parameters, setParameters] = useState<any>(null);
  const analysisId = useEffectiveAnalysisId();

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const response = await fetch(`https://flippings.com.br/parametros/${analysisId}`);
        if (!response.ok) throw new Error("Erro ao carregar parâmetros");
        const data = await response.json();
        setParameters(data);
      } catch (error) {
        console.error("Erro ao carregar parâmetros:", error);
      }
    };
    fetchParameters();
  }, [analysisId]);

  const calculateAveragePrice = () => {
    if (!references.length) return 0;
    const total = references.reduce(
      (sum, ref) => sum + ref.imovel.preco_anunciado,
      0,
    );
    const average = total / references.length;
    const reductionPct = parameters?.reducao_pct || 0;
    return average * (1 - reductionPct / 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 inline-block">
          <p className="text-xs font-medium text-gray-500 mb-1">
            Preço de Venda Sugerido
          </p>
          <p className="text-sm font-bold text-gray-900">
            {formatCurrency(calculateAveragePrice())}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
        >
          <PlusCircle size={14} className="inline-block mr-1" />
          Adicionar Referência
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-2 py-2 text-left">Endereço</th>
              <th className="px-2 py-2 text-right">Valor</th>
              <th className="px-2 py-2 text-right">Área</th>
              <th className="px-2 py-2 text-center">Qts</th>
              <th className="px-2 py-2 text-center">Ban</th>
              <th className="px-2 py-2 text-center">Vgs</th>
              <th className="px-2 py-2 text-right">Cond.</th>
              <th className="px-2 py-2 text-right">IPTU</th>
              <th className="px-2 py-2 text-right">R$/m²</th>
              <th className="px-2 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {references.map((reference) => (
              <tr key={reference.id} className="hover:bg-gray-50 text-sm">
                <td className="px-2 py-2 text-gray-900 truncate max-w-xs">
                  {reference.imovel.endereco}
                </td>
                <td className="px-2 py-2 text-gray-900 text-right">
                  {formatCurrency(reference.imovel.preco_anunciado)}
                </td>
                <td className="px-2 py-2 text-gray-900 text-right">
                  {reference.imovel.area}m²
                </td>
                <td className="px-2 py-2 text-gray-900 text-center">
                  {reference.imovel.quartos}
                </td>
                <td className="px-2 py-2 text-gray-900 text-center">
                  {reference.imovel.banheiros}
                </td>
                <td className="px-2 py-2 text-gray-900 text-center">
                  {reference.imovel.vagas}
                </td>
                <td className="px-2 py-2 text-gray-900 text-right">
                  {formatCurrency(reference.imovel.condominio_mensal)}
                </td>
                <td className="px-2 py-2 text-gray-900 text-right">
                  {formatCurrency(reference.imovel.iptu_anual)}
                </td>
                <td className="px-2 py-2 text-gray-900 text-right">
                  {formatCurrency(reference.imovel.preco_m2)}
                </td>
                <td className="px-2 py-2 text-gray-900 text-center">
                  <div className="flex justify-center space-x-2">
                    <a
                      href={reference.imovel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink size={16} />
                    </a>
                    <button
                      onClick={() => {
                        setReferenceToDelete(reference.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AddReferenceModal
          onClose={() => setIsModalOpen(false)}
          simulationId={simulationId}
          onUpdate={fetchReferences}
          simulacao={simulacao}
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar exclusão
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Deseja realmente excluir esta referência?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setReferenceToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={() =>
                  referenceToDelete && handleRemove(referenceToDelete)
                }
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface Property {
  id: string;
  url: string;
  imobiliaria: string;
  preco_anunciado: number;
  area: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  condominio_mensal: number;
  iptu_anual: number;
  endereco: string;
  preco_m2: number;
}

const AddReferenceModal: React.FC<{
  onClose: () => void;
  simulationId: string;
  onUpdate: () => void;
  simulacao?: any;
}> = ({ onClose, simulationId, onUpdate, simulacao }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const analysisId = useEffectiveAnalysisId();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all properties
        const propertiesResponse = await fetch(
          `https://flippings.com.br/imoveis?id_analise=${analysisId}&reformado=true`,
        );
        if (!propertiesResponse.ok) throw new Error("Erro ao carregar imóveis");
        const propertiesData = await propertiesResponse.json();

        // Fetch existing references
        const referencesResponse = await fetch(
          `https://flippings.com.br/referencia-simulacao?id_simulacao=${simulationId}`,
        );
        if (!referencesResponse.ok) throw new Error("Erro ao carregar referências");
        const referencesData = await referencesResponse.json();

        // Get IDs of existing references
        const existingReferenceIds = new Set(
          referencesData.map((ref: any) => ref.imovel.id)
        );

        // Filter out properties that are already references
        const filteredProperties = propertiesData.filter(
          (property: Property) => !existingReferenceIds.has(property.id)
        );

        setProperties(filteredProperties);
      } catch (error) {
        toast.error("Erro ao carregar imóveis");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [simulationId, analysisId]);

  const handlePropertySelect = (propertyId: string) => {
    const newSelected = new Set(selectedProperties);
    if (selectedProperties.has(propertyId)) {
      newSelected.delete(propertyId);
    } else {
      newSelected.add(propertyId);
    }
    setSelectedProperties(newSelected);
  };

  const handleAddReferences = async () => {
    try {
      const addPromises = Array.from(selectedProperties).map((propertyId) =>
        fetch("https://flippings.com.br/referencia-simulacao", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_simulacao: simulationId,
            id_imovel_referencia: propertyId,
          }),
        }),
      );

      await Promise.all(addPromises);

      onClose();
      toast.success("Referências adicionadas com sucesso");
      onUpdate(); // Chama a função para atualizar as referências
    } catch (error) {
      toast.error("Erro ao adicionar referências");
      console.error(error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Adicionar Imóveis de Referência
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Recommended Properties */}
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <h4 className="text-lg font-medium text-green-800 mb-3">
                  Imóveis Recomendados para Referência
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-3 py-2"></th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Link</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Endereço</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Valor</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Área</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Qts/Ban/Vgs</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">R$/m²</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {properties
                        .filter((property) => {
                          const areaVariation = Math.abs(property.area - (simulacao?.imovel?.area || 0)) / (simulacao?.imovel?.area || 1) * 100;
                          return (
                            property.quartos === simulacao?.imovel?.quartos &&
                            property.banheiros === simulacao?.imovel?.banheiros &&
                            property.vagas === simulacao?.imovel?.vagas &&
                            areaVariation <= 10
                          );
                        })
                        .map((property) => (
                          <tr key={property.id} className="hover:bg-green-50">
                            <td className="px-3 py-2">
                              <input
                                type="checkbox"
                                checked={selectedProperties.has(property.id)}
                                onChange={() => handlePropertySelect(property.id)}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <a
                                href={property.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink size={16} />
                              </a>
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900" title={property.endereco}>
                              {property.endereco}
                            </td>
                            <td className="px-3 py-2 text-sm text-right font-medium">
                              {formatCurrency(property.preco_anunciado)}
                            </td>
                            <td className="px-3 py-2 text-sm text-right">
                              {property.area}m²
                            </td>
                            <td className="px-3 py-2 text-sm text-center">
                              {property.quartos}/{property.banheiros}/{property.vagas}
                            </td>
                            <td className="px-3 py-2 text-sm text-right">
                              {formatCurrency(property.preco_m2)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Not Recommended Properties */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-700 mb-3">
                  Outros Imóveis Disponíveis
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2"></th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Link</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Endereço</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Valor</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Área</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Qts/Ban/Vgs</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">R$/m²</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {properties
                        .filter((property) => {
                          const areaVariation = Math.abs(property.area - (simulacao?.imovel?.area || 0)) / (simulacao?.imovel?.area || 1) * 100;
                          return !(
                            property.quartos === simulacao?.imovel?.quartos &&
                            property.banheiros === simulacao?.imovel?.banheiros &&
                            property.vagas === simulacao?.imovel?.vagas &&
                            areaVariation <= 10
                          );
                        })
                        .map((property) => (
                          <tr key={property.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2">
                              <input
                                type="checkbox"
                                checked={selectedProperties.has(property.id)}
                                onChange={() => handlePropertySelect(property.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <a
                                href={property.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink size={16} />
                              </a>
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900" title={property.endereco}>
                              {property.endereco}
                            </td>
                            <td className="px-3 py-2 text-sm text-right font-medium">
                              {formatCurrency(property.preco_anunciado)}
                            </td>
                            <td className="px-3 py-2 text-sm text-right">
                              {property.area}m²
                            </td>
                            <td className="px-3 py-2 text-sm text-center">
                              {property.quartos}/{property.banheiros}/{property.vagas}
                            </td>
                            <td className="px-3 py-2 text-sm text-right">
                              {formatCurrency(property.preco_m2)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleAddReferences}
            disabled={selectedProperties.size === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Adicionar Selecionados
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferenceProperties;