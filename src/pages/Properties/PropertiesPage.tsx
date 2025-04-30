import { useEffectiveAnalysisId } from "../../hooks/useEffectiveAnalysisId";
import React, { useState, useEffect } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import PropertyTable from "./PropertyTable";
import { Property } from "../../types/property";
import toast from "react-hot-toast";
import { Plus, Upload, Download } from "lucide-react";

const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewPropertyModalOpen, setIsNewPropertyModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    valor_min: '',
    valor_max: '',
    area_min: '',
    area_max: '',
    quartos: '',
    banheiros: '',
    reformado: '',
    condominio_min: '',
    condominio_max: '',
    m2_min: '',
    m2_max: '',
  });
  const [isSaving, setIsSaving] = useState(false); // Added isSaving state
  const effectiveAnalysisId = useEffectiveAnalysisId();
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

    if (filters.valor_min) filtered = filtered.filter(p => p.preco_anunciado >= Number(filters.valor_min));
    if (filters.valor_max) filtered = filtered.filter(p => p.preco_anunciado <= Number(filters.valor_max));
    if (filters.area_min) filtered = filtered.filter(p => p.area >= Number(filters.area_min));
    if (filters.area_max) filtered = filtered.filter(p => p.area <= Number(filters.area_max));
    if (filters.quartos) filtered = filtered.filter(p => p.quartos === Number(filters.quartos));
    if (filters.banheiros) filtered = filtered.filter(p => p.banheiros === Number(filters.banheiros));
    if (filters.reformado) filtered = filtered.filter(p => p.reformado === (filters.reformado === 'true'));
    if (filters.condominio_min) filtered = filtered.filter(p => p.condominio_mensal >= Number(filters.condominio_min));
    if (filters.condominio_max) filtered = filtered.filter(p => p.condominio_mensal <= Number(filters.condominio_max));
    if (filters.m2_min) filtered = filtered.filter(p => p.preco_m2 >= Number(filters.m2_min));
    if (filters.m2_max) filtered = filtered.filter(p => p.preco_m2 <= Number(filters.m2_max));

    setFilteredProperties(filtered);
  }, [filters, properties]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`https://flippings.com.br/imoveis/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir imóvel');

      await fetchProperties();
      toast.success('Imóvel excluído com sucesso');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Erro ao excluir imóvel');
    }
    setPropertyToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleExport = async () => {
    const XLSX = await import('xlsx');
    
    // Prepare the data in the same format
    const data = [
      ['ID', 'URL', 'Imobiliária', 'Preço', 'Área', 'Quartos', 'Banheiros', 'Vagas', 
       'Condomínio', 'IPTU', 'Endereço', 'Código', 'Data Anúncio', 'Comentários', 
       'Criado Em', 'Reformado', 'Preço/m²'],
      ...filteredProperties.map(p => [
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
        p.reformado ? 'Sim' : 'Não',
        p.preco_m2
      ])
    ];

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Imóveis');

    // Generate and download the file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imoveis.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddProperty = async (formData: any) => {
    setIsSaving(true); // Set isSaving to true before API call
    if (!effectiveAnalysisId) {
      toast.error("Nenhuma análise selecionada");
      setIsSaving(false); // Reset isSaving if no analysis is selected
      return;
    }

    try {
      const response = await fetch("https://flippings.com.br/imoveis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id_analise: effectiveAnalysisId,
          preco_anunciado: Number(formData.preco_anunciado),
          area: Number(formData.area),
          quartos: Number(formData.quartos),
          banheiros: Number(formData.banheiros),
          vagas: Number(formData.vagas) || 0,
          condominio_mensal: Number(formData.condominio_mensal),
          iptu_anual: Number(formData.iptu_anual),
          reformado: Boolean(formData.reformado),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erro ao adicionar imóvel: ${JSON.stringify(errorData)}`,
        );
      }

      await fetchProperties();
      setIsNewPropertyModalOpen(false);
      toast.success("Imóvel adicionado com sucesso");
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("Erro ao adicionar imóvel");
    } finally {
      setIsSaving(false); // Reset isSaving in finally block
      setIsNewPropertyModalOpen(false);
    }
  };

  const handleAddNewProperty = () => {
    setIsNewPropertyModalOpen(true);
  };

  const handleImportHTML = () => {
    setIsImportModalOpen(true);
  };

  const closeModals = () => {
    setIsImportModalOpen(false);
    setIsNewPropertyModalOpen(false);
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
                    onChange={(e) => setFilters({...filters, valor_min: e.target.value})}
                    className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.valor_max}
                    onChange={(e) => setFilters({...filters, valor_max: e.target.value})}
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
                    onChange={(e) => setFilters({...filters, area_min: e.target.value})}
                    className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.area_max}
                    onChange={(e) => setFilters({...filters, area_max: e.target.value})}
                    className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700">Status:</label>
                <select 
                  value={filters.reformado}
                  onChange={(e) => setFilters({...filters, reformado: e.target.value})}
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
                onClick={() => setFilters({
                  valor_min: '',
                  valor_max: '',
                  area_min: '',
                  area_max: '',
                  quartos: '',
                  banheiros: '',
                  reformado: '',
                  condominio_min: '',
                  condominio_max: '',
                  m2_min: '',
                  m2_max: '',
                })}
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
          onEdit={(property) => console.log("Edit:", property)}
          onDelete={(id) => {
            setPropertyToDelete(id);
            setIsDeleteModalOpen(true);
          }}
        />

        {/* Delete Confirmation Modal */}
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
                  onClick={() => propertyToDelete && handleDelete(propertyToDelete)}
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Adicionar Novo Imóvel
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSaving(true);
                const formElement = e.target as HTMLFormElement;
                const formData = new FormData(formElement);
                const data = Object.fromEntries(formData);
                const payload: any = { id_analise: effectiveAnalysisId };

                // Only include non-empty fields
                if (data.url) payload.url = data.url;
                if (data.imobiliaria) payload.imobiliaria = data.imobiliaria;
                if (data.preco_anunciado) payload.preco_anunciado = Number(data.preco_anunciado);
                if (data.area) payload.area = Number(data.area);
                if (data.quartos) payload.quartos = Number(data.quartos);
                if (data.banheiros) payload.banheiros = Number(data.banheiros);
                if (data.vagas) payload.vagas = Number(data.vagas);
                if (data.condominio_mensal) payload.condominio_mensal = Number(data.condominio_mensal);
                if (data.iptu_anual) payload.iptu_anual = Number(data.iptu_anual);
                if (data.codigo_ref_externo) payload.codigo_ref_externo = data.codigo_ref_externo;
                if (data.data_anuncio) payload.data_anuncio = data.data_anuncio;
                if (data.endereco) payload.endereco = data.endereco;
                if (data.reformado) payload.reformado = true;
                if (data.comentarios) payload.comentarios = data.comentarios;

                try {
                  const response = await fetch(
                    "https://flippings.com.br/imoveis",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(payload),
                    },
                  );

                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Erro ao adicionar imóvel");
                  }

                  await fetchProperties();
                  setIsNewPropertyModalOpen(false);
                  toast.success("Imóvel adicionado com sucesso");
                } catch (error) {
                  console.error("Erro ao adicionar imóvel:", error);
                  toast.error(error instanceof Error ? error.message : "Erro ao adicionar imóvel");
                  setIsSaving(false); // Only reset if there's an error
                }
              }}
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    URL do anúncio
                  </label>
                  <input
                    name="url"
                    type="text"
                    required
                    className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Imobiliária
                  </label>
                  <input
                    name="imobiliaria"
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Preço (R$)
                  </label>
                  <input
                    name="preco_anunciado"
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Área (m²)
                  </label>
                  <input
                    name="area"
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quartos
                  </label>
                  <input
                    name="quartos"
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Banheiros
                  </label>
                  <input
                    name="banheiros"
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vagas
                  </label>
                  <input
                    name="vagas"
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Condomínio mensal (R$)
                  </label>
                  <input
                    name="condominio_mensal"
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    IPTU anual (R$)
                  </label>
                  <input
                    name="iptu_anual"
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Código
                  </label>
                  <input
                    name="codigo_ref_externo"
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Data do anúncio (opcional)
                  </label>
                  <input
                    name="data_anuncio"
                    type="date"
                    className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Endereço
                  </label>
                  <input
                    name="endereco"
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <input
                      name="reformado"
                      type="checkbox"
                      className="mr-2 rounded border-gray-300"
                    />
                    Reformado
                  </label>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Comentários
                  </label>
                  <textarea
                    name="comentarios"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  ></textarea>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Salvando...
                    </span>
                  ) : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Import HTML Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Import HTML
            </h2>
            <p className="text-gray-600 mb-4">
              Upload an HTML file from a real estate listing to automatically
              import property details.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop an HTML file, or click to browse
              </p>
              <input
                type="file"
                className="hidden"
                id="html-upload"
                accept=".html,.htm"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    // Handle file upload logic here
                  }
                }}
              />
              <button 
                onClick={() => document.getElementById('html-upload')?.click()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Select File
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModals}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                Process HTML
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default PropertiesPage;