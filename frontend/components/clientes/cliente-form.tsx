'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clienteSchema, type ClienteFormData } from '@/lib/schemas';
import { TipoPessoa, Sexo, TipoEndereco, type Cliente } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { maskCPF, maskCNPJ, maskPhoneAuto, unmask } from '@/lib/utils/masks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
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
      nome: '',
      apelido: '',
      cpf: '',
      rg: '',
      rgEmissor: '',
      rgUf: '',
      sexo: undefined,
      dataNascimento: '',
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      inscricaoEstadual: '',
      inscricaoMunicipal: '',
      indicadorIE: 9,
      telefone: '',
      celular: '',
      email: '',
      emailNFe: '',
      site: '',
      issRetido: false,
      consumidorFinal: true,
      produtorRural: false,
      bloqueado: false,
      limiteCredito: 0,
      observacao: '',
      tipoPrecoId: '',
      enderecos: [],
    },
  });

  const tipoPessoa = form.watch('tipo');

  // Limpar campos ao trocar tipo de pessoa
  React.useEffect(() => {
    if (!cliente) { // Só limpa se não estiver editando
      if (tipoPessoa === TipoPessoa.FISICA) {
        // Limpar campos de PJ
        form.setValue('cnpj', '');
        form.setValue('razaoSocial', '');
        form.setValue('nomeFantasia', '');
        form.setValue('inscricaoEstadual', '');
        form.setValue('inscricaoMunicipal', '');
      } else {
        // Limpar campos de PF
        form.setValue('cpf', '');
        form.setValue('apelido', '');
        form.setValue('rg', '');
        form.setValue('rgEmissor', '');
        form.setValue('rgUf', '');
        form.setValue('sexo', undefined);
        form.setValue('dataNascimento', '');
      }
    }
  }, [tipoPessoa, form, cliente]);

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

  const handleFormSubmit = (data: ClienteFormData) => {
    console.log('📝 Dados do formulário:', data);
    console.log('📍 Endereços:', enderecos);

    // Limpar campos vazios e formatar dados
    const cleanData: any = {
      ...data,
      // Remover campos vazios de strings (já estão sem máscara)
      apelido: data.apelido || undefined,
      cpf: data.cpf || undefined,
      rg: data.rg || undefined,
      rgEmissor: data.rgEmissor || undefined,
      rgUf: data.rgUf || undefined,
      dataNascimento: data.dataNascimento || undefined,
      razaoSocial: data.razaoSocial || undefined,
      nomeFantasia: data.nomeFantasia || undefined,
      cnpj: data.cnpj || undefined,
      inscricaoEstadual: data.inscricaoEstadual || undefined,
      inscricaoMunicipal: data.inscricaoMunicipal || undefined,
      telefone: data.telefone || undefined,
      celular: data.celular || undefined,
      email: data.email || undefined,
      emailNFe: data.emailNFe || undefined,
      site: data.site || undefined,
      observacao: data.observacao || undefined,
      tipoPrecoId: (data.tipoPrecoId && data.tipoPrecoId !== '') ? data.tipoPrecoId : undefined,
      // Garantir valores booleanos
      issRetido: data.issRetido ?? false,
      consumidorFinal: data.consumidorFinal ?? true,
      produtorRural: data.produtorRural ?? false,
      bloqueado: data.bloqueado ?? false,
      // Garantir valores numéricos
      limiteCredito: Number(data.limiteCredito) || 0,
      indicadorIE: Number(data.indicadorIE) || 9,
      // Endereços
      enderecos: enderecos.map(end => ({
        tipo: end.tipo,
        cep: end.cep.replace(/\D/g, ''),
        logradouro: end.logradouro,
        numero: end.numero,
        complemento: end.complemento || undefined,
        bairro: end.bairro,
        cidade: end.cidade,
        uf: end.uf,
        principal: end.principal ?? false,
      })),
    };

    // Remover campos undefined
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === undefined) {
        delete cleanData[key];
      }
    });

    console.log('✅ Dados limpos para enviar:', cleanData);

    onSubmit(cleanData);
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Dados Principais */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Tipo de Pessoa */}
          <div className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-12 md:col-span-6 space-y-1.5">
              <Label className="text-sm font-medium">Tipo de Pessoa *</Label>
              <ToggleGroup
                type="single"
                value={form.watch('tipo')}
                onValueChange={(value) => value && form.setValue('tipo', value as TipoPessoa)}
                className="justify-start"
              >
                <ToggleGroupItem value={TipoPessoa.FISICA} aria-label="Pessoa Física" className="gap-2 h-9">
                  <User className="h-3.5 w-3.5" />
                  Física
                </ToggleGroupItem>
                <ToggleGroupItem value={TipoPessoa.JURIDICA} aria-label="Pessoa Jurídica" className="gap-2 h-9">
                  <Building2 className="h-3.5 w-3.5" />
                  Jurídica
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="col-span-6 md:col-span-2 space-y-1.5">
              <Label htmlFor="bloqueado" className="text-sm">Bloqueado</Label>
              <div className="flex items-center h-9">
                <Switch
                  id="bloqueado"
                  checked={form.watch('bloqueado')}
                  onCheckedChange={(checked) => form.setValue('bloqueado', checked)}
                  className="data-[state=checked]:bg-red-600"
                />
              </div>
            </div>

            <div className="col-span-6 md:col-span-4 space-y-1.5">
              <Label htmlFor="tipoPrecoId" className="text-sm">Lista de Preços</Label>
              <Select
                value={form.watch('tipoPrecoId') || ''}
                onValueChange={(value) => form.setValue('tipoPrecoId', value)}
              >
                <SelectTrigger className="h-9 w-full"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="padrao">Padrão</SelectItem>
                  <SelectItem value="promocional">Promocional</SelectItem>
                  <SelectItem value="atacado">Atacado</SelectItem>
                  <SelectItem value="varejo">Varejo</SelectItem>
                  {/* TODO: Carregar tipos de preço do backend */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Campos condicionais baseados no tipo */}
          <div className="grid grid-cols-12 gap-3">
            {tipoPessoa === TipoPessoa.FISICA ? (
              <>
                <div className="col-span-12 md:col-span-7 space-y-1.5">
                  <Label htmlFor="nome" className="text-sm">Nome Completo *</Label>
                  <Input id="nome" {...form.register('nome')} placeholder="Nome completo" className="h-9" />
                  {form.formState.errors.nome && (
                    <p className="text-xs text-destructive">{form.formState.errors.nome.message}</p>
                  )}
                </div>
                <div className="col-span-12 md:col-span-3 space-y-1.5">
                  <Label htmlFor="cpf" className="text-sm">CPF *</Label>
                  <Input
                    id="cpf"
                    value={maskCPF(form.watch('cpf') ?? '')}
                    onChange={(e) => form.setValue('cpf', unmask(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="h-9"
                  />
                  {form.formState.errors.cpf && (
                    <p className="text-xs text-destructive">{form.formState.errors.cpf.message}</p>
                  )}
                </div>
                <div className="col-span-12 md:col-span-2 space-y-1.5">
                  <Label htmlFor="sexo" className="text-sm">Sexo</Label>
                  <Select
                    value={form.watch('sexo') || ''}
                    onValueChange={(value) => form.setValue('sexo', value as Sexo)}
                  >
                    <SelectTrigger className="h-9 w-full"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Sexo.MASCULINO}>Masculino</SelectItem>
                      <SelectItem value={Sexo.FEMININO}>Feminino</SelectItem>
                      <SelectItem value={Sexo.OUTRO}>Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-12 md:col-span-5 space-y-1.5">
                  <Label htmlFor="apelido" className="text-sm">Apelido</Label>
                  <Input id="apelido" {...form.register('apelido')} placeholder="Como prefere ser chamado" className="h-9" />
                </div>
                <div className="col-span-12 md:col-span-3 space-y-1.5">
                  <Label htmlFor="rg" className="text-sm">RG</Label>
                  <Input id="rg" {...form.register('rg')} placeholder="00.000.000-0" className="h-9" />
                </div>
                <div className="col-span-12 md:col-span-2 space-y-1.5">
                  <Label htmlFor="dataNascimento" className="text-sm">Aniversário</Label>
                  <Input id="dataNascimento" type="date" {...form.register('dataNascimento')} className="h-9" />
                </div>
                <div className="col-span-12 md:col-span-2 space-y-1.5">
                  <Label htmlFor="rgEmissor" className="text-sm">Emissor</Label>
                  <Input id="rgEmissor" {...form.register('rgEmissor')} placeholder="SSP" className="h-9" />
                </div>
                <div className="col-span-12 md:col-span-1 space-y-1.5">
                  <Label htmlFor="rgUf" className="text-sm">UF</Label>
                  <Input id="rgUf" {...form.register('rgUf')} placeholder="SP" maxLength={2} className="uppercase h-9" />
                </div>
              </>
            ) : (
              <>
                <div className="col-span-12 md:col-span-4 space-y-1.5">
                  <Label htmlFor="cnpj" className="text-sm">CNPJ *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cnpj"
                      value={maskCNPJ(form.watch('cnpj') ?? '')}
                      onChange={(e) => handleCnpjChange(unmask(e.target.value))}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                      className="h-9"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => buscarCnpj(form.watch('cnpj') ?? '')}
                      disabled={isLoadingCnpj}
                      className="h-9 w-9 shrink-0"
                    >
                      {isLoadingCnpj ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Search className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  {form.formState.errors.cnpj && (
                    <p className="text-xs text-destructive">{form.formState.errors.cnpj.message}</p>
                  )}
                </div>
                <div className="col-span-12 md:col-span-8 space-y-1.5">
                  <Label htmlFor="nome" className="text-sm">Razão Social *</Label>
                  <Input id="nome" {...form.register('nome')} placeholder="Razão social da empresa" className="h-9" />
                  {form.formState.errors.nome && (
                    <p className="text-xs text-destructive">{form.formState.errors.nome.message}</p>
                  )}
                </div>
                <div className="col-span-12 md:col-span-5 space-y-1.5">
                  <Label htmlFor="indicadorIE" className="text-sm">Indicador da IE</Label>
                  <Select
                    value={String(form.watch('indicadorIE'))}
                    onValueChange={(value) => form.setValue('indicadorIE', Number(value))}
                  >
                    <SelectTrigger className="h-9 w-full"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Contribuinte ICMS</SelectItem>
                      <SelectItem value="2">2 - Contribuinte isento</SelectItem>
                      <SelectItem value="9">9 - Não Contribuinte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-12 md:col-span-7 space-y-1.5">
                  <Label htmlFor="nomeFantasia" className="text-sm">Nome Fantasia</Label>
                  <Input id="nomeFantasia" {...form.register('nomeFantasia')} placeholder="Nome fantasia" className="h-9" />
                </div>
                <div className="col-span-12 md:col-span-6 space-y-1.5">
                  <Label htmlFor="inscricaoEstadual" className="text-sm">Inscrição Estadual</Label>
                  <Input id="inscricaoEstadual" {...form.register('inscricaoEstadual')} placeholder="000.000.000.000" className="h-9" />
                </div>
                <div className="col-span-12 md:col-span-6 space-y-1.5">
                  <Label htmlFor="inscricaoMunicipal" className="text-sm">Inscrição Municipal</Label>
                  <Input id="inscricaoMunicipal" {...form.register('inscricaoMunicipal')} placeholder="000000000" className="h-9" />
                </div>
              </>
            )}
          </div>

          <Separator className="my-4" />

          {/* Contato */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-3 space-y-1.5">
              <Label htmlFor="telefone" className="text-sm">Telefone</Label>
              <Input
                id="telefone"
                value={maskPhoneAuto(form.watch('telefone') ?? '')}
                onChange={(e) => form.setValue('telefone', unmask(e.target.value))}
                placeholder="(00) 0000-0000"
                maxLength={15}
                className="h-9"
              />
            </div>
            <div className="col-span-12 md:col-span-3 space-y-1.5">
              <Label htmlFor="celular" className="text-sm">Celular</Label>
              <Input
                id="celular"
                value={maskPhoneAuto(form.watch('celular') ?? '')}
                onChange={(e) => form.setValue('celular', unmask(e.target.value))}
                placeholder="(00) 00000-0000"
                maxLength={15}
                className="h-9"
              />
            </div>
            <div className="col-span-12 md:col-span-6 space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" {...form.register('email')} placeholder="email@exemplo.com" className="h-9" />
            </div>
            {tipoPessoa === TipoPessoa.JURIDICA && (
              <div className="col-span-12 space-y-1.5">
                <Label htmlFor="site" className="text-sm">Site</Label>
                <Input id="site" {...form.register('site')} placeholder="Ex: http://www.site.com.br" className="h-9" />
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Observação e Limite de Crédito */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-9 space-y-1.5">
              <Label htmlFor="observacao" className="text-sm">Observação</Label>
              <Textarea id="observacao" {...form.register('observacao')} placeholder="Informações adicionais sobre o cliente" rows={2} className="resize-none" />
            </div>
            <div className="col-span-12 md:col-span-3 space-y-1.5">
              <Label htmlFor="limiteCredito" className="text-sm">Limite de Crédito</Label>
              <Input
                id="limiteCredito"
                type="number"
                step="0.01"
                {...form.register('limiteCredito', { valueAsNumber: true })}
                placeholder="R$ 0,00"
                className="h-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados Fiscais */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="emailNFe" className="text-sm">Email do Destinatário da NFe</Label>
            <Input id="emailNFe" type="email" {...form.register('emailNFe')} placeholder="nfe@exemplo.com" className="h-9" />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="issRetido"
                checked={form.watch('issRetido')}
                onCheckedChange={(checked) => form.setValue('issRetido', checked as boolean)}
              />
              <Label htmlFor="issRetido" className="cursor-pointer text-sm">ISS Retido na Fonte?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consumidorFinal"
                checked={form.watch('consumidorFinal')}
                onCheckedChange={(checked) => form.setValue('consumidorFinal', checked as boolean)}
              />
              <Label htmlFor="consumidorFinal" className="cursor-pointer text-sm">Consumidor Final?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="produtorRural"
                checked={form.watch('produtorRural')}
                onCheckedChange={(checked) => form.setValue('produtorRural', checked as boolean)}
              />
              <Label htmlFor="produtorRural" className="cursor-pointer text-sm">Produtor Rural?</Label>
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

