import { createColumnConfigHelper } from '@/components/data-table-filter/core/filters'
import { Cliente } from '@/lib/types'
import { User, Building2, Mail, Phone, CheckCircle } from 'lucide-react'

// Criar o builder de configuração
const dtf = createColumnConfigHelper<Cliente>()

// Configurar as colunas para filtros
export const clientesColumnsConfig = [
  dtf
    .text()
    .id('nome')
    .accessor((row) => row.nome)
    .displayName('Nome')
    .icon(User)
    .build(),

  dtf
    .text()
    .id('email')
    .accessor((row) => row.email || '')
    .displayName('Email')
    .icon(Mail)
    .build(),

  dtf
    .text()
    .id('celular')
    .accessor((row) => row.celular || '')
    .displayName('Celular')
    .icon(Phone)
    .build(),

  dtf
    .option()
    .id('tipo')
    .accessor((row) => row.tipo)
    .displayName('Tipo')
    .icon(User)
    .options([
      {
        value: 'FISICA',
        label: 'Pessoa Física',
        icon: User,
      },
      {
        value: 'JURIDICA',
        label: 'Pessoa Jurídica',
        icon: Building2,
      },
    ])
    .build(),

  dtf
    .option()
    .id('ativo')
    .accessor((row) => (row.ativo ? 'true' : 'false'))
    .displayName('Status')
    .icon(CheckCircle)
    .options([
      {
        value: 'true',
        label: 'Ativo',
      },
      {
        value: 'false',
        label: 'Inativo',
      },
    ])
    .build(),
] as const

