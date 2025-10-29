'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { TipoEndereco } from '@/lib/types';
import { MapPin, Check, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Endereco {
  id?: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  principal: boolean;
  tipo: TipoEndereco;
}

interface EnderecoFormSectionProps {
  enderecos: Endereco[];
  onChange: (enderecos: Endereco[]) => void;
}

export function EnderecoFormSection({ enderecos, onChange }: EnderecoFormSectionProps) {
  const [formData, setFormData] = useState<Endereco>({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    principal: false,
    tipo: TipoEndereco.RESIDENCIAL,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const buscarCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }

      setFormData(prev => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        uf: data.uf || '',
      }));
    } catch (error) {
      toast.error('Erro ao buscar CEP');
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleCepChange = (value: string) => {
    setFormData(prev => ({ ...prev, cep: value }));
    if (value.replace(/\D/g, '').length === 8) {
      buscarCep(value);
    }
  };

  const handleAddOrUpdate = () => {
    // Validação básica
    if (!formData.cep || !formData.logradouro || !formData.numero || !formData.bairro || !formData.cidade || !formData.uf) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const novosEnderecos = [...enderecos];

    if (editingIndex !== null) {
      // Atualizar endereço existente
      novosEnderecos[editingIndex] = { ...formData };
      toast.success('Endereço atualizado!');
      setEditingIndex(null);
    } else {
      // Adicionar novo endereço
      // Se for marcado como principal, desmarcar os outros
      if (formData.principal) {
        novosEnderecos.forEach(end => end.principal = false);
      }
      novosEnderecos.push({ ...formData, id: `temp-${Date.now()}` });
      toast.success('Endereço adicionado!');
    }

    onChange(novosEnderecos);
    
    // Limpar formulário
    setFormData({
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      principal: false,
      tipo: TipoEndereco.RESIDENCIAL,
    });
  };

  const handleEdit = (index: number) => {
    setFormData(enderecos[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const novosEnderecos = enderecos.filter((_, i) => i !== index);
    onChange(novosEnderecos);
    toast.success('Endereço removido!');
    
    if (editingIndex === index) {
      setEditingIndex(null);
      setFormData({
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        principal: false,
        tipo: TipoEndereco.RESIDENCIAL,
      });
    }
  };

  const handleSetPrincipal = (index: number) => {
    const novosEnderecos = enderecos.map((end, i) => ({
      ...end,
      principal: i === index,
    }));
    onChange(novosEnderecos);
    toast.success('Endereço principal atualizado!');
  };

  const handleToggleAtivo = (index: number) => {
    // Implementar lógica de ativo/inativo se necessário
    toast.info('Funcionalidade em desenvolvimento');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Endereços
        </CardTitle>
        <CardDescription>Adicione os endereços do cliente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulário Inline */}
        <div className="grid grid-cols-12 gap-2 items-end">
          <div className="col-span-2 space-y-1">
            <Label htmlFor="cep" className="text-xs">CEP</Label>
            <div className="flex gap-1">
              <Input
                id="cep"
                value={formData.cep}
                onChange={(e) => handleCepChange(e.target.value)}
                placeholder="00000-000"
                maxLength={9}
                className="h-9"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-9 w-9 shrink-0"
                onClick={() => buscarCep(formData.cep)}
                disabled={isLoadingCep}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="col-span-3 space-y-1">
            <Label htmlFor="logradouro" className="text-xs">Endereço</Label>
            <Input
              id="logradouro"
              value={formData.logradouro}
              onChange={(e) => setFormData(prev => ({ ...prev, logradouro: e.target.value }))}
              placeholder="Rua, Avenida..."
              className="h-9"
            />
          </div>

          <div className="col-span-1 space-y-1">
            <Label htmlFor="numero" className="text-xs">Nº</Label>
            <Input
              id="numero"
              value={formData.numero}
              onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
              placeholder="123"
              className="h-9"
            />
          </div>

          <div className="col-span-2 space-y-1">
            <Label htmlFor="complemento" className="text-xs">Complemento</Label>
            <Input
              id="complemento"
              value={formData.complemento}
              onChange={(e) => setFormData(prev => ({ ...prev, complemento: e.target.value }))}
              placeholder="Apto, Sala..."
              className="h-9"
            />
          </div>

          <div className="col-span-2 space-y-1">
            <Label htmlFor="bairro" className="text-xs">Bairro</Label>
            <Input
              id="bairro"
              value={formData.bairro}
              onChange={(e) => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
              placeholder="Bairro"
              className="h-9"
            />
          </div>

          <div className="col-span-1 space-y-1">
            <Label htmlFor="cidade" className="text-xs">Cidade</Label>
            <Input
              id="cidade"
              value={formData.cidade}
              onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
              placeholder="Cidade"
              className="h-9"
              disabled
            />
          </div>

          <div className="col-span-1 space-y-1 flex items-end">
            <Button
              type="button"
              onClick={handleAddOrUpdate}
              className="h-9 w-full"
              size="sm"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabela de Endereços */}
        {enderecos.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CEP</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead className="text-center">Ativo</TableHead>
                  <TableHead className="text-center">Padrão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enderecos.map((endereco, index) => (
                  <TableRow key={endereco.id || index}>
                    <TableCell className="font-mono text-sm">{endereco.cep}</TableCell>
                    <TableCell>
                      {endereco.logradouro}, {endereco.numero} ({endereco.cidade}/{endereco.uf})
                    </TableCell>
                    <TableCell>{endereco.bairro}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleToggleAtivo(index)}
                      >
                        <div className="h-6 w-6 rounded bg-green-500 flex items-center justify-center text-white">
                          1
                        </div>
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={endereco.principal}
                        onCheckedChange={() => handleSetPrincipal(index)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handleEdit(index)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/20">
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum endereço informado para este cliente até o momento!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

