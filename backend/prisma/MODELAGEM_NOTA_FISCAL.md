# Modelagem de Dados - Sistema de Emissão de Nota Fiscal

## Visão Geral

Esta modelagem foi criada para suportar um sistema completo de emissão de notas fiscais eletrônicas (NF-e, NFC-e, NFS-e), incluindo gestão de clientes, produtos, vendas e configurações fiscais.

## Estrutura Principal

### 1. Configurações do Sistema

#### Empresa
- Dados cadastrais completos (CNPJ, IE, IM)
- Regime tributário e CRT
- Endereço completo
- Certificado digital para assinatura de NF-e
- Relacionamentos com todas as entidades do sistema

#### Usuario
- Controle de acesso ao sistema
- Perfis: ADMIN, GERENTE, VENDEDOR, OPERADOR
- Vinculado a uma empresa

### 2. Clientes

#### Cliente
- Suporta Pessoa Física e Jurídica
- Dados fiscais (ISS retido, consumidor final, produtor rural)
- Limite de crédito e bloqueio
- Email específico para envio de NF-e
- Tipo de preço (lista de preços personalizada)

#### EnderecoCliente
- Múltiplos endereços por cliente
- Tipos: RESIDENCIAL, COMERCIAL, COBRANCA, ENTREGA
- Endereço principal marcado

#### ContatoCliente
- Múltiplos contatos por cliente
- Nome, cargo, telefones e email

#### DadoBancarioCliente
- Dados bancários para pagamentos
- Tipos de conta: CORRENTE, POUPANCA, SALARIO

#### TipoPreco
- Listas de preços personalizadas
- Permite preços diferenciados por tipo de cliente

### 3. Produtos

#### Produto
- Código único e código interno
- Código de balança para vendas por peso
- Tipo: PRODUTO, SERVICO, MERCADORIA
- Unidade, categoria, subcategoria e marca
- Tags para organização
- Preços: custo, varejo, atacado
- Quantidade mínima para atacado
- Controle de estoque (atual, mínimo, máximo)
- Dados fiscais: NCM, CEST, origem
- Suporte a composição de produtos
- Imagem do produto

#### PrecoProduto
- Preços personalizados por tipo de cliente
- Relacionamento produto x tipo de preço

#### ComposicaoProduto
- Produtos compostos (kits)
- Quantidade de cada componente
- Controle de estoque da composição

#### Unidade
- Unidades de medida (UN, KG, L, etc.)

#### Categoria e Subcategoria
- Organização hierárquica de produtos

#### Marca
- Marcas dos produtos

### 4. Vendas

#### Venda
- Tipos: ORCAMENTO, PEDIDO, VENDA
- Status: ABERTA, APROVADA, FATURADA, CANCELADA
- Valores: subtotal, desconto, acréscimo, total
- Observações (cliente e interna)
- Datas: emissão, validade, fechamento
- Relacionamento com nota fiscal

#### ItemVenda
- Itens da venda
- Sequência, quantidade, valores
- Desconto e acréscimo por item
- Observação do item

### 5. Notas Fiscais

#### NotaFiscal
- Modelos: NFE (55), NFCE (65), NFSE, CTE (57), MDFE (58)
- Série e número
- Chave de acesso
- Tipo: ENTRADA, SAIDA
- Finalidade: NORMAL, COMPLEMENTAR, AJUSTE, DEVOLUCAO
- Natureza da operação
- Valores totais e impostos
- Status SEFAZ (protocolo, autorização, rejeição)
- Cancelamento (motivo, data, protocolo)
- Informações complementares
- Ambiente: PRODUCAO, HOMOLOGACAO

#### ItemNotaFiscal
- Itens da nota fiscal
- Dados do produto (código, descrição, NCM, CEST, CFOP)
- Quantidades e valores
- Impostos detalhados por item:
  - **ICMS**: origem, CST/CSOSN, modalidade BC, base de cálculo, alíquota, valor
  - **ICMS ST**: modalidade BC ST, base de cálculo, alíquota, valor
  - **IPI**: CST, base de cálculo, alíquota, valor
  - **PIS**: CST, base de cálculo, alíquota, valor
  - **COFINS**: CST, base de cálculo, alíquota, valor
  - **ISS**: alíquota, valor, código de serviço, código de tributação
