# Diagrama Entidade-Relacionamento - Sistema de Nota Fiscal

## Diagrama Principal

```mermaid
erDiagram
    EMPRESA ||--o{ USUARIO : possui
    EMPRESA ||--o{ CLIENTE : possui
    EMPRESA ||--o{ PRODUTO : possui
    EMPRESA ||--o{ VENDA : possui
    EMPRESA ||--o{ NOTA_FISCAL : emite
    EMPRESA ||--o{ MATRIZ_FISCAL : configura
    EMPRESA ||--o{ NATUREZA_OPERACAO : define
    
    CLIENTE ||--o{ ENDERECO_CLIENTE : possui
    CLIENTE ||--o{ CONTATO_CLIENTE : possui
    CLIENTE ||--o{ DADO_BANCARIO_CLIENTE : possui
    CLIENTE ||--o{ VENDA : realiza
    CLIENTE ||--o{ NOTA_FISCAL : recebe
    CLIENTE }o--|| TIPO_PRECO : "tem lista de preço"
    
    PRODUTO }o--|| UNIDADE : "medido em"
    PRODUTO }o--o| CATEGORIA : "pertence a"
    PRODUTO }o--o| SUBCATEGORIA : "pertence a"
    PRODUTO }o--o| MARCA : "possui"
    PRODUTO ||--o{ PRECO_PRODUTO : "tem preços"
    PRODUTO ||--o{ COMPOSICAO_PRODUTO : "composto por"
    PRODUTO ||--o{ ITEM_VENDA : "vendido em"
    PRODUTO ||--o{ ITEM_NOTA_FISCAL : "faturado em"
    
    TIPO_PRECO ||--o{ PRECO_PRODUTO : define
    CATEGORIA ||--o{ SUBCATEGORIA : possui
    
    VENDA ||--o{ ITEM_VENDA : contém
    VENDA ||--o| NOTA_FISCAL : "gera"
    
    NOTA_FISCAL ||--o{ ITEM_NOTA_FISCAL : contém
    NOTA_FISCAL ||--o{ EVENTO_NOTA_FISCAL : possui
    NOTA_FISCAL }o--|| NATUREZA_OPERACAO : "usa"
    
    MATRIZ_FISCAL ||--o{ FILTRO_MATRIZ_FISCAL : possui
    MATRIZ_FISCAL ||--o{ DEFINICAO_FISCAL_MATRIZ : possui
    MATRIZ_FISCAL ||--o{ ALIQUOTA_MATRIZ_FISCAL : possui
    
    EMPRESA {
        uuid id PK
        string razaoSocial
        string cnpj UK
        string inscricaoEstadual
        enum regimeTributario
        int crt
        string cep
        string logradouro
        string email
        bytes certificadoDigital
        boolean ativo
        datetime createdAt
        datetime updatedAt
    }
    
    USUARIO {
        uuid id PK
        string nome
        string email UK
        string senha
        enum perfil
        uuid empresaId FK
        boolean ativo
        datetime createdAt
        datetime updatedAt
    }
    
    CLIENTE {
        uuid id PK
        enum tipo
        string nome
        string cpf UK
        string cnpj UK
        string email
        string emailNFe
        boolean issRetido
        boolean consumidorFinal
        decimal limiteCredito
        uuid empresaId FK
        uuid tipoPrecoId FK
        boolean ativo
        datetime createdAt
        datetime updatedAt
    }
    
    PRODUTO {
        uuid id PK
        string codigo UK
        string descricao
        enum tipo
        uuid unidadeId FK
        uuid categoriaId FK
        uuid marcaId FK
        decimal precoVenda
        decimal precoAtacado
        boolean movimentaEstoque
        decimal estoqueAtual
        string ncm
        uuid empresaId FK
        boolean ativo
        datetime createdAt
        datetime updatedAt
    }
    
    VENDA {
        uuid id PK
        string numero UK
        enum tipo
        enum status
        uuid clienteId FK
        uuid empresaId FK
        decimal subtotal
        decimal desconto
        decimal valorTotal
        datetime dataEmissao
        datetime createdAt
        datetime updatedAt
    }
    
    ITEM_VENDA {
        uuid id PK
        int sequencia
        uuid produtoId FK
        uuid vendaId FK
        decimal quantidade
        decimal valorUnitario
        decimal valorTotal
        datetime createdAt
        datetime updatedAt
    }
    
    NOTA_FISCAL {
        uuid id PK
        enum modelo
        string serie
        int numero
        string chave UK
        enum tipo
        uuid clienteId FK
        uuid empresaId FK
        uuid vendaId FK
        uuid naturezaOperacaoId FK
        decimal valorTotal
        decimal valorICMS
        decimal valorPIS
        decimal valorCOFINS
        enum status
        string protocolo
        boolean cancelada
        enum ambiente
        datetime dataEmissao
        datetime createdAt
        datetime updatedAt
    }
    
    ITEM_NOTA_FISCAL {
        uuid id PK
        int sequencia
        uuid produtoId FK
        uuid notaFiscalId FK
        string cfop
        decimal quantidade
        decimal valorUnitario
        decimal valorTotal
        string cstICMS
        decimal aliquotaICMS
        decimal valorICMS
        datetime createdAt
        datetime updatedAt
    }
    
    MATRIZ_FISCAL {
        uuid id PK
        string nome
        enum tipoImposto
        boolean aplicaServico
        enum regimeFiscal
        datetime dataInicio
        datetime dataFim
        enum modeloNF
        uuid empresaId FK
        boolean ativo
        datetime createdAt
        datetime updatedAt
    }
```

