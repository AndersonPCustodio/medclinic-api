# MedClinic API — Etapa 1: Autenticação e Autorização

Este projeto constitui a base sólida de segurança e controle de acessos da **MedClinic API**, uma aplicação desenvolvida para o gerenciamento de clínicas médicas de pequeno porte. Nesta primeira etapa, foi implementada exclusivamente a infraestrutura de acesso, cadastro de usuários, autenticação via tokens JWT e autorização baseada em funções (RBAC).

---

## 🛠️ Tecnologias Utilizadas

A aplicação foi construída utilizando práticas modernas de desenvolvimento back-end e tipagem estática estrita:

- **Node.js** & **Express.js** — Ambiente de execução e framework para a infraestrutura HTTP.
- **TypeScript** — Linguagem obrigatória com tipagem estática aplicada em todas as camadas.
- **PostgreSQL** — Banco de dados relacional para persistência de dados.
- **TypeORM** — Object-Relational Mapper (ORM) para modelagem e comunicação com a base de dados.
- **Bcrypt** — Criptografia de alta segurança para armazenamento de senhas por meio de hash.
- **JSON Web Token (JWT)** — Emissão e validação de tokens para autenticação sem estado (stateless).

---

## 📂 Arquitetura do Projeto

O projeto adota uma arquitetura **MVC (Model-View-Controller) dividida em camadas**, promovendo baixo acoplamento e separação estrita de responsabilidades:

- `src/server.ts`: Ponto de entrada da aplicação que inicializa o servidor Express e conexões.
- `src/database/`: Centraliza o DataSource e as configurações de conexão com o PostgreSQL.
- `src/entities/`: Classes que representam as tabelas e dados do banco através de decorators.
- `src/repositories/`: Camada exclusiva de persistência e comunicação direta via TypeORM.
- `src/services/`: Concentra todas as regras de negócio, validações e lançamentos de exceções.
- `src/controllers/`: Manipula requisições HTTP de entrada e formata as respostas em JSON.
- `src/middlewares/`: Filtros e interceptadores (Autenticação JWT, Controle RBAC e Erro Global).
- `src/utils/`: Funções utilitárias auxiliares, DTOs e gerenciadores de segurança.

---

## ⚙️ Configuração do Ambiente

### Pré-requisitos
Certifique-se de possuir o **Node.js (v18+)** e o **PostgreSQL** instalados localmente.

### 1. Clonar o Repositório
```bash
git clone https://github.com/AndersonPCustodio/medclinic-api.git
cd medclinic-api
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Crie um arquivo chamado `.env` na raiz do seu projeto e preencha com suas configurações locais (utilize o `.env.example` como base):
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario_postgres
DB_PASS=sua_senha_postgres
DB_NAME=medclinic_db
JWT_SECRET=chave_secreta_super_segura
JWT_EXPIRES_IN=1d
```
*Nota: Crie um banco de dados vazio chamado `medclinic_db` no seu PostgreSQL antes de iniciar.*

### 4. Execução da Aplicação
```bash
# Executar em ambiente de desenvolvimento (com recarregamento automático)
npm run dev

# Compilar o código TypeScript para JavaScript
npm run build

# Executar o código compilado em modo de produção
npm start
```

---

## 🔐 Perfis de Acesso (RBAC)

O controle de autorização está dividido em dois níveis principais:
1. **Administrador** — Possui acesso total e irrestrito a todos os endpoints da API.
2. **Atendente** — Acesso operacional restrito, impedido de acessar recursos administrativos.

---

## 🚀 Documentação dos Endpoints

### 1. Cadastro de Usuário
- **Rota:** `POST /auth/register`
- **Acesso:** Público
- **Exemplo de Requisição (Body JSON):**
```json
{
  "nome": "Dr. Anderson",
  "email": "anderson@medclinic.com",
  "senhaPura": "senha123",
  "role": "Administrador"
}
```
- **Respostas Esperadas:**
  - `211 Created`: Retorna o usuário criado (sem a senha).
  - `400 Bad Request`: Dados inválidos ou campos obrigatórios ausentes.
  - `409 Conflict`: E-mail informado já cadastrado na base de dados.

### 2. Autenticação (Login)
- **Rota:** `POST /auth/login`
- **Acesso:** Público
- **Exemplo de Requisição (Body JSON):**
```json
{
  "email": "anderson@medclinic.com",
  "senha": "senha123"
}
```
- **Respostas Esperadas:**
  - `200 OK`: Retorna o token JWT gerado.
  - `401 Unauthorized`: Credenciais incorretas (mensagem genérica por segurança).

### 3. Verificar Usuário Logado
- **Rota:** `GET /users/me`
- **Acesso:** Autenticado (Requer Header `Authorization: Bearer <token>`)
- **Respostas Esperadas:**
  - `200 OK`: Retorna os dados do proprietário do token.
  - `401 Unauthorized`: Token inválido, expirado ou ausente.

### 4. Verificação de Permissão Administrativa
- **Rota:** `GET /users/admin/ping`
- **Acesso:** Restrito (Requer Header `Authorization: Bearer <token>` de perfil **Administrador**)
- **Respostas Esperadas:**
  - `200 OK`: Acesso concedido com sucesso.
  - `403 Forbidden`: Usuário autenticado, mas com perfil sem permissão (ex: Atendente).
