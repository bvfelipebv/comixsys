import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auxiliaresService } from '@/lib/services';

// Unidades
export function useUnidades() {
  return useQuery({
    queryKey: ['unidades'],
    queryFn: () => auxiliaresService.unidades.getAll(),
  });
}

// Categorias
export function useCategorias() {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: () => auxiliaresService.categorias.getAll(),
  });
}

export function useCreateCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { nome: string; descricao?: string }) =>
      auxiliaresService.categorias.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
}

// Subcategorias
export function useSubcategorias(categoriaId?: string) {
  return useQuery({
    queryKey: ['subcategorias', categoriaId],
    queryFn: () => auxiliaresService.subcategorias.getAll(categoriaId),
  });
}

export function useCreateSubcategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { nome: string; descricao?: string; categoriaId: string }) =>
      auxiliaresService.subcategorias.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategorias'] });
    },
  });
}

// Marcas
export function useMarcas() {
  return useQuery({
    queryKey: ['marcas'],
    queryFn: () => auxiliaresService.marcas.getAll(),
  });
}

export function useCreateMarca() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { nome: string; descricao?: string }) =>
      auxiliaresService.marcas.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
    },
  });
}

// Tipos de Preço
export function useTiposPreco() {
  return useQuery({
    queryKey: ['tipos-preco'],
    queryFn: () => auxiliaresService.tiposPreco.getAll(),
  });
}

export function useCreateTipoPreco() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { nome: string; descricao?: string }) =>
      auxiliaresService.tiposPreco.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-preco'] });
    },
  });
}

