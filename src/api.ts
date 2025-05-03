// src/api.ts

import axios from "axios";

const BASE_URL = "https://flippings.com.br";

export const getSimulacoes = async (idSimulacao: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/simulacoes/${idSimulacao}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar simulação:", error);
    throw error;
  }
};

export const getReferenciaSimulacao = async (idSimulacao: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/referencia-simulacao`, {
      params: {
        id_simulacao: idSimulacao,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar referências da simulação:", error);
    throw error;
  }
};

// Em api.ts
export const atualizarSimulacao = async (
  id: string,
  dados: Partial<Simulacao>,
) => {
  const response = await fetch(`https://flippings.com.br/simulacoes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error("Falha ao atualizar a simulação");
  }

  return await response.json();
};

// Tipo para os parâmetros de análise
export interface ParametrosAnalise {
  margem_area_pct: number;
  diferenca_max_m2: number;
  condominio_max: number;
  valor_maximo_imovel: number;
  reducao_pct: number;
  param_entrada_pct: number;
  param_itbi_pct: number;
  param_avaliacao_bancaria: number;
  param_registro_cartorio_pct: number;
  param_contas_gerais: number;
  param_custo_reforma_pct: number;
  param_taxa_cet: number;
  param_prazo_financiamento: number;
  param_tempo_venda: number;
  param_incide_ir: boolean;
  param_corretagem_venda_pct: number;
  param_desconto_valor_compra: number;
}

// Função para obter os parâmetros de análise
export const getParametrosAnalise = async (
  analiseId: string,
): Promise<ParametrosAnalise> => {
  try {
    const response = await axios.get(`${BASE_URL}/parametros/${analiseId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar parâmetros de análise:", error);
    throw error;
  }
};

// Função para atualizar os parâmetros de análise
export const updateParametrosAnalise = async (
  analiseId: string,
  parametros: ParametrosAnalise,
): Promise<ParametrosAnalise> => {
  try {
    const response = await axios.put(
      `${BASE_URL}/parametros/${analiseId}`,
      parametros,
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar parâmetros de análise:", error);
    throw error;
  }
};
