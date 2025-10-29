export enum TipoItem {
  PRODUTO = 'PRODUTO',
  SERVICO = 'SERVICO',
  MERCADORIA = 'MERCADORIA',
}

export interface Unidade {
  id: string;
  sigla: string;
  descricao: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  subcategorias?: Subcategoria[];
}

export interface Subcategoria {
  id: string;
  nome: string;
  descricao?: string;
  categoriaId: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoria?: Categoria;
}

export interface Marca {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TipoPreco {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrecoProduto {
  id: string;
  valor: number;
  produtoId: string;
  tipoPrecoId: string;
  tipoPreco?: TipoPreco;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComposicaoProduto {
  id: string;
  quantidade: number;
  produtoPrincipalId: string;
  produtoComponenteId: string;
  produtoComponente?: Produto;
  createdAt: Date;
  updatedAt: Date;
}

export interface Produto {
  id: string;
  codigo: string;
  codigoInterno?: string;
  codigoBalanca?: string;
  descricao: string;
  tipo: TipoItem;
  
  unidadeId: string;
  unidade?: Unidade;
  
  categoriaId?: string;
  categoria?: Categoria;
  
  subcategoriaId?: string;
  subcategoria?: Subcategoria;
  
  marcaId?: string;
  marca?: Marca;
  
  modelo?: string;
  tags: string[];
  
  // Preços
  custoUltimaCompra: number;
  precoVenda: number;
  precoAtacado: number;
  qtdeMinimaAtacado: number;
  
  // Estoque
  movimentaEstoque: boolean;
  movimentaComposicao: boolean;
  estoqueAtual: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  
  // Fiscal
  ncm?: string;
  cest?: string;
  origem?: number;
  
  // Imagem
  imagemUrl?: string;
  
  empresaId: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relações
  precos?: PrecoProduto[];
  composicao?: ComposicaoProduto[];
}

export interface CreateProdutoInput {
  codigo: string;
  codigoInterno?: string;
  codigoBalanca?: string;
  descricao: string;
  tipo: TipoItem;
  unidadeId: string;
  categoriaId?: string;
  subcategoriaId?: string;
  marcaId?: string;
  modelo?: string;
  tags?: string[];
  custoUltimaCompra?: number;
  precoVenda?: number;
  precoAtacado?: number;
  qtdeMinimaAtacado?: number;
  movimentaEstoque?: boolean;
  movimentaComposicao?: boolean;
  estoqueAtual?: number;
  estoqueMinimo?: number;
  estoqueMaximo?: number;
  ncm?: string;
  cest?: string;
  origem?: number;
  imagemUrl?: string;
  empresaId: string;
  precos?: Array<{
    tipoPrecoId: string;
    valor: number;
  }>;
  composicao?: Array<{
    produtoComponenteId: string;
    quantidade: number;
  }>;
}

export interface UpdateProdutoInput extends Partial<CreateProdutoInput> {}

