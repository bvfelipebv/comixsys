import { api } from './api';
import type { Produto, CreateProdutoInput, UpdateProdutoInput } from '../types';

export const produtoService = {
  async getAll(empresaId: string, ativo?: boolean): Promise<Produto[]> {
    const params = new URLSearchParams({ empresaId });
    if (ativo !== undefined) {
      params.append('ativo', String(ativo));
    }
    return api.get<Produto[]>(`/produtos?${params.toString()}`);
  },

  async getById(id: string): Promise<Produto> {
    return api.get<Produto>(`/produtos/${id}`);
  },

  async getByCodigo(codigo: string): Promise<Produto> {
    return api.get<Produto>(`/produtos/codigo/${codigo}`);
  },

  async getEstoqueBaixo(empresaId: string): Promise<Produto[]> {
    return api.get<Produto[]>(`/produtos/estoque-baixo?empresaId=${empresaId}`);
  },

  async create(data: CreateProdutoInput): Promise<Produto> {
    return api.post<Produto>('/produtos', data);
  },

  async update(id: string, data: UpdateProdutoInput): Promise<Produto> {
    return api.patch<Produto>(`/produtos/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete<void>(`/produtos/${id}`);
  },

  async restore(id: string): Promise<Produto> {
    return api.patch<Produto>(`/produtos/${id}/restore`, {});
  },

  async updateEstoque(
    id: string,
    quantidade: number,
    operacao: 'adicionar' | 'remover'
  ): Promise<Produto> {
    return api.patch<Produto>(`/produtos/${id}/estoque`, { quantidade, operacao });
  },
};

