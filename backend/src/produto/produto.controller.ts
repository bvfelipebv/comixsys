import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtoService.create(createProdutoDto);
  }

  @Get()
  findAll(@Query('empresaId') empresaId: string, @Query('ativo') ativo?: string) {
    const ativoBoolean = ativo === 'true' ? true : ativo === 'false' ? false : undefined;
    return this.produtoService.findAll(empresaId, ativoBoolean);
  }

  @Get('estoque-baixo')
  findEstoqueBaixo(@Query('empresaId') empresaId: string) {
    return this.produtoService.findEstoqueBaixo(empresaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtoService.findOne(id);
  }

  @Get('codigo/:codigo')
  findByCodigo(@Param('codigo') codigo: string) {
    return this.produtoService.findByCodigo(codigo);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
    return this.produtoService.update(id, updateProdutoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.produtoService.remove(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.produtoService.restore(id);
  }

  @Patch(':id/estoque')
  updateEstoque(
    @Param('id') id: string,
    @Body() body: { quantidade: number; operacao: 'adicionar' | 'remover' },
  ) {
    return this.produtoService.updateEstoque(id, body.quantidade, body.operacao);
  }
}

