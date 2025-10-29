import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) {}

  async create(createProdutoDto: CreateProdutoDto) {
    // Verificar se código já existe
    const existingProduto = await this.prisma.produto.findUnique({
      where: { codigo: createProdutoDto.codigo },
    });

    if (existingProduto) {
      throw new ConflictException('Código de produto já cadastrado');
    }

    const { precos, composicao, ...produtoData } = createProdutoDto;

    return this.prisma.produto.create({
      data: {
        ...produtoData,
        precos: precos
          ? {
              create: precos,
            }
          : undefined,
        composicao: composicao
          ? {
              create: composicao,
            }
          : undefined,
      },
      include: {
        unidade: true,
        categoria: true,
        subcategoria: true,
        marca: true,
        precos: {
          include: {
            tipoPreco: true,
          },
        },
        composicao: {
          include: {
            produtoComponente: true,
          },
        },
      },
    });
  }

  async findAll(empresaId: string, ativo?: boolean) {
    return this.prisma.produto.findMany({
      where: {
        empresaId,
        ...(ativo !== undefined && { ativo }),
      },
      include: {
        unidade: true,
        categoria: true,
        subcategoria: true,
        marca: true,
      },
      orderBy: { descricao: 'asc' },
    });
  }

  async findOne(id: string) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: {
        unidade: true,
        categoria: true,
        subcategoria: true,
        marca: true,
        precos: {
          include: {
            tipoPreco: true,
          },
        },
        composicao: {
          include: {
            produtoComponente: {
              include: {
                unidade: true,
              },
            },
          },
        },
      },
    });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return produto;
  }

  async findByCodigo(codigo: string) {
    const produto = await this.prisma.produto.findUnique({
      where: { codigo },
      include: {
        unidade: true,
        categoria: true,
        marca: true,
      },
    });

    if (!produto) {
      throw new NotFoundException(`Produto com código ${codigo} não encontrado`);
    }

    return produto;
  }

  async findEstoqueBaixo(empresaId: string) {
    return this.prisma.produto.findMany({
      where: {
        empresaId,
        ativo: true,
        movimentaEstoque: true,
        estoqueAtual: {
          lte: this.prisma.produto.fields.estoqueMinimo,
        },
      },
      include: {
        unidade: true,
        categoria: true,
      },
      orderBy: { estoqueAtual: 'asc' },
    });
  }

  async update(id: string, updateProdutoDto: UpdateProdutoDto) {
    // Verificar se produto existe
    await this.findOne(id);

    // Se está atualizando código, verificar se não existe outro com mesmo código
    if (updateProdutoDto.codigo) {
      const existingProduto = await this.prisma.produto.findUnique({
        where: { codigo: updateProdutoDto.codigo },
      });

      if (existingProduto && existingProduto.id !== id) {
        throw new ConflictException('Código já cadastrado em outro produto');
      }
    }

    const { precos, composicao, ...produtoData } = updateProdutoDto;

    return this.prisma.produto.update({
      where: { id },
      data: produtoData,
      include: {
        unidade: true,
        categoria: true,
        subcategoria: true,
        marca: true,
        precos: {
          include: {
            tipoPreco: true,
          },
        },
        composicao: {
          include: {
            produtoComponente: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Verificar se produto existe
    await this.findOne(id);

    // Soft delete
    return this.prisma.produto.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async restore(id: string) {
    // Verificar se produto existe
    await this.findOne(id);

    return this.prisma.produto.update({
      where: { id },
      data: { ativo: true },
    });
  }

  async updateEstoque(id: string, quantidade: number, operacao: 'adicionar' | 'remover') {
    const produto = await this.findOne(id);

    if (!produto.movimentaEstoque) {
      throw new ConflictException('Este produto não movimenta estoque');
    }

    const novoEstoque =
      operacao === 'adicionar'
        ? Number(produto.estoqueAtual) + quantidade
        : Number(produto.estoqueAtual) - quantidade;

    return this.prisma.produto.update({
      where: { id },
      data: { estoqueAtual: novoEstoque },
    });
  }
}

