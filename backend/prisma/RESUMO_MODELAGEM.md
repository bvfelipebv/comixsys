# Resumo da Modelagem Completa - Sistema ComixSys

## ✅ Modelagem Concluída

A modelagem de dados foi criada com base nos XMLs de NF-e fornecidos e nas páginas do frontend do sistema.

## 📊 Entidades Principais

### 1. **Empresa** (Multi-tenant)
- Dados cadastrais completos (CNPJ, IE, IM, CRT)
- Regime tributário (Simples Nacional, Normal, MEI)
- Endereço completo com código de município
- Certificado digital para assinatura
- Centro do sistema - todas entidades se relacionam com empresa

### 2. **Cliente**
- Suporta Pessoa Física (CPF) e Jurídica (CNPJ)
- **Indicador IE**: 1=Contribuinte, 2=Isento, 9=Não Contribuinte
- Múltiplos endereços (residencial, comercial, cobrança, entrega)
- Múltiplos contatos
- Dados bancários
- Email específico para NF-e
- Limite de crédito e bloqueio
- Lista de preços personalizada

### 3. **Produto**
- Código único e código interno
- Código de balança (vendas por peso)
- Tipo: PRODUTO, SERVICO, MERCADORIA
- Unidade, categoria, subcategoria, marca
- Preços: custo, varejo, atacado
- Quantidade mínima para atacado
- Controle de estoque (atual, mínimo, máximo)
- **Dados fiscais**: NCM, CEST, origem
- Suporte a composição (kits)
- Múltiplos preços por tipo de cliente

### 4. **Venda**
- Tipos: ORCAMENTO, PEDIDO, VENDA
- Status: ABERTA, APROVADA, FATURADA, CANCELADA
- Itens com quantidade, valores, descontos
- Relacionamento 1:1 com Nota Fiscal

### 5. **Nota Fiscal** ⭐ (Completa)
Baseada nos XMLs analisados:

#### Identificação
- Modelo: NFE (55), NFCE (65), NFSE, CTE (57), MDFE (58)
- Série e número
- Chave de acesso (44 dígitos)
- Código numérico e dígito verificador
- Tipo de emissão, impressão
- Destino operação (interna/interestadual/exterior)
- Indicador presença e consumidor final

#### Valores
- Produtos, desconto, frete, seguro, outras despesas
- Total da nota

#### Impostos Totais
- **ICMS**: Base cálculo, valor, desoneração, FCP
- **ICMS ST**: Base cálculo, valor, FCP ST, FCP ST Ret
- **IPI**: Valor, devolução
- **PIS**: Valor
- **COFINS**: Valor
- **ISS**: Valor
- **II**: Imposto Importação

#### Transporte
- Modalidade frete: 0=Emitente, 1=Destinatário, 9=Sem frete

#### Cobrança
- Número da fatura
- Valor original e líquido
- **Duplicatas**: número, vencimento, valor
- **Pagamentos**: indicador (à vista/prazo), meio pagamento, valor

#### Status SEFAZ
- Status: DIGITACAO, VALIDADA, ASSINADA, ENVIADA, AUTORIZADA, REJEITADA, CANCELADA
- Protocolo de autorização
- Data de autorização
- Motivo de rejeição (se houver)

#### Cancelamento
- Motivo, data, protocolo

#### Responsável Técnico
- CNPJ, contato, email, telefone
- Versão do processo emissor

### 6. **Item Nota Fiscal** ⭐ (Completo)

#### Produto
- Código, código EAN/GTIN
- Descrição, NCM, CEST, CFOP
- Unidade comercial e tributável

#### Quantidades e Valores
- Quantidade comercial e tributável (4 casas decimais)
- Valor unitário comercial e tributável (10 casas decimais)
- Desconto, frete, seguro, outras despesas
- Indicador se compõe total

#### ICMS
- Origem (0 a 8)
- CST ou CSOSN
- Modalidade BC
- Base cálculo, alíquota (4 casas decimais), valor
- **Simples Nacional**: Percentual crédito, valor crédito

