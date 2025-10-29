#!/bin/bash

# Script para executar migrations do Prisma antes de iniciar o servidor
# Este script verifica se o banco está acessível e executa as migrations

set -e

echo "🔍 Verificando conexão com o banco de dados..."

# Função para verificar se o banco está acessível
check_database() {
  npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1
  return $?
}

# Aguardar até que o banco esteja disponível (máximo 30 segundos)
MAX_RETRIES=30
RETRY_COUNT=0

while ! check_database; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo "❌ Erro: Não foi possível conectar ao banco de dados após $MAX_RETRIES tentativas."
    echo "   Verifique se o Docker está rodando: docker-compose up -d"
    exit 1
  fi
  
  echo "⏳ Aguardando banco de dados... (tentativa $RETRY_COUNT/$MAX_RETRIES)"
  sleep 1
done

echo "✅ Banco de dados está acessível!"

# Executar migrations
echo "🔄 Executando migrations do Prisma..."
npx prisma migrate deploy

echo "✅ Migrations executadas com sucesso!"

# Gerar Prisma Client (caso necessário)
echo "🔄 Gerando Prisma Client..."
npx prisma generate

echo "✅ Prisma Client gerado com sucesso!"

# Executar seed
echo "🌱 Executando seed do banco de dados..."
if npx prisma db seed 2>/dev/null; then
  echo "✅ Seed executado com sucesso!"
else
  echo "⚠️  Aviso: Seed não foi executado (pode já ter dados no banco)"
fi

echo "🚀 Pronto para iniciar o servidor!"

