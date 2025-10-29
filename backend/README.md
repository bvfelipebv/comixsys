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

### 4. Executar Migrations
```bash
npx prisma migrate dev
```

### 5. Iniciar Aplicação
```bash
npm run start:dev
```

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
# Migrations
npx prisma migrate dev
npx prisma migrate deploy

# Studio (GUI)
npx prisma studio

# Generate Client
npx prisma generate
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

## 🔧 Scripts

```bash
# Desenvolvimento
npm run start:dev

# Build
npm run build

# Produção
npm run start:prod

# Testes
npm run test
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

