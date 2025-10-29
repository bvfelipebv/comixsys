# Guia Rápido - Sistema ComixSys

## 🚀 Início Rápido

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Configurar Banco de Dados

Edite o arquivo `.env`:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/comixsys?schema=public"
```

### 3. Criar Banco de Dados

```bash
# PostgreSQL
createdb comixsys

# Ou via psql
psql -U postgres
CREATE DATABASE comixsys;
\q
```

### 4. Executar Migrations

```bash
npx prisma migrate dev --name init
```

### 5. Popular Banco (Seed)

```bash
npx prisma db seed
```

### 6. Visualizar Dados

```bash
npx prisma studio
```

Abre em: http://localhost:5555

## 📝 Uso Básico

### Importar Prisma Client

```typescript
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class MeuService {
  constructor(private prisma: PrismaService) {}
}
```

### Criar Cliente

```typescript
const cliente = await this.prisma.cliente.create({
  data: {
    tipo: 'FISICA',
    nome: 'João Silva',
    cpf: '12345678900',
    email: 'joao@email.com',
    consumidorFinal: true,
    indicadorIE: 9, // Não contribuinte
    empresaId: empresaId,
    enderecos: {
      create: {
        tipo: 'RESIDENCIAL',
        cep: '01310100',
        logradouro: 'Av Paulista',
        numero: '1000',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        uf: 'SP',
        principal: true
      }
    }
  }
});
```

### Criar Produto

```typescript
const produto = await this.prisma.produto.create({
  data: {
    codigo: 'PROD001',
    descricao: 'Notebook Dell',
    tipo: 'PRODUTO',
    unidadeId: unidadeId,
    precoVenda: 3500.00,
    ncm: '84713012',
    origem: 0,
    empresaId: empresaId
  }
});
```

### Criar Venda

```typescript
const venda = await this.prisma.venda.create({
  data: {
    numero: 'VND-001',
    tipo: 'VENDA',
    status: 'ABERTA',
    clienteId: clienteId,
    empresaId: empresaId,
    subtotal: 3500.00,
    valorTotal: 3500.00,
    itens: {
      create: [
        {
          sequencia: 1,
          produtoId: produtoId,
          quantidade: 1,
          valorUnitario: 3500.00,
          valorTotal: 3500.00
        }
      ]
    }
  },
  include: {
    itens: true,
    cliente: true
  }
});
```

### Criar Nota Fiscal

```typescript
const notaFiscal = await this.prisma.notaFiscal.create({
  data: {
    modelo: 'NFE',
    serie: '1',
    numero: 1,
    tipo: 'SAIDA',
    finalidade: 'NORMAL',
    clienteId: clienteId,
    empresaId: empresaId,
    vendaId: vendaId,
    naturezaOperacaoId: naturezaId,
    valorProdutos: 3500.00,
    valorTotal: 3500.00,
    status: 'DIGITACAO',
    ambiente: 'HOMOLOGACAO',
    destinoOperacao: 1, // Interna
    indicadorPresenca: 1, // Presencial
    indicadorFinal: 1, // Consumidor final
    modalidadeFrete: 0, // Emitente
    itens: {
      create: [
        {
          sequencia: 1,
          produtoId: produtoId,
          codigoProduto: 'PROD001',
          codigoEAN: 'SEM GTIN',
          descricao: 'Notebook Dell',
          ncm: '84713012',
          cfop: '5102',
          unidade: 'UN',
          quantidade: 1,
          valorUnitario: 3500.00,
          valorTotal: 3500.00,
          origem: 0,
          csosn: '102'
        }
      ]
    },
    duplicatas: {
      create: [
        {
          numero: '001',
          dataVencimento: new Date('2025-10-01'),
          valor: 3500.00
        }
      ]
    },
    pagamentos: {
      create: [
        {
          indicadorPagamento: 1, // À prazo
          meioPagamento: 15, // Boleto
          valor: 3500.00
        }
      ]
    }
  },
  include: {
    itens: true,
    duplicatas: true,
    pagamentos: true
  }
});
```

### Buscar Notas Fiscais

```typescript
// Todas as notas autorizadas
const notas = await this.prisma.notaFiscal.findMany({
  where: {
    empresaId: empresaId,
    status: 'AUTORIZADA',
    cancelada: false
  },
  include: {
    cliente: true,
    itens: true,
    duplicatas: true
  },
  orderBy: {
    numero: 'desc'
  }
});

