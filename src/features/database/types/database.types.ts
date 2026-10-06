export interface DatabaseStatus {
  success?: boolean;
  message?: string;
}

export interface HealthResponse {
  status: string;
  message: string;
  banco_de_dados?: DatabaseStatus;
}

export interface SchemaEntity {
  tabela: string;
  colunas: string;
  chave: string;
}
