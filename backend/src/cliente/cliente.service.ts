import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) {}

  async create(createClienteDto: CreateClienteDto) {
    // Validar CPF ou CNPJ dependendo do tipo
    if (createClienteDto.tipo === 'FISICA') {
      if (!createClienteDto.cpf) {
        throw new BadRequestException('CPF é obrigatório para pessoa física');
      }

      // Verificar se CPF já existe
      const existingCliente = await this.prisma.cliente.findUnique({
        where: { cpf: createClienteDto.cpf },
      });

      if (existingCliente) {
        throw new ConflictException('CPF já cadastrado');
      }
    } else if (createClienteDto.tipo === 'JURIDICA') {
      if (!createClienteDto.cnpj) {
        throw new BadRequestException('CNPJ é obrigatório para pessoa jurídica');
      }

      // Verificar se CNPJ já existe
      const existingCliente = await this.prisma.cliente.findUnique({
        where: { cnpj: createClienteDto.cnpj },
      });

      if (existingCliente) {
        throw new ConflictException('CNPJ já cadastrado');
      }
    }

    const { enderecos, ...clienteData } = createClienteDto;

    return this.prisma.cliente.create({
      data: {
        ...clienteData,
        enderecos: enderecos
          ? {
              create: enderecos,
            }
          : undefined,
      },
      include: {
        enderecos: true,
        tipoPreco: true,
      },
    });
  }

  async findAll(empresaId: string, ativo?: boolean) {
    return this.prisma.cliente.findMany({
      where: {
        empresaId,
        ...(ativo !== undefined && { ativo }),
      },
      include: {
        enderecos: {
          where: { principal: true },
          take: 1,
        },
        tipoPreco: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: {
        enderecos: true,
        contatos: true,
        dadosBancarios: true,
        tipoPreco: true,
      },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return cliente;
  }

  async findByCpf(cpf: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { cpf },
      include: {
        enderecos: true,
        tipoPreco: true,
      },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente com CPF ${cpf} não encontrado`);
    }

    return cliente;
  }

  async findByCnpj(cnpj: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { cnpj },
      include: {
        enderecos: true,
        tipoPreco: true,
      },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente com CNPJ ${cnpj} não encontrado`);
    }

    return cliente;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    // Verificar se cliente existe
    await this.findOne(id);

    // Validar CPF/CNPJ se estiver sendo atualizado
    if (updateClienteDto.cpf) {
      const existingCliente = await this.prisma.cliente.findUnique({
        where: { cpf: updateClienteDto.cpf },
      });

      if (existingCliente && existingCliente.id !== id) {
        throw new ConflictException('CPF já cadastrado em outro cliente');
      }
    }

    if (updateClienteDto.cnpj) {
      const existingCliente = await this.prisma.cliente.findUnique({
        where: { cnpj: updateClienteDto.cnpj },
      });

      if (existingCliente && existingCliente.id !== id) {
        throw new ConflictException('CNPJ já cadastrado em outro cliente');
      }
    }

    const { enderecos, ...clienteData } = updateClienteDto;

    return this.prisma.cliente.update({
      where: { id },
      data: clienteData,
      include: {
        enderecos: true,
        contatos: true,
        dadosBancarios: true,
        tipoPreco: true,
      },
    });
  }

  async remove(id: string) {
    // Verificar se cliente existe
    await this.findOne(id);

    // Soft delete
    return this.prisma.cliente.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async restore(id: string) {
    // Verificar se cliente existe
    await this.findOne(id);

    return this.prisma.cliente.update({
      where: { id },
      data: { ativo: true },
    });
  }

  // Métodos para endereços
  async addEndereco(clienteId: string, enderecoData: any) {
    await this.findOne(clienteId);

    return this.prisma.enderecoCliente.create({
      data: {
        ...enderecoData,
        clienteId,
      },
    });
  }

  async updateEndereco(enderecoId: string, enderecoData: any) {
    return this.prisma.enderecoCliente.update({
      where: { id: enderecoId },
      data: enderecoData,
    });
  }

  async removeEndereco(enderecoId: string) {
    return this.prisma.enderecoCliente.delete({
      where: { id: enderecoId },
    });
  }
}

