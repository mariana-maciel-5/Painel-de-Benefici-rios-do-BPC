export interface BeneficiarioItem {
  id: number;
  nome: string;
  cpf?: string | null;
  nis?: string | null;
  valor_beneficio: number | string;
  data_concessao: string;
  data_solicitacao?: string | null;
  data_revisao?: string | null;
  ativo: number | boolean;
  tipo_beneficio?: string;
  bairro: string;
  rpa?: string | null;
  data_criacao?: string;
}

export interface BeneficiariosResponse {
  success: boolean;
  data: BeneficiarioItem[];
  message?: string;
}

export interface NovoBeneficiarioPayload {
  nome: string;
  cpf?: string;
  nis?: string;
  valor_beneficio: number;
  data_concessao: string;
  data_solicitacao?: string;
  data_revisao?: string;
  ativo: boolean;
  tipo_beneficio?: string;
  bairro: string;
  rpa?: string;
}

export interface BeneficiarioFilterParams {
  bairro?: string;
  data_inicio?: string;
  data_fim?: string;
  ativo?: string;
}
