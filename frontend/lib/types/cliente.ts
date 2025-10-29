export enum TipoPessoa {
  FISICA = 'FISICA',
  JURIDICA = 'JURIDICA',
}

export enum Sexo {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  OUTRO = 'OUTRO',
}

export enum TipoEndereco {
  RESIDENCIAL = 'RESIDENCIAL',
  COMERCIAL = 'COMERCIAL',
  COBRANCA = 'COBRANCA',
  ENTREGA = 'ENTREGA',
  OUTRO = 'OUTRO',
}

export interface EnderecoCliente {
  id: string;
  tipo: TipoEndereco;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  codigoMunicipio?: string;
  principal: boolean;
  clienteId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cliente {
  id: string;
  tipo: TipoPessoa;
  
  // Pessoa Física
  nome: string;
  apelido?: string;
  cpf?: string;
  rg?: string;
  rgEmissor?: string;
  rgUf?: string;
  sexo?: Sexo;
  dataNascimento?: Date;
  
  // Pessoa Jurídica
  razaoSocial?: string;
  nomeFantasia?: string;
  cnpj?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  indicadorIE: number;
  
  // Contato
  telefone?: string;
  celular?: string;
  email?: string;
  emailNFe?: string;
  site?: string;
  
  // Fiscal
  issRetido: boolean;
  consumidorFinal: boolean;
  produtorRural: boolean;
  
  // Financeiro
  limiteCredito: number;
  bloqueado: boolean;
  
  observacao?: string;
  
  empresaId: string;
  tipoPrecoId?: string;
  
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relações
  enderecos?: EnderecoCliente[];
  tipoPreco?: any;
}

export interface CreateClienteInput {
  tipo: TipoPessoa;
  nome: string;
  apelido?: string;
  cpf?: string;
  rg?: string;
  rgEmissor?: string;
  rgUf?: string;
  sexo?: Sexo;
  dataNascimento?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  cnpj?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  indicadorIE?: number;
  telefone?: string;
  celular?: string;
  email?: string;
  emailNFe?: string;
  site?: string;
  issRetido?: boolean;
  consumidorFinal?: boolean;
  produtorRural?: boolean;
  limiteCredito?: number;
  bloqueado?: boolean;
  observacao?: string;
  empresaId: string;
  tipoPrecoId?: string;
  enderecos?: Array<{
    tipo: TipoEndereco;
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    codigoMunicipio?: string;
    principal?: boolean;
  }>;
}

export interface UpdateClienteInput extends Partial<CreateClienteInput> {}

