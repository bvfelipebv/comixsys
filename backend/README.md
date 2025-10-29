# 🚀 ComixSys Backend

API REST desenvolvida com NestJS, Prisma ORM e PostgreSQL.

## ⚡ Quick Start

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
# Edite o .env se necessário
```

### 3. Iniciar Banco de Dados
```bash
docker-compose up -d
```

### 4. Iniciar Aplicação
```bash
npm run start:dev
```

> **✨ Novidade:** As migrations e o seed agora são executados automaticamente antes de iniciar o servidor!
> Não é mais necessário executar `npx prisma migrate dev` ou `npx prisma db seed` manualmente.

**API:** `http://localhost:3000`

## 🗄️ Banco de Dados

### Docker Services
- **PostgreSQL**: `localhost:5432`
- **DbGate**: `http://localhost:3002`

### Comandos Docker
```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Logs
docker-compose logs -f

# Acessar PostgreSQL
docker-compose exec postgres psql -U postgres -d comixsys
```

### Prisma
```bash
# Migrations (executadas automaticamente no start:dev)
npm run migrate:deploy    # Executar migrations pendentes
npm run migrate:dev       # Criar nova migration
npm run migrate:reset     # Resetar banco e migrations

# Studio (GUI)
npm run db:studio         # Abrir Prisma Studio
npx prisma studio         # Alternativa

# Generate Client
npm run db:generate       # Gerar Prisma Client
npx prisma generate       # Alternativa
```

## 📁 Estrutura

```
backend/
├── src/
│   ├── empresa/      # CRUD Empresa
│   ├── cliente/      # CRUD Cliente
│   ├── produto/      # CRUD Produto
│   └── auxiliares/   # Unidades, Categorias, etc
├── prisma/
│   └── schema.prisma
├── docker-compose.yml
└── .env
```

## 🌐 Endpoints

### Empresa
- `GET /empresas`
- `POST /empresas`
- `PATCH /empresas/:id`
- `DELETE /empresas/:id`

### Cliente
- `GET /clientes?empresaId=xxx`
- `POST /clientes`
- `PATCH /clientes/:id`
- `DELETE /clientes/:id`

### Produto
- `GET /produtos?empresaId=xxx`
- `POST /produtos`
- `PATCH /produtos/:id`
- `DELETE /produtos/:id`

### Auxiliares
- `GET /auxiliares/unidades`
- `GET /auxiliares/categorias`
- `GET /auxiliares/marcas`
- `GET /auxiliares/tipos-preco`

## 🔧 Scripts Disponíveis

### Desenvolvimento
```bash
npm run start:dev         # Inicia servidor em modo desenvolvimento (com migrations automáticas)
npm run start:debug       # Inicia em modo debug (com migrations automáticas)
```

### Produção
```bash
npm run build             # Compila o projeto
npm run start:prod        # Inicia servidor em produção (com migrations automáticas)
```

### Banco de Dados
```bash
npm run migrate:deploy    # Executa migrations pendentes
npm run migrate:dev       # Cria nova migration
npm run migrate:reset     # Reseta banco e migrations
npm run db:studio         # Abre Prisma Studio
npm run db:generate       # Gera Prisma Client
```

### Testes
```bash
npm run test              # Executa testes
npm run test:watch        # Executa testes em modo watch
npm run test:cov          # Executa testes com cobertura
npm run test:e2e          # Executa testes E2E
```

### Qualidade de Código
```bash
npm run lint              # Executa linter
npm run format            # Formata código
```

## 🐛 Troubleshooting

### Porta 5432 em uso
```bash
sudo systemctl stop postgresql
# ou use porta diferente no docker-compose.yml
```

### Erro Prisma Client
```bash
npx prisma generate
```

### Limpar tudo
```bash
docker-compose down -v
npm install
npx prisma generate
docker-compose up -d
npx prisma migrate dev
```

