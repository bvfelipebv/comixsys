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
  Search,
  UserPlus,
  UserCheck,
  UserX,
  TrendingUp,
  PieChart,
  Activity,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Truck,
  ClipboardList,
  CreditCard,
  DollarSign,
  FileCheck,
  Grid3X3,
  Route,
  FileBarChart,
  Workflow
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavUser } from "@/components/shared/nav-user"
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
    "/dashboard": [
      { title: "Visão Geral", url: "/dashboard", icon: LayoutDashboard },
      { title: "Vendas do Dia", url: "/dashboard/vendas-dia", icon: TrendingUp },
      { title: "Gráficos", url: "/dashboard/graficos", icon: PieChart },
      { title: "Atividades Recentes", url: "/dashboard/atividades", icon: Activity },
      { title: "Agenda", url: "/dashboard/agenda", icon: Calendar },
    ],
    "/clientes": [
      { title: "Todos os Clientes", url: "/clientes", icon: Users },
      { title: "Novo Cliente", url: "/clientes/novo", icon: UserPlus },
      { title: "Clientes Ativos", url: "/clientes/ativos", icon: UserCheck },
      { title: "Clientes Inativos", url: "/clientes/inativos", icon: UserX },
      { title: "Contatos", url: "/clientes/contatos", icon: Phone },
      { title: "Endereços", url: "/clientes/enderecos", icon: MapPin },
    ],
    "/fornecedores": [
      { title: "Todos os Fornecedores", url: "/fornecedores", icon: Building2 },
      { title: "Novo Fornecedor", url: "/fornecedores/novo", icon: Plus },
      { title: "Fornecedores Ativos", url: "/fornecedores/ativos", icon: UserCheck },
      { title: "Contatos", url: "/fornecedores/contatos", icon: Mail },
      { title: "Pedidos de Compra", url: "/fornecedores/pedidos", icon: ClipboardList },
      { title: "Entregas", url: "/fornecedores/entregas", icon: Truck },
    ],
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
      { title: "Pagamentos", url: "/vendas/pagamentos", icon: CreditCard },
      { title: "Comissões", url: "/vendas/comissoes", icon: DollarSign },
    ],
    "/relatorios": [
      { title: "Todos os Relatórios", url: "/relatorios", icon: BarChart3 },
      { title: "Relatório de Vendas", url: "/relatorios/vendas", icon: ShoppingCart },
      { title: "Relatório de Produtos", url: "/relatorios/produtos", icon: Package },
      { title: "Relatório de Clientes", url: "/relatorios/clientes", icon: Users },
      { title: "Relatório Financeiro", url: "/relatorios/financeiro", icon: DollarSign },
      { title: "Relatório de Estoque", url: "/relatorios/estoque", icon: Package },
    ],
    "/fiscal": [
      { title: "Área Fiscal", url: "/fiscal", icon: FileText },
      { title: "NFCe", url: "/fiscal/nfce", icon: Receipt },
      { title: "NFe", url: "/fiscal/nfe", icon: File },
      { title: "Impostos", url: "/fiscal/impostos", icon: DollarSign },
      { title: "Declarações", url: "/fiscal/declaracoes", icon: ClipboardList },
    ],
    "/configuracoes": [
      { title: "Configurações Gerais", url: "/configuracoes", icon: Settings },
      { title: "Empresa", url: "/configuracoes/empresa", icon: Building2 },
      { title: "Usuários", url: "/configuracoes/usuarios", icon: Users },
      { title: "Sistema", url: "/configuracoes/sistema", icon: Settings },
      { type: "separator", title: "Fiscal" },
      { title: "Fiscal Geral", url: "/configuracoes/fiscal/geral", icon: FileText },
      { title: "NFe", url: "/configuracoes/fiscal/nfe", icon: File },
      { title: "NFCe", url: "/configuracoes/fiscal/nfce", icon: Receipt },
      { title: "CTe", url: "/configuracoes/fiscal/cte", icon: Truck },
      { title: "MDFe", url: "/configuracoes/fiscal/mdfe", icon: Route },
      { title: "Matriz Fiscal", url: "/configuracoes/fiscal/matriz-fiscal", icon: Grid3X3 },
      { title: "Natureza de Operação", url: "/configuracoes/fiscal/natureza-operacao", icon: Workflow },
    ],
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filteredSubItems, setFilteredSubItems] = React.useState<any[]>([])
  const { setOpen, open } = useSidebar()

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
      // Buscar em todos os itens do sistema quando há termo de busca
      const allItems: any[] = []
      const addedUrls = new Set<string>()

      // Adicionar subitens de todos os menus que correspondem à busca primeiro
      Object.values(data.subMenus).forEach(menuItems => {
        menuItems.forEach(item => {
          // Pular separadores na busca
          if ('type' in item && item.type === 'separator') return

          if (item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            if ('url' in item && item.url && !addedUrls.has(item.url)) {
              allItems.push({
                ...item,
                isMainItem: false,
                uniqueKey: `sub-${item.url}`
              })
              addedUrls.add(item.url)
            }
          }
        })
      })

      // Adicionar itens principais que correspondem à busca (apenas se não há subitem com mesma URL)
      data.navMain.forEach(mainItem => {
        if (mainItem.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          if (!addedUrls.has(mainItem.url)) {
            allItems.push({
              title: mainItem.title,
              url: mainItem.url,
              icon: mainItem.icon,
              isMainItem: true,
              uniqueKey: `main-${mainItem.url}`
            })
            addedUrls.add(mainItem.url)
          }
        }
      })

      setFilteredSubItems(allItems)
    } else {
      // Quando não há busca, mostrar apenas subitens do menu ativo
      const itemsWithKeys = subItems.map((item, index) => ({
        ...item,
        uniqueKey: ('type' in item && item.type === 'separator')
          ? `separator-${index}`
          : `current-${'url' in item ? item.url : 'unknown'}-${index}`
      }))
      setFilteredSubItems(itemsWithKeys)
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
                        const isSameItem = activeItem?.url === item.url
                        setActiveItem(item)
                        setSearchTerm("")
                        setOpen(isSameItem ? !open : true)
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
              {searchTerm ? 'Resultados da Busca' : activeItem?.title}
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Buscar</span>
              <Search className="size-4 text-muted-foreground" />
            </Label>
          </div>
          <SidebarInput
            placeholder="Buscar em todo o sistema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <div className="text-xs text-muted-foreground px-1">
              Buscando em todos os menus e submenus
            </div>
          )}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {filteredSubItems.length > 0 ? (
                filteredSubItems.map((item) => {
                  // Renderizar separador
                  if ('type' in item && item.type === 'separator') {
                    return (
                      <div key={item.uniqueKey} className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <div className="h-px bg-border/50 flex-1"></div>
                          <span className="text-xs text-muted-foreground/70">
                            {item.title}
                          </span>
                          <div className="h-px bg-border/50 flex-1"></div>
                        </div>
                      </div>
                    )
                  }

                  // Renderizar item normal
                  const itemUrl = 'url' in item ? item.url : '#'
                  return (
                    <Link
                      href={itemUrl}
                      key={item.uniqueKey || itemUrl}
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex w-full items-center gap-2">
                        {'icon' in item && item.icon && <item.icon className="size-4" />}
                        <div className="flex flex-col">
                          <span className="font-medium">{item.title}</span>
                          {searchTerm && 'isMainItem' in item && item.isMainItem && (
                            <span className="text-xs text-muted-foreground">Menu Principal</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })
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
