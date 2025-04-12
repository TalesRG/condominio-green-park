import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoletoEntity } from '../entity/BoletoEntity';
import { BoletoController } from '../controller/boleto.controller';
import { BoletoService } from '../service/boleto/boleto.service';
import { LoteModule } from './lote.module';

@Module({
  imports: [TypeOrmModule.forFeature([BoletoEntity]), LoteModule],
  controllers: [BoletoController],
  providers: [BoletoService],
})
export class BoletoModule {}
