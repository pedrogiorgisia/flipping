
export interface Property {
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
  codigo_ref_externo: string;
  data_anuncio: Date;
  endereco: string;
  reformado: boolean;
  comentarios?: string;
  id_analise: string;
}
