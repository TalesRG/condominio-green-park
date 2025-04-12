import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { LoteEntity } from '../../entity/LoteEntity';

@Injectable()
export class LoteService {
  constructor(
    @InjectRepository(LoteEntity)
    private loteRepository: Repository<LoteEntity>,
  ) {}
  async procurarLotePorId(unidade: number): Promise<LoteEntity> {
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

    return lote;
  }
}
