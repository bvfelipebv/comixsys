# Exemplos de Queries Prisma - Sistema de Nota Fiscal

## Setup Inicial

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
```

## 1. Empresa

### Criar Empresa
```typescript
const empresa = await prisma.empresa.create({
  data: {
    razaoSocial: 'Empresa Exemplo LTDA',
    nomeFantasia: 'Empresa Exemplo',
    cnpj: '12345678000190',
    inscricaoEstadual: '123456789',
    regimeTributario: 'SIMPLES_NACIONAL',
    crt: 1,
    cep: '12345-678',
    logradouro: 'Rua Exemplo',
    numero: '123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    uf: 'SP',
    codigoMunicipio: '3550308',
    email: 'contato@empresa.com.br',
    telefone: '(11) 1234-5678'
  }
})
```

## 2. Clientes

### Criar Cliente Pessoa Física
```typescript
const clientePF = await prisma.cliente.create({
  data: {
    tipo: 'FISICA',
    nome: 'João da Silva',
    cpf: '12345678900',
    email: 'joao@email.com',
    celular: '(11) 98765-4321',
    consumidorFinal: true,
    empresaId: empresa.id,
    enderecos: {
      create: {
        tipo: 'RESIDENCIAL',
        cep: '12345-678',
        logradouro: 'Rua do Cliente',
        numero: '456',
        bairro: 'Jardim',
        cidade: 'São Paulo',
        uf: 'SP',
        principal: true
      }
    }
  },
  include: {
    enderecos: true
  }
})
```

### Criar Cliente Pessoa Jurídica
```typescript
const clientePJ = await prisma.cliente.create({
  data: {
    tipo: 'JURIDICA',
    nome: 'Cliente Empresa LTDA',
    razaoSocial: 'Cliente Empresa LTDA',
    nomeFantasia: 'Cliente Empresa',
    cnpj: '98765432000100',
    inscricaoEstadual: '987654321',
    email: 'contato@cliente.com.br',
    emailNFe: 'nfe@cliente.com.br',
    consumidorFinal: false,
    empresaId: empresa.id
  }
})
```

### Buscar Cliente com Endereços
```typescript
const cliente = await prisma.cliente.findUnique({
  where: { id: clienteId },
  include: {
    enderecos: true,
    contatos: true,
    dadosBancarios: true
  }
})
```

## 3. Produtos

### Criar Produto
```typescript
// Primeiro criar unidade, categoria e marca
const unidade = await prisma.unidade.create({
  data: {
    sigla: 'UN',
    descricao: 'Unidade'
  }
})

const categoria = await prisma.categoria.create({
  data: {
    nome: 'Eletrônicos',
    descricao: 'Produtos eletrônicos'
  }
})

const marca = await prisma.marca.create({
  data: {
    nome: 'Samsung'
  }
})

