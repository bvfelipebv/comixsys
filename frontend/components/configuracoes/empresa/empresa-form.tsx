'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { empresaSchema, type EmpresaFormData } from '@/lib/schemas';
import { RegimeTributario, type Empresa } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Building2, MapPin, Phone } from 'lucide-react';

interface EmpresaFormProps {
  empresa?: Empresa;
  onSubmit: (data: EmpresaFormData) => Promise<void>;
  isLoading?: boolean;
}

export function EmpresaForm({ empresa, onSubmit, isLoading }: EmpresaFormProps) {
  const form = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      regimeTributario: RegimeTributario.SIMPLES_NACIONAL,
      crt: 1,
    },
  });

  useEffect(() => {
    if (empresa) {
      form.reset({
        razaoSocial: empresa.razaoSocial,
        nomeFantasia: empresa.nomeFantasia || '',
        cnpj: empresa.cnpj,
        inscricaoEstadual: empresa.inscricaoEstadual || '',
        inscricaoMunicipal: empresa.inscricaoMunicipal || '',
        regimeTributario: empresa.regimeTributario,
        crt: empresa.crt,
        cep: empresa.cep,
        logradouro: empresa.logradouro,
        numero: empresa.numero,
        complemento: empresa.complemento || '',
        bairro: empresa.bairro,
        cidade: empresa.cidade,
        uf: empresa.uf,
        codigoMunicipio: empresa.codigoMunicipio,
        telefone: empresa.telefone || '',
        celular: empresa.celular || '',
        email: empresa.email || '',
        site: empresa.site || '',
      });
    }
  }, [empresa, form]);

  const buscarCep = async () => {
    const cep = form.getValues('cep').replace(/\D/g, '');
    if (cep.length !== 8) {
      toast.error('CEP deve ter 8 dígitos');
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        form.setValue('logradouro', data.logradouro);
        form.setValue('bairro', data.bairro);
        form.setValue('cidade', data.localidade);
        form.setValue('uf', data.uf);
        form.setValue('codigoMunicipio', data.ibge);
        toast.success('CEP encontrado!');
      } else {
        toast.error('CEP não encontrado');
      }
    } catch (error) {
      toast.error('Erro ao buscar CEP');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Dados da Empresa
          </CardTitle>
          <CardDescription>Informações básicas e fiscais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="razaoSocial">Razão Social *</Label>
              <Input id="razaoSocial" {...form.register('razaoSocial')} placeholder="Empresa LTDA" />
              {form.formState.errors.razaoSocial && (
                <p className="text-sm text-red-500">{form.formState.errors.razaoSocial.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
              <Input id="nomeFantasia" {...form.register('nomeFantasia')} placeholder="Empresa" />
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
            <div className="space-y-2">
              <Label htmlFor="regimeTributario">Regime Tributário *</Label>
              <Select
                value={form.watch('regimeTributario')}
                onValueChange={(value) => form.setValue('regimeTributario', value as RegimeTributario)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={RegimeTributario.SIMPLES_NACIONAL}>Simples Nacional</SelectItem>
                  <SelectItem value={RegimeTributario.SIMPLES_NACIONAL_EXCESSO}>Simples Nacional - Excesso</SelectItem>
                  <SelectItem value={RegimeTributario.REGIME_NORMAL}>Regime Normal</SelectItem>
                  <SelectItem value={RegimeTributario.MEI}>MEI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="crt">CRT *</Label>
              <Select value={String(form.watch('crt'))} onValueChange={(value) => form.setValue('crt', Number(value))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Simples Nacional</SelectItem>
                  <SelectItem value="2">2 - Simples Nacional - Excesso</SelectItem>
                  <SelectItem value="3">3 - Regime Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Endereço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cep">CEP *</Label>
              <div className="flex gap-2">
                <Input id="cep" {...form.register('cep')} placeholder="00000000" maxLength={8} />
                <Button type="button" variant="outline" onClick={buscarCep}>Buscar</Button>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="logradouro">Logradouro *</Label>
              <Input id="logradouro" {...form.register('logradouro')} placeholder="Rua, Avenida..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero">Número *</Label>
              <Input id="numero" {...form.register('numero')} placeholder="123" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input id="complemento" {...form.register('complemento')} placeholder="Sala, Andar..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro *</Label>
              <Input id="bairro" {...form.register('bairro')} placeholder="Centro" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input id="cidade" {...form.register('cidade')} placeholder="São Paulo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uf">UF *</Label>
              <Input id="uf" {...form.register('uf')} placeholder="SP" maxLength={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigoMunicipio">Código Município *</Label>
              <Input id="codigoMunicipio" {...form.register('codigoMunicipio')} placeholder="3550308" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contato
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
              <Input id="email" type="email" {...form.register('email')} placeholder="contato@empresa.com.br" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site">Site</Label>
              <Input id="site" {...form.register('site')} placeholder="https://www.empresa.com.br" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {empresa ? 'Atualizar' : 'Criar'} Empresa
        </Button>
      </div>
    </form>
  );
}

