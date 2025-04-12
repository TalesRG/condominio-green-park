import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { LoteEntity } from '../entity/LoteEntity';

@Injectable()
export class LoteService {
  constructor(
    @InjectRepository(LoteEntity)
    private loteRepository: Repository<LoteEntity>,
  ) {}
  private readonly logger = new Logger(LoteService.name);
  async procurarLotePorId(unidade: number): Promise<LoteEntity> {
    this.logger.log('Procurando lote por ID...');
    const lote = await this.loteRepository.findOne({
      where: {
        nome: Raw((alias) => `CONVERT(${alias}, SIGNED) = :unidade`, {
          unidade,
        }),
      },
    });

    if (!lote) {
      throw new NotFoundException('Lote não encontrado');
    }
    this.logger.log('Lote encontrado com sucesso');
    return lote;
  }
}
