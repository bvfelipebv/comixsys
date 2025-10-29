import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EmpresaModule } from './empresa/empresa.module';
import { ClienteModule } from './cliente/cliente.module';
import { ProdutoModule } from './produto/produto.module';
import { AuxiliaresModule } from './auxiliares/auxiliares.module';

@Module({
  imports: [
    PrismaModule,
    EmpresaModule,
    ClienteModule,
    ProdutoModule,
    AuxiliaresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
