export enum RegimeTributario {
  SIMPLES_NACIONAL = 'SIMPLES_NACIONAL',
  SIMPLES_NACIONAL_EXCESSO = 'SIMPLES_NACIONAL_EXCESSO',
  REGIME_NORMAL = 'REGIME_NORMAL',
  MEI = 'MEI',
}

export interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  regimeTributario: RegimeTributario;
  crt: number;
  
  // Endereço
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  codigoMunicipio: string;
  
  // Contato
  telefone?: string;
  celular?: string;
  email?: string;
  site?: string;
  
  // Certificado Digital
  certificadoDigital?: Buffer;
  senhaCertificado?: string;
  validadeCertificado?: Date;
  
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmpresaInput {
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  regimeTributario: RegimeTributario;
  crt: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  codigoMunicipio: string;
  telefone?: string;
  celular?: string;
  email?: string;
  site?: string;
}

export interface UpdateEmpresaInput extends Partial<CreateEmpresaInput> {}

