import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TipoItem {
  PRODUTO = 'PRODUTO',
  SERVICO = 'SERVICO',
  MERCADORIA = 'MERCADORIA',
}

export class CreatePrecoProdutoDto {
  @IsString()
  tipoPrecoId: string;

  @IsNumber()
  valor: number;
}

export class CreateComposicaoDto {
  @IsString()
  produtoComponenteId: string;

  @IsNumber()
  quantidade: number;
}

export class CreateProdutoDto {
  @IsString()
  codigo: string;

  @IsString()
  @IsOptional()
  codigoInterno?: string;

  @IsString()
  @IsOptional()
  codigoBalanca?: string;

  @IsString()
  descricao: string;

  @IsEnum(TipoItem)
  tipo: TipoItem;

  @IsString()
  unidadeId: string;

  @IsString()
  @IsOptional()
  categoriaId?: string;

  @IsString()
  @IsOptional()
  subcategoriaId?: string;

  @IsString()
  @IsOptional()
  marcaId?: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  // Preços
  @IsNumber()
  @IsOptional()
  custoUltimaCompra?: number;

  @IsNumber()
  @IsOptional()
  precoVenda?: number;

  @IsNumber()
  @IsOptional()
  precoAtacado?: number;

  @IsInt()
  @IsOptional()
  qtdeMinimaAtacado?: number;

  // Estoque
  @IsBoolean()
  @IsOptional()
  movimentaEstoque?: boolean;

  @IsBoolean()
  @IsOptional()
  movimentaComposicao?: boolean;

  @IsNumber()
  @IsOptional()
  estoqueAtual?: number;

  @IsNumber()
  @IsOptional()
  estoqueMinimo?: number;

  @IsNumber()
  @IsOptional()
  estoqueMaximo?: number;

  // Fiscal
  @IsString()
  @IsOptional()
  ncm?: string;

  @IsString()
  @IsOptional()
  cest?: string;

  @IsInt()
  @IsOptional()
  origem?: number;

  // Imagem
  @IsString()
  @IsOptional()
  imagemUrl?: string;

  @IsString()
  empresaId: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  // Preços personalizados
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrecoProdutoDto)
  @IsOptional()
  precos?: CreatePrecoProdutoDto[];

  // Composição
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateComposicaoDto)
  @IsOptional()
  composicao?: CreateComposicaoDto[];
}

