import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoletoEntity } from '../entity/BoletoEntity';
import { BoletoController } from '../controller/boleto.controller';
import { BoletoService } from '../service/boleto.service';
import { LoteModule } from './lote.module';
import { CsvService } from '../service/csv.service';
import { CsvModule } from './csv.module';

@Module({
  imports: [TypeOrmModule.forFeature([BoletoEntity]), LoteModule, CsvModule],
  controllers: [BoletoController],
  providers: [BoletoService],
})
export class BoletoModule {}
