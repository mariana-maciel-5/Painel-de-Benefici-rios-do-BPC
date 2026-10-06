export interface PapelItem {
  id: number;
  nome: string;
  descricao: string | null;
  data_criacao: string;
  total_permissoes: number;
}

export interface PapeisResponse {
  success: boolean;
  data: PapelItem[];
  message?: string;
}
