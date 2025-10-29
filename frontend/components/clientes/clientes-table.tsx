'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Cliente } from '@/lib/types';
import { DataTableGeneric } from '@/components/shared/data-table-generic';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ClientesTableProps {
  clientes: Cliente[];
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

export function ClientesTable({ clientes, onDelete, onRestore }: ClientesTableProps) {
  const router = useRouter();

  const columns: ColumnDef<Cliente>[] = [
    {
      accessorKey: 'nome',
      header: 'Nome',
      cell: ({ row }) => {
        const cliente = row.original;
        return (
          <div>
            <div className="font-medium">{cliente.nome}</div>
            {cliente.tipo === 'JURIDICA' && cliente.nomeFantasia && (
              <div className="text-sm text-muted-foreground">{cliente.nomeFantasia}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'cpf',
      header: 'CPF/CNPJ',
      cell: ({ row }) => {
        const cliente = row.original;
        return cliente.tipo === 'FISICA' ? cliente.cpf : cliente.cnpj;
      },
    },
    {
      accessorKey: 'tipo',
      header: 'Tipo',
      cell: ({ row }) => {
        const tipo = row.getValue('tipo') as string;
        return (
          <Badge variant={tipo === 'FISICA' ? 'default' : 'secondary'}>
            {tipo === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'celular',
      header: 'Celular',
    },
    {
      accessorKey: 'ativo',
      header: 'Status',
      cell: ({ row }) => {
        const ativo = row.getValue('ativo') as boolean;
        return (
          <Badge variant={ativo ? 'default' : 'destructive'}>
            {ativo ? 'Ativo' : 'Inativo'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const cliente = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push(`/clientes/${cliente.id}`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              {cliente.ativo ? (
                <DropdownMenuItem onClick={() => onDelete(cliente.id)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Desativar
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onRestore(cliente.id)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reativar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return <DataTableGeneric columns={columns} data={clientes} searchKey="nome" searchPlaceholder="Buscar por nome..." />;
}

