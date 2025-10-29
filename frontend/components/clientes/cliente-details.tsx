'use client';

import * as React from 'react';
import { Cliente, TipoPessoa, Sexo, TipoEndereco } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  FileText, 
  DollarSign,
  Shield,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { maskCPF, maskCNPJ, maskPhone } from '@/lib/utils/masks';

interface ClienteDetailsProps {
  cliente: Cliente;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ClienteDetails({ cliente, onEdit, onDelete }: ClienteDetailsProps) {
  const isPessoaFisica = cliente.tipo === TipoPessoa.FISICA;
  const enderecos = (cliente as any).enderecos || [];
  const enderecoPrincipal = enderecos.find((e: any) => e.principal);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '-';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return '-';
    }
  };

  const getSexoLabel = (sexo?: Sexo) => {
    if (!sexo) return '-';
    const labels = {
      [Sexo.MASCULINO]: 'Masculino',
      [Sexo.FEMININO]: 'Feminino',
      [Sexo.OUTRO]: 'Outro',
    };
    return labels[sexo] || '-';
  };

  const getTipoEnderecoLabel = (tipo: TipoEndereco) => {
    const labels = {
      [TipoEndereco.RESIDENCIAL]: 'Residencial',
      [TipoEndereco.COMERCIAL]: 'Comercial',
      [TipoEndereco.COBRANCA]: 'Cobrança',
      [TipoEndereco.ENTREGA]: 'Entrega',
      [TipoEndereco.OUTRO]: 'Outro',
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="space-y-6">
      {/* Header com Ações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {isPessoaFisica ? (
              <User className="h-6 w-6 text-primary" />
            ) : (
              <Building2 className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{cliente.nome}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={cliente.ativo ? 'default' : 'secondary'}>
                {cliente.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
              <Badge variant="outline">
                {isPessoaFisica ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </Badge>
              {cliente.bloqueado && (
                <Badge variant="destructive">Bloqueado</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button onClick={onEdit} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
          {onDelete && (
            <Button onClick={onDelete} variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          )}
        </div>
      </div>

      {/* Dados Principais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isPessoaFisica ? <User className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
            Dados {isPessoaFisica ? 'Pessoais' : 'Empresariais'}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {isPessoaFisica ? (
            <>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                <p className="text-base">{cliente.nome || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Apelido</label>
                <p className="text-base">{cliente.apelido || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">CPF</label>
                <p className="text-base">{cliente.cpf ? maskCPF(cliente.cpf) : '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">RG</label>
                <p className="text-base">{cliente.rg || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Órgão Emissor</label>
                <p className="text-base">{cliente.rgEmissor ? `${cliente.rgEmissor}/${cliente.rgUf}` : '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Sexo</label>
                <p className="text-base">{getSexoLabel(cliente.sexo)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data de Nascimento</label>
                <p className="text-base">{formatDate(cliente.dataNascimento)}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Razão Social</label>
                <p className="text-base">{cliente.razaoSocial || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome Fantasia</label>
                <p className="text-base">{cliente.nomeFantasia || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
                <p className="text-base">{cliente.cnpj ? maskCNPJ(cliente.cnpj) : '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Inscrição Estadual</label>
                <p className="text-base">{cliente.inscricaoEstadual || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Inscrição Municipal</label>
                <p className="text-base">{cliente.inscricaoMunicipal || '-'}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dados de Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone
            </label>
            <p className="text-base">{cliente.telefone ? maskPhone(cliente.telefone) : '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Celular
            </label>
            <p className="text-base">{cliente.celular ? maskPhone(cliente.celular) : '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              E-mail
            </label>
            <p className="text-base">{cliente.email || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              E-mail NF-e
            </label>
            <p className="text-base">{cliente.emailNFe || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Site
            </label>
            <p className="text-base">{cliente.site || '-'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Endereços */}
      {enderecos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereços
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {enderecos.map((endereco: any, index: number) => (
              <div key={endereco.id || index}>
                {index > 0 && <Separator className="my-4" />}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={endereco.principal ? 'default' : 'outline'}>
                      {getTipoEnderecoLabel(endereco.tipo)}
                    </Badge>
                    {endereco.principal && (
                      <Badge variant="secondary">Principal</Badge>
                    )}
                  </div>
                  <p className="text-base">
                    {endereco.logradouro}, {endereco.numero}
                    {endereco.complemento && ` - ${endereco.complemento}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {endereco.bairro} - {endereco.cidade}/{endereco.uf}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CEP: {endereco.cep}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Dados Fiscais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Informações Fiscais
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">ISS Retido</label>
            <p className="text-base">{cliente.issRetido ? 'Sim' : 'Não'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Consumidor Final</label>
            <p className="text-base">{cliente.consumidorFinal ? 'Sim' : 'Não'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Produtor Rural</label>
            <p className="text-base">{cliente.produtorRural ? 'Sim' : 'Não'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Dados Financeiros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Informações Financeiras
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Limite de Crédito</label>
            <p className="text-base">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(cliente.limiteCredito) || 0)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <p className="text-base">
              {cliente.bloqueado ? (
                <Badge variant="destructive">Bloqueado</Badge>
              ) : (
                <Badge variant="default">Liberado</Badge>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Observações */}
      {cliente.observacao && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base whitespace-pre-wrap">{cliente.observacao}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

