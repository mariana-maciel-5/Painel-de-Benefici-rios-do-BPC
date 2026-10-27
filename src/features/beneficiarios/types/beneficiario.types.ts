export interface BeneficiarioItem {
  id: number;
  nome: string;
  cpf?: string | null;
  nis?: string | null;
  valor_beneficio: number | string;
  data_concessao: string;
  ativo: number | boolean;
  tipo_beneficio?: string;
  bairro?: string | null;
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
  ativo: boolean;
  tipo_beneficio?: string;
  bairro?: string;
}