// Nota por chave
const nota = await this.prisma.notaFiscal.findUnique({
  where: {
    chave: '21250941884059000177552750000003391000622530'
  },
  include: {
    cliente: true,
    empresa: true,
    itens: {
      include: {
        veiculo: true // Se for venda de veículo
      }
    },
    duplicatas: true,
    pagamentos: true,
    eventos: true
  }
});
```

### Aplicar Matriz Fiscal

```typescript
// Buscar matriz fiscal aplicável
const matriz = await this.prisma.matrizFiscal.findFirst({
  where: {
    empresaId: empresaId,
    ativo: true,
    tipoImposto: 'ICMS',
    dataInicio: { lte: new Date() },
    OR: [
      { dataFim: null },
      { dataFim: { gte: new Date() } }
    ],
    filtros: {
      some: {
        OR: [
          { produtoId: produtoId },
          { tipoItem: 'PRODUTO' },
          { ncm: '84713012' }
        ]
      }
    }
  },
  include: {
    filtros: true,
    definicoes: true,
    aliquotas: true
  }
});

// Aplicar alíquota ao item
if (matriz) {
  const aliquota = matriz.aliquotas[0]?.aliquota || 0;
  const valorICMS = (valorProduto * aliquota) / 100;
}
```

### Relatórios

```typescript
// Vendas do mês
const vendas = await this.prisma.venda.findMany({
  where: {
    empresaId: empresaId,
    dataEmissao: {
      gte: new Date('2025-01-01'),
      lte: new Date('2025-01-31')
    }
  },
  include: {
    cliente: true,
    itens: {
      include: {
        produto: true
      }
    }
  }
});

// Total de vendas
const total = await this.prisma.venda.aggregate({
  where: {
    empresaId: empresaId,
    status: 'FATURADA'
  },
  _sum: {
    valorTotal: true
  },
  _count: {
    id: true
  }
});

// Produtos mais vendidos
const produtosMaisVendidos = await this.prisma.itemVenda.groupBy({
  by: ['produtoId'],
  where: {
    venda: {
      empresaId: empresaId,
      status: 'FATURADA'
    }
  },
  _sum: {
    quantidade: true,
    valorTotal: true
  },
  orderBy: {
    _sum: {
      quantidade: 'desc'
    }
  },
  take: 10
});
```

## 🔧 Comandos Úteis

```bash
# Gerar Prisma Client
npx prisma generate

# Visualizar banco
npx prisma studio

# Formatar schema
npx prisma format

# Validar schema
npx prisma validate

# Criar migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations (produção)
npx prisma migrate deploy

# Resetar banco (CUIDADO!)
npx prisma migrate reset

# Ver status das migrations
npx prisma migrate status
```

## 📚 Documentação Completa

- `MODELAGEM_NOTA_FISCAL.md` - Documentação detalhada de todas as entidades
- `EXEMPLOS_QUERIES.md` - Exemplos completos de queries
- `DIAGRAMA_ER.md` - Diagramas de relacionamento
- `RESUMO_MODELAGEM.md` - Resumo da modelagem

## 🎯 Dicas

1. **Sempre use transações** para operações que envolvem múltiplas tabelas
2. **Use include** para carregar relacionamentos
3. **Use select** para otimizar queries
4. **Implemente paginação** para listas grandes
5. **Valide dados** antes de inserir no banco
6. **Use soft delete** (campo `ativo`) ao invés de deletar registros
7. **Mantenha histórico** de alterações importantes

## ⚠️ Importante

- Sempre faça backup antes de executar migrations em produção
- Use ambiente de homologação para testes
- Valide XMLs antes de enviar para SEFAZ
- Mantenha certificado digital atualizado
- Configure corretamente o regime tributário da empresa

## 🆘 Suporte

Em caso de dúvidas:
1. Consulte a documentação do Prisma: https://www.prisma.io/docs
2. Consulte a documentação do NestJS: https://docs.nestjs.com
3. Consulte o manual da NF-e: http://www.nfe.fazenda.gov.br

