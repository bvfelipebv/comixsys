'use client';

import { toast } from 'sonner';
import { useEmpresas, useUpdateEmpresa, useCreateEmpresa } from '@/hooks';
import { type EmpresaFormData } from '@/lib/schemas';
import { EmpresaForm } from '@/components/configuracoes/empresa/empresa-form';
import { AppSidebar } from "@/components/shared/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const { data: empresas, isLoading } = useEmpresas();
  const createEmpresa = useCreateEmpresa();
  const updateEmpresa = useUpdateEmpresa();

  const empresa = empresas?.[0];

  const handleSubmit = async (data: EmpresaFormData) => {
    try {
      if (empresa) {
        await updateEmpresa.mutateAsync({ id: empresa.id, data });
        toast.success('Empresa atualizada com sucesso!');
      } else {
        await createEmpresa.mutateAsync(data);
        toast.success('Empresa criada com sucesso!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar empresa');
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
                <BreadcrumbPage>Configuração da Empresa</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                {isLoading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-[400px] w-full" />
                    <Skeleton className="h-[300px] w-full" />
                    <Skeleton className="h-[200px] w-full" />
                  </div>
                ) : (
                  <EmpresaForm
                    empresa={empresa}
                    onSubmit={handleSubmit}
                    isLoading={createEmpresa.isPending || updateEmpresa.isPending}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