## Diagrama de Configurações Fiscais

```mermaid
erDiagram
    EMPRESA ||--o| CONFIGURACAO_NFE : configura
    EMPRESA ||--o| CONFIGURACAO_NFCE : configura
    EMPRESA ||--o| CONFIGURACAO_NFSE : configura
    
    CONFIGURACAO_NFE {
        uuid id PK
        uuid empresaId FK UK
        string serie
        int proximoNumero
        enum ambiente
        bytes certificadoDigital
        enum formatoImpressao
        boolean ativo
        datetime createdAt
        datetime updatedAt
    }
    
    CONFIGURACAO_NFCE {
        uuid id PK
        uuid empresaId FK UK
        string serie
        int proximoNumero
        enum ambiente
        string idToken
        string csc
        boolean ativo
        datetime createdAt
        datetime updatedAt
    }
    
    CONFIGURACAO_NFSE {
        uuid id PK
        uuid empresaId FK UK
        string serie
        int proximoNumero
        enum ambiente
        string provedor
        string usuario
        string senha
        boolean ativo
        datetime createdAt
        datetime updatedAt
    }
```

## Diagrama de Matriz Fiscal Detalhado

```mermaid
erDiagram
    MATRIZ_FISCAL ||--o{ FILTRO_MATRIZ_FISCAL : "aplica filtros"
    MATRIZ_FISCAL ||--o{ DEFINICAO_FISCAL_MATRIZ : "define regras"
    MATRIZ_FISCAL ||--o{ ALIQUOTA_MATRIZ_FISCAL : "define alíquotas"
    
    FILTRO_MATRIZ_FISCAL {
        uuid id PK
        uuid matrizFiscalId FK
        uuid produtoId
        string cfop
        enum tipoItem
        string ncm
        boolean atividadePrincipal
        datetime createdAt
        datetime updatedAt
    }
    
    DEFINICAO_FISCAL_MATRIZ {
        uuid id PK
        uuid matrizFiscalId FK
        string cst
        string csosn
        int modalidadeBC
        decimal percentualReducaoBC
        decimal percentualMVA
        datetime createdAt
        datetime updatedAt
    }
    
    ALIQUOTA_MATRIZ_FISCAL {
        uuid id PK
        uuid matrizFiscalId FK
        decimal aliquota
        string codigoAtividade
        string codigoItemListaServico
        string codigoTributacao
        string cnae
        datetime createdAt
        datetime updatedAt
    }
```

## Fluxo de Dados - Emissão de NF-e

