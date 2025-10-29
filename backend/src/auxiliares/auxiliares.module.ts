import { Module } from '@nestjs/common';
import { AuxiliaresService } from './auxiliares.service';
import { AuxiliaresController } from './auxiliares.controller';

@Module({
  controllers: [AuxiliaresController],
  providers: [AuxiliaresService],
  exports: [AuxiliaresService],
})
export class AuxiliaresModule {}

