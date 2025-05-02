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
