# Afya Challenge API

API em Node.js/TypeScript para gerenciar médicos, pacientes, consultas e notas clínicas. Autenticação via cookies httpOnly, banco de dados com PostgreSQL/Prisma, e documentação Swagger em português.

## Stack rápida

- Node.js + TypeScript + Express 5
- Docker + docker-compose
- Prisma + PostgreSQL
- Autenticação com JWT em cookies (`accessToken` e `refreshToken`)
- Class-validator/class-transformer para validação
- Injeção de dependência com tsyringe
- Vitest para testes
- Swagger UI na rota `/docs`

## Requisitos

- Node 24+
- npm
- Banco PostgreSQL acessível (local ou criado via Docker/docker-compose)

## Variáveis de ambiente

Crie um `.env` na raiz seguindo o exemplo do arquivo `.env.example`.

Crie também o arquivo `.env.local` seguindo o exemplo do arquivo `.env.local.example` para os comandos do prisma funcionarem corretamente.

## Instalação

```bash
npm install
```

## Rodando o projeto pela primeira vez

Inicie somente o banco de dados com:

```bash
docker compose up database -d
```

Depois, rode as migrations com o comando abaixo:

```bash
npm run migrate:dev
```

Após, rode o comando abaixo para iniciar a API também:

```bash
docker compose up -d
```

O comando sobe Postgres + API (porta 3000). As envs do `.env` são usadas pelo compose.

Acesse:

- API: http://localhost:3000
- Docs Swagger: http://localhost:3000/docs
- JSON da doc: http://localhost:3000/docs.json

## Scripts úteis

- `npm run dev` — servidor com tsx (hot reload).
- `npm run test` — testes com Vitest.
- `npm run test:coverage` — cobertura de testes.
- `npm run test:verbose` — testes com as descrições.
- `npm run type-check` — checagem de tipos.
- `npm run lint` / `npm run lint:fix` — lint.
- `npm run migrate:dev` — aplica migrações (usa dotenv com `.env.local`).
- `npm run migrate:g` — gera cliente Prisma.

## Documentação da API

- Swagger UI em português na rota `/docs`.
- Schemas e paths modularizados em `src/docs/`.
- Segurança via cookies:
  - `accessToken` (apiKey em cookie) para rotas protegidas.
  - `refreshToken` para `/auth/refresh`.

## Fluxos principais

- **Autenticação**: `/auth/login`, `/auth/logout`, `/auth/refresh`, `/me`. Cookies httpOnly gravados após login.
- **Médicos**: cadastro aberto em `/medics` (email/senha).
- **Pacientes**: CRUD básico e anonimização em `/patients`.
- **Consultas**: CRUD + filtros de data em `/appointments`; notas em `/appointments/{id}/notes`.

## Testes

Use `npm run test` ou `npm run test:coverage`. Os testes usam Vitest.

## Logs

Configurados com Pino. Nível controlado por `LOG_LEVEL` (padrão `debug` em dev, `info` em prod).

## Problemas comuns

- **Erro de conexão**: confirme `DATABASE_URL` e se o Postgres está rodando.
- **Migração falhando**: cheque permissão do usuário e schema no `DATABASE_URL`.
- **Cookies não chegam**: em dev, `NODE_ENV=development` usa `sameSite=lax` e `secure=false`; em uma possível produção, é `secure=true` para HTTPS.

## Estrutura de pastas (alto nível)

- `src/` — código da API (adapters/express, usecases, domain, infra/prisma, docs, config).
- `prisma/` — schema e migrações.
- `src/docs/` — especificação Swagger modular (paths e schemas).
- `generated/` — Prisma Client (após `npm run migrate:g`).
