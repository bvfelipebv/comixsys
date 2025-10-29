'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useClientes, useDeleteCliente, useRestoreCliente } from '@/hooks';
import { ClientesTable } from '@/components/clientes/clientes-table';
import { AppSidebar } from "@/components/shared/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ativos' | 'inativos'>('ativos');
  
  // TODO: Pegar empresaId do contexto/auth
  const empresaId = 'temp-empresa-id';
  
  const { data: clientesAtivos, isLoading: loadingAtivos } = useClientes(empresaId, true);
  const { data: clientesInativos, isLoading: loadingInativos } = useClientes(empresaId, false);
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
    <SidebarProvider style={{ "--sidebar-width": "350px" } as React.CSSProperties}>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
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
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold">Clientes</h1>
                    <p className="text-muted-foreground">Gerencie seus clientes</p>
                  </div>
                  <Button onClick={() => router.push('/clientes/novo')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Cliente
                  </Button>
                </div>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'ativos' | 'inativos')}>
                  <TabsList>
                    <TabsTrigger value="ativos">Ativos</TabsTrigger>
                    <TabsTrigger value="inativos">Inativos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="ativos" className="mt-6">
                    {loadingAtivos ? (
                      <Skeleton className="h-[400px] w-full" />
                    ) : (
                      <ClientesTable
                        clientes={clientesAtivos || []}
                        onDelete={handleDelete}
                        onRestore={handleRestore}
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="inativos" className="mt-6">
                    {loadingInativos ? (
                      <Skeleton className="h-[400px] w-full" />
                    ) : (
                      <ClientesTable
                        clientes={clientesInativos || []}
                        onDelete={handleDelete}
                        onRestore={handleRestore}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