#### ICMS ST
- Modalidade BC ST
- Base cálculo, alíquota, valor

#### IPI
- CST, código enquadramento (padrão 999)
- Base cálculo, alíquota (4 casas decimais), valor

#### PIS
- CST
- Base cálculo, alíquota (4 casas decimais), valor

#### COFINS
- CST
- Base cálculo, alíquota (4 casas decimais), valor

#### ISS (Serviços)
- Alíquota (4 casas decimais), valor
- Código serviço, código tributação

### 7. **Veículo Nota Fiscal** 🚗 (Novo)
Para vendas de veículos (reboques, carros, motos):
- Tipo operação (venda concessionária, faturamento direto, etc)
- **Chassi**
- Código e descrição da cor
- Potência motor, cilindradas
- Peso líquido e bruto
- Número série, tipo combustível, número motor
- CMT (Capacidade Máxima Tração)
- Distância entre eixos
- **Ano modelo e fabricação**
- Tipo pintura (fábrica/repintura)
- Tipo veículo, espécie veículo
- Condição VIN e veículo
- Código marca/modelo
- Código cor DENATRAN
- Lotação máxima, restrição

### 8. **Duplicata Nota Fiscal** 💰 (Novo)
- Número da duplicata
- Data de vencimento
- Valor

### 9. **Pagamento Nota Fiscal** 💳 (Novo)
- Indicador: 0=À vista, 1=À prazo
- Meio pagamento: 01=Dinheiro, 02=Cheque, 03=Cartão Crédito, 04=Cartão Débito, 15=Boleto, etc
- Valor
- Dados do cartão (se aplicável): CNPJ credenciadora, bandeira, autorização

### 10. **Evento Nota Fiscal**
- Tipos: CANCELAMENTO, CARTA_CORRECAO, CONFIRMACAO_OPERACAO, etc
- Sequência, descrição, justificativa
- Protocolo, data do evento

### 11. **Matriz Fiscal**
Sistema flexível de tributação:
- Nome do imposto/taxa
- Tipo: ICMS, IPI, PIS, COFINS, ISS, etc
- Aplica a serviço ou produto
- Regime fiscal
- Vigência (data início e fim)
- Modelo NF aplicável
- **Filtros**: produto, CFOP, tipo item, NCM, atividade principal
- **Definições**: CST/CSOSN, modalidade BC, redução BC, MVA
- **Alíquotas**: valor, código atividade, código serviço, CNAE

### 12. **Natureza Operação**
- Código e descrição
- CFOP padrão
- Finalidade: NORMAL, COMPLEMENTAR, AJUSTE, DEVOLUCAO
- Tipo: ENTRADA, SAIDA

### 13. **Configurações Fiscais**
- **NF-e**: Série, próximo número, ambiente, certificado, formato DANFE, contingência
- **NFC-e**: Série, próximo número, ambiente, certificado, Token CSC
- **NFS-e**: Série, próximo número, ambiente, certificado, RPS, provedor

## 🎯 Campos Importantes Baseados nos XMLs

### Do XML analisado:
✅ `cUF` - Código UF (21 = Maranhão)
✅ `cNF` - Código numérico
✅ `natOp` - Natureza operação
✅ `mod` - Modelo (55 = NF-e)
✅ `serie` - Série
✅ `nNF` - Número
✅ `dhEmi` - Data/hora emissão
✅ `dhSaiEnt` - Data/hora saída/entrada
✅ `tpNF` - Tipo (1=Saída)
✅ `idDest` - Destino operação
✅ `cMunFG` - Código município
✅ `tpImp` - Tipo impressão
✅ `tpEmis` - Tipo emissão
✅ `cDV` - Dígito verificador
✅ `tpAmb` - Ambiente (1=Produção, 2=Homologação)
✅ `finNFe` - Finalidade
✅ `indFinal` - Indicador consumidor final
✅ `indPres` - Indicador presença
✅ `procEmi` - Processo emissão
✅ `verProc` - Versão processo

