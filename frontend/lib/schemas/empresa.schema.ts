import { z } from 'zod';
import { RegimeTributario } from '../types';

export const empresaSchema = z.object({
  razaoSocial: z.string().min(3, 'Razão social deve ter no mínimo 3 caracteres'),
  nomeFantasia: z.string().optional(),
  cnpj: z
    .string()
    .length(14, 'CNPJ deve ter 14 dígitos')
    .regex(/^\d{14}$/, 'CNPJ deve conter apenas números'),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  regimeTributario: z.nativeEnum(RegimeTributario),
  crt: z.number().int().min(1).max(4),
  
  // Endereço
  cep: z.string().min(8, 'CEP inválido'),
  logradouro: z.string().min(3, 'Logradouro deve ter no mínimo 3 caracteres'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(2, 'Bairro deve ter no mínimo 2 caracteres'),
  cidade: z.string().min(2, 'Cidade deve ter no mínimo 2 caracteres'),
  uf: z.string().length(2, 'UF deve ter 2 caracteres'),
  codigoMunicipio: z.string().min(7, 'Código do município inválido'),
  
  // Contato
  telefone: z.string().optional(),
  celular: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  site: z.string().url('URL inválida').optional().or(z.literal('')),
});

export type EmpresaFormData = z.infer<typeof empresaSchema>;

