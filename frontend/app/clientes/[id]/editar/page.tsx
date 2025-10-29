'use client';

import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useCliente, useUpdateCliente } from '@/hooks';
import { type ClienteFormData } from '@/lib/schemas';
import { ClienteForm } from '@/components/clientes/cliente-form';
import { AppSidebar } from "@/components/shared/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Loader2 } from 'lucide-react';

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const clienteId = params.id as string;

  const { data: cliente, isLoading: isLoadingCliente } = useCliente(clienteId);
  const updateCliente = useUpdateCliente();

  // TODO: Pegar empresaId do contexto/auth
  const empresaId = 'c0a0dd09-9ee1-46af-aef1-88f58fe78100'; // Empresa Exemplo LTDA

  const handleSubmit = async (data: ClienteFormData) => {
    console.log('🚀 Iniciando atualização...', data);
    try {
      const result = await updateCliente.mutateAsync({ id: clienteId, data });
      console.log('✅ Cliente atualizado:', result);
      toast.success('Cliente atualizado com sucesso!');
      router.push('/clientes');
    } catch (error: any) {
      console.error('❌ Erro ao atualizar cliente:', error);
      toast.error(error.message || 'Erro ao atualizar cliente');
    }
  };

  if (isLoadingCliente) {
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
                  <BreadcrumbLink href="/clientes">Clientes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Editar Cliente</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!cliente) {
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
                  <BreadcrumbLink href="/clientes">Clientes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Editar Cliente</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <p className="text-muted-foreground">Cliente não encontrado</p>
                <button
                  onClick={() => router.push('/clientes')}
                  className="text-primary hover:underline"
                >
                  Voltar para listagem
                </button>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
                <BreadcrumbLink href="/clientes">Clientes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Editar {cliente.nome}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4 md:p-6">
              <ClienteForm
                cliente={cliente}
                empresaId={empresaId}
                onSubmit={handleSubmit}
                isLoading={updateCliente.isPending}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

