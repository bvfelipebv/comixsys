'use client';

import * as React from 'react';
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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Loader2, User, Building2, Phone, Mail, Globe, DollarSign, FileText, Shield, Search } from 'lucide-react';
import { EnderecoFormSection } from './endereco-form-section';
import { toast } from 'sonner';

interface ClienteFormProps {
  cliente?: Cliente;
  empresaId: string;
  onSubmit: (data: ClienteFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ClienteForm({ cliente, empresaId, onSubmit, isLoading }: ClienteFormProps) {
  const [enderecos, setEnderecos] = React.useState<any[]>([]);
  const [isLoadingCnpj, setIsLoadingCnpj] = React.useState(false);

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
      enderecos: [],
    },
  });

  const tipoPessoa = form.watch('tipo');

  const buscarCnpj = async (cnpj: string) => {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length !== 14) return;

    setIsLoadingCnpj(true);
    try {
      const response = await fetch(`https://publica.cnpj.ws/cnpj/${cnpjLimpo}`);

      if (!response.ok) {
        toast.error('CNPJ não encontrado');
        return;
      }

      const data = await response.json();

      // Preencher dados da empresa
      form.setValue('nome', data.razao_social || '');
      form.setValue('razaoSocial', data.razao_social || '');
      form.setValue('nomeFantasia', data.estabelecimento?.nome_fantasia || '');

      // Inscrição Estadual
      if (data.estabelecimento?.inscricoes_estaduais?.length > 0) {
        const ieAtiva = data.estabelecimento.inscricoes_estaduais.find((ie: any) => ie.ativo);
        if (ieAtiva) {
          form.setValue('inscricaoEstadual', ieAtiva.inscricao_estadual || '');
        }
      }

      // Contato
      if (data.estabelecimento?.email) {
        form.setValue('email', data.estabelecimento.email);
      }

      if (data.estabelecimento?.ddd1 && data.estabelecimento?.telefone1) {
        form.setValue('telefone', `(${data.estabelecimento.ddd1}) ${data.estabelecimento.telefone1}`);
      }

      // Endereço
      if (data.estabelecimento) {
        const est = data.estabelecimento;
        const novoEndereco = {
          id: `temp-${Date.now()}`,
          cep: est.cep || '',
          logradouro: `${est.tipo_logradouro || ''} ${est.logradouro || ''}`.trim(),
          numero: est.numero || '',
          complemento: est.complemento || '',
          bairro: est.bairro || '',
          cidade: est.cidade?.nome || '',
          uf: est.estado?.sigla || '',
          principal: true,
          tipo: TipoEndereco.COMERCIAL,
        };

        setEnderecos([novoEndereco]);
        form.setValue('enderecos', [novoEndereco] as any);
      }

      toast.success('Dados do CNPJ carregados com sucesso!');
    } catch (error) {
      toast.error('Erro ao buscar CNPJ');
      console.error(error);
    } finally {
      setIsLoadingCnpj(false);
    }
  };

  const handleCnpjChange = (value: string) => {
    form.setValue('cnpj', value);
    if (value.replace(/\D/g, '').length === 14) {
      buscarCnpj(value);
    }
  };

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
        enderecos: [],
      });
      // Carregar endereços se existirem
      if ((cliente as any).enderecos) {
        setEnderecos((cliente as any).enderecos);
      }
    }
  }, [cliente, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Ficha Cadastral */}
      <Card>
        <CardHeader>
          <CardTitle>Ficha Cadastral</CardTitle>
          <CardDescription>Informações básicas do cliente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tipo de Pessoa */}
          <div className="space-y-3">
            <Label>Pessoa Física ou Jurídica? *</Label>
            <ToggleGroup
              type="single"
              value={form.watch('tipo')}
              onValueChange={(value) => value && form.setValue('tipo', value as TipoPessoa)}
              className="justify-start"
            >
              <ToggleGroupItem value={TipoPessoa.FISICA} aria-label="Pessoa Física" className="gap-2">
                <User className="h-4 w-4" />
                Física
              </ToggleGroupItem>
              <ToggleGroupItem value={TipoPessoa.JURIDICA} aria-label="Pessoa Jurídica" className="gap-2">
                <Building2 className="h-4 w-4" />
                Jurídica
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <Separator />

          {/* Campos condicionais baseados no tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nome">{tipoPessoa === TipoPessoa.FISICA ? 'Nome Completo' : 'Razão Social'} *</Label>
              <Input id="nome" {...form.register('nome')} placeholder={tipoPessoa === TipoPessoa.FISICA ? 'Nome completo' : 'Razão social da empresa'} />
              {form.formState.errors.nome && (
                <p className="text-sm text-destructive">{form.formState.errors.nome.message}</p>
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
                  <Input id="cpf" {...form.register('cpf')} placeholder="000.000.000-00" maxLength={11} />
                  {form.formState.errors.cpf && (
                    <p className="text-sm text-destructive">{form.formState.errors.cpf.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rg">RG</Label>
                  <Input id="rg" {...form.register('rg')} placeholder="00.000.000-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rgEmissor">Emissor</Label>
                  <Input id="rgEmissor" {...form.register('rgEmissor')} placeholder="SSP" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rgUf">UF</Label>
                  <Input id="rgUf" {...form.register('rgUf')} placeholder="SP" maxLength={2} className="uppercase" />
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
                  <Label htmlFor="dataNascimento">Aniversário</Label>
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
                  <div className="flex gap-2">
                    <Input
                      id="cnpj"
                      value={form.watch('cnpj') || ''}
                      onChange={(e) => handleCnpjChange(e.target.value)}
                      placeholder="00.000.000/0000-00"
                      maxLength={14}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => buscarCnpj(form.watch('cnpj') || '')}
                      disabled={isLoadingCnpj}
                    >
                      {isLoadingCnpj ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {form.formState.errors.cnpj && (
                    <p className="text-sm text-destructive">{form.formState.errors.cnpj.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                  <Input id="inscricaoEstadual" {...form.register('inscricaoEstadual')} placeholder="000.000.000.000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
                  <Input id="inscricaoMunicipal" {...form.register('inscricaoMunicipal')} placeholder="000000000" />
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* Contato */}
          <div>
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" {...form.register('telefone')} placeholder="(00) 0000-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="celular">Celular</Label>
                <Input id="celular" {...form.register('celular')} placeholder="(00) 00000-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register('email')} placeholder="email@exemplo.com" />
              </div>
              {tipoPessoa === TipoPessoa.JURIDICA && (
                <div className="space-y-2">
                  <Label htmlFor="site">Site</Label>
                  <Input id="site" {...form.register('site')} placeholder="Ex: http://www.site.com.br" />
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Observação */}
          <div className="space-y-2">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea id="observacao" {...form.register('observacao')} placeholder="Informações adicionais sobre o cliente" rows={3} />
          </div>

          <Separator />

          {/* Limite de Crédito */}
          <div className="space-y-2">
            <Label htmlFor="limiteCredito" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Limite de Crédito
            </Label>
            <Input
              id="limiteCredito"
              type="number"
              step="0.01"
              {...form.register('limiteCredito', { valueAsNumber: true })}
              placeholder="R$ 0,00"
            />
          </div>
        </CardContent>
      </Card>

      {/* Dados Fiscais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Dados Fiscais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emailNFe">Email do Destinatário da NFe</Label>
            <Input id="emailNFe" type="email" {...form.register('emailNFe')} placeholder="nfe@exemplo.com" />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="issRetido"
                checked={form.watch('issRetido')}
                onCheckedChange={(checked) => form.setValue('issRetido', checked as boolean)}
              />
              <Label htmlFor="issRetido" className="cursor-pointer">ISS Retido na Fonte?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consumidorFinal"
                checked={form.watch('consumidorFinal')}
                onCheckedChange={(checked) => form.setValue('consumidorFinal', checked as boolean)}
              />
              <Label htmlFor="consumidorFinal" className="cursor-pointer">Consumidor Final?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="produtorRural"
                checked={form.watch('produtorRural')}
                onCheckedChange={(checked) => form.setValue('produtorRural', checked as boolean)}
              />
              <Label htmlFor="produtorRural" className="cursor-pointer">Produtor Rural?</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endereços */}
      <EnderecoFormSection
        enderecos={enderecos}
        onChange={(novosEnderecos) => {
          setEnderecos(novosEnderecos);
          form.setValue('enderecos', novosEnderecos as any);
        }}
      />

      {/* Botões de Ação */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {cliente ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
        </Button>
      </div>
    </form>
  );
}

