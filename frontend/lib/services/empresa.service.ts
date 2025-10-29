import { api } from './api';
import type { Empresa, CreateEmpresaInput, UpdateEmpresaInput } from '../types';

export const empresaService = {
  async getAll(): Promise<Empresa[]> {
    return api.get<Empresa[]>('/empresas');
  },

  async getById(id: string): Promise<Empresa> {
    return api.get<Empresa>(`/empresas/${id}`);
  },

  async getByCnpj(cnpj: string): Promise<Empresa> {
    return api.get<Empresa>(`/empresas/cnpj/${cnpj}`);
  },

  async create(data: CreateEmpresaInput): Promise<Empresa> {
    return api.post<Empresa>('/empresas', data);
  },

  async update(id: string, data: UpdateEmpresaInput): Promise<Empresa> {
    return api.patch<Empresa>(`/empresas/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete<void>(`/empresas/${id}`);
  },

  async restore(id: string): Promise<Empresa> {
    return api.patch<Empresa>(`/empresas/${id}/restore`, {});
  },
};

