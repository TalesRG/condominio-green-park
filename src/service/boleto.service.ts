import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoletoEntity } from '../entity/BoletoEntity';
import { Repository } from 'typeorm';
import { BoletoDto } from '../dto/boleto.dto';
import { LoteService } from './lote.service';
import { LoteEntity } from '../entity/LoteEntity';

@Injectable()
export class BoletoService {
  constructor(
    @InjectRepository(BoletoEntity)
    private readonly boletoRepository: Repository<BoletoEntity>,
    private readonly loteService: LoteService, // Importando o LoteService
  ) {}

  async criarBoletos(boletosDto: BoletoDto[]): Promise<BoletoEntity[]> {
    try {
      const boletosParaSalvar: BoletoEntity[] = [];

      for (const boletoDto of boletosDto) {
        const lote: LoteEntity = await this.loteService.procurarLotePorId(
          boletoDto.unidade,
        );

        const novoBoleto = new BoletoEntity();
        novoBoleto.nome_sacado = boletoDto.nome;
        novoBoleto.valor = boletoDto.valor;
        novoBoleto.linha_digitavel = boletoDto.linha_digitavel;
        novoBoleto.lote = lote;

        boletosParaSalvar.push(novoBoleto);
      }

      return await this.boletoRepository.save(boletosParaSalvar);
    } catch (error) {
      console.error('Erro ao criar boletos:', error);
      throw new Error('Erro ao criar boletos');
    }
  }

  async recuperarTodosBoletos(): Promise<BoletoEntity[]> {
    return await this.boletoRepository.find({
      relations: ['lote'],
    });
  }

  async recuperarBoletosComFiltro(
    filtros: FiltrosBoleto,
  ): Promise<BoletoEntity[]> {
    const query = this.boletoRepository.createQueryBuilder('boleto');

    if (filtros.nome) {
      query.andWhere('boleto.nome_sacado LIKE :nome', {
        nome: `%${filtros.nome}%`,
      });
    }

    if (filtros.valorInicial !== undefined) {
      query.andWhere('boleto.valor >= :valorInicial', {
        valorInicial: filtros.valorInicial,
      });
    }

    if (filtros.valorFinal !== undefined) {
      query.andWhere('boleto.valor <= :valorFinal', {
        valorFinal: filtros.valorFinal,
      });
    }

    if (filtros.idLote !== undefined) {
      query.andWhere('boleto.lote = :idLote', { idLote: filtros.idLote });
    }

    return await query.getMany();
  }
}
