import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoletoEntity } from '../../entity/BoletoEntity';
import { Repository } from 'typeorm';
import { BoletoDto } from '../../dto/boleto.dto';
import { LoteService } from '../lote/lote.service';
import { LoteEntity } from '../../entity/LoteEntity';

@Injectable()
export class BoletoService {
  constructor(
    @InjectRepository(BoletoEntity)
    private readonly boletoRepository: Repository<BoletoEntity>,
    private readonly loteService: LoteService, // Importando o LoteService
  ) {}

  async criarBoleto(boleto: BoletoDto): Promise<BoletoEntity> {
    try {
      // Verifica se o lote existe
      const lote: LoteEntity = await this.loteService.procurarLotePorId(
        boleto.unidade,
      );

      const novoBoleto = new BoletoEntity();
      novoBoleto.nome_sacado = boleto.nome;
      novoBoleto.valor = boleto.valor;
      novoBoleto.lote = lote;
      novoBoleto.linha_digitavel = boleto.linha_digitavel;

      return await this.boletoRepository.save(novoBoleto);
    } catch (error) {
      console.error('Erro ao criar boleto:', error);
      throw new Error('Erro ao criar boleto');
    }
  }
}