- Informações adicionais do item

#### EventoNotaFiscal
- Eventos da nota fiscal
- Tipos: CANCELAMENTO, CARTA_CORRECAO, CONFIRMACAO_OPERACAO, etc.
- Protocolo e data do evento
- Justificativa (quando necessário)

### 6. Configurações Fiscais

#### NaturezaOperacao
- Código e descrição
- CFOP padrão
- Finalidade e tipo de operação
- Única por empresa

#### ConfiguracaoNFe
- Configurações específicas para NF-e
- Série e próximo número
- Ambiente (produção/homologação)
- Certificado digital
- Formato de impressão (DANFE)
- Email para cópia
- Contingência

#### ConfiguracaoNFCe
- Configurações específicas para NFC-e
- Token CSC (Código de Segurança do Contribuinte)
- Série e numeração independente

#### ConfiguracaoNFSe
- Configurações específicas para NFS-e
- RPS (Recibo Provisório de Serviços)
- Provedor de NFS-e
- Credenciais de acesso

### 7. Matriz Fiscal

#### MatrizFiscal
- Nome do imposto/taxa
- Tipo: ICMS, IPI, PIS, COFINS, ISS, etc.
- Aplica a serviço ou produto
- Regime fiscal
- Vigência (data início e fim)
- Modelo de NF aplicável
- Utilizar em homologação

#### FiltroMatrizFiscal
- Filtros para aplicação da matriz
- Produto específico
- CFOP
- Tipo de item
- NCM
- Atividade principal

#### DefinicaoFiscalMatriz
- Definições fiscais da matriz
- CST/CSOSN
- Modalidade de base de cálculo
- Percentual de redução de BC
- MVA (Margem de Valor Agregado)

#### AliquotaMatrizFiscal
- Alíquotas aplicáveis
- Código de atividade
- Código de item da lista de serviço
- Código de tributação
- CNAE

## Fluxo de Emissão de Nota Fiscal

1. **Criação da Venda**
   - Cliente seleciona produtos
   - Sistema calcula valores e impostos
   - Venda é salva com status ABERTA

2. **Aprovação da Venda**
   - Venda é aprovada
   - Status muda para APROVADA

3. **Geração da Nota Fiscal**
   - Sistema busca configurações fiscais da empresa
   - Aplica matriz fiscal aos itens
   - Calcula impostos por item
   - Gera XML da nota fiscal
   - Assina com certificado digital

4. **Envio para SEFAZ**
   - Envia XML para SEFAZ
   - Aguarda retorno (autorização ou rejeição)
   - Salva protocolo e chave de acesso

5. **Autorização**
   - Nota autorizada
   - Status muda para AUTORIZADA
   - Venda muda para FATURADA
   - Envia email para cliente

6. **Eventos (opcional)**
   - Cancelamento
   - Carta de correção
   - Confirmação de operação

## Índices e Performance

- Todos os IDs são UUID para segurança
- Campos únicos: CNPJ, CPF, chave de NF-e
- Índices compostos: empresa + código (natureza operação)
- Timestamps automáticos (createdAt, updatedAt)

## Relacionamentos Importantes

- Empresa → Clientes, Produtos, Vendas, Notas Fiscais
- Cliente → Endereços, Contatos, Dados Bancários, Vendas, Notas Fiscais
- Produto → Preços, Composição, Itens de Venda, Itens de NF
- Venda → Itens, Nota Fiscal (1:1)
- Nota Fiscal → Itens, Eventos

## Próximos Passos

1. Instalar Prisma: `npm install @prisma/client`
2. Instalar Prisma CLI: `npm install -D prisma`
3. Configurar DATABASE_URL no .env
4. Executar migrations: `npx prisma migrate dev --name init`
5. Gerar cliente Prisma: `npx prisma generate`

## Observações

- A modelagem suporta multi-empresa (multi-tenant)
- Todos os valores monetários usam Decimal para precisão
- Suporte completo a impostos brasileiros
- Ambiente de homologação e produção separados
- Histórico completo de eventos das notas fiscais

