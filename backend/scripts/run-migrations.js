#!/usr/bin/env node

/**
 * Script para executar migrations do Prisma antes de iniciar o servidor
 * Compatível com Windows, Linux e macOS
 */

const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
  } catch (error) {
    if (!options.ignoreError) {
      throw error;
    }
    return null;
  }
}

async function checkDatabase() {
  log('🔍 Verificando conexão com o banco de dados...', colors.blue);

  const maxRetries = 30;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      // Tenta executar um comando simples no banco
      exec('npx prisma db execute --stdin', {
        silent: true,
        input: 'SELECT 1;',
        ignoreError: true,
      });

      log('✅ Banco de dados está acessível!', colors.green);
      return true;
    } catch (error) {
      retryCount++;

      if (retryCount >= maxRetries) {
        log(
          `❌ Erro: Não foi possível conectar ao banco de dados após ${maxRetries} tentativas.`,
          colors.red
        );
        log(
          '   Verifique se o Docker está rodando: docker-compose up -d',
          colors.yellow
        );
        process.exit(1);
      }

      log(
        `⏳ Aguardando banco de dados... (tentativa ${retryCount}/${maxRetries})`,
        colors.yellow
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

async function checkIfDatabaseIsEmpty() {
  try {
    // Verifica se existe alguma tabela no banco
    const result = exec(
      'npx prisma db execute --stdin',
      {
        silent: true,
        input: "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';",
      }
    );
    return result === null || result.toString().includes('0');
  } catch (error) {
    // Se der erro, assume que o banco está vazio
    return true;
  }
}

async function runMigrations() {
  try {
    await checkDatabase();

    // Executar migrations
    log('🔄 Executando migrations do Prisma...', colors.blue);
    exec('npx prisma migrate deploy');
    log('✅ Migrations executadas com sucesso!', colors.green);

    // Gerar Prisma Client
    log('🔄 Gerando Prisma Client...', colors.blue);
    exec('npx prisma generate');
    log('✅ Prisma Client gerado com sucesso!', colors.green);

    // Executar seed
    log('🌱 Executando seed do banco de dados...', colors.blue);
    try {
      exec('npx prisma db seed');
      log('✅ Seed executado com sucesso!', colors.green);
    } catch (error) {
      // Se o seed falhar, apenas avisa mas não interrompe
      log('⚠️  Aviso: Seed não foi executado (pode já ter dados no banco)', colors.yellow);
    }

    log('🚀 Pronto para iniciar o servidor!', colors.green);
  } catch (error) {
    log(`❌ Erro ao executar migrations: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Executar
runMigrations();

