'use client';

import { toast } from 'sonner';
import { useClientes, useDeleteCliente, useRestoreCliente } from '@/hooks';
import { ClientesDataTable } from '@/components/clientes/clientes-data-table';
import { AppSidebar } from "@/components/shared/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  // TODO: Pegar empresaId do contexto/auth
  const empresaId = 'c0a0dd09-9ee1-46af-aef1-88f58fe78100'; // Empresa Exemplo LTDA

  const { data: clientes, isLoading } = useClientes(empresaId);
  const deleteCliente = useDeleteCliente();
  const restoreCliente = useRestoreCliente();

  const handleDelete = async (id: string) => {
    try {
      await deleteCliente.mutateAsync(id);
      toast.success('Cliente desativado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao desativar cliente');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreCliente.mutateAsync(id);
      toast.success('Cliente reativado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao reativar cliente');
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Clientes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">Carregando clientes...</p>
                </div>
              ) : (
                <ClientesDataTable
                  data={clientes || []}
                  onDelete={handleDelete}
                  onRestore={handleRestore}
                />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

