-- CreateEnum
CREATE TYPE "regime_tributario" AS ENUM ('SIMPLES_NACIONAL', 'SIMPLES_NACIONAL_EXCESSO', 'REGIME_NORMAL', 'MEI');

-- CreateEnum
CREATE TYPE "perfil_usuario" AS ENUM ('ADMIN', 'GERENTE', 'VENDEDOR', 'OPERADOR');

-- CreateEnum
CREATE TYPE "tipo_pessoa" AS ENUM ('FISICA', 'JURIDICA');

-- CreateEnum
CREATE TYPE "sexo" AS ENUM ('MASCULINO', 'FEMININO', 'OUTRO');

-- CreateEnum
CREATE TYPE "tipo_endereco" AS ENUM ('RESIDENCIAL', 'COMERCIAL', 'COBRANCA', 'ENTREGA', 'OUTRO');

-- CreateEnum
CREATE TYPE "tipo_conta" AS ENUM ('CORRENTE', 'POUPANCA', 'SALARIO');

-- CreateEnum
CREATE TYPE "tipo_item" AS ENUM ('PRODUTO', 'SERVICO', 'MERCADORIA');

-- CreateEnum
CREATE TYPE "tipo_venda" AS ENUM ('ORCAMENTO', 'PEDIDO', 'VENDA');

