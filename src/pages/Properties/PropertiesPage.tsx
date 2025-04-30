import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import { Plus, Filter, Download, Upload } from 'lucide-react';
import PropertyTable from './PropertyTable';
import { Property } from '../../types/property';
import { useAnalysis } from '../../context/AnalysisContext';
import toast from 'react-hot-toast';

const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewPropertyModalOpen, setIsNewPropertyModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { analysisId } = useAnalysis();

  const fetchProperties = async () => {
    if (!analysisId) {
      toast.error('Nenhuma análise selecionada');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://flippings.com.br/imoveis?id_analise=${analysisId}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar imóveis');
      }
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Erro ao carregar imóveis');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [analysisId]);

  const handleAddProperty = async (formData: any) => {
    if (!analysisId) {
      toast.error('Nenhuma análise selecionada');
      return;
    }

    try {
      const response = await fetch('https://flippings.com.br/imoveis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id_analise: analysisId
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar imóvel');
      }

      await fetchProperties();
      setIsNewPropertyModalOpen(false);
      toast.success('Imóvel adicionado com sucesso');
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Erro ao adicionar imóvel');
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
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Status:</label>
              <select className="rounded-md border border-gray-300 px-3 py-1.5 text-sm">
                <option value="">Todos</option>
                <option value="renovated">Reformados</option>
                <option value="not_renovated">Não Reformados</option>
              </select>
            </div>

            <button className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50">
              <Download size={16} className="mr-2" />
              Exportar
            </button>
          </div>
        </div>

        <PropertyTable 
          properties={properties}
          onEdit={(property) => console.log('Edit:', property)}
          onDelete={(id) => console.log('Delete:', id)}
        />
      </div>

      {isNewPropertyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Adicionar Novo Imóvel</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formElement = e.target as HTMLFormElement;
              const formData = new FormData(formElement);
              handleAddProperty(Object.fromEntries(formData));
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL</label>
                  <input name="url" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preço</label>
                  <input name="preco" type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Área</label>
                  <input name="area" type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Endereço</label>
                  <input name="endereco" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={closeModals} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md">
                  Salvar
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Import HTML</h2>
            <p className="text-gray-600 mb-4">Upload an HTML file from a real estate listing to automatically import property details.</p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Drag and drop an HTML file, or click to browse</p>
              <input type="file" className="hidden" id="html-upload" accept=".html,.htm" />
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
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
              <button 
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
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