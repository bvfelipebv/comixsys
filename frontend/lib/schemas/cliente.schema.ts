import { z } from 'zod';
import { TipoPessoa, Sexo, TipoEndereco } from '../types';

const enderecoSchema = z.object({
  tipo: z.nativeEnum(TipoEndereco),
  cep: z.string().min(8, 'CEP inválido'),
  logradouro: z.string().min(3, 'Logradouro deve ter no mínimo 3 caracteres'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(2, 'Bairro deve ter no mínimo 2 caracteres'),
  cidade: z.string().min(2, 'Cidade deve ter no mínimo 2 caracteres'),
  uf: z.string().length(2, 'UF deve ter 2 caracteres'),
  codigoMunicipio: z.string().optional(),
  principal: z.boolean().optional(),
});

export const clienteSchema = z.object({
  tipo: z.nativeEnum(TipoPessoa),

  // Pessoa Física
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  apelido: z.string().optional().or(z.literal('')),
  cpf: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^\d{11}$/.test(val), 'CPF deve ter 11 dígitos'),
  rg: z.string().optional().or(z.literal('')),
  rgEmissor: z.string().optional().or(z.literal('')),
  rgUf: z.string().optional().or(z.literal('')),
  sexo: z.nativeEnum(Sexo).optional().or(z.literal('')),
  dataNascimento: z.string().optional().or(z.literal('')),

  // Pessoa Jurídica
  razaoSocial: z.string().optional().or(z.literal('')),
  nomeFantasia: z.string().optional().or(z.literal('')),
  cnpj: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^\d{14}$/.test(val), 'CNPJ deve ter 14 dígitos'),
  inscricaoEstadual: z.string().optional().or(z.literal('')),
  inscricaoMunicipal: z.string().optional().or(z.literal('')),
  indicadorIE: z.number().int().min(1).max(9).default(9),

  // Contato
  telefone: z.string().optional().or(z.literal('')),
  celular: z.string().optional().or(z.literal('')),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  emailNFe: z.string().email('Email inválido').optional().or(z.literal('')),
  site: z.string().optional().or(z.literal('')),

  // Fiscal
  issRetido: z.boolean().default(false),
  consumidorFinal: z.boolean().default(true),
  produtorRural: z.boolean().default(false),

  // Financeiro
  limiteCredito: z.number().min(0).default(0),
  bloqueado: z.boolean().default(false),

  observacao: z.string().optional().or(z.literal('')),

  empresaId: z.string().uuid(),
  tipoPrecoId: z.string().optional().or(z.literal('')),

  // Endereços
  enderecos: z.array(enderecoSchema).optional().default([]),
}).superRefine((data, ctx) => {
  // Validar CPF para Pessoa Física
  if (data.tipo === TipoPessoa.FISICA) {
    if (!data.cpf || data.cpf.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CPF é obrigatório para pessoa física',
        path: ['cpf'],
      });
    }
  }

  // Validar CNPJ para Pessoa Jurídica
  if (data.tipo === TipoPessoa.JURIDICA) {
    if (!data.cnpj || data.cnpj.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CNPJ é obrigatório para pessoa jurídica',
        path: ['cnpj'],
      });
    }
  }
});

export type ClienteFormData = z.infer<typeof clienteSchema>;

