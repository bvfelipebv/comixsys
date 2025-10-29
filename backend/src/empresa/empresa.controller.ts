import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Controller('empresas')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.empresaService.create(createEmpresaDto);
  }

  @Get()
  findAll() {
    return this.empresaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empresaService.findOne(id);
  }

  @Get('cnpj/:cnpj')
  findByCnpj(@Param('cnpj') cnpj: string) {
    return this.empresaService.findByCnpj(cnpj);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmpresaDto: UpdateEmpresaDto) {
    return this.empresaService.update(id, updateEmpresaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.empresaService.remove(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.empresaService.restore(id);
  }
}

