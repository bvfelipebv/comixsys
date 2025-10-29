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
  apelido: z.string().optional(),
  cpf: z
    .string()
    .length(11, 'CPF deve ter 11 dígitos')
    .regex(/^\d{11}$/, 'CPF deve conter apenas números')
    .optional(),
  rg: z.string().optional(),
  rgEmissor: z.string().optional(),
  rgUf: z.string().length(2).optional(),
  sexo: z.nativeEnum(Sexo).optional(),
  dataNascimento: z.string().optional(),
  
  // Pessoa Jurídica
  razaoSocial: z.string().optional(),
  nomeFantasia: z.string().optional(),
  cnpj: z
    .string()
    .length(14, 'CNPJ deve ter 14 dígitos')
    .regex(/^\d{14}$/, 'CNPJ deve conter apenas números')
    .optional(),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  indicadorIE: z.number().int().min(1).max(9).optional(),
  
  // Contato
  telefone: z.string().optional(),
  celular: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  emailNFe: z.string().email('Email inválido').optional().or(z.literal('')),
  site: z.string().url('URL inválida').optional().or(z.literal('')),
  
  // Fiscal
  issRetido: z.boolean().optional(),
  consumidorFinal: z.boolean().optional(),
  produtorRural: z.boolean().optional(),
  
  // Financeiro
  limiteCredito: z.number().min(0).optional(),
  bloqueado: z.boolean().optional(),
  
  observacao: z.string().optional(),
  
  empresaId: z.string().uuid(),
  tipoPrecoId: z.string().uuid().optional(),
  
  // Endereços
  enderecos: z.array(enderecoSchema).optional(),
}).refine(
  (data) => {
    if (data.tipo === TipoPessoa.FISICA) {
      return !!data.cpf;
    }
    if (data.tipo === TipoPessoa.JURIDICA) {
      return !!data.cnpj;
    }
    return true;
  },
  {
    message: 'CPF é obrigatório para pessoa física e CNPJ para pessoa jurídica',
    path: ['cpf'],
  }
);

export type ClienteFormData = z.infer<typeof clienteSchema>;

