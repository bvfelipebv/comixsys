import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { empresaService } from '@/lib/services';
import type { Empresa, CreateEmpresaInput, UpdateEmpresaInput } from '@/lib/types';

export function useEmpresas() {
  return useQuery({
    queryKey: ['empresas'],
    queryFn: () => empresaService.getAll(),
  });
}

export function useEmpresa(id: string | undefined) {
  return useQuery({
    queryKey: ['empresa', id],
    queryFn: () => empresaService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmpresaInput) => empresaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
    },
  });
}

export function useUpdateEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmpresaInput }) =>
      empresaService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      queryClient.invalidateQueries({ queryKey: ['empresa', variables.id] });
    },
  });
}

export function useDeleteEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => empresaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
    },
  });
}

export function useRestoreEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => empresaService.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
    },
  });
}

