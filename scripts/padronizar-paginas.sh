#!/bin/bash

# Script para padronizar todas as páginas com a estrutura do dashboard
# Copia a estrutura do dashboard para todas as outras páginas

echo "🚀 Iniciando padronização das páginas..."

# Diretório base
BASE_DIR="frontend/app"
DASHBOARD_DIR="$BASE_DIR/dashboard"

# Lista de páginas principais para padronizar
PAGINAS_PRINCIPAIS=(
  "clientes"
  "fornecedores" 
  "produtos"
  "vendas"
  "relatorios"
  "fiscal"
  "configuracoes"
)

# Lista de subpáginas para padronizar
SUBPAGINAS=(
  "produtos/nova"
  "produtos/categoria"
  "produtos/marca"
  "produtos/unidade"
  "vendas/nova"
  "vendas/pedido"
  "vendas/orçamento"
  "relatorios/vendas"
  "relatorios/produtos"
  "relatorios/clientes"
  "fiscal/nfce"
  "fiscal/nfe"
  "configuracoes/empresa"
  "configuracoes/usuarios"
  "configuracoes/sistema"
  "configuracoes/fiscal/geral"
  "configuracoes/fiscal/nfe"
)

# Lista de páginas de detalhes [id]
PAGINAS_ID=(
  "clientes/[id]"
  "fornecedores/[id]"
  "produtos/[id]"
  "vendas/[id]"
)

# Função para copiar e ajustar página
copiar_pagina() {
  local destino=$1
  local titulo=$2
  local breadcrumb=$3
  
  echo "📄 Processando: $destino"
  
  # Criar diretório se não existir
  mkdir -p "$(dirname "$BASE_DIR/$destino")"
  
  # Copiar page.tsx do dashboard
  cp "$DASHBOARD_DIR/page.tsx" "$BASE_DIR/$destino/page.tsx"
  
  # Ajustar o conteúdo da página
  sed -i "s/Dashboard/$titulo/g" "$BASE_DIR/$destino/page.tsx"
  sed -i "s/ChartAreaInteractive.*//g" "$BASE_DIR/$destino/page.tsx"
  sed -i "s/DataTable.*//g" "$BASE_DIR/$destino/page.tsx"
  sed -i "s/SectionCards.*//g" "$BASE_DIR/$destino/page.tsx"
  sed -i "s/import.*chart-area-interactive.*//g" "$BASE_DIR/$destino/page.tsx"
  sed -i "s/import.*data-table.*//g" "$BASE_DIR/$destino/page.tsx"
  sed -i "s/import.*section-cards.*//g" "$BASE_DIR/$destino/page.tsx"
  sed -i "s/import data from.*//g" "$BASE_DIR/$destino/page.tsx"
  
  # Ajustar breadcrumb se fornecido
  if [ ! -z "$breadcrumb" ]; then
    sed -i "s/<BreadcrumbPage>$titulo<\/BreadcrumbPage>/$breadcrumb/g" "$BASE_DIR/$destino/page.tsx"
  fi
  
  echo "✅ Concluído: $destino"
}

# Processar páginas principais
echo "📁 Processando páginas principais..."
for pagina in "${PAGINAS_PRINCIPAIS[@]}"; do
  titulo=$(echo "$pagina" | sed 's/\b\w/\U&/g')
  copiar_pagina "$pagina" "$titulo"
done

# Processar subpáginas
echo "📁 Processando subpáginas..."
for subpagina in "${SUBPAGINAS[@]}"; do
  # Extrair título da subpágina
  titulo=$(basename "$subpagina" | sed 's/\b\w/\U&/g')
  
  # Criar breadcrumb para subpáginas
  parent=$(dirname "$subpagina" | sed 's/\b\w/\U&/g')
  breadcrumb="<BreadcrumbItem className=\"hidden md:block\"><BreadcrumbLink href=\"/$parent\">$parent</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator className=\"hidden md:block\" /><BreadcrumbItem><BreadcrumbPage>$titulo</BreadcrumbPage></BreadcrumbItem>"
  
  copiar_pagina "$subpagina" "$titulo" "$breadcrumb"
done

# Processar páginas de detalhes [id]
echo "📁 Processando páginas de detalhes..."
for pagina_id in "${PAGINAS_ID[@]}"; do
  parent=$(dirname "$pagina_id" | sed 's/\b\w/\U&/g')
  titulo="Detalhes"
  
  breadcrumb="<BreadcrumbItem className=\"hidden md:block\"><BreadcrumbLink href=\"/$parent\">$parent</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator className=\"hidden md:block\" /><BreadcrumbItem><BreadcrumbPage>$titulo</BreadcrumbPage></BreadcrumbItem>"
  
  copiar_pagina "$pagina_id" "$titulo" "$breadcrumb"
done

echo "🎉 Padronização concluída!"
echo "📊 Total de páginas processadas: $((${#PAGINAS_PRINCIPAIS[@]} + ${#SUBPAGINAS[@]} + ${#PAGINAS_ID[@]}))"
echo ""
echo "⚠️  Próximos passos manuais:"
echo "1. Ajustar imports específicos de cada página"
echo "2. Personalizar conteúdo de cada página"
echo "3. Testar navegação e breadcrumbs"