```mermaid
flowchart TD
    A[Criar Venda] --> B[Adicionar Itens]
    B --> C[Calcular Totais]
    C --> D[Aprovar Venda]
    D --> E[Gerar Nota Fiscal]
    E --> F[Buscar Configurações]
    F --> G[Aplicar Matriz Fiscal]
    G --> H[Calcular Impostos]
    H --> I[Gerar XML]
    I --> J[Assinar XML]
    J --> K[Enviar para SEFAZ]
    K --> L{Autorizada?}
    L -->|Sim| M[Salvar Protocolo]
    L -->|Não| N[Salvar Rejeição]
    M --> O[Enviar Email Cliente]
    O --> P[Atualizar Estoque]
    P --> Q[Finalizar]
    N --> R[Corrigir Erros]
    R --> E
```

## Fluxo de Aplicação da Matriz Fiscal

```mermaid
flowchart TD
    A[Item da Nota Fiscal] --> B[Buscar Matriz Fiscal]
    B --> C{Filtros Aplicáveis?}
    C -->|Produto Específico| D[Aplicar Matriz]
    C -->|CFOP| D
    C -->|Tipo Item| D
    C -->|NCM| D
    C -->|Nenhum| E[Usar Padrão]
    D --> F[Obter Definições Fiscais]
    F --> G[CST/CSOSN]
    F --> H[Modalidade BC]
    F --> I[Redução BC]
    F --> J[MVA]
    D --> K[Obter Alíquotas]
    K --> L[Calcular Impostos]
    L --> M[ICMS]
    L --> N[IPI]
    L --> O[PIS]
    L --> P[COFINS]
    L --> Q[ISS]
    M --> R[Aplicar ao Item]
    N --> R
    O --> R
    P --> R
    Q --> R
```

## Relacionamentos Principais

### 1. Empresa (Multi-tenant)
- Centro do sistema
- Todas as entidades principais se relacionam com Empresa
- Permite múltiplas empresas no mesmo banco

### 2. Cliente
- Pode ser Pessoa Física ou Jurídica
- Possui múltiplos endereços, contatos e dados bancários
- Relacionado com vendas e notas fiscais

### 3. Produto
- Estrutura hierárquica: Categoria > Subcategoria
- Suporta composição (kits)
- Múltiplos preços por tipo de cliente
- Controle de estoque

### 4. Venda → Nota Fiscal
- Relacionamento 1:1
- Venda gera uma nota fiscal
- Nota fiscal referencia a venda original

### 5. Matriz Fiscal
- Sistema flexível de tributação
- Filtros para aplicação condicional
- Definições fiscais por imposto
- Alíquotas configuráveis

## Índices Importantes

```sql
-- Índices de performance
CREATE INDEX idx_cliente_cnpj ON clientes(cnpj);
CREATE INDEX idx_cliente_cpf ON clientes(cpf);
CREATE INDEX idx_produto_codigo ON produtos(codigo);
CREATE INDEX idx_nota_fiscal_chave ON notas_fiscais(chave);
CREATE INDEX idx_nota_fiscal_data ON notas_fiscais(data_emissao);
CREATE INDEX idx_venda_data ON vendas(data_emissao);
CREATE INDEX idx_venda_status ON vendas(status);

-- Índices compostos
CREATE INDEX idx_cliente_empresa ON clientes(empresa_id, ativo);
CREATE INDEX idx_produto_empresa ON produtos(empresa_id, ativo);
CREATE INDEX idx_nota_fiscal_empresa_status ON notas_fiscais(empresa_id, status);
```

## Observações sobre o Modelo

1. **UUID como Chave Primária**: Maior segurança e facilita distribuição
2. **Soft Delete**: Campo `ativo` para não perder histórico
3. **Timestamps**: `createdAt` e `updatedAt` automáticos
4. **Decimal para Valores**: Precisão em cálculos financeiros
5. **Enums**: Validação de dados no banco
6. **Relacionamentos em Cascata**: Exclusão de itens ao excluir pai
7. **Índices Únicos**: Garantem integridade (CNPJ, CPF, chave NF-e)

