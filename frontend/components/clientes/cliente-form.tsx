'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clienteSchema, type ClienteFormData } from '@/lib/schemas';
import { TipoPessoa, Sexo, type Cliente } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User, Building2, MapPin, Phone, DollarSign } from 'lucide-react';

interface ClienteFormProps {
  cliente?: Cliente;
  empresaId: string;
  onSubmit: (data: ClienteFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ClienteForm({ cliente, empresaId, onSubmit, isLoading }: ClienteFormProps) {
  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      tipo: TipoPessoa.FISICA,
      empresaId,
      indicadorIE: 9,
      issRetido: false,
      consumidorFinal: true,
      produtorRural: false,
      bloqueado: false,
      limiteCredito: 0,
    },
  });

  const tipoPessoa = form.watch('tipo');

  useEffect(() => {
    if (cliente) {
      form.reset({
        tipo: cliente.tipo,
        nome: cliente.nome,
        apelido: cliente.apelido || '',
        cpf: cliente.cpf || '',
        rg: cliente.rg || '',
        rgEmissor: cliente.rgEmissor || '',
        rgUf: cliente.rgUf || '',
        sexo: cliente.sexo,
        dataNascimento: cliente.dataNascimento ? new Date(cliente.dataNascimento).toISOString().split('T')[0] : '',
        razaoSocial: cliente.razaoSocial || '',
        nomeFantasia: cliente.nomeFantasia || '',
        cnpj: cliente.cnpj || '',
        inscricaoEstadual: cliente.inscricaoEstadual || '',
        inscricaoMunicipal: cliente.inscricaoMunicipal || '',
        indicadorIE: cliente.indicadorIE,
        telefone: cliente.telefone || '',
        celular: cliente.celular || '',
        email: cliente.email || '',
        emailNFe: cliente.emailNFe || '',
        site: cliente.site || '',
        issRetido: cliente.issRetido,
        consumidorFinal: cliente.consumidorFinal,
        produtorRural: cliente.produtorRural,
        limiteCredito: Number(cliente.limiteCredito),
        bloqueado: cliente.bloqueado,
        observacao: cliente.observacao || '',
        empresaId: cliente.empresaId,
        tipoPrecoId: cliente.tipoPrecoId || '',
      });
    }
  }, [cliente, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tipo de Pessoa</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={form.watch('tipo')}
            onValueChange={(value) => form.setValue('tipo', value as TipoPessoa)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TipoPessoa.FISICA}>Pessoa Física</SelectItem>
              <SelectItem value={TipoPessoa.JURIDICA}>Pessoa Jurídica</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="dados" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dados">Dados</TabsTrigger>
          <TabsTrigger value="contato">Contato</TabsTrigger>
          <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {tipoPessoa === TipoPessoa.FISICA ? <User className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                Dados {tipoPessoa === TipoPessoa.FISICA ? 'Pessoais' : 'da Empresa'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">{tipoPessoa === TipoPessoa.FISICA ? 'Nome Completo' : 'Razão Social'} *</Label>
                  <Input id="nome" {...form.register('nome')} placeholder="Nome completo" />
                  {form.formState.errors.nome && (
                    <p className="text-sm text-red-500">{form.formState.errors.nome.message}</p>
                  )}
                </div>

                {tipoPessoa === TipoPessoa.FISICA ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="apelido">Apelido</Label>
                      <Input id="apelido" {...form.register('apelido')} placeholder="Como prefere ser chamado" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input id="cpf" {...form.register('cpf')} placeholder="00000000000" maxLength={11} />
                      {form.formState.errors.cpf && (
                        <p className="text-sm text-red-500">{form.formState.errors.cpf.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rg">RG</Label>
                      <Input id="rg" {...form.register('rg')} placeholder="000000000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rgEmissor">Órgão Emissor</Label>
                      <Input id="rgEmissor" {...form.register('rgEmissor')} placeholder="SSP" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rgUf">UF Emissor</Label>
                      <Input id="rgUf" {...form.register('rgUf')} placeholder="SP" maxLength={2} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sexo">Sexo</Label>
                      <Select
                        value={form.watch('sexo')}
                        onValueChange={(value) => form.setValue('sexo', value as Sexo)}
                      >
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Sexo.MASCULINO}>Masculino</SelectItem>
                          <SelectItem value={Sexo.FEMININO}>Feminino</SelectItem>
                          <SelectItem value={Sexo.OUTRO}>Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                      <Input id="dataNascimento" type="date" {...form.register('dataNascimento')} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                      <Input id="nomeFantasia" {...form.register('nomeFantasia')} placeholder="Nome fantasia" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ *</Label>
                      <Input id="cnpj" {...form.register('cnpj')} placeholder="00000000000000" maxLength={14} />
                      {form.formState.errors.cnpj && (
                        <p className="text-sm text-red-500">{form.formState.errors.cnpj.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                      <Input id="inscricaoEstadual" {...form.register('inscricaoEstadual')} placeholder="000000000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
                      <Input id="inscricaoMunicipal" {...form.register('inscricaoMunicipal')} placeholder="000000000" />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contato" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" {...form.register('telefone')} placeholder="(11) 3000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="celular">Celular</Label>
                  <Input id="celular" {...form.register('celular')} placeholder="(11) 90000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...form.register('email')} placeholder="email@exemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailNFe">Email para NF-e</Label>
                  <Input id="emailNFe" type="email" {...form.register('emailNFe')} placeholder="nfe@exemplo.com" />
                </div>
                {tipoPessoa === TipoPessoa.JURIDICA && (
                  <div className="space-y-2">
                    <Label htmlFor="site">Site</Label>
                    <Input id="site" {...form.register('site')} placeholder="https://www.exemplo.com" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fiscal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Fiscais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="issRetido"
                    {...form.register('issRetido')}
                    className="rounded"
                  />
                  <Label htmlFor="issRetido">ISS Retido</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="consumidorFinal"
                    {...form.register('consumidorFinal')}
                    className="rounded"
                  />
                  <Label htmlFor="consumidorFinal">Consumidor Final</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="produtorRural"
                    {...form.register('produtorRural')}
                    className="rounded"
                  />
                  <Label htmlFor="produtorRural">Produtor Rural</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Informações Financeiras
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="limiteCredito">Limite de Crédito</Label>
                  <Input
                    id="limiteCredito"
                    type="number"
                    step="0.01"
                    {...form.register('limiteCredito', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="bloqueado"
                    {...form.register('bloqueado')}
                    className="rounded"
                  />
                  <Label htmlFor="bloqueado">Cliente Bloqueado</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacao">Observações</Label>
                <textarea
                  id="observacao"
                  {...form.register('observacao')}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Observações sobre o cliente..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {cliente ? 'Atualizar' : 'Criar'} Cliente
        </Button>
      </div>
    </form>
  );
}

