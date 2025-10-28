"use client"

import * as React from "react"
import {
  ArchiveX,
  Command,
  File,
  Inbox,
  Send,
  Trash2,
  LayoutDashboard,
  Users,
  Building2,
  Package,
  ShoppingCart,
  BarChart3,
  FileText,
  Settings,
  Plus,
  Tag,
  Bookmark,
  Receipt,
  Search
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavUser } from "@/components/nav-user"
import { Label } from "@/components/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"

// Sistema de dados do ComixSys
const data = {
  user: {
    name: "Admin",
    email: "admin@comixsys.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Clientes",
      url: "/clientes",
      icon: Users,
      isActive: false,
    },
    {
      title: "Fornecedores",
      url: "/fornecedores",
      icon: Building2,
      isActive: false,
    },
    {
      title: "Produtos",
      url: "/produtos",
      icon: Package,
      isActive: false,
    },
    {
      title: "Vendas",
      url: "/vendas",
      icon: ShoppingCart,
      isActive: false,
    },
    {
      title: "Relatórios",
      url: "/relatorios",
      icon: BarChart3,
      isActive: false,
    },
    {
      title: "Fiscal",
      url: "/fiscal",
      icon: FileText,
      isActive: false,
    },
    {
      title: "Configurações",
      url: "/configuracoes",
      icon: Settings,
      isActive: false,
    },
  ],
  subMenus: {
    "/produtos": [
      { title: "Todos os Produtos", url: "/produtos", icon: Package },
      { title: "Novo Produto", url: "/produtos/nova", icon: Plus },
      { title: "Categorias", url: "/produtos/categoria", icon: Tag },
      { title: "Marcas", url: "/produtos/marca", icon: Bookmark },
      { title: "Unidades", url: "/produtos/unidade", icon: Receipt },
    ],
    "/vendas": [
      { title: "Todas as Vendas", url: "/vendas", icon: ShoppingCart },
      { title: "Nova Venda", url: "/vendas/nova", icon: Plus },
      { title: "Pedidos", url: "/vendas/pedido", icon: File },
      { title: "Orçamentos", url: "/vendas/orçamento", icon: FileText },
    ],
    "/relatorios": [
      { title: "Todos os Relatórios", url: "/relatorios", icon: BarChart3 },
      { title: "Relatório de Vendas", url: "/relatorios/vendas", icon: ShoppingCart },
      { title: "Relatório de Produtos", url: "/relatorios/produtos", icon: Package },
      { title: "Relatório de Clientes", url: "/relatorios/clientes", icon: Users },
    ],
    "/fiscal": [
      { title: "Área Fiscal", url: "/fiscal", icon: FileText },
      { title: "NFCe", url: "/fiscal/nfce", icon: Receipt },
      { title: "NFe", url: "/fiscal/nfe", icon: File },
    ],
    "/configuracoes": [
      { title: "Configurações Gerais", url: "/configuracoes", icon: Settings },
      { title: "Empresa", url: "/configuracoes/empresa", icon: Building2 },
      { title: "Usuários", url: "/configuracoes/usuarios", icon: Users },
      { title: "Sistema", url: "/configuracoes/sistema", icon: Settings },
      { title: "Fiscal", url: "/configuracoes/fiscal/geral", icon: FileText },
    ],
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filteredSubItems, setFilteredSubItems] = React.useState<any[]>([])
  const { setOpen } = useSidebar()

  // Determinar item ativo baseado na URL atual
  React.useEffect(() => {
    const currentItem = data.navMain.find(item => pathname.startsWith(item.url))
    if (currentItem) {
      setActiveItem(currentItem)
    }
  }, [pathname])

  // Filtrar subitens baseado na busca
  React.useEffect(() => {
    const subItems = data.subMenus[activeItem?.url as keyof typeof data.subMenus] || []
    if (searchTerm) {
      const filtered = subItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredSubItems(filtered)
    } else {
      setFilteredSubItems(subItems)
    }
  }, [activeItem, searchTerm])

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link href="/dashboard">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">ComixSys</span>
                    <span className="truncate text-xs">Sistema de Gestão</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        setSearchTerm("")
                        setOpen(true)
                      }}
                      isActive={pathname.startsWith(item.url)}
                      className="px-2.5 md:px-2"
                      asChild
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {activeItem?.title}
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Buscar</span>
              <Search className="size-4 text-muted-foreground" />
            </Label>
          </div>
          <SidebarInput
            placeholder="Buscar itens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {filteredSubItems.length > 0 ? (
                filteredSubItems.map((item) => (
                  <Link
                    href={item.url}
                    key={item.url}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                  >
                    <div className="flex w-full items-center gap-2">
                      <item.icon className="size-4" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0">
                  <div className="flex w-full items-center gap-2">
                    <span className="text-muted-foreground">
                      {searchTerm ? 'Nenhum item encontrado' : 'Selecione um menu para ver os subitens'}
                    </span>
                  </div>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
