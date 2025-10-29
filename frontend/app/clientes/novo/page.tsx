'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateCliente } from '@/hooks';
import { type ClienteFormData } from '@/lib/schemas';
import { ClienteForm } from '@/components/clientes/cliente-form';
import { AppSidebar } from "@/components/shared/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  const router = useRouter();
  const createCliente = useCreateCliente();

  // TODO: Pegar empresaId do contexto/auth
  const empresaId = 'c0a0dd09-9ee1-46af-aef1-88f58fe78100'; // Empresa Exemplo LTDA

  const handleSubmit = async (data: ClienteFormData) => {
    console.log('🚀 Iniciando submit...', data);
    try {
      const result = await createCliente.mutateAsync(data);
      console.log('✅ Cliente criado:', result);
      toast.success('Cliente criado com sucesso!');
      router.push('/clientes');
    } catch (error: any) {
      console.error('❌ Erro ao criar cliente:', error);
      toast.error(error.message || 'Erro ao criar cliente');
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
                <BreadcrumbLink href="/clientes">Clientes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Novo Cliente</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4 md:p-6">
              <ClienteForm
                empresaId={empresaId}
                onSubmit={handleSubmit}
                isLoading={createCliente.isPending}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