// Criar produto
const produto = await prisma.produto.create({
  data: {
    codigo: 'PROD001',
    codigoInterno: 'INT001',
    descricao: 'Smartphone Galaxy',
    tipo: 'PRODUTO',
    unidadeId: unidade.id,
    categoriaId: categoria.id,
    marcaId: marca.id,
    custoUltimaCompra: 1000.00,
    precoVenda: 1500.00,
    precoAtacado: 1300.00,
    qtdeMinimaAtacado: 10,
    movimentaEstoque: true,
    estoqueAtual: 50,
    estoqueMinimo: 10,
    ncm: '85171231',
    origem: 0,
    empresaId: empresa.id
  }
})
```

### Criar Produto Composto
```typescript
const produtoKit = await prisma.produto.create({
  data: {
    codigo: 'KIT001',
    descricao: 'Kit Smartphone + Fone',
    tipo: 'PRODUTO',
    unidadeId: unidade.id,
    precoVenda: 1700.00,
    movimentaEstoque: false,
    movimentaComposicao: true,
    empresaId: empresa.id,
    composicao: {
      create: [
        {
          produtoComponenteId: produto.id,
          quantidade: 1
        },
        {
          produtoComponenteId: fone.id,
          quantidade: 1
        }
      ]
    }
  },
  include: {
    composicao: {
      include: {
        produtoComponente: true
      }
    }
  }
})
```

### Buscar Produtos com Estoque Baixo
```typescript
const produtosEstoqueBaixo = await prisma.produto.findMany({
  where: {
    empresaId: empresa.id,
    ativo: true,
    movimentaEstoque: true,
    estoqueAtual: {
      lte: prisma.produto.fields.estoqueMinimo
    }
  },
  include: {
    unidade: true,
    categoria: true
  }
})
```

## 4. Vendas

### Criar Venda com Itens
```typescript
const venda = await prisma.venda.create({
  data: {
    numero: 'VND-001',
    tipo: 'VENDA',
    status: 'ABERTA',
    clienteId: cliente.id,
    empresaId: empresa.id,
    subtotal: 1500.00,
    desconto: 50.00,
    valorTotal: 1450.00,
    dataEmissao: new Date(),
    itens: {
      create: [
        {
          sequencia: 1,
          produtoId: produto.id,
          quantidade: 1,
          valorUnitario: 1500.00,
          desconto: 50.00,
          valorTotal: 1450.00
        }
      ]
    }
  },
  include: {
    itens: {
      include: {
        produto: true
      }
    },
    cliente: true
  }
})
```

### Buscar Vendas do Dia
```typescript
const hoje = new Date()
hoje.setHours(0, 0, 0, 0)

const vendasDia = await prisma.venda.findMany({
  where: {
    empresaId: empresa.id,
    dataEmissao: {
      gte: hoje
    }
  },
  include: {
    cliente: true,
    itens: {
      include: {
        produto: true
      }
    }
  },
  orderBy: {
    dataEmissao: 'desc'
  }
})
```

## 5. Notas Fiscais

### Criar Nota Fiscal a partir de Venda
```typescript
const notaFiscal = await prisma.notaFiscal.create({
  data: {
    modelo: 'NFE',
    serie: '1',
    numero: 1,
    tipo: 'SAIDA',
    finalidade: 'NORMAL',
    clienteId: venda.clienteId,
    empresaId: venda.empresaId,
    vendaId: venda.id,
    naturezaOperacaoId: naturezaOperacao.id,
    valorProdutos: venda.valorTotal,
    valorTotal: venda.valorTotal,
    status: 'DIGITACAO',
    ambiente: 'HOMOLOGACAO',
    dataEmissao: new Date(),
    itens: {
      create: venda.itens.map((item, index) => ({
        sequencia: index + 1,
        produtoId: item.produtoId,
        codigoProduto: item.produto.codigo,
        descricao: item.produto.descricao,
        ncm: item.produto.ncm,
        cfop: '5102',
        unidade: item.produto.unidade.sigla,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        valorDesconto: item.desconto,
        valorTotal: item.valorTotal,
        origem: item.produto.origem,
        csosn: '102',
        baseCalculoICMS: 0,
        aliquotaICMS: 0,
        valorICMS: 0
      }))
    }
  },
  include: {
    itens: true,
    cliente: true,
    empresa: true
  }
})
```

### Buscar Notas Fiscais Autorizadas
```typescript
const notasAutorizadas = await prisma.notaFiscal.findMany({
  where: {
    empresaId: empresa.id,
    status: 'AUTORIZADA',
    cancelada: false,
    dataEmissao: {
      gte: new Date('2024-01-01'),
      lte: new Date('2024-12-31')
    }
  },
  include: {
    cliente: true,
    itens: true
  },
  orderBy: {
    numero: 'desc'
  }
})
```

### Cancelar Nota Fiscal
```typescript
const notaCancelada = await prisma.notaFiscal.update({
  where: { id: notaFiscalId },
  data: {
    cancelada: true,
    motivoCancelamento: 'Erro no cadastro do cliente',
    dataCancelamento: new Date(),
    protocoloCancelamento: '123456789012345',
    eventos: {
      create: {
        tipo: 'CANCELAMENTO',
        sequencia: 1,
        descricao: 'Cancelamento de NF-e',
        justificativa: 'Erro no cadastro do cliente',
        protocolo: '123456789012345',
        dataEvento: new Date()
      }
    }
  }
})
```

## 6. Matriz Fiscal

### Criar Matriz Fiscal para ICMS
```typescript
const matrizICMS = await prisma.matrizFiscal.create({
  data: {
    nome: 'ICMS - Simples Nacional',
    tipoImposto: 'ICMS',
    aplicaServico: false,
    regimeFiscal: 'SIMPLES_NACIONAL',
    dataInicio: new Date('2024-01-01'),
    modeloNF: 'NFE',
    utilizarHomologacao: true,
    empresaId: empresa.id,
    filtros: {
      create: {
        tipoItem: 'PRODUTO',
        cfop: '5102'
      }
    },
    definicoes: {
      create: {
        csosn: '102'
      }
    },
    aliquotas: {
      create: {
        aliquota: 0
      }
    }
  },
  include: {
    filtros: true,
    definicoes: true,
    aliquotas: true
  }
})
```

### Buscar Matriz Fiscal Aplicável
```typescript
const matrizAplicavel = await prisma.matrizFiscal.findFirst({
  where: {
    empresaId: empresa.id,
    ativo: true,
    tipoImposto: 'ICMS',
    regimeFiscal: empresa.regimeTributario,
    dataInicio: {
      lte: new Date()
    },
    OR: [
      { dataFim: null },
      { dataFim: { gte: new Date() } }
    ],
    filtros: {
      some: {
        OR: [
          { produtoId: produto.id },
          { tipoItem: produto.tipo },
          { ncm: produto.ncm }
        ]
      }
    }
  },
  include: {
    filtros: true,
    definicoes: true,
    aliquotas: true
  }
})
```

## 7. Relatórios

### Vendas por Período
```typescript
const relatorioVendas = await prisma.venda.groupBy({
  by: ['status'],
  where: {
    empresaId: empresa.id,
    dataEmissao: {
      gte: new Date('2024-01-01'),
      lte: new Date('2024-12-31')
    }
  },
  _sum: {
    valorTotal: true
  },
  _count: {
    id: true
  }
})
```

### Produtos Mais Vendidos
```typescript
const produtosMaisVendidos = await prisma.itemVenda.groupBy({
  by: ['produtoId'],
  where: {
    venda: {
      empresaId: empresa.id,
      status: 'FATURADA',
      dataEmissao: {
        gte: new Date('2024-01-01')
      }
    }
  },
  _sum: {
    quantidade: true,
    valorTotal: true
  },
  _count: {
    id: true
  },
  orderBy: {
    _sum: {
      quantidade: 'desc'
    }
  },
  take: 10
})

