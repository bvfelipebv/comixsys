#!/bin/bash

# Script para corrigir as páginas após a padronização
echo "🔧 Corrigindo páginas padronizadas..."

# Função para corrigir uma página
corrigir_pagina() {
  local arquivo=$1
  local titulo=$2
  local descricao=$3
  
  echo "📄 Corrigindo: $arquivo"
  
  # Criar conteúdo limpo da página
  cat > "$arquivo" << EOF
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
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
                <BreadcrumbPage>$titulo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold mb-4">$titulo</h1>
                <p className="text-muted-foreground">
                  $descricao
                </p>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
EOF
  
  echo "✅ Corrigido: $arquivo"
}

# Função para corrigir subpágina com breadcrumb
corrigir_subpagina() {
  local arquivo=$1
  local titulo=$2
  local parent=$3
  local parent_url=$4
  local descricao=$5
  
  echo "📄 Corrigindo subpágina: $arquivo"
  
  cat > "$arquivo" << EOF
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="$parent_url">$parent</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>$titulo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold mb-4">$titulo</h1>
                <p className="text-muted-foreground">
                  $descricao
                </p>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
EOF
  
  echo "✅ Corrigido: $arquivo"
}

# Corrigir páginas principais
echo "📁 Corrigindo páginas principais..."
corrigir_pagina "frontend/app/clientes/page.tsx" "Clientes" "Gerencie seus clientes aqui. Visualize, adicione, edite e remova clientes do sistema."
corrigir_pagina "frontend/app/fornecedores/page.tsx" "Fornecedores" "Gerencie seus fornecedores aqui. Visualize, adicione, edite e remova fornecedores do sistema."
corrigir_pagina "frontend/app/produtos/page.tsx" "Produtos" "Gerencie seus produtos aqui. Visualize, adicione, edite e remova produtos do sistema."
corrigir_pagina "frontend/app/vendas/page.tsx" "Vendas" "Gerencie suas vendas aqui. Visualize, adicione, edite e remova vendas do sistema."
corrigir_pagina "frontend/app/relatorios/page.tsx" "Relatórios" "Visualize relatórios detalhados do sistema. Analise vendas, produtos e clientes."
corrigir_pagina "frontend/app/fiscal/page.tsx" "Fiscal" "Área fiscal do sistema. Gerencie NFCe, NFe e outras obrigações fiscais."
corrigir_pagina "frontend/app/configuracoes/page.tsx" "Configurações" "Configure o sistema de acordo com suas necessidades. Ajuste empresa, usuários e parâmetros fiscais."

echo "🎉 Correção concluída!"
echo "📊 Páginas principais corrigidas: 7"
