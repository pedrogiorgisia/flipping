
import React, { useState } from "react";
import { Property } from "../../types/property";
import toast from "react-hot-toast";
import { useEffectiveAnalysisId } from "../../hooks/useEffectiveAnalysisId";

interface NewPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProperty?: Property | null;
  onSave: () => void;
}

const NewPropertyModal: React.FC<NewPropertyModalProps> = ({
  isOpen,
  onClose,
  editingProperty,
  onSave,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string>("");
  const [importedData, setImportedData] = useState<any>(null);
  const effectiveAnalysisId = useEffectiveAnalysisId();

  const handleAddProperty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError("");

    if (!effectiveAnalysisId) {
      toast.error("Nenhuma análise selecionada");
      setIsSaving(false);
      return;
    }

    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData);

    const payload: any = {
      id_analise: effectiveAnalysisId,
      reformado: data.reformado === "on",
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
      if (data[field] && data[field].toString().trim() !== "") {
        payload[field] =
          field === "data_anuncio"
            ? data[field]
            : [
                "preco_anunciado",
                "area",
                "quartos",
                "banheiros",
                "vagas",
                "condominio_mensal",
                "iptu_anual",
              ].includes(field)
              ? Number(data[field])
              : data[field];
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

      toast.success(
        `Imóvel ${editingProperty ? "editado" : "adicionado"} com sucesso`,
      );
      onSave();
      onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {editingProperty
            ? "Editar Imóvel"
            : importedData
              ? "Editar Imóvel Importado"
              : "Adicionar Novo Imóvel"}
        </h2>
        <form onSubmit={handleAddProperty}>
          {formError && (
            <div className="mb-4 p-2 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded">
              <p className="font-medium">Erro ao adicionar imóvel:</p>
              <p>{formError}</p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div className="flex items-end gap-4">
              <div className="flex-grow">
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
                  defaultValue={editingProperty?.url || importedData?.url || ""}
                />
              </div>
              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={async () => {
                    const url = (document.getElementById('url') as HTMLInputElement).value;
                    if (!url) return;

                    setFormError("");
                    setIsSaving(true);

                    try {
                      const formData = new FormData();
                      formData.append('url', url);

                      const response = await fetch('https://flippings.com.br/api/v1/parse-html', {
                        method: 'POST',
                        body: formData
                      });

                      if (!response.ok) {
                        throw new Error('Failed to parse URL');
                      }

                      const data = await response.json();
                      setImportedData(data);

                      // Fill all form fields with the imported data
                      const formElement = document.querySelector('form');
                      if (formElement) {
                        const fields = ['imobiliaria', 'preco_anunciado', 'area', 'quartos', 
                          'banheiros', 'vagas', 'condominio_mensal', 'iptu_anual', 'endereco', 
                          'codigo_ref_externo', 'data_anuncio'];

                        fields.forEach(field => {
                          const input = formElement.querySelector(`[name="${field}"]`) as HTMLInputElement;
                          if (input && data[field] !== undefined) {
                            input.value = data[field];
                          }
                        });
                      }
                    } catch (error) {
                      setFormError("Não foi possível capturar os dados do anúncio");
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={isSaving}
                  className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 h-[34px]"
                >
                  {isSaving ? "Importando..." : "Importar dados do anúncio"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="imobiliaria">
                  Imobiliária
                </label>
                <input
                  id="imobiliaria"
                  name="imobiliaria"
                  type="text"
                  className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  defaultValue={editingProperty?.imobiliaria || importedData?.imobiliaria || ""}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="preco_anunciado">
                  Preço (R$)
                </label>
                <input
                  id="preco_anunciado"
                  name="preco_anunciado"
                  type="number"
                  required
                  className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  placeholder="0,00"
                  defaultValue={editingProperty?.preco_anunciado || importedData?.preco_anunciado || ""}
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
                  defaultValue={editingProperty?.area || importedData?.area || ""}
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
                  defaultValue={editingProperty?.quartos || importedData?.quartos || ""}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="banheiros">
                  Banheiros
                </label>
                <input
                  id="banheiros"
                  name="banheiros"
                  type="number"
                  required
                  className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  placeholder="0"
                  defaultValue={editingProperty?.banheiros || importedData?.banheiros || ""}
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
                  defaultValue={editingProperty?.vagas || importedData?.vagas || ""}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="condominio_mensal">
                  Condomínio mensal (R$)
                </label>
                <input
                  id="condominio_mensal"
                  name="condominio_mensal"
                  type="number"
                  required
                  className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  placeholder="0,00"
                  defaultValue={editingProperty?.condominio_mensal || importedData?.condominio_mensal || ""}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="iptu_anual">
                  IPTU anual (R$)
                </label>
                <input
                  id="iptu_anual"
                  name="iptu_anual"
                  type="number"
                  required
                  className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  placeholder="0,00"
                  defaultValue={editingProperty?.iptu_anual || importedData?.iptu_anual || ""}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="codigo_ref_externo">
                  Código
                </label>
                <input
                  id="codigo_ref_externo"
                  name="codigo_ref_externo"
                  type="text"
                  className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  defaultValue={editingProperty?.codigo_ref_externo || importedData?.codigo_ref_externo || ""}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="data_anuncio">
                  Data do anúncio
                </label>
                <input
                  id="data_anuncio"
                  name="data_anuncio"
                  type="date"
                  className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  defaultValue={
                    editingProperty?.data_anuncio
                      ? new Date(editingProperty.data_anuncio).toISOString().split("T")[0]
                      : importedData?.data_anuncio || ""
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1" htmlFor="endereco">
                Endereço
              </label>
              <input
                id="endereco"
                name="endereco"
                type="text"
                required
                className="w-full px-2 py-1 border border-gray-300 rounded-md"
                defaultValue={editingProperty?.endereco || importedData?.endereco || ""}
              />
            </div>
            <div>
              <label className="flex items-center">
                <input
                  name="reformado"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked={editingProperty?.reformado || importedData?.reformado || false}
                />
                <span className="ml-2 text-gray-700">Reformado</span>
              </label>
            </div>
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="comentarios">
                Comentários
              </label>
              <textarea
                id="comentarios"
                name="comentarios"
                rows={2}
                className="w-full px-2 py-1 border border-gray-300 rounded-md"
                defaultValue={editingProperty?.comentarios || importedData?.comentarios || ""}
              ></textarea>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
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
  );
};

export default NewPropertyModal;
