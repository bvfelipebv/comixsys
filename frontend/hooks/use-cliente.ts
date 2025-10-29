import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clienteService } from '@/lib/services';
import type { Cliente, CreateClienteInput, UpdateClienteInput } from '@/lib/types';

export function useClientes(empresaId: string, ativo?: boolean) {
  return useQuery({
    queryKey: ['clientes', empresaId, ativo],
    queryFn: () => clienteService.getAll(empresaId, ativo),
    enabled: !!empresaId,
  });
}

export function useCliente(id: string | undefined) {
  return useQuery({
    queryKey: ['cliente', id],
    queryFn: () => clienteService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClienteInput) => clienteService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}

export function useUpdateCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClienteInput }) =>
      clienteService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['cliente', variables.id] });
    },
  });
}

export function useDeleteCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clienteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}

export function useRestoreCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clienteService.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}

