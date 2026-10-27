export interface IndicadorItem {
  id: number;
  nome: string;
  descricao?: string | null;
  unidade: string;
  fonte: string;
  painelId: number;
  valor?: number | string;
  data_criacao?: string;
  data_atualizacao?: string;
}

export interface IndicadoresResponse {
  success: boolean;
  data: IndicadorItem[];
  message?: string;
}

export interface PainelItem {
  id: number;
  nome: string;
  descricao?: string | null;
}

export interface PaineisResponse {
  success: boolean;
  data: PainelItem[];
  message?: string;
}

export interface NovoIndicadorPayload {
  nome: string;
  descricao?: string;
  unidade: string;
  fonte: string;
  painelId: number;
  valor?: number;
}
