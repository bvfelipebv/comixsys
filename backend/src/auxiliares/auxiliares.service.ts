import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuxiliaresService {
  constructor(private prisma: PrismaService) {}

  // ============ UNIDADES ============
  async createUnidade(data: { sigla: string; descricao: string }) {
    const existing = await this.prisma.unidade.findUnique({
      where: { sigla: data.sigla },
    });

    if (existing) {
      throw new ConflictException('Sigla já cadastrada');
    }

    return this.prisma.unidade.create({ data });
  }

  async findAllUnidades() {
    return this.prisma.unidade.findMany({
      where: { ativo: true },
      orderBy: { sigla: 'asc' },
    });
  }

  async findOneUnidade(id: string) {
    const unidade = await this.prisma.unidade.findUnique({ where: { id } });
    if (!unidade) {
      throw new NotFoundException('Unidade não encontrada');
    }
    return unidade;
  }

  async updateUnidade(id: string, data: { sigla?: string; descricao?: string }) {
    await this.findOneUnidade(id);
    return this.prisma.unidade.update({ where: { id }, data });
  }

  async removeUnidade(id: string) {
    await this.findOneUnidade(id);
    return this.prisma.unidade.update({
      where: { id },
      data: { ativo: false },
    });
  }

  // ============ CATEGORIAS ============
  async createCategoria(data: { nome: string; descricao?: string }) {
    return this.prisma.categoria.create({ data });
  }

  async findAllCategorias() {
    return this.prisma.categoria.findMany({
      where: { ativo: true },
      include: { subcategorias: { where: { ativo: true } } },
      orderBy: { nome: 'asc' },
    });
  }

  async findOneCategoria(id: string) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
      include: { subcategorias: true },
    });
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }
    return categoria;
  }

  async updateCategoria(id: string, data: { nome?: string; descricao?: string }) {
    await this.findOneCategoria(id);
    return this.prisma.categoria.update({ where: { id }, data });
  }

  async removeCategoria(id: string) {
    await this.findOneCategoria(id);
    return this.prisma.categoria.update({
      where: { id },
      data: { ativo: false },
    });
  }

  // ============ SUBCATEGORIAS ============
  async createSubcategoria(data: {
    nome: string;
    descricao?: string;
    categoriaId: string;
  }) {
    return this.prisma.subcategoria.create({ data });
  }

  async findAllSubcategorias(categoriaId?: string) {
    return this.prisma.subcategoria.findMany({
      where: {
        ativo: true,
        ...(categoriaId && { categoriaId }),
      },
      include: { categoria: true },
      orderBy: { nome: 'asc' },
    });
  }

  async findOneSubcategoria(id: string) {
    const subcategoria = await this.prisma.subcategoria.findUnique({
      where: { id },
      include: { categoria: true },
    });
    if (!subcategoria) {
      throw new NotFoundException('Subcategoria não encontrada');
    }
    return subcategoria;
  }

  async updateSubcategoria(
    id: string,
    data: { nome?: string; descricao?: string; categoriaId?: string },
  ) {
    await this.findOneSubcategoria(id);
    return this.prisma.subcategoria.update({ where: { id }, data });
  }

  async removeSubcategoria(id: string) {
    await this.findOneSubcategoria(id);
    return this.prisma.subcategoria.update({
      where: { id },
      data: { ativo: false },
    });
  }

  // ============ MARCAS ============
  async createMarca(data: { nome: string; descricao?: string }) {
    return this.prisma.marca.create({ data });
  }

  async findAllMarcas() {
    return this.prisma.marca.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  async findOneMarca(id: string) {
    const marca = await this.prisma.marca.findUnique({ where: { id } });
    if (!marca) {
      throw new NotFoundException('Marca não encontrada');
    }
    return marca;
  }

  async updateMarca(id: string, data: { nome?: string; descricao?: string }) {
    await this.findOneMarca(id);
    return this.prisma.marca.update({ where: { id }, data });
  }

  async removeMarca(id: string) {
    await this.findOneMarca(id);
    return this.prisma.marca.update({
      where: { id },
      data: { ativo: false },
    });
  }

  // ============ TIPOS DE PREÇO ============
  async createTipoPreco(data: { nome: string; descricao?: string }) {
    return this.prisma.tipoPreco.create({ data });
  }

  async findAllTiposPreco() {
    return this.prisma.tipoPreco.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  async findOneTipoPreco(id: string) {
    const tipoPreco = await this.prisma.tipoPreco.findUnique({ where: { id } });
    if (!tipoPreco) {
      throw new NotFoundException('Tipo de preço não encontrado');
    }
    return tipoPreco;
  }

  async updateTipoPreco(id: string, data: { nome?: string; descricao?: string }) {
    await this.findOneTipoPreco(id);
    return this.prisma.tipoPreco.update({ where: { id }, data });
  }

  async removeTipoPreco(id: string) {
    await this.findOneTipoPreco(id);
    return this.prisma.tipoPreco.update({
      where: { id },
      data: { ativo: false },
    });
  }
}

