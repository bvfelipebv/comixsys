"use client"

import * as React from "react"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLayoutColumns,
  IconPlus,
  IconRefresh,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { useRouter } from "next/navigation"

import { Cliente } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDataTableFilters, DataTableFilter } from "@/components/data-table-filter"
import { clientesColumnsConfig } from "./clientes-filters-config"

interface ClientesDataTableProps {
  data: Cliente[]
  onDelete: (id: string) => void
  onRestore: (id: string) => void
}

export function ClientesDataTable({
  data,
  onDelete,
  onRestore,
}: ClientesDataTableProps) {
  const router = useRouter()
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [clienteToDelete, setClienteToDelete] = React.useState<Cliente | null>(null)
  const [clienteToRestore, setClienteToRestore] = React.useState<Cliente | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Configurar filtros
  const { filters, columns: filterColumns, actions } = useDataTableFilters({
    strategy: 'client',
    data,
    columnsConfig: clientesColumnsConfig,
  })

  const columnsDefinition: ColumnDef<Cliente>[] = [
    {
      accessorKey: "nome",
      header: "Cliente",
      cell: ({ row }) => {
        const cliente = row.original
        return (
          <div>
            <div className="font-medium">{cliente.nome}</div>
            {cliente.tipo === "JURIDICA" && cliente.nomeFantasia && (
              <div className="text-muted-foreground text-sm">
                {cliente.nomeFantasia}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "documento",
      header: "CPF/CNPJ",
      cell: ({ row }) => {
        const cliente = row.original
        return (
          <span className="font-mono text-sm">
            {cliente.tipo === "FISICA" ? cliente.cpf : cliente.cnpj}
          </span>
        )
      },
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => {
        const tipo = row.getValue("tipo") as string
        return (
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {tipo === "FISICA" ? "Pessoa Física" : "Pessoa Jurídica"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return (
          <span className="text-sm">{row.getValue("email") || "-"}</span>
        )
      },
    },
    {
      accessorKey: "celular",
      header: "Celular",
      cell: ({ row }) => {
        return (
          <span className="text-sm">{row.getValue("celular") || "-"}</span>
        )
      },
    },
    {
      accessorKey: "ativo",
      header: "Status",
      cell: ({ row }) => {
        const ativo = row.getValue("ativo") as boolean
        return (
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {ativo ? "Ativo" : "Inativo"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const cliente = row.original

        return (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {cliente.ativo ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-destructive"
                onClick={() => setClienteToDelete(cliente)}
                title="Desativar"
              >
                <IconTrash className="size-4" />
                <span className="sr-only">Desativar</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                onClick={() => setClienteToRestore(cliente)}
                title="Reativar"
              >
                <IconRefresh className="size-4" />
                <span className="sr-only">Reativar</span>
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  const tableColumns: ColumnDef<Cliente>[] = React.useMemo(() => columnsDefinition, [])

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <DataTableFilter
            filters={filters}
            columns={filterColumns}
            actions={actions}
            strategy="client"
            locale="pt-br"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Colunas</span>
                <span className="lg:hidden">Colunas</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button onClick={() => router.push('/clientes/novo')} size="sm">
          <IconPlus className="size-4" />
          <span className="hidden lg:inline">Novo Cliente</span>
          <span className="lg:hidden">Novo</span>
        </Button>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer"
                    onClick={() => router.push(`/clientes/${row.original.id}/editar`)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    className="h-[400px]"
                  >
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                      <div className="bg-muted flex size-20 items-center justify-center rounded-full">
                        <IconUsers className="text-muted-foreground size-10" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold">Nenhum cliente encontrado</h3>
                        <p className="text-muted-foreground text-sm">
                          {data.length === 0
                            ? "Comece adicionando seu primeiro cliente."
                            : "Tente ajustar os filtros para encontrar o que procura."}
                        </p>
                      </div>
                      {data.length === 0 && (
                        <Button onClick={() => router.push('/clientes/novo')}>
                          <IconPlus className="size-4" />
                          Adicionar Cliente
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Linhas por página
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir para primeira página</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir para página anterior</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir para próxima página</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir para última página</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Dialog de confirmação para desativar */}
    <AlertDialog open={!!clienteToDelete} onOpenChange={() => setClienteToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desativar Cliente</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja desativar o cliente <strong>{clienteToDelete?.nome}</strong>?
            <br />
            O cliente será marcado como inativo e poderá ser reativado posteriormente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (clienteToDelete) {
                onDelete(clienteToDelete.id)
                setClienteToDelete(null)
              }
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Desativar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Dialog de confirmação para reativar */}
    <AlertDialog open={!!clienteToRestore} onOpenChange={() => setClienteToRestore(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reativar Cliente</AlertDialogTitle>
          <AlertDialogDescription>
            Deseja reativar o cliente <strong>{clienteToRestore?.nome}</strong>?
            <br />
            O cliente voltará a aparecer como ativo no sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (clienteToRestore) {
                onRestore(clienteToRestore.id)
                setClienteToRestore(null)
              }
            }}
          >
            Reativar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  )
}

