# 🔄 Sistema de Migrations e Seed Automáticos

Este projeto está configurado para executar as migrations e o seed do Prisma **automaticamente** antes de iniciar o servidor.

## ✨ Como Funciona

Quando você executa `npm run start:dev`, o sistema:

1. ✅ Verifica se o banco de dados está acessível
2. ✅ Aguarda até 30 segundos pela conexão (útil quando o Docker está iniciando)
3. ✅ Executa todas as migrations pendentes (`prisma migrate deploy`)
4. ✅ Gera o Prisma Client atualizado
5. ✅ Executa o seed do banco de dados (`prisma db seed`)
6. ✅ Inicia o servidor NestJS

## 🚀 Uso Básico

### Iniciar o Servidor (com migrations automáticas)

```bash
# Desenvolvimento
npm run start:dev

# Debug
npm run start:debug

# Produção
npm run start:prod
```

> **Nota:** Todas as migrations pendentes serão aplicadas automaticamente!

## 📝 Comandos de Migration

### Criar Nova Migration

Quando você faz alterações no `schema.prisma`:

```bash
npm run migrate:dev
# ou
npx prisma migrate dev --name nome_da_migration
```

### Executar Migrations Manualmente

```bash
npm run migrate:deploy
```

### Resetar Banco de Dados

```bash
npm run migrate:reset
```

> ⚠️ **Atenção:** Este comando apaga todos os dados!

### Executar Seed Manualmente

```bash
npx prisma db seed
```

> **Nota:** O seed é executado automaticamente no `start:dev`, mas você pode executá-lo manualmente se necessário.

## 🔧 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run start:dev` | Inicia servidor com migrations automáticas |
| `npm run migrate:deploy` | Executa migrations pendentes |
| `npm run migrate:dev` | Cria nova migration |
| `npm run migrate:reset` | Reseta banco e migrations |
| `npm run db:studio` | Abre Prisma Studio |
| `npm run db:generate` | Gera Prisma Client |

## 🐛 Troubleshooting

### Erro: "Não foi possível conectar ao banco de dados"

**Solução:**
```bash
# Verifique se o Docker está rodando
docker-compose ps

# Se não estiver, inicie o banco
docker-compose up -d

# Aguarde alguns segundos e tente novamente
npm run start:dev
```

### Erro: "Migration failed"

**Solução:**
```bash
# Verifique o status das migrations
npx prisma migrate status

# Se necessário, resete o banco (CUIDADO: apaga dados!)
npm run migrate:reset

# Ou aplique manualmente
npm run migrate:deploy
```

### Erro: "Prisma Client not generated"

**Solução:**
```bash
# Gere o Prisma Client manualmente
npm run db:generate
```

## 📋 Fluxo de Trabalho Recomendado

### 1. Primeira Vez no Projeto

```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env
cp .env.example .env

# 3. Iniciar banco de dados
docker-compose up -d

# 4. Iniciar servidor (migrations automáticas)
npm run start:dev
```

### 2. Alterando o Schema

```bash
# 1. Edite o arquivo prisma/schema.prisma

# 2. Crie uma migration
npm run migrate:dev

# 3. O servidor já está rodando com as mudanças!
```

### 3. Trabalhando em Equipe

```bash
# 1. Puxe as mudanças do repositório
git pull

# 2. Inicie o servidor (migrations automáticas aplicam as novas migrations)
npm run start:dev
```

## 🎯 Vantagens

✅ **Sem passos manuais**: Não precisa lembrar de executar migrations ou seed
✅ **Segurança**: Verifica conexão antes de aplicar migrations
✅ **Consistência**: Garante que o banco está sempre atualizado com dados iniciais
✅ **Produtividade**: Menos comandos para executar
✅ **Compatibilidade**: Funciona em Windows, Linux e macOS
✅ **Dados de exemplo**: Banco sempre populado com dados de teste

## 📚 Arquivos Relacionados

- `scripts/run-migrations.js` - Script principal de migrations
- `scripts/run-migrations.sh` - Versão shell (Linux/macOS)
- `package.json` - Configuração dos scripts npm
- `prisma/schema.prisma` - Schema do banco de dados
- `prisma/migrations/` - Histórico de migrations

## 🔗 Links Úteis

- [Documentação Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [NestJS + Prisma](https://docs.nestjs.com/recipes/prisma)

