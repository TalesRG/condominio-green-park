import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoteEntity } from '../entity/LoteEntity';
import { LoteService } from '../service/lote.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoteEntity])],
  controllers: [],
  providers: [LoteService],
  exports: [LoteService],
})
export class LoteModule {}
