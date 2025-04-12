import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoletoEntity } from '../entity/BoletoEntity';
import { Repository } from 'typeorm';
import { BoletoDto } from '../dto/boleto.dto';
import { LoteService } from './lote.service';
import { LoteEntity } from '../entity/LoteEntity';
import { FiltrosBoleto } from '../interfaces/FiltrosBoleto';
import { PdfService } from './pdf.service';

@Injectable()
export class BoletoService {
  constructor(
    @InjectRepository(BoletoEntity)
    private readonly boletoRepository: Repository<BoletoEntity>,
    private readonly loteService: LoteService,
    private readonly pdfService: PdfService,
  ) {}

  async criarBoletos(boletosDto: BoletoDto[]) {
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

  async recuperarBoletosComFiltro(
    filtros: FiltrosBoleto,
  ): Promise<BoletoEntity[] | { base64: string }> {
    const query = this.boletoRepository
      .createQueryBuilder('boleto')
      .leftJoinAndSelect('boleto.lote', 'lote');

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

    if (filtros.relatorio === 1) {
      const boletos: BoletoEntity[] = await query.getMany();
      const pdfBuffer: Buffer = await this.pdfService.gerarPdf(boletos);
      const base64String: string = pdfBuffer.toString('base64');
      return { base64: base64String };
    }

    return await query.getMany();
  }
}
