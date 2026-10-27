export interface IndicadorItem {
  id: number;
  mes_referencia: string;
  total_beneficiarios: number;
  num_idosos: number;
  num_pcd: number;
  num_ativos: number;
  num_inativos: number;
  valor_total_repassado: number | string;
  taxa_idosos?: number | string;
  taxa_pcd?: number | string;
  bairro_destaque?: string | null;
  data_calculo: string;
  data_criacao?: string;
}

export interface IndicadoresResponse {
  success: boolean;
  data: IndicadorItem[];
  message?: string;
}

export interface IndicadorAtualResponse {
  success: boolean;
  data: IndicadorItem;
  message?: string;
}

export interface RecalcularResponse {
  success: boolean;
  message: string;
  indicador: IndicadorItem;
}
