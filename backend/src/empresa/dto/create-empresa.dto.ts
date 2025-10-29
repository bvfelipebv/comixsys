import { IsString, IsEmail, IsEnum, IsOptional, IsInt, IsBoolean, IsDateString, Length, Matches } from 'class-validator';

export enum RegimeTributario {
  SIMPLES_NACIONAL = 'SIMPLES_NACIONAL',
  SIMPLES_NACIONAL_EXCESSO = 'SIMPLES_NACIONAL_EXCESSO',
  REGIME_NORMAL = 'REGIME_NORMAL',
  MEI = 'MEI',
}

export class CreateEmpresaDto {
  @IsString()
  razaoSocial: string;

  @IsString()
  @IsOptional()
  nomeFantasia?: string;

  @IsString()
  @Length(14, 14)
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter 14 dígitos' })
  cnpj: string;

  @IsString()
  @IsOptional()
  inscricaoEstadual?: string;

  @IsString()
  @IsOptional()
  inscricaoMunicipal?: string;

  @IsEnum(RegimeTributario)
  regimeTributario: RegimeTributario;

  @IsInt()
  crt: number;

  // Endereço
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
  codigoMunicipio: string;

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

  @IsString()
  @IsOptional()
  site?: string;

  // Certificado Digital
  @IsOptional()
  certificadoDigital?: Buffer;

  @IsString()
  @IsOptional()
  senhaCertificado?: string;

  @IsDateString()
  @IsOptional()
  validadeCertificado?: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}

