import { api } from './api';
import type { Cliente, CreateClienteInput, UpdateClienteInput } from '../types';

export const clienteService = {
  async getAll(empresaId: string, ativo?: boolean): Promise<Cliente[]> {
    const params = new URLSearchParams({ empresaId });
    if (ativo !== undefined) {
      params.append('ativo', String(ativo));
    }
    return api.get<Cliente[]>(`/clientes?${params.toString()}`);
  },

  async getById(id: string): Promise<Cliente> {
    return api.get<Cliente>(`/clientes/${id}`);
  },

  async getByCpf(cpf: string): Promise<Cliente> {
    return api.get<Cliente>(`/clientes/cpf/${cpf}`);
  },

  async getByCnpj(cnpj: string): Promise<Cliente> {
    return api.get<Cliente>(`/clientes/cnpj/${cnpj}`);
  },

  async create(data: CreateClienteInput): Promise<Cliente> {
    return api.post<Cliente>('/clientes', data);
  },

  async update(id: string, data: UpdateClienteInput): Promise<Cliente> {
    return api.patch<Cliente>(`/clientes/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete<void>(`/clientes/${id}`);
  },

  async restore(id: string): Promise<Cliente> {
    return api.patch<Cliente>(`/clientes/${id}/restore`, {});
  },

  // Endereços
  async addEndereco(clienteId: string, endereco: any): Promise<any> {
    return api.post(`/clientes/${clienteId}/enderecos`, endereco);
  },

  async updateEndereco(enderecoId: string, endereco: any): Promise<any> {
    return api.patch(`/clientes/enderecos/${enderecoId}`, endereco);
  },

  async deleteEndereco(enderecoId: string): Promise<void> {
    return api.delete(`/clientes/enderecos/${enderecoId}`);
  },
};

