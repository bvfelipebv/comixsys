import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { produtoService } from '@/lib/services';
import type { Produto, CreateProdutoInput, UpdateProdutoInput } from '@/lib/types';

export function useProdutos(empresaId: string, ativo?: boolean) {
  return useQuery({
    queryKey: ['produtos', empresaId, ativo],
    queryFn: () => produtoService.getAll(empresaId, ativo),
    enabled: !!empresaId,
  });
}

export function useProduto(id: string | undefined) {
  return useQuery({
    queryKey: ['produto', id],
    queryFn: () => produtoService.getById(id!),
    enabled: !!id,
  });
}

export function useProdutosEstoqueBaixo(empresaId: string) {
  return useQuery({
    queryKey: ['produtos-estoque-baixo', empresaId],
    queryFn: () => produtoService.getEstoqueBaixo(empresaId),
    enabled: !!empresaId,
  });
}

export function useCreateProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProdutoInput) => produtoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
  });
}

export function useUpdateProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProdutoInput }) =>
      produtoService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      queryClient.invalidateQueries({ queryKey: ['produto', variables.id] });
    },
  });
}

export function useDeleteProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => produtoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
  });
}

export function useRestoreProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => produtoService.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
  });
}

export function useUpdateEstoque() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      quantidade,
      operacao,
    }: {
      id: string;
      quantidade: number;
      operacao: 'adicionar' | 'remover';
    }) => produtoService.updateEstoque(id, quantidade, operacao),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      queryClient.invalidateQueries({ queryKey: ['produto', variables.id] });
    },
  });
}

