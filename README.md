# Painel de Beneficiário BPC do Recife

Aplicação completa (Backend Node.js/Fastify + MySQL e Frontend React/Tailwind) para a gestão de acessos, perfis e beneficiários do Programa de Benefício de Prestação Continuada (BPC) da Prefeitura do Recife.

---

## 🚀 Tecnologias Utilizadas

- **Backend**: Node.js, Fastify, `@fastify/middie`, `@fastify/static`
- **Autenticação**: JSON Web Token (`jsonwebtoken`), Hash Seguro (`bcryptjs`)
- **Banco de Dados**: MySQL (`bpc_recife_d`)
- **ORM & Migrações**: Drizzle ORM, Drizzle Kit, `mysql2`
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons

---

## 🔐 Autenticação JWT (JSON Web Token)

Todas as rotas privadas de dados (`/api/usuarios`, `/api/papeis`, `/api/permissoes`, `/api/auth/me`) exigem o cabeçalho HTTP:
```http
Authorization: Bearer <seu_token_jwt>
```
Se o token não for enviado ou for inválido/expirado, o backend retornará `401 Unauthorized`.

### Credenciais de Demonstração (Seed):
- **Mariana Maciel (Admin Geral)**:
  - Email: `mariana.maciel@recife.pe.gov.br`
  - Senha: `123456`
- **Carlos Eduardo Bezerra (Assistente Social)**:
  - Email: `carlos.bezerra@recife.pe.gov.br`
  - Senha: `123456`

---

## 🗄️ Entidades do Banco de Dados

1. **`beneficiarios`**: `id`, `nome`, `cpf`, `nis`, `valor_beneficio`, `data_concessao`, `ativo`, `tipo_beneficio`, `bairro`, `data_criacao`, `data_atualizacao`
2. **`usuarios`**: `id`, `nome`, `email`, `senha`, `ativo`, `data_criacao`, `data_atualizacao`
3. **`papeis`**: `id`, `nome`, `descricao`, `data_criacao`, `data_atualizacao`
4. **`permissoes`**: `id`, `nome`, `descricao`, `data_criacao`, `data_atualizacao`
5. **`usuario_papel`**: `usuario_id`, `papel_id` *(Chave Composta e FK com CASCADE)*
6. **`papel_permissao`**: `papel_id`, `permissao_id` *(Chave Composta e FK com CASCADE)*

---

## 📡 Endpoints da API construídos

A API roda por padrão na porta `3000` (ex: `http://localhost:3000`). Todas as rotas de backend possuem o prefixo `/api`.

### 1. `POST /api/auth/login`
Autentica o usuário com email e senha, retornando o token JWT e as informações de perfil.

- **Método**: `POST`
- **URL**: `http://localhost:3000/api/auth/login`
- **Body (JSON)**:
  ```json
  {
    "email": "mariana.maciel@recife.pe.gov.br",
    "senha": "123456"
  }
  ```
- **Exemplo de Resposta (Status 200)**:
  ```json
  {
    "success": true,
    "message": "Autenticação realizada com sucesso!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 1,
      "email": "mariana.maciel@recife.pe.gov.br",
      "nome": "Mariana Maciel",
      "papeis": ["Administrador Geral"],
      "permissoes": ["beneficiarios:visualizar", "beneficiarios:cadastrar", "usuarios:gerenciar"]
    }
  }
  ```

---

### 2. `GET /api/auth/me` *(Protegido por JWT)*
Retorna os dados e claims do usuário autenticado no momento.

- **Método**: `GET`
- **URL**: `http://localhost:3000/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Exemplo de Resposta (Status 200)**:
  ```json
  {
    "success": true,
    "usuario": {
      "id": 1,
      "email": "mariana.maciel@recife.pe.gov.br",
      "nome": "Mariana Maciel",
      "papeis": ["Administrador Geral"]
    }
  }
  ```

---

### 3. `GET /api/health`
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

### 7. `GET /api/beneficiarios` *(Protegido por JWT)*
Retorna a listagem de beneficiários cadastrados, com nome, valor do benefício, data de concessão e status ativo/inativo.

- **Método**: `GET`
- **URL**: `http://localhost:3000/api/beneficiarios`
- **Headers**: `Authorization: Bearer <token>`
- **Exemplo de Resposta**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "nome": "Severino Ramos da Silva",
        "cpf": "123.456.789-01",
        "nis": "10987654321",
        "valor_beneficio": 1412.00,
        "data_concessao": "2021-03-15",
        "ativo": 1,
        "tipo_beneficio": "Idoso (65+ anos)",
        "bairro": "Casa Amarela"
      }
    ]
  }
  ```

---

### 8. `POST /api/beneficiarios` *(Protegido por JWT)*
Cadastra um novo beneficiário do BPC no sistema e no banco de dados MySQL.

- **Método**: `POST`
- **URL**: `http://localhost:3000/api/beneficiarios`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body (JSON)**:
  ```json
  {
    "nome": "Maria das Graças Silva",
    "cpf": "111.222.333-44",
    "nis": "12345678901",
    "valor_beneficio": 1412.00,
    "data_concessao": "2024-02-10",
    "ativo": true,
    "tipo_beneficio": "Idoso (65+ anos)",
    "bairro": "Afogados"
  }
  ```

---

### 9. `PATCH /api/beneficiarios/:id/toggle-status` *(Protegido por JWT)*
Alterna o status do benefício entre ativo e inativo/suspenso.

- **Método**: `PATCH`
- **URL**: `http://localhost:3000/api/beneficiarios/1/toggle-status`
- **Headers**: `Authorization: Bearer <token>`

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
