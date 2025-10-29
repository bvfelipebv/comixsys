import { api } from './api';
import type { Unidade, Categoria, Subcategoria, Marca, TipoPreco } from '../types';

export const auxiliaresService = {
  // Unidades
  unidades: {
    async getAll(): Promise<Unidade[]> {
      return api.get<Unidade[]>('/auxiliares/unidades');
    },
    async getById(id: string): Promise<Unidade> {
      return api.get<Unidade>(`/auxiliares/unidades/${id}`);
    },
    async create(data: { sigla: string; descricao: string }): Promise<Unidade> {
      return api.post<Unidade>('/auxiliares/unidades', data);
    },
    async update(id: string, data: Partial<{ sigla: string; descricao: string }>): Promise<Unidade> {
      return api.patch<Unidade>(`/auxiliares/unidades/${id}`, data);
    },
    async delete(id: string): Promise<void> {
      return api.delete<void>(`/auxiliares/unidades/${id}`);
    },
  },

  // Categorias
  categorias: {
    async getAll(): Promise<Categoria[]> {
      return api.get<Categoria[]>('/auxiliares/categorias');
    },
    async getById(id: string): Promise<Categoria> {
      return api.get<Categoria>(`/auxiliares/categorias/${id}`);
    },
    async create(data: { nome: string; descricao?: string }): Promise<Categoria> {
      return api.post<Categoria>('/auxiliares/categorias', data);
    },
    async update(id: string, data: Partial<{ nome: string; descricao?: string }>): Promise<Categoria> {
      return api.patch<Categoria>(`/auxiliares/categorias/${id}`, data);
    },
    async delete(id: string): Promise<void> {
      return api.delete<void>(`/auxiliares/categorias/${id}`);
    },
  },

  // Subcategorias
  subcategorias: {
    async getAll(categoriaId?: string): Promise<Subcategoria[]> {
      const params = categoriaId ? `?categoriaId=${categoriaId}` : '';
      return api.get<Subcategoria[]>(`/auxiliares/subcategorias${params}`);
    },
    async getById(id: string): Promise<Subcategoria> {
      return api.get<Subcategoria>(`/auxiliares/subcategorias/${id}`);
    },
    async create(data: { nome: string; descricao?: string; categoriaId: string }): Promise<Subcategoria> {
      return api.post<Subcategoria>('/auxiliares/subcategorias', data);
    },
    async update(id: string, data: Partial<{ nome: string; descricao?: string; categoriaId?: string }>): Promise<Subcategoria> {
      return api.patch<Subcategoria>(`/auxiliares/subcategorias/${id}`, data);
    },
    async delete(id: string): Promise<void> {
      return api.delete<void>(`/auxiliares/subcategorias/${id}`);
    },
  },

  // Marcas
  marcas: {
    async getAll(): Promise<Marca[]> {
      return api.get<Marca[]>('/auxiliares/marcas');
    },
    async getById(id: string): Promise<Marca> {
      return api.get<Marca>(`/auxiliares/marcas/${id}`);
    },
    async create(data: { nome: string; descricao?: string }): Promise<Marca> {
      return api.post<Marca>('/auxiliares/marcas', data);
    },
    async update(id: string, data: Partial<{ nome: string; descricao?: string }>): Promise<Marca> {
      return api.patch<Marca>(`/auxiliares/marcas/${id}`, data);
    },
    async delete(id: string): Promise<void> {
      return api.delete<void>(`/auxiliares/marcas/${id}`);
    },
  },

  // Tipos de Preço
  tiposPreco: {
    async getAll(): Promise<TipoPreco[]> {
      return api.get<TipoPreco[]>('/auxiliares/tipos-preco');
    },
    async getById(id: string): Promise<TipoPreco> {
      return api.get<TipoPreco>(`/auxiliares/tipos-preco/${id}`);
    },
    async create(data: { nome: string; descricao?: string }): Promise<TipoPreco> {
      return api.post<TipoPreco>('/auxiliares/tipos-preco', data);
    },
    async update(id: string, data: Partial<{ nome: string; descricao?: string }>): Promise<TipoPreco> {
      return api.patch<TipoPreco>(`/auxiliares/tipos-preco/${id}`, data);
    },
    async delete(id: string): Promise<void> {
      return api.delete<void>(`/auxiliares/tipos-preco/${id}`);
    },
  },
};

