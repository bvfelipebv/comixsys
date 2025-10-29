# Guia de Instalação - Sistema de Nota Fiscal

## Pré-requisitos

- Node.js 20+ instalado
- PostgreSQL 14+ instalado e rodando
- npm ou yarn

## Passo 1: Instalar Dependências

```bash
cd backend
npm install
```

## Passo 2: Instalar Prisma

```bash
npm install @prisma/client
npm install -D prisma
```

## Passo 3: Configurar Banco de Dados

### 3.1 Criar Banco de Dados PostgreSQL

```sql
-- Conectar ao PostgreSQL
psql -U postgres

-- Criar banco de dados
CREATE DATABASE comixsys;

-- Criar usuário (opcional)
CREATE USER comixsys_user WITH PASSWORD 'sua_senha_segura';

-- Dar permissões
GRANT ALL PRIVILEGES ON DATABASE comixsys TO comixsys_user;

-- Sair
\q
```

### 3.2 Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure a URL do banco:

```env
DATABASE_URL="postgresql://comixsys_user:sua_senha_segura@localhost:5432/comixsys?schema=public"
```

## Passo 4: Executar Migrations

### 4.1 Criar a primeira migration

```bash
npx prisma migrate dev --name init
```

Este comando irá:
- Criar as tabelas no banco de dados
- Gerar o Prisma Client
- Aplicar as migrations

### 4.2 Verificar se as tabelas foram criadas

```bash
npx prisma studio
```

Isso abrirá uma interface web em `http://localhost:5555` onde você pode visualizar e editar os dados.

## Passo 5: Gerar Prisma Client

Se precisar regenerar o cliente Prisma:

```bash
npx prisma generate
```

## Passo 6: Seed (Dados Iniciais)

Crie um arquivo `prisma/seed.ts` para popular o banco com dados iniciais:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Criar empresa
  const empresa = await prisma.empresa.create({
    data: {
      razaoSocial: 'Empresa Exemplo LTDA',
      nomeFantasia: 'Empresa Exemplo',
      cnpj: '12345678000190',
      inscricaoEstadual: '123456789',
      regimeTributario: 'SIMPLES_NACIONAL',
      crt: 1,
      cep: '01310-100',
      logradouro: 'Avenida Paulista',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      codigoMunicipio: '3550308',
      email: 'contato@empresa.com.br',
      telefone: '(11) 3000-0000'
    }
  })

  console.log('Empresa criada:', empresa)

  // Criar usuário admin
  const usuario = await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: 'admin@empresa.com.br',
      senha: '$2b$10$...' // Use bcrypt para hash da senha
      perfil: 'ADMIN',
      empresaId: empresa.id
    }
  })

  console.log('Usuário criado:', usuario)

  // Criar unidades
  const unidades = await prisma.unidade.createMany({
    data: [
      { sigla: 'UN', descricao: 'Unidade' },
      { sigla: 'KG', descricao: 'Quilograma' },
      { sigla: 'L', descricao: 'Litro' },
      { sigla: 'M', descricao: 'Metro' },
      { sigla: 'CX', descricao: 'Caixa' },
      { sigla: 'PC', descricao: 'Peça' }
    ]
  })

  console.log('Unidades criadas:', unidades)

  // Criar categorias
  const categoria = await prisma.categoria.create({
    data: {
      nome: 'Eletrônicos',
      descricao: 'Produtos eletrônicos em geral'
    }
  })

  console.log('Categoria criada:', categoria)

  // Criar marcas
  const marca = await prisma.marca.create({
    data: {
      nome: 'Samsung',
      descricao: 'Marca Samsung'
    }
  })

  console.log('Marca criada:', marca)

  // Criar natureza de operação
  const naturezaOperacao = await prisma.naturezaOperacao.create({
    data: {
      codigo: '5102',
      descricao: 'Venda de mercadoria adquirida ou recebida de terceiros',
      cfop: '5102',
      finalidade: 'NORMAL',
      tipo: 'SAIDA',
      empresaId: empresa.id
    }
  })

  console.log('Natureza de operação criada:', naturezaOperacao)

  // Criar configuração NF-e
  const configNFe = await prisma.configuracaoNFe.create({
    data: {
      empresaId: empresa.id,
      serie: '1',
      proximoNumero: 1,
      ambiente: 'HOMOLOGACAO',
      formatoImpressao: 'RETRATO'
    }
  })

  console.log('Configuração NF-e criada:', configNFe)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Adicione o script no `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

Execute o seed:

```bash
npx prisma db seed
```

## Passo 7: Integrar com NestJS

### 7.1 Criar Prisma Service

Crie o arquivo `src/prisma/prisma.service.ts`:

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### 7.2 Criar Prisma Module

Crie o arquivo `src/prisma/prisma.module.ts`:

```typescript
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### 7.3 Importar no App Module

Edite `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 7.4 Usar Prisma nos Services

Exemplo de uso em um service:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async findAll(empresaId: string) {
    return this.prisma.cliente.findMany({
      where: { empresaId, ativo: true },
      include: {
        enderecos: true
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.cliente.findUnique({
      where: { id },
      include: {
        enderecos: true,
        contatos: true,
        dadosBancarios: true
      }
    });
  }

  async create(data: any) {
    return this.prisma.cliente.create({
      data
    });
  }

  async update(id: string, data: any) {
    return this.prisma.cliente.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    return this.prisma.cliente.update({
      where: { id },
      data: { ativo: false }
    });
  }
}
```

## Passo 8: Comandos Úteis

### Visualizar banco de dados
```bash
npx prisma studio
```

### Formatar schema
```bash
npx prisma format
```

### Validar schema
```bash
npx prisma validate
```

### Resetar banco de dados (CUIDADO!)
```bash
npx prisma migrate reset
```

### Criar nova migration
```bash
npx prisma migrate dev --name nome_da_migration
```

### Aplicar migrations em produção
```bash
npx prisma migrate deploy
```

### Gerar diagrama ERD
```bash
npx prisma-erd-generator
```

## Passo 9: Backup e Restore

### Backup
```bash
pg_dump -U comixsys_user -d comixsys -F c -b -v -f backup_comixsys_$(date +%Y%m%d).backup
```

### Restore
```bash
pg_restore -U comixsys_user -d comixsys -v backup_comixsys_20240101.backup
```

## Troubleshooting

### Erro: "Can't reach database server"
- Verifique se o PostgreSQL está rodando
- Verifique a URL de conexão no .env
- Verifique firewall e permissões

### Erro: "Migration failed"
- Verifique se há dados conflitantes
- Use `npx prisma migrate reset` para resetar (desenvolvimento)
- Revise a migration gerada

### Erro: "Type 'X' is not assignable"
- Regenere o Prisma Client: `npx prisma generate`
- Reinicie o TypeScript server

## Próximos Passos

1. Implementar autenticação (JWT)
2. Criar módulos NestJS para cada entidade
3. Implementar validação com class-validator
4. Criar DTOs para entrada/saída de dados
5. Implementar testes unitários e e2e
6. Configurar CI/CD
7. Implementar integração com SEFAZ para NF-e
8. Criar jobs para processamento assíncrono

## Recursos Adicionais

- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação NestJS](https://docs.nestjs.com)
- [Manual NF-e SEFAZ](http://www.nfe.fazenda.gov.br/portal/principal.aspx)
- [Schemas XML NF-e](http://www.nfe.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=/fwLvLUSmU8=)

