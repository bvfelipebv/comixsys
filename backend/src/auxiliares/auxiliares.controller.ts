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
import { AuxiliaresService } from './auxiliares.service';

@Controller('auxiliares')
export class AuxiliaresController {
  constructor(private readonly auxiliaresService: AuxiliaresService) {}

  // ============ UNIDADES ============
  @Post('unidades')
  @HttpCode(HttpStatus.CREATED)
  createUnidade(@Body() data: { sigla: string; descricao: string }) {
    return this.auxiliaresService.createUnidade(data);
  }

  @Get('unidades')
  findAllUnidades() {
    return this.auxiliaresService.findAllUnidades();
  }

  @Get('unidades/:id')
  findOneUnidade(@Param('id') id: string) {
    return this.auxiliaresService.findOneUnidade(id);
  }

  @Patch('unidades/:id')
  updateUnidade(@Param('id') id: string, @Body() data: any) {
    return this.auxiliaresService.updateUnidade(id, data);
  }

  @Delete('unidades/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeUnidade(@Param('id') id: string) {
    return this.auxiliaresService.removeUnidade(id);
  }

  // ============ CATEGORIAS ============
  @Post('categorias')
  @HttpCode(HttpStatus.CREATED)
  createCategoria(@Body() data: { nome: string; descricao?: string }) {
    return this.auxiliaresService.createCategoria(data);
  }

  @Get('categorias')
  findAllCategorias() {
    return this.auxiliaresService.findAllCategorias();
  }

  @Get('categorias/:id')
  findOneCategoria(@Param('id') id: string) {
    return this.auxiliaresService.findOneCategoria(id);
  }

  @Patch('categorias/:id')
  updateCategoria(@Param('id') id: string, @Body() data: any) {
    return this.auxiliaresService.updateCategoria(id, data);
  }

  @Delete('categorias/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeCategoria(@Param('id') id: string) {
    return this.auxiliaresService.removeCategoria(id);
  }

  // ============ SUBCATEGORIAS ============
  @Post('subcategorias')
  @HttpCode(HttpStatus.CREATED)
  createSubcategoria(@Body() data: any) {
    return this.auxiliaresService.createSubcategoria(data);
  }

  @Get('subcategorias')
  findAllSubcategorias(@Query('categoriaId') categoriaId?: string) {
    return this.auxiliaresService.findAllSubcategorias(categoriaId);
  }

  @Get('subcategorias/:id')
  findOneSubcategoria(@Param('id') id: string) {
    return this.auxiliaresService.findOneSubcategoria(id);
  }

  @Patch('subcategorias/:id')
  updateSubcategoria(@Param('id') id: string, @Body() data: any) {
    return this.auxiliaresService.updateSubcategoria(id, data);
  }

  @Delete('subcategorias/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeSubcategoria(@Param('id') id: string) {
    return this.auxiliaresService.removeSubcategoria(id);
  }

  // ============ MARCAS ============
  @Post('marcas')
  @HttpCode(HttpStatus.CREATED)
  createMarca(@Body() data: { nome: string; descricao?: string }) {
    return this.auxiliaresService.createMarca(data);
  }

  @Get('marcas')
  findAllMarcas() {
    return this.auxiliaresService.findAllMarcas();
  }

  @Get('marcas/:id')
  findOneMarca(@Param('id') id: string) {
    return this.auxiliaresService.findOneMarca(id);
  }

  @Patch('marcas/:id')
  updateMarca(@Param('id') id: string, @Body() data: any) {
    return this.auxiliaresService.updateMarca(id, data);
  }

  @Delete('marcas/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMarca(@Param('id') id: string) {
    return this.auxiliaresService.removeMarca(id);
  }

  // ============ TIPOS DE PREÇO ============
  @Post('tipos-preco')
  @HttpCode(HttpStatus.CREATED)
  createTipoPreco(@Body() data: { nome: string; descricao?: string }) {
    return this.auxiliaresService.createTipoPreco(data);
  }

  @Get('tipos-preco')
  findAllTiposPreco() {
    return this.auxiliaresService.findAllTiposPreco();
  }

  @Get('tipos-preco/:id')
  findOneTipoPreco(@Param('id') id: string) {
    return this.auxiliaresService.findOneTipoPreco(id);
  }

  @Patch('tipos-preco/:id')
  updateTipoPreco(@Param('id') id: string, @Body() data: any) {
    return this.auxiliaresService.updateTipoPreco(id, data);
  }

  @Delete('tipos-preco/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTipoPreco(@Param('id') id: string) {
    return this.auxiliaresService.removeTipoPreco(id);
  }
}