### Emitente:
✅ CNPJ, razão social, nome fantasia
✅ Endereço completo
✅ IE, CRT

### Destinatário:
✅ CPF ou CNPJ
✅ Nome/razão social
✅ Endereço completo
✅ `indIEDest` - Indicador IE

### Produto/Item:
✅ Código produto, EAN
✅ Descrição, NCM, CFOP
✅ Unidade, quantidade, valor unitário
✅ Valor total
✅ **Veículo**: chassi, cor, potência, peso, ano, etc

### Impostos:
✅ ICMS: origem, CSOSN, percentual crédito SN
✅ IPI: CST, código enquadramento
✅ PIS: CST
✅ COFINS: CST

### Totais:
✅ Todos os valores de impostos
✅ Valor produtos, frete, seguro, desconto
✅ Valor total NF

### Transporte:
✅ Modalidade frete

### Cobrança:
✅ Fatura: número, valor original, valor líquido
✅ Duplicata: número, vencimento, valor

### Pagamento:
✅ Indicador pagamento
✅ Tipo pagamento
✅ Valor

### Responsável Técnico:
✅ CNPJ, contato, email, telefone

### Protocolo:
✅ Ambiente, versão aplicativo
✅ Chave NF-e
✅ Data recebimento
✅ Número protocolo
✅ Digest value
✅ Status (100 = Autorizado)
✅ Motivo

## 📁 Estrutura de Arquivos

```
backend/
├── prisma/
│   ├── schema.prisma              # Schema completo
│   ├── seed.ts                    # Dados iniciais
│   ├── MODELAGEM_NOTA_FISCAL.md   # Documentação detalhada
│   ├── EXEMPLOS_QUERIES.md        # Exemplos de uso
│   ├── DIAGRAMA_ER.md             # Diagramas
│   └── RESUMO_MODELAGEM.md        # Este arquivo
├── src/
│   └── prisma/
│       ├── prisma.service.ts      # Serviço Prisma
│       └── prisma.module.ts       # Módulo Prisma
└── .env                           # Configurações

```

## 🚀 Próximos Passos

1. ✅ Modelagem completa
2. ✅ Prisma instalado e configurado
3. ✅ PrismaService e PrismaModule criados
4. ⏳ Criar banco de dados PostgreSQL
5. ⏳ Executar migrations: `npx prisma migrate dev --name init`
6. ⏳ Executar seed: `npx prisma db seed`
7. ⏳ Criar módulos NestJS para cada entidade
8. ⏳ Criar DTOs e validações
9. ⏳ Implementar integração com SEFAZ
10. ⏳ Criar testes

## 📝 Observações Importantes

- **Multi-tenant**: Sistema suporta múltiplas empresas
- **Precisão**: Valores monetários usam Decimal
- **Alíquotas**: 4 casas decimais (ex: 18.0000%)
- **Quantidades**: 4 casas decimais
- **Valores unitários**: 10 casas decimais
- **UUID**: Chaves primárias para segurança
- **Soft delete**: Campo `ativo` preserva histórico
- **Timestamps**: `createdAt` e `updatedAt` automáticos
- **Cascata**: Exclusão de itens ao excluir pai
- **Índices únicos**: CNPJ, CPF, chave NF-e

## 🎨 Compatibilidade com Frontend

A modelagem suporta todas as páginas do frontend:

✅ `/clientes/*` - CRUD completo de clientes
✅ `/produtos/*` - CRUD completo de produtos
✅ `/vendas/*` - Orçamentos, pedidos e vendas
✅ `/configuracoes/fiscal/*` - Todas configurações fiscais
✅ `/configuracoes/empresa` - Dados da empresa
✅ `/configuracoes/usuarios` - Gestão de usuários
✅ `/dashboard/*` - Relatórios e indicadores

## 📊 Estatísticas

- **Total de Modelos**: 35+
- **Total de Enums**: 18
- **Relacionamentos**: 50+
- **Campos de Impostos**: 40+
- **Suporte a**: NF-e, NFC-e, NFS-e, CT-e, MDF-e

