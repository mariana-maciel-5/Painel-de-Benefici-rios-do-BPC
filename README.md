# Painel de Beneficiário BPC do Recife

Aplicação completa (Backend Node.js/Fastify + MySQL e Frontend React/Tailwind) para a gestão de acessos, perfis e beneficiários do Programa de Benefício de Prestação Continuada (BPC) da Prefeitura do Recife.

---

## 🚀 Tecnologias Utilizadas

- **Backend**: Node.js, Fastify, `@fastify/middie`, `@fastify/static`
- **Banco de Dados**: MySQL (`bpc_recife_d`)
- **ORM & Migrações**: Drizzle ORM, Drizzle Kit, `mysql2`
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons

---

## 🗄️ Entidades do Banco de Dados

1. **`usuarios`**: `id`, `nome`, `email`, `senha`, `ativo`, `data_criacao`, `data_atualizacao`
2. **`papeis`**: `id`, `nome`, `descricao`, `data_criacao`, `data_atualizacao`
3. **`permissoes`**: `id`, `nome`, `descricao`, `data_criacao`, `data_atualizacao`
4. **`usuario_papel`**: `usuario_id`, `papel_id` *(Chave Composta e FK com CASCADE)*
5. **`papel_permissao`**: `papel_id`, `permissao_id` *(Chave Composta e FK com CASCADE)*

---

## 📡 Endpoints da API construídos

A API roda por padrão na porta `3000` (ex: `http://localhost:3000`). Todas as rotas de backend possuem o prefixo `/api`.

### 1. `GET /api/health`
Verifica a integridade do servidor Fastify e o status da conexão com o banco de dados MySQL.

- **Método**: `GET`
- **URL**: `http://localhost:3000/api/health`
- **Exemplo de Resposta (Status 200)**:
  ```json
  {
    "status": "ok",
    "message": "API rodando perfeitamente!",
    "banco_de_dados": {
      "success": true,
      "message": "Tabelas sincronizadas com sucesso no MySQL."
    }
  }
  ```

---

### 2. `GET /api/db/init` (ou `POST`)
Inicializador DDL do banco de dados. Cria o banco `bpc_recife_d` (se ainda não existir) e executa o `CREATE TABLE IF NOT EXISTS` para as 5 tabelas da aplicação.

- **Método**: `GET` ou `POST`
- **URL**: `http://localhost:3000/api/db/init`
- **Exemplo de Resposta**:
  ```json
  {
    "success": true,
    "message": "Tabelas sincronizadas com sucesso no MySQL."
  }
  ```

---

### 3. `POST /api/db/seed` (ou `GET`)
Executa a carga inicial de dados mockados (seed) de forma idempotente (`INSERT IGNORE` / `ON DUPLICATE KEY UPDATE`).

- **Método**: `POST` ou `GET`
- **URL**: `http://localhost:3000/api/db/seed`
- **Dados Inseridos**:
  - 5 papéis municipais (Administrador Geral, Coordenador CRAS, Assistente Social, Auditor Municipal, Atendente).
  - 8 permissões do sistema BPC.
  - 6 usuários de demonstração da equipe de Recife.
  - Vínculos relacionais `papel_permissao` e `usuario_papel`.
- **Exemplo de Resposta**:
  ```json
  {
    "success": true,
    "message": "Dados mockados inseridos com sucesso no MySQL!",
    "totais": {
      "papeis": 5,
      "permissoes": 8,
      "usuarios": 6,
      "vinculos_papel_permissao": 20,
      "vinculos_usuario_papel": 6
    }
  }
  ```

---

### 4. `GET /api/usuarios`
Lista todos os usuários cadastrados no banco de dados com seus respectivos papéis associados via `JOIN`.

- **Método**: `GET`
- **URL**: `http://localhost:3000/api/usuarios`
- **Exemplo de Resposta**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "nome": "Mariana Maciel",
        "email": "mariana.maciel@recife.pe.gov.br",
        "ativo": 1,
        "data_criacao": "2026-10-02T11:00:00.000Z",
        "papel": "Administrador Geral"
      },
      {
        "id": 2,
        "nome": "Carlos Eduardo Bezerra",
        "email": "carlos.bezerra@recife.pe.gov.br",
        "ativo": 1,
        "data_criacao": "2026-10-02T11:00:00.000Z",
        "papel": "Assistente Social"
      }
    ]
  }
  ```

---

### 5. `GET /api/papeis`
Lista todos os papéis (perfis de acesso) e a quantidade de permissões atribuídas a cada um.

- **Método**: `GET`
- **URL**: `http://localhost:3000/api/papeis`
- **Exemplo de Resposta**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "nome": "Administrador Geral",
        "descricao": "Acesso total a todas as funcionalidades e configurações do BPC Recife",
        "data_criacao": "2026-10-02T11:00:00.000Z",
        "total_permissoes": 8
      },
      {
        "id": 2,
        "nome": "Coordenador CRAS",
        "descricao": "Supervisão técnica de atendimentos e aprovação de relatórios das unidades",
        "data_criacao": "2026-10-02T11:00:00.000Z",
        "total_permissoes": 5
      }
    ]
  }
  ```

---

### 6. `GET /api/permissoes`
Lista todas as permissões cadastradas no sistema.

- **Método**: `GET`
- **URL**: `http://localhost:3000/api/permissoes`
- **Exemplo de Resposta**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "nome": "beneficiarios:visualizar",
        "descricao": "Visualizar listagem e prontuário de beneficiários BPC",
        "data_criacao": "2026-10-02T11:00:00.000Z",
        "data_atualizacao": "2026-10-02T11:00:00.000Z"
      },
      {
        "id": 2,
        "nome": "beneficiarios:cadastrar",
        "descricao": "Cadastrar novos beneficiários e requerentes",
        "data_criacao": "2026-10-02T11:00:00.000Z",
        "data_atualizacao": "2026-10-02T11:00:00.000Z"
      }
    ]
  }
  ```

---

## 🛠️ Comandos Disponíveis no Terminal

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor Fastify com Vite integrado na porta 3000 |
| `npm run db:seed` | Executa o script isolado para popular dados mockados no MySQL |
| `npm run db:push` | Sincroniza o schema Drizzle (`src/db/schema.ts`) diretamente com o MySQL |
| `npm run db:generate` | Gera os arquivos de migração SQL na pasta `drizzle/` |
| `npm run db:studio` | Abre o painel visual Drizzle Studio no navegador |
| `npm run build` | Compila o frontend React e empacota o backend para produção |
| `npm start` | Inicia o servidor compilado em ambiente de produção |

---

## ⚙️ Configuração do `.env`

Crie um arquivo `.env` na raiz do projeto com as credenciais do seu banco de dados MySQL:

```env
# Opção 1: URL Completa
DATABASE_URL="mysql://root:senha@localhost:3306/bpc_recife_d"

# Opção 2: Variáveis Individuais
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD="sua_senha_aqui"
DB_NAME="bpc_recife_d"
```
