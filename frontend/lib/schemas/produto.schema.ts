import { z } from 'zod';
import { TipoItem } from '../types';

export const produtoSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  codigoInterno: z.string().optional(),
  codigoBalanca: z.string().optional(),
  descricao: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
  tipo: z.nativeEnum(TipoItem),
  
  unidadeId: z.string().uuid('Unidade é obrigatória'),
  categoriaId: z.string().uuid().optional(),
  subcategoriaId: z.string().uuid().optional(),
  marcaId: z.string().uuid().optional(),
  
  modelo: z.string().optional(),
  tags: z.array(z.string()).optional(),
  
  // Preços
  custoUltimaCompra: z.number().min(0).optional(),
  precoVenda: z.number().min(0).optional(),
  precoAtacado: z.number().min(0).optional(),
  qtdeMinimaAtacado: z.number().int().min(0).optional(),
  
  // Estoque
  movimentaEstoque: z.boolean().optional(),
  movimentaComposicao: z.boolean().optional(),
  estoqueAtual: z.number().min(0).optional(),
  estoqueMinimo: z.number().min(0).optional(),
  estoqueMaximo: z.number().min(0).optional(),
  
  // Fiscal
  ncm: z.string().optional(),
  cest: z.string().optional(),
  origem: z.number().int().min(0).max(8).optional(),
  
  // Imagem
  imagemUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  
  empresaId: z.string().uuid(),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;

