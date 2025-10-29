import { PrismaClient, FinalidadeNF, TipoOperacao } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar empresa
  const empresa = await prisma.empresa.upsert({
    where: { cnpj: '12345678000190' },
    update: {},
    create: {
      razaoSocial: 'Empresa Exemplo LTDA',
      nomeFantasia: 'Empresa Exemplo',
      cnpj: '12345678000190',
      inscricaoEstadual: '123456789',
      inscricaoMunicipal: '987654321',
      regimeTributario: 'SIMPLES_NACIONAL',
      crt: 1,
      cep: '01310100',
      logradouro: 'Avenida Paulista',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      codigoMunicipio: '3550308',
      email: 'contato@empresa.com.br',
      telefone: '(11) 3000-0000',
    },
  });

  console.log('✅ Empresa criada:', empresa.nomeFantasia);

  // Criar usuário admin
  const usuario = await prisma.usuario.upsert({
    where: { email: 'admin@empresa.com.br' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@empresa.com.br',
      senha: '$2b$10$YourHashedPasswordHere', // Use bcrypt para hash da senha
      perfil: 'ADMIN',
      empresaId: empresa.id,
    },
  });

  console.log('✅ Usuário criado:', usuario.nome);

  // Criar unidades
  const unidadesData = [
    { sigla: 'UN', descricao: 'Unidade' },
    { sigla: 'KG', descricao: 'Quilograma' },
    { sigla: 'L', descricao: 'Litro' },
    { sigla: 'M', descricao: 'Metro' },
    { sigla: 'CX', descricao: 'Caixa' },
    { sigla: 'PC', descricao: 'Peça' },
    { sigla: 'MT', descricao: 'Metro' },
    { sigla: 'M2', descricao: 'Metro Quadrado' },
    { sigla: 'M3', descricao: 'Metro Cúbico' },
  ];

  for (const unidadeData of unidadesData) {
    await prisma.unidade.upsert({
      where: { sigla: unidadeData.sigla },
      update: {},
      create: unidadeData,
    });
  }

  console.log('✅ Unidades criadas');

  // Criar categorias
  const categoria1 = await prisma.categoria.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      nome: 'Eletrônicos',
      descricao: 'Produtos eletrônicos em geral',
    },
  });

  const categoria2 = await prisma.categoria.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      nome: 'Alimentos',
      descricao: 'Produtos alimentícios',
    },
  });

  console.log('✅ Categorias criadas');

  // Criar subcategorias
  await prisma.subcategoria.upsert({
    where: { id: '00000000-0000-0000-0000-000000000011' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000011',
      nome: 'Smartphones',
      descricao: 'Telefones celulares',
      categoriaId: categoria1.id,
    },
  });

  await prisma.subcategoria.upsert({
    where: { id: '00000000-0000-0000-0000-000000000012' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000012',
      nome: 'Notebooks',
      descricao: 'Computadores portáteis',
      categoriaId: categoria1.id,
    },
  });

  console.log('✅ Subcategorias criadas');

  // Criar marcas
  const marcasData = [
    { nome: 'Samsung', descricao: 'Marca Samsung' },
    { nome: 'Apple', descricao: 'Marca Apple' },
    { nome: 'Dell', descricao: 'Marca Dell' },
    { nome: 'HP', descricao: 'Marca HP' },
    { nome: 'Lenovo', descricao: 'Marca Lenovo' },
  ];

  for (const marcaData of marcasData) {
    await prisma.marca.upsert({
      where: { id: `marca-${marcaData.nome.toLowerCase()}` },
      update: {},
      create: {
        id: `marca-${marcaData.nome.toLowerCase()}`,
        ...marcaData,
      },
    });
  }

  console.log('✅ Marcas criadas');

  // Criar naturezas de operação
  const naturezasOperacao = [
    {
      codigo: '5102',
      descricao: 'Venda de mercadoria adquirida ou recebida de terceiros',
      cfop: '5102',
      finalidade: FinalidadeNF.NORMAL,
      tipo: TipoOperacao.SAIDA,
    },
    {
      codigo: '5101',
      descricao: 'Venda de produção do estabelecimento',
      cfop: '5101',
      finalidade: FinalidadeNF.NORMAL,
      tipo: TipoOperacao.SAIDA,
    },
    {
      codigo: '5405',
      descricao: 'Venda de mercadoria adquirida ou recebida de terceiros em operação com mercadoria sujeita ao regime de substituição tributária',
      cfop: '5405',
      finalidade: FinalidadeNF.NORMAL,
      tipo: TipoOperacao.SAIDA,
    },
    {
      codigo: '6102',
      descricao: 'Venda de mercadoria adquirida ou recebida de terceiros - Interestadual',
      cfop: '6102',
      finalidade: FinalidadeNF.NORMAL,
      tipo: TipoOperacao.SAIDA,
    },
  ];

  for (const natOp of naturezasOperacao) {
    await prisma.naturezaOperacao.upsert({
      where: { empresaId_codigo: { empresaId: empresa.id, codigo: natOp.codigo } },
      update: {},
      create: {
        ...natOp,
        empresaId: empresa.id,
      },
    });
  }

  console.log('✅ Naturezas de operação criadas');

  // Criar configuração NF-e
  await prisma.configuracaoNFe.upsert({
    where: { empresaId: empresa.id },
    update: {},
    create: {
      empresaId: empresa.id,
      serie: '1',
      proximoNumero: 1,
      ambiente: 'HOMOLOGACAO',
      formatoImpressao: 'RETRATO',
      usarCertificadoEmpresa: true,
    },
  });

  console.log('✅ Configuração NF-e criada');

  // Criar configuração NFC-e
  await prisma.configuracaoNFCe.upsert({
    where: { empresaId: empresa.id },
    update: {},
    create: {
      empresaId: empresa.id,
      serie: '1',
      proximoNumero: 1,
      ambiente: 'HOMOLOGACAO',
      usarCertificadoEmpresa: true,
    },
  });

  console.log('✅ Configuração NFC-e criada');

  // Criar configuração NFS-e
  await prisma.configuracaoNFSe.upsert({
    where: { empresaId: empresa.id },
    update: {},
    create: {
      empresaId: empresa.id,
      serie: '1',
      proximoNumero: 1,
      ambiente: 'HOMOLOGACAO',
      usarCertificadoEmpresa: true,
      rps: true,
      lote: false,
    },
  });

  console.log('✅ Configuração NFS-e criada');

  // Criar tipo de preço padrão
  const tipoPreco = await prisma.tipoPreco.upsert({
    where: { id: 'tipo-preco-padrao' },
    update: {},
    create: {
      id: 'tipo-preco-padrao',
      nome: 'Padrão',
      descricao: 'Lista de preços padrão',
    },
  });

  console.log('✅ Tipo de preço criado');

  // Criar cliente exemplo
  const cliente = await prisma.cliente.upsert({
    where: { cpf: '12345678900' },
    update: {},
    create: {
      tipo: 'FISICA',
      nome: 'João da Silva',
      cpf: '12345678900',
      rg: '123456789',
      rgEmissor: 'SSP',
      rgUf: 'SP',
      sexo: 'MASCULINO',
      email: 'joao@email.com',
      celular: '(11) 98765-4321',
      consumidorFinal: true,
      empresaId: empresa.id,
      tipoPrecoId: tipoPreco.id,
    },
  });

  console.log('✅ Cliente criado:', cliente.nome);

  // Criar endereço do cliente
  await prisma.enderecoCliente.create({
    data: {
      tipo: 'RESIDENCIAL',
      cep: '01310100',
      logradouro: 'Avenida Paulista',
      numero: '1500',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      codigoMunicipio: '3550308',
      principal: true,
      clienteId: cliente.id,
    },
  });

  console.log('✅ Endereço do cliente criado');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

