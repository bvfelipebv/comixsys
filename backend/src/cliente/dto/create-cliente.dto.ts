import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsInt,
  ValidateNested,
  IsArray,
  Length,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class CreateEnderecoDto {
  @IsEnum(TipoEndereco)
  tipo: TipoEndereco;

  @IsString()
  cep: string;

  @IsString()
  logradouro: string;

  @IsString()
  numero: string;

  @IsString()
  @IsOptional()
  complemento?: string;

  @IsString()
  bairro: string;

  @IsString()
  cidade: string;

  @IsString()
  @Length(2, 2)
  uf: string;

  @IsString()
  @IsOptional()
  codigoMunicipio?: string;

  @IsBoolean()
  @IsOptional()
  principal?: boolean;
}

export class CreateClienteDto {
  @IsEnum(TipoPessoa)
  tipo: TipoPessoa;

  // Pessoa Física
  @IsString()
  nome: string;

  @IsString()
  @IsOptional()
  apelido?: string;

  @IsString()
  @IsOptional()
  @Length(11, 11)
  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos' })
  cpf?: string;

  @IsString()
  @IsOptional()
  rg?: string;

  @IsString()
  @IsOptional()
  rgEmissor?: string;

  @IsString()
  @IsOptional()
  @Length(2, 2)
  rgUf?: string;

  @IsEnum(Sexo)
  @IsOptional()
  sexo?: Sexo;

  @IsDateString()
  @IsOptional()
  dataNascimento?: string;

  // Pessoa Jurídica
  @IsString()
  @IsOptional()
  razaoSocial?: string;

  @IsString()
  @IsOptional()
  nomeFantasia?: string;

  @IsString()
  @IsOptional()
  @Length(14, 14)
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter 14 dígitos' })
  cnpj?: string;

  @IsString()
  @IsOptional()
  inscricaoEstadual?: string;

  @IsString()
  @IsOptional()
  inscricaoMunicipal?: string;

  @IsInt()
  @IsOptional()
  indicadorIE?: number;

  // Contato
  @IsString()
  @IsOptional()
  telefone?: string;

  @IsString()
  @IsOptional()
  celular?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEmail()
  @IsOptional()
  emailNFe?: string;

  @IsString()
  @IsOptional()
  site?: string;

  // Fiscal
  @IsBoolean()
  @IsOptional()
  issRetido?: boolean;

  @IsBoolean()
  @IsOptional()
  consumidorFinal?: boolean;

  @IsBoolean()
  @IsOptional()
  produtorRural?: boolean;

  // Financeiro
  @IsNumber()
  @IsOptional()
  limiteCredito?: number;

  @IsBoolean()
  @IsOptional()
  bloqueado?: boolean;

  @IsString()
  @IsOptional()
  observacao?: string;

  @IsString()
  empresaId: string;

  @IsString()
  @IsOptional()
  tipoPrecoId?: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  // Endereços
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEnderecoDto)
  @IsOptional()
  enderecos?: CreateEnderecoDto[];
}