-- CreateEnum
CREATE TYPE "status_venda" AS ENUM ('ABERTA', 'APROVADA', 'FATURADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "modelo_nf" AS ENUM ('NFE', 'NFCE', 'NFSE', 'CTE', 'MDFE');

-- CreateEnum
CREATE TYPE "tipo_operacao" AS ENUM ('ENTRADA', 'SAIDA');

-- CreateEnum
CREATE TYPE "finalidade_nf" AS ENUM ('NORMAL', 'COMPLEMENTAR', 'AJUSTE', 'DEVOLUCAO');

-- CreateEnum
CREATE TYPE "status_nf" AS ENUM ('DIGITACAO', 'VALIDADA', 'ASSINADA', 'ENVIADA', 'AUTORIZADA', 'REJEITADA', 'CANCELADA', 'DENEGADA');

-- CreateEnum
CREATE TYPE "ambiente_nf" AS ENUM ('PRODUCAO', 'HOMOLOGACAO');

-- CreateEnum
CREATE TYPE "tipo_evento" AS ENUM ('CANCELAMENTO', 'CARTA_CORRECAO', 'CONFIRMACAO_OPERACAO', 'CIENCIA_OPERACAO', 'DESCONHECIMENTO_OPERACAO', 'OPERACAO_NAO_REALIZADA');

-- CreateEnum
CREATE TYPE "formato_danfe" AS ENUM ('RETRATO', 'PAISAGEM', 'SIMPLIFICADO');

-- CreateEnum
CREATE TYPE "tipo_contingencia" AS ENUM ('SVC_AN', 'SVC_RS', 'OFFLINE');

-- CreateEnum
CREATE TYPE "tipo_imposto" AS ENUM ('ICMS', 'ICMS_ST', 'IPI', 'PIS', 'COFINS', 'ISS', 'ISSQN', 'CSLL', 'IRPJ');

-- CreateTable
CREATE TABLE "empresas" (
    "id" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "nomeFantasia" TEXT,
    "cnpj" TEXT NOT NULL,
    "inscricaoEstadual" TEXT,
    "inscricaoMunicipal" TEXT,
    "regimeTributario" "regime_tributario" NOT NULL,
    "crt" INTEGER NOT NULL,
    "cep" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "codigoMunicipio" TEXT NOT NULL,
    "telefone" TEXT,
    "celular" TEXT,
    "email" TEXT,
    "site" TEXT,
    "certificadoDigital" BYTEA,
    "senhaCertificado" TEXT,
    "validadeCertificado" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "perfil" "perfil_usuario" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "empresaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "tipo" "tipo_pessoa" NOT NULL,
    "nome" TEXT NOT NULL,
    "apelido" TEXT,
    "cpf" TEXT,
    "rg" TEXT,
    "rgEmissor" TEXT,
    "rgUf" TEXT,
    "sexo" "sexo",
    "dataNascimento" TIMESTAMP(3),
    "razaoSocial" TEXT,
    "nomeFantasia" TEXT,
    "cnpj" TEXT,
    "inscricaoEstadual" TEXT,
    "inscricaoMunicipal" TEXT,
    "indicadorIE" INTEGER NOT NULL DEFAULT 9,
    "telefone" TEXT,
    "celular" TEXT,
    "email" TEXT,
    "emailNFe" TEXT,
    "site" TEXT,
    "issRetido" BOOLEAN NOT NULL DEFAULT false,
    "consumidorFinal" BOOLEAN NOT NULL DEFAULT true,
    "produtorRural" BOOLEAN NOT NULL DEFAULT false,
    "limiteCredito" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,
    "observacao" TEXT,
    "empresaId" TEXT NOT NULL,
    "tipoPrecoId" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enderecos_clientes" (
    "id" TEXT NOT NULL,
    "tipo" "tipo_endereco" NOT NULL,
    "cep" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "codigoMunicipio" TEXT,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "clienteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enderecos_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contatos_clientes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cargo" TEXT,
    "telefone" TEXT,
    "celular" TEXT,
    "email" TEXT,
    "clienteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contatos_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dados_bancarios_clientes" (
    "id" TEXT NOT NULL,
    "banco" TEXT NOT NULL,
    "agencia" TEXT NOT NULL,
    "conta" TEXT NOT NULL,
    "tipoConta" "tipo_conta" NOT NULL,
    "clienteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dados_bancarios_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_precos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_precos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "codigoInterno" TEXT,
    "codigoBalanca" TEXT,
    "descricao" TEXT NOT NULL,
    "tipo" "tipo_item" NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "categoriaId" TEXT,
    "subcategoriaId" TEXT,
    "marcaId" TEXT,
    "modelo" TEXT,
    "tags" TEXT[],
    "custoUltimaCompra" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "precoVenda" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "precoAtacado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "qtdeMinimaAtacado" INTEGER NOT NULL DEFAULT 0,
    "movimentaEstoque" BOOLEAN NOT NULL DEFAULT true,
    "movimentaComposicao" BOOLEAN NOT NULL DEFAULT false,
    "estoqueAtual" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "estoqueMinimo" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "estoqueMaximo" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "ncm" TEXT,
    "cest" TEXT,
    "origem" INTEGER,
    "imagemUrl" TEXT,
    "empresaId" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "precos_produtos" (
    "id" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "produtoId" TEXT NOT NULL,
    "tipoPrecoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "precos_produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "composicao_produtos" (
    "id" TEXT NOT NULL,
    "quantidade" DECIMAL(10,3) NOT NULL,
    "produtoPrincipalId" TEXT NOT NULL,
    "produtoComponenteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "composicao_produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades" (
    "id" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategorias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "categoriaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subcategorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendas" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "tipo" "tipo_venda" NOT NULL,
    "status" "status_venda" NOT NULL,
    "clienteId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "desconto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "acrescimo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "observacao" TEXT,
    "observacaoInterna" TEXT,
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataValidade" TIMESTAMP(3),
    "dataFechamento" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_vendas" (
    "id" TEXT NOT NULL,
    "sequencia" INTEGER NOT NULL,
    "produtoId" TEXT NOT NULL,
    "vendaId" TEXT NOT NULL,
    "quantidade" DECIMAL(10,3) NOT NULL,
    "valorUnitario" DECIMAL(10,2) NOT NULL,
    "desconto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "acrescimo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itens_vendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notas_fiscais" (
    "id" TEXT NOT NULL,
    "modelo" "modelo_nf" NOT NULL,
    "serie" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "chave" TEXT,
    "codigoNumerico" TEXT,
    "digitoVerificador" INTEGER,
    "tipo" "tipo_operacao" NOT NULL,
    "finalidade" "finalidade_nf" NOT NULL,
    "tipoEmissao" INTEGER NOT NULL DEFAULT 1,
    "tipoImpressao" INTEGER NOT NULL DEFAULT 1,
    "destinoOperacao" INTEGER NOT NULL DEFAULT 1,
    "indicadorPresenca" INTEGER NOT NULL DEFAULT 1,
    "indicadorFinal" INTEGER NOT NULL DEFAULT 1,
    "clienteId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "vendaId" TEXT,
    "naturezaOperacaoId" TEXT NOT NULL,
    "valorProdutos" DECIMAL(10,2) NOT NULL,
    "valorDesconto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorFrete" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorSeguro" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorOutrasDespesas" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "baseCalculoICMS" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorICMS" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorICMSDeson" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorFCP" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "baseCalculoICMSST" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorICMSST" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorFCPST" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorFCPSTRet" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorII" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorIPI" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorIPIDevol" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorPIS" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorCOFINS" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorISS" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "status_nf" NOT NULL,
    "statusSefaz" TEXT,
    "motivoRejeicao" TEXT,
    "protocolo" TEXT,
    "dataAutorizacao" TIMESTAMP(3),
    "cancelada" BOOLEAN NOT NULL DEFAULT false,
    "motivoCancelamento" TEXT,
    "dataCancelamento" TIMESTAMP(3),
    "protocoloCancelamento" TEXT,
    "informacoesComplementares" TEXT,
    "informacoesFisco" TEXT,
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataSaida" TIMESTAMP(3),
    "ambiente" "ambiente_nf" NOT NULL DEFAULT 'HOMOLOGACAO',
    "modalidadeFrete" INTEGER NOT NULL DEFAULT 0,
    "numeroFatura" TEXT,
    "valorOriginalFatura" DECIMAL(10,2),
    "valorLiquidoFatura" DECIMAL(10,2),
    "cnpjRespTec" TEXT,
    "contatoRespTec" TEXT,
    "emailRespTec" TEXT,
    "foneRespTec" TEXT,
    "versaoProcesso" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notas_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_notas_fiscais" (
    "id" TEXT NOT NULL,
    "sequencia" INTEGER NOT NULL,
    "produtoId" TEXT NOT NULL,
    "notaFiscalId" TEXT NOT NULL,
    "codigoProduto" TEXT NOT NULL,
    "codigoEAN" TEXT DEFAULT 'SEM GTIN',
    "descricao" TEXT NOT NULL,
    "ncm" TEXT,
    "cest" TEXT,
    "cfop" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "unidadeTributavel" TEXT,
    "quantidade" DECIMAL(10,4) NOT NULL,
    "quantidadeTributavel" DECIMAL(10,4),
    "valorUnitario" DECIMAL(10,10) NOT NULL,
    "valorUnitarioTributavel" DECIMAL(10,10),
    "valorDesconto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorFrete" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorSeguro" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorOutrasDespesas" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "indicadorTotal" INTEGER NOT NULL DEFAULT 1,
    "origem" INTEGER NOT NULL,
    "cstICMS" TEXT,
    "csosn" TEXT,
    "modalidadeBC" INTEGER,
    "baseCalculoICMS" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "aliquotaICMS" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "valorICMS" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "percentualCredSN" DECIMAL(5,4),
    "valorCredICMSSN" DECIMAL(10,2),
    "modalidadeBCST" INTEGER,
    "baseCalculoICMSST" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "aliquotaICMSST" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "valorICMSST" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "cstIPI" TEXT,
    "codigoEnquadramento" TEXT DEFAULT '999',
    "baseCalculoIPI" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "aliquotaIPI" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "valorIPI" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "cstPIS" TEXT,
    "baseCalculoPIS" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "aliquotaPIS" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "valorPIS" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "cstCOFINS" TEXT,
    "baseCalculoCOFINS" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "aliquotaCOFINS" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "valorCOFINS" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "aliquotaISS" DECIMAL(5,4),
    "valorISS" DECIMAL(10,2),
    "codigoServico" TEXT,
    "codigoTributacao" TEXT,
    "informacoesAdicionais" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itens_notas_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veiculos_notas_fiscais" (
    "id" TEXT NOT NULL,
    "itemNotaFiscalId" TEXT NOT NULL,
    "tipoOperacao" INTEGER NOT NULL,
    "chassi" TEXT NOT NULL,
    "codigoCor" TEXT NOT NULL,
    "descricaoCor" TEXT NOT NULL,
    "potenciaMotor" INTEGER NOT NULL DEFAULT 0,
    "cilindradas" INTEGER NOT NULL DEFAULT 0,
    "pesoLiquido" DECIMAL(10,4) NOT NULL,
    "pesoBruto" DECIMAL(10,4) NOT NULL,
    "numeroSerie" TEXT NOT NULL DEFAULT '0',
    "tipoCombustivel" INTEGER NOT NULL,
    "numeroMotor" TEXT NOT NULL DEFAULT '0',
    "cmt" DECIMAL(10,4) NOT NULL,
    "distanciaEixos" DECIMAL(10,2) NOT NULL,
    "anoModelo" INTEGER NOT NULL,
    "anoFabricacao" INTEGER NOT NULL,
    "tipoPintura" TEXT NOT NULL,
    "tipoVeiculo" INTEGER NOT NULL,
    "especieVeiculo" INTEGER NOT NULL,
    "condicaoVIN" TEXT NOT NULL,
    "condicaoVeiculo" INTEGER NOT NULL,
    "codigoMarcaModelo" TEXT,
    "codigoCorDENATRAN" INTEGER NOT NULL,
    "lotacaoMaxima" INTEGER NOT NULL DEFAULT 0,
    "restricao" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "veiculos_notas_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "duplicatas_notas_fiscais" (
    "id" TEXT NOT NULL,
    "notaFiscalId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "duplicatas_notas_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos_notas_fiscais" (
    "id" TEXT NOT NULL,
    "notaFiscalId" TEXT NOT NULL,
    "indicadorPagamento" INTEGER NOT NULL,
    "meioPagamento" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "cnpjCredenciadora" TEXT,
    "bandeira" TEXT,
    "numeroAutorizacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagamentos_notas_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_notas_fiscais" (
    "id" TEXT NOT NULL,
    "tipo" "tipo_evento" NOT NULL,
    "sequencia" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "justificativa" TEXT,
    "notaFiscalId" TEXT NOT NULL,
    "protocolo" TEXT,
    "dataEvento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_notas_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naturezas_operacao" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "cfop" TEXT NOT NULL,
    "finalidade" "finalidade_nf" NOT NULL,
    "tipo" "tipo_operacao" NOT NULL,
    "empresaId" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naturezas_operacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracoes_nfe" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "serie" TEXT NOT NULL DEFAULT '1',
    "proximoNumero" INTEGER NOT NULL DEFAULT 1,
    "ambiente" "ambiente_nf" NOT NULL DEFAULT 'HOMOLOGACAO',
    "usarCertificadoEmpresa" BOOLEAN NOT NULL DEFAULT true,
    "certificadoDigital" BYTEA,
    "senhaCertificado" TEXT,
    "formatoImpressao" "formato_danfe" NOT NULL DEFAULT 'RETRATO',
    "emailCopia" TEXT,
    "tipoContingencia" "tipo_contingencia",
    "justificativaContingencia" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_nfe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracoes_nfce" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "serie" TEXT NOT NULL DEFAULT '1',
    "proximoNumero" INTEGER NOT NULL DEFAULT 1,
    "ambiente" "ambiente_nf" NOT NULL DEFAULT 'HOMOLOGACAO',
    "usarCertificadoEmpresa" BOOLEAN NOT NULL DEFAULT true,
    "certificadoDigital" BYTEA,
    "senhaCertificado" TEXT,
    "idToken" TEXT,
    "csc" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_nfce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracoes_nfse" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "serie" TEXT NOT NULL DEFAULT '1',
    "proximoNumero" INTEGER NOT NULL DEFAULT 1,
    "ambiente" "ambiente_nf" NOT NULL DEFAULT 'HOMOLOGACAO',
    "usarCertificadoEmpresa" BOOLEAN NOT NULL DEFAULT true,
    "certificadoDigital" BYTEA,
    "senhaCertificado" TEXT,
    "rps" BOOLEAN NOT NULL DEFAULT true,
    "lote" BOOLEAN NOT NULL DEFAULT false,
    "provedor" TEXT,
    "usuario" TEXT,
    "senha" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_nfse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matriz_fiscal" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoImposto" "tipo_imposto" NOT NULL,
    "aplicaServico" BOOLEAN NOT NULL DEFAULT false,
    "regimeFiscal" "regime_tributario" NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "modeloNF" "modelo_nf",
    "utilizarHomologacao" BOOLEAN NOT NULL DEFAULT false,
    "empresaId" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matriz_fiscal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filtros_matriz_fiscal" (
    "id" TEXT NOT NULL,
    "matrizFiscalId" TEXT NOT NULL,
    "produtoId" TEXT,
    "cfop" TEXT,
    "tipoItem" "tipo_item",
    "ncm" TEXT,
    "atividadePrincipal" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "filtros_matriz_fiscal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "definicoes_fiscais_matriz" (
    "id" TEXT NOT NULL,
    "matrizFiscalId" TEXT NOT NULL,
    "cst" TEXT,
    "csosn" TEXT,
    "modalidadeBC" INTEGER,
    "modalidadeBCST" INTEGER,
    "percentualReducaoBC" DECIMAL(5,2),
    "percentualReducaoBCST" DECIMAL(5,2),
    "percentualMVA" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "definicoes_fiscais_matriz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aliquotas_matriz_fiscal" (
    "id" TEXT NOT NULL,
    "matrizFiscalId" TEXT NOT NULL,
    "aliquota" DECIMAL(5,4) NOT NULL,
    "codigoAtividade" TEXT,
    "codigoItemListaServico" TEXT,
    "codigoTributacao" TEXT,
    "cnae" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aliquotas_matriz_fiscal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "empresas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cpf_key" ON "clientes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cnpj_key" ON "clientes"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_codigo_key" ON "produtos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "precos_produtos_produtoId_tipoPrecoId_key" ON "precos_produtos"("produtoId", "tipoPrecoId");

-- CreateIndex
CREATE UNIQUE INDEX "unidades_sigla_key" ON "unidades"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "vendas_numero_key" ON "vendas"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "notas_fiscais_chave_key" ON "notas_fiscais"("chave");

-- CreateIndex
CREATE UNIQUE INDEX "notas_fiscais_vendaId_key" ON "notas_fiscais"("vendaId");

-- CreateIndex
CREATE UNIQUE INDEX "veiculos_notas_fiscais_itemNotaFiscalId_key" ON "veiculos_notas_fiscais"("itemNotaFiscalId");

-- CreateIndex
CREATE UNIQUE INDEX "naturezas_operacao_empresaId_codigo_key" ON "naturezas_operacao"("empresaId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "configuracoes_nfe_empresaId_key" ON "configuracoes_nfe"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "configuracoes_nfce_empresaId_key" ON "configuracoes_nfce"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "configuracoes_nfse_empresaId_key" ON "configuracoes_nfse"("empresaId");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_tipoPrecoId_fkey" FOREIGN KEY ("tipoPrecoId") REFERENCES "tipos_precos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enderecos_clientes" ADD CONSTRAINT "enderecos_clientes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contatos_clientes" ADD CONSTRAINT "contatos_clientes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dados_bancarios_clientes" ADD CONSTRAINT "dados_bancarios_clientes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_subcategoriaId_fkey" FOREIGN KEY ("subcategoriaId") REFERENCES "subcategorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "marcas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precos_produtos" ADD CONSTRAINT "precos_produtos_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precos_produtos" ADD CONSTRAINT "precos_produtos_tipoPrecoId_fkey" FOREIGN KEY ("tipoPrecoId") REFERENCES "tipos_precos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "composicao_produtos" ADD CONSTRAINT "composicao_produtos_produtoPrincipalId_fkey" FOREIGN KEY ("produtoPrincipalId") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "composicao_produtos" ADD CONSTRAINT "composicao_produtos_produtoComponenteId_fkey" FOREIGN KEY ("produtoComponenteId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategorias" ADD CONSTRAINT "subcategorias_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_vendas" ADD CONSTRAINT "itens_vendas_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_vendas" ADD CONSTRAINT "itens_vendas_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "vendas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "vendas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_naturezaOperacaoId_fkey" FOREIGN KEY ("naturezaOperacaoId") REFERENCES "naturezas_operacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_notas_fiscais" ADD CONSTRAINT "itens_notas_fiscais_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_notas_fiscais" ADD CONSTRAINT "itens_notas_fiscais_notaFiscalId_fkey" FOREIGN KEY ("notaFiscalId") REFERENCES "notas_fiscais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculos_notas_fiscais" ADD CONSTRAINT "veiculos_notas_fiscais_itemNotaFiscalId_fkey" FOREIGN KEY ("itemNotaFiscalId") REFERENCES "itens_notas_fiscais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duplicatas_notas_fiscais" ADD CONSTRAINT "duplicatas_notas_fiscais_notaFiscalId_fkey" FOREIGN KEY ("notaFiscalId") REFERENCES "notas_fiscais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos_notas_fiscais" ADD CONSTRAINT "pagamentos_notas_fiscais_notaFiscalId_fkey" FOREIGN KEY ("notaFiscalId") REFERENCES "notas_fiscais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_notas_fiscais" ADD CONSTRAINT "eventos_notas_fiscais_notaFiscalId_fkey" FOREIGN KEY ("notaFiscalId") REFERENCES "notas_fiscais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naturezas_operacao" ADD CONSTRAINT "naturezas_operacao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracoes_nfe" ADD CONSTRAINT "configuracoes_nfe_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracoes_nfce" ADD CONSTRAINT "configuracoes_nfce_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracoes_nfse" ADD CONSTRAINT "configuracoes_nfse_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriz_fiscal" ADD CONSTRAINT "matriz_fiscal_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filtros_matriz_fiscal" ADD CONSTRAINT "filtros_matriz_fiscal_matrizFiscalId_fkey" FOREIGN KEY ("matrizFiscalId") REFERENCES "matriz_fiscal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "definicoes_fiscais_matriz" ADD CONSTRAINT "definicoes_fiscais_matriz_matrizFiscalId_fkey" FOREIGN KEY ("matrizFiscalId") REFERENCES "matriz_fiscal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aliquotas_matriz_fiscal" ADD CONSTRAINT "aliquotas_matriz_fiscal_matrizFiscalId_fkey" FOREIGN KEY ("matrizFiscalId") REFERENCES "matriz_fiscal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
