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
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @Get()
  findAll(@Query('empresaId') empresaId: string, @Query('ativo') ativo?: string) {
    const ativoBoolean = ativo === 'true' ? true : ativo === 'false' ? false : undefined;
    return this.clienteService.findAll(empresaId, ativoBoolean);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clienteService.findOne(id);
  }

  @Get('cpf/:cpf')
  findByCpf(@Param('cpf') cpf: string) {
    return this.clienteService.findByCpf(cpf);
  }

  @Get('cnpj/:cnpj')
  findByCnpj(@Param('cnpj') cnpj: string) {
    return this.clienteService.findByCnpj(cnpj);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clienteService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.clienteService.remove(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.clienteService.restore(id);
  }

  // Rotas para endereços
  @Post(':id/enderecos')
  addEndereco(@Param('id') id: string, @Body() enderecoData: any) {
    return this.clienteService.addEndereco(id, enderecoData);
  }

  @Patch('enderecos/:enderecoId')
  updateEndereco(@Param('enderecoId') enderecoId: string, @Body() enderecoData: any) {
    return this.clienteService.updateEndereco(enderecoId, enderecoData);
  }

  @Delete('enderecos/:enderecoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeEndereco(@Param('enderecoId') enderecoId: string) {
    return this.clienteService.removeEndereco(enderecoId);
  }
}

