import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresaService {
  constructor(private prisma: PrismaService) {}

  async create(createEmpresaDto: CreateEmpresaDto) {
    // Verificar se CNPJ já existe
    const existingEmpresa = await this.prisma.empresa.findUnique({
      where: { cnpj: createEmpresaDto.cnpj },
    });

    if (existingEmpresa) {
      throw new ConflictException('CNPJ já cadastrado');
    }

    return this.prisma.empresa.create({
      data: createEmpresaDto,
    });
  }

  async findAll() {
    return this.prisma.empresa.findMany({
      where: { ativo: true },
      orderBy: { razaoSocial: 'asc' },
    });
  }

  async findOne(id: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id },
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }

    return empresa;
  }

  async findByCnpj(cnpj: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { cnpj },
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa com CNPJ ${cnpj} não encontrada`);
    }

    return empresa;
  }

  async update(id: string, updateEmpresaDto: UpdateEmpresaDto) {
    // Verificar se empresa existe
    await this.findOne(id);

    // Se está atualizando CNPJ, verificar se não existe outro com mesmo CNPJ
    if (updateEmpresaDto.cnpj) {
      const existingEmpresa = await this.prisma.empresa.findUnique({
        where: { cnpj: updateEmpresaDto.cnpj },
      });

      if (existingEmpresa && existingEmpresa.id !== id) {
        throw new ConflictException('CNPJ já cadastrado em outra empresa');
      }
    }

    return this.prisma.empresa.update({
      where: { id },
      data: updateEmpresaDto,
    });
  }

  async remove(id: string) {
    // Verificar se empresa existe
    await this.findOne(id);

    // Soft delete
    return this.prisma.empresa.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async restore(id: string) {
    // Verificar se empresa existe
    await this.findOne(id);

    return this.prisma.empresa.update({
      where: { id },
      data: { ativo: true },
    });
  }
}

