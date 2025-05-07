import { useEffectiveAnalysisId } from "../../hooks/useEffectiveAnalysisId";
import React, { useState, useEffect } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import PropertyTable from "./PropertyTable";
import { Property } from "../../types/property";
import toast from "react-hot-toast";
import { Plus, Upload, Download } from "lucide-react";

const PropertiesPage: React.FC = () => {
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsNewPropertyModalOpen(true);
  };
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewPropertyModalOpen, setIsNewPropertyModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    valor_min: "",
    valor_max: "",
    area_min: "",
    area_max: "",
    quartos: "",
    banheiros: "",
    reformado: "",
    condominio_min: "",
    condominio_max: "",
    m2_min: "",
    m2_max: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string>("");
  const effectiveAnalysisId = useEffectiveAnalysisId();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importedData, setImportedData] = useState<any>(null);

  console.log(effectiveAnalysisId);

  const fetchProperties = async () => {
    if (!effectiveAnalysisId) {
      toast.error("Nenhuma análise selecionada");
      setIsLoading(false);
      return;
    }

    if (effectiveAnalysisId === "undefined") {
      toast.error("ID da análise inválido");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://flippings.com.br/imoveis?id_analise=${effectiveAnalysisId}`,
      );
      if (!response.ok) {
        throw new Error("Erro ao carregar imóveis");
      }
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Erro ao carregar imóveis");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveAnalysisId) {
      fetchProperties();
    }
  }, [effectiveAnalysisId]);

  useEffect(() => {
    let filtered = [...properties];

    if (filters.valor_min)
      filtered = filtered.filter(
        (p) => p.preco_anunciado >= Number(filters.valor_min),
      );
    if (filters.valor_max)
      filtered = filtered.filter(
        (p) => p.preco_anunciado <= Number(filters.valor_max),
      );
    if (filters.area_min)
      filtered = filtered.filter((p) => p.area >= Number(filters.area_min));
    if (filters.area_max)
      filtered = filtered.filter((p) => p.area <= Number(filters.area_max));
    if (filters.quartos)
      filtered = filtered.filter((p) => p.quartos === Number(filters.quartos));
    if (filters.banheiros)
      filtered = filtered.filter(
        (p) => p.banheiros === Number(filters.banheiros),
      );
    if (filters.reformado)
      filtered = filtered.filter(
        (p) => p.reformado === (filters.reformado === "true"),
      );
    if (filters.condominio_min)
      filtered = filtered.filter(
        (p) => p.condominio_mensal >= Number(filters.condominio_min),
      );
    if (filters.condominio_max)
      filtered = filtered.filter(
        (p) => p.condominio_mensal <= Number(filters.condominio_max),
      );
    if (filters.m2_min)
      filtered = filtered.filter((p) => p.preco_m2 >= Number(filters.m2_min));
    if (filters.m2_max)
      filtered = filtered.filter((p) => p.preco_m2 <= Number(filters.m2_max));

    setFilteredProperties(filtered);
  }, [filters, properties]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`https://flippings.com.br/imoveis/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir imóvel");

      await fetchProperties();
      toast.success("Imóvel excluído com sucesso");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Erro ao excluir imóvel");
    }
    setPropertyToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleExport = async () => {
    const XLSX = await import("xlsx");

    const data = [
      [
        "ID",
        "URL",
        "Imobiliária",
        "Preço",
        "Área",
        "Quartos",
        "Banheiros",
        "Vagas",
        "Condomínio",
        "IPTU",
        "Endereço",
        "Código",
        "Data Anúncio",
        "Comentários",
        "Criado Em",
        "Reformado",
        "Preço/m²",
      ],
      ...filteredProperties.map((p) => [
        p.id,
        p.url,
        p.imobiliaria,
        p.preco_anunciado,
        p.area,
        p.quartos,
        p.banheiros,
        p.vagas,
        p.condominio_mensal,
        p.iptu_anual,
        p.endereco,
        p.codigo_ref_externo,
        new Date(p.data_anuncio).toLocaleDateString(),
        p.comentarios,
        new Date(p.criado_em).toLocaleString(),
        p.reformado ? "Sim" : "Não",
        p.preco_m2,
      ]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, "Imóveis");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "imoveis.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddProperty = async (formData: any) => {
    setIsSaving(true);
    setFormError("");

    if (!effectiveAnalysisId) {
      toast.error("Nenhuma análise selecionada");
      setIsSaving(false);
      return;
    }

    const payload: any = {
      id_analise: effectiveAnalysisId,
      reformado: formData.reformado === "on",
    };

    const fieldsToInclude = [
      "url",
      "imobiliaria",
      "preco_anunciado",
      "area",
      "quartos",
      "banheiros",
      "vagas",
      "condominio_mensal",
      "iptu_anual",
      "codigo_ref_externo",
      "data_anuncio",
      "endereco",
      "comentarios",
    ];

    fieldsToInclude.forEach((field) => {
      if (formData[field] && formData[field].trim() !== "") {
        payload[field] =
          field === "data_anuncio"
            ? formData[field]
            : [
                  "preco_anunciado",
                  "area",
                  "quartos",
                  "banheiros",
                  "vagas",
                  "condominio_mensal",
                  "iptu_anual",
                ].includes(field)
              ? Number(formData[field])
              : formData[field];
      }
    });

    try {
      let response;
      if (editingProperty) {
        response = await fetch(
          `https://flippings.com.br/imoveis/${editingProperty.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );
      } else {
        response = await fetch("https://flippings.com.br/imoveis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erro ao ${editingProperty ? "editar" : "adicionar"} imóvel: ${JSON.stringify(errorData)}`,
        );
      }

      await fetchProperties();
      toast.success(
        `Imóvel ${editingProperty ? "editado" : "adicionado"} com sucesso`,
      );
      setIsNewPropertyModalOpen(false);
      setEditingProperty(null);
      setImportedData(null);
    } catch (error) {
      console.error(
        `Error ${editingProperty ? "editing" : "adding"} property:`,
        error,
      );
      toast.error(`Erro ao ${editingProperty ? "editar" : "adicionar"} imóvel`);
      setFormError(
        error instanceof Error ? error.message : "Erro desconhecido",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNewProperty = () => {
    setIsNewPropertyModalOpen(true);
    setImportedData(null);
  };

  const handleImportHTML = () => {
    setIsImportModalOpen(true);
    setSelectedFile(null);
    setImportError(null);
  };

  const closeModals = () => {
    setIsImportModalOpen(false);
    setIsNewPropertyModalOpen(false);
    setImportedData(null);
  };

  const handleProcessHTML = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setImportError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "https://flippings.com.br/api/v1/parse-html",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(
          "Falha ao processar o arquivo HTML. Por favor, tente novamente.",
        );
      }

      const data = await response.json();
      setImportedData(data);
      setIsImportModalOpen(false);
      setIsNewPropertyModalOpen(true);
    } catch (error) {
      setImportError(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao processar o arquivo.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-600">Carregando...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Base de Imóveis</h1>
        <p className="text-gray-600 mt-1">Gerencie os imóveis da sua análise</p>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200 px-4 py-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAddNewProperty}
              className="inline-flex items-center px-4 py-2 border border-transparent bg-blue-600 text-sm font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-2" />
              Novo Imóvel
            </button>
            <button
              onClick={handleImportHTML}
              className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
            >
              <Upload size={16} className="mr-2" />
              Importar HTML
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-700">Preço min/max:</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.valor_min}
                    onChange={(e) =>
                      setFilters({ ...filters, valor_min: e.target.value })
                    }
                    className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.valor_max}
                    onChange={(e) =>
                      setFilters({ ...filters, valor_max: e.target.value })
                    }
                    className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700">Área min/max:</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.area_min}
                    onChange={(e) =>
                      setFilters({ ...filters, area_min: e.target.value })
                    }
                    className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.area_max}
                    onChange={(e) =>
                      setFilters({ ...filters, area_max: e.target.value })
                    }
                    className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700">Status:</label>
                <select
                  value={filters.reformado}
                  onChange={(e) =>
                    setFilters({ ...filters, reformado: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                >
                  <option value="">Todos</option>
                  <option value="true">Reformados</option>
                  <option value="false">Não Reformados</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setFilters({
                    valor_min: "",
                    valor_max: "",
                    area_min: "",
                    area_max: "",
                    quartos: "",
                    banheiros: "",
                    reformado: "",
                    condominio_min: "",
                    condominio_max: "",
                    m2_min: "",
                    m2_max: "",
                  })
                }
                className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
              >
                Limpar Filtros
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
              >
                <Download size={16} className="mr-2" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        <PropertyTable
          properties={filteredProperties}
          onEdit={handleEditProperty}
          onDelete={(id) => {
            setPropertyToDelete(id);
            setIsDeleteModalOpen(true);
          }}
        />

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirmar exclusão
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Deseja realmente excluir o imóvel?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setPropertyToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() =>
                    propertyToDelete && handleDelete(propertyToDelete)
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

      {isNewPropertyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingProperty
                ? "Editar Imóvel"
                : importedData
                  ? "Editar Imóvel Importado"
                  : "Adicionar Novo Imóvel"}
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formElement = e.target as HTMLFormElement;
                const formData = new FormData(formElement);
                const data = Object.fromEntries(formData);
                await handleAddProperty(data);
              }}
            >
              {formError && (
                <div className="mb-4 p-2 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded">
                  <p className="font-medium">Erro ao adicionar imóvel:</p>
                  <p>{formError}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-gray-700 mb-1" htmlFor="url">
                    URL do anúncio
                  </label>
                  <input
                    id="url"
                    name="url"
                    type="url"
                    required
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    placeholder="https://..."
                    defaultValue={
                      editingProperty?.url || importedData?.url || ""
                    }
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-1"
                    htmlFor="imobiliaria"
                  >
                    Imobiliária
                  </label>
                  <input
                    id="imobiliaria"
                    name="imobiliaria"
                    type="text"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    defaultValue={
                      editingProperty?.imobiliaria ||
                      importedData?.imobiliaria ||
                      ""
                    }
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-1"
                    htmlFor="preco_anunciado"
                  >
                    Preço (R$)
                  </label>
                  <input
                    id="preco_anunciado"
                    name="preco_anunciado"
                    type="number"
                    required
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    placeholder="0,00"
                    defaultValue={
                      editingProperty?.preco_anunciado ||
                      importedData?.preco_anunciado ||
                      ""
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1" htmlFor="area">
                    Área (m²)
                  </label>
                  <input
                    id="area"
                    name="area"
                    type="number"
                    required
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    placeholder="0"
                    defaultValue={
                      editingProperty?.area || importedData?.area || ""
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1" htmlFor="quartos">
                    Quartos
                  </label>
                  <input
                    id="quartos"
                    name="quartos"
                    type="number"
                    required
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    placeholder="0"
                    defaultValue={
                      editingProperty?.quartos || importedData?.quartos || ""
                    }
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-1"
                    htmlFor="banheiros"
                  >
                    Banheiros
                  </label>
                  <input
                    id="banheiros"
                    name="banheiros"
                    type="number"
                    required
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    placeholder="0"
                    defaultValue={
                      editingProperty?.banheiros ||
                      importedData?.banheiros ||
                      ""
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1" htmlFor="vagas">
                    Vagas
                  </label>
                  <input
                    id="vagas"
                    name="vagas"
                    type="number"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    placeholder="0"
                    defaultValue={
                      editingProperty?.vagas || importedData?.vagas || ""
                    }
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-1"
                    htmlFor="condominio_mensal"
                  >
                    Condomínio mensal (R$)
                  </label>
                  <input
                    id="condominio_mensal"
                    name="condominio_mensal"
                    type="number"
                    required
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    placeholder="0,00"
                    defaultValue={
                      editingProperty?.condominio_mensal ||
                      importedData?.condominio_mensal ||
                      ""
                    }
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-1"
                    htmlFor="iptu_anual"
                  >
                    IPTU anual (R$)
                  </label>
                  <input
                    id="iptu_anual"
                    name="iptu_anual"
                    type="number"
                    required
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    placeholder="0,00"
                    defaultValue={
                      editingProperty?.iptu_anual ||
                      importedData?.iptu_anual ||
                      ""
                    }
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-1"
                    htmlFor="codigo_ref_externo"
                  >
                    Código
                  </label>
                  <input
                    id="codigo_ref_externo"
                    name="codigo_ref_externo"
                    type="text"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    defaultValue={
                      editingProperty?.codigo_ref_externo ||
                      importedData?.codigo_ref_externo ||
                      ""
                    }
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-1"
                    htmlFor="data_anuncio"
                  >
                    Data do anúncio
                  </label>
                  <input
                    id="data_anuncio"
                    name="data_anuncio"
                    type="date"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    defaultValue={
                      editingProperty?.data_anuncio
                        ? new Date(editingProperty.data_anuncio)
                            .toISOString()
                            .split("T")[0]
                        : importedData?.data_anuncio || ""
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label
                    className="block text-gray-700 mb-1"
                    htmlFor="endereco"
                  >
                    Endereço
                  </label>
                  <input
                    id="endereco"
                    name="endereco"
                    type="text"
                    required
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    defaultValue={
                      editingProperty?.endereco || importedData?.endereco || ""
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="flex items-center">
                    <input
                      name="reformado"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked={
                        editingProperty?.reformado ||
                        importedData?.reformado ||
                        false
                      }
                    />
                    <span className="ml-2 text-gray-700">Reformado</span>
                  </label>
                </div>
                <div className="col-span-2">
                  <label
                    className="block text-gray-700 mb-1"
                    htmlFor="comentarios"
                  >
                    Comentários
                  </label>
                  <textarea
                    id="comentarios"
                    name="comentarios"
                    rows={2}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    defaultValue={
                      editingProperty?.comentarios ||
                      importedData?.comentarios ||
                      ""
                    }
                  ></textarea>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    closeModals();
                    setEditingProperty(null);
                  }}
                  className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  disabled={isSaving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 ${isSaving ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  {isSaving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Importar HTML
            </h2>
            <p className="text-gray-600 mb-4">
              Faça upload de um arquivo HTML de um anúncio para importar
              automaticamente os detalhes do imóvel. <br />
              <br />
              HTML aceitos: Quinto Andar, Zap imóveis, Loft
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Arraste e solte um arquivo HTML, ou clique para selecionar
              </p>
              <input
                type="file"
                className="hidden"
                id="html-upload"
                accept=".html,.htm"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                  }
                }}
              />
              <button
                onClick={() => document.getElementById("html-upload")?.click()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Selecionar Arquivo
              </button>
            </div>

            {selectedFile && (
              <p className="text-sm text-gray-600 mb-4">
                Arquivo selecionado: {selectedFile.name}
              </p>
            )}

            {importError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {importError}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModals}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleProcessHTML}
                disabled={!selectedFile || isProcessing}
                className={`px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 ${!selectedFile || isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isProcessing ? "Processando..." : "Processar HTML"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default PropertiesPage;
