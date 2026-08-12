# RESTaurant API

API REST para gerenciamento de reservas de um restaurante e cadastro de mesas, autenticação de usuários e sistema de reservas com verificação de disponibilidade e capacidade.

Construída com [NestJS](https://nestjs.com/), [Drizzle ORM](https://orm.drizzle.team/) e PostgreSQL.

## Stack

- **NestJS** — framework backend (TypeScript)
- **Drizzle ORM** — acesso ao banco, tipado a partir do schema
- **PostgreSQL** — banco de dados
- **JWT** (`@nestjs/jwt`) — autenticação
- **class-validator** — validação de DTOs
- **bcrypt** — hash de senhas
- **Swagger** (`@nestjs/swagger`) — documentação interativa da API
- **Jest** — testes

## Funcionalidades

### Autenticação
- Registro de usuário (nome, e-mail, senha)
- Login com retorno de token JWT
- Rotas de reserva e listagem de usuários protegidas por token

### Mesas
- Listagem pública das mesas
- Criação, edição e remoção restritas a administradores (`role: admin`)
- Status: `disponivel`, `reservada`, `inativa`

### Reservas
- Criação de reserva por usuário autenticado, com validações:
  - mesa precisa existir e estar `disponivel`
  - número de pessoas não pode exceder a capacidade da mesa
  - data/horário precisa ser no futuro
  - horário precisa estar dentro do funcionamento do restaurante (07:00–23:00)
- Ao criar uma reserva, a mesa correspondente muda automaticamente para `reservada`
- Cancelamento apenas pelo usuário dono da reserva
- Ao cancelar, a mesa volta automaticamente para `disponivel`
- Criação/cancelamento executados em transação (reserva + mesa são atualizadas juntas ou nenhuma das duas é)

## Como rodar o projeto

### 1. Pré-requisitos
- Node.js
- Docker (para rodar o PostgreSQL) — ou um PostgreSQL já instalado localmente

### 2. Subir o banco com Docker
```bash
docker run --name restaurant-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=restaurant \
  -p 5432:5432 \
  -d postgres
```

### 3. Instalar dependências
```bash
npm install
```

### 4. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (os valores abaixo batem com o container Docker do passo 2):
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/restaurant
JWT_SECRET=uma-string-secreta-qualquer
```

### 5. Criar as tabelas no banco
```bash
npm run db:push
```

### 6. Subir a aplicação
```bash
npm run start:dev
```

A API sobe em `http://localhost:3000`. Documentação interativa (Swagger) disponível em `http://localhost:3000/api`.

## Rotas principais

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/users/register` | — | Registrar novo usuário |
| POST | `/users/login` | — | Login, retorna token JWT |
| GET | `/users` | Token | Listar usuários (id, nome) |
| GET | `/mesas` | — | Listar mesas |
| GET | `/mesas/:id` | — | Detalhar mesa |
| POST | `/mesas` | Token + admin | Criar mesa |
| PATCH | `/mesas/:id` | Token + admin | Atualizar mesa |
| DELETE | `/mesas/:id` | Token + admin | Remover mesa |
| POST | `/reservas` | Token | Criar reserva |
| GET | `/reservas` | — | Listar reservas |
| GET | `/reservas/:id` | — | Detalhar reserva |
| PATCH | `/reservas/:id/cancelar` | Token (dono) | Cancelar reserva |

Rotas com **Token** exigem o header `Authorization: Bearer <token>`, obtido no login.

## Rodar os testes

```bash
npm run test
```

## Scripts úteis do Drizzle

```bash
npm run db:generate   # gera migration a partir do schema.ts
npm run db:migrate    # aplica migrations pendentes
npm run db:push       # sincroniza o schema direto (sem gerar migration)
npm run db:studio     # abre o Drizzle Studio (interface visual do banco)
```