// Buscar detalhes dos produtos
const produtosDetalhes = await prisma.produto.findMany({
  where: {
    id: {
      in: produtosMaisVendidos.map(p => p.produtoId)
    }
  }
})
```

### Notas Fiscais por Status
```typescript
const notasPorStatus = await prisma.notaFiscal.groupBy({
  by: ['status', 'modelo'],
  where: {
    empresaId: empresa.id
  },
  _count: {
    id: true
  }
})
```

## 8. Transações

### Criar Venda e Atualizar Estoque (Transação)
```typescript
const resultado = await prisma.$transaction(async (tx) => {
  // Criar venda
  const venda = await tx.venda.create({
    data: {
      numero: 'VND-002',
      tipo: 'VENDA',
      status: 'FATURADA',
      clienteId: cliente.id,
      empresaId: empresa.id,
      subtotal: 1500.00,
      valorTotal: 1500.00,
      itens: {
        create: [
          {
            sequencia: 1,
            produtoId: produto.id,
            quantidade: 2,
            valorUnitario: 750.00,
            valorTotal: 1500.00
          }
        ]
      }
    }
  })

  // Atualizar estoque
  await tx.produto.update({
    where: { id: produto.id },
    data: {
      estoqueAtual: {
        decrement: 2
      }
    }
  })

  return venda
})
```

## Observações

- Sempre use transações para operações que envolvem múltiplas tabelas
- Use `include` para carregar relacionamentos
- Use `select` para otimizar queries quando não precisar de todos os campos
- Implemente paginação para listas grandes
- Use índices apropriados para melhorar performance

