import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoletoEntity } from '../entity/BoletoEntity';
import { Like, Repository } from 'typeorm';
import { BoletoDto } from '../dto/boleto.dto';
import { LoteService } from './lote.service';
import { LoteEntity } from '../entity/LoteEntity';
import { FiltrosBoleto } from '../interfaces/FiltrosBoleto';
import { PdfService } from './pdf.service';
import { PDFDocument } from 'pdf-lib';
import { promises as fs } from 'fs';
import { join } from 'path';
import pdfParse from 'pdf-parse';

@Injectable()
export class BoletoService {
  constructor(
    @InjectRepository(BoletoEntity)
    private readonly boletoRepository: Repository<BoletoEntity>,
    private readonly loteService: LoteService,
    private readonly pdfService: PdfService,
  ) {}

  private readonly logger = new Logger(BoletoService.name);

  async criarBoletos(boletosDto: BoletoDto[]) {
    try {
      this.logger.log('Iniciando a criação de boletos...');
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

      this.logger.log(
        'Boletos criados com sucesso, salvando no banco de dados...',
      );

      return await this.boletoRepository.save(boletosParaSalvar);
    } catch (error) {
      console.error('Erro ao criar boletos:', error);
      throw new Error('Erro ao criar boletos');
    }
  }

  async recuperarBoletosComFiltro(
    filtros: FiltrosBoleto,
  ): Promise<BoletoEntity[] | { base64: string }> {
    this.logger.log('Recuperando boletos...');
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
      this.logger.log('Iniciando a geração do PDF em base64');
      const boletos: BoletoEntity[] = await query.getMany();
      const pdfBuffer: Buffer = await this.pdfService.gerarPdf(boletos);
      const base64String: string = pdfBuffer.toString('base64');
      this.logger.log('Gerado PDF em base64');
      return { base64: base64String };
    }
    this.logger.log('Boletos recuperados com sucesso');
    return await query.getMany();
  }

  async separarBoletosPdf(buffer: Buffer, outputFolder: string) {
    try {
      const originalPdf = await PDFDocument.load(buffer);
      const totalPages = originalPdf.getPageCount();

      await fs.mkdir(outputFolder, { recursive: true });

      const savedFilePaths: string[] = [];

      for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFDocument.create();

        const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
        newPdf.addPage(copiedPage);

        const newPdfBytes = await newPdf.save();
        const newPdfBuffer = Buffer.from(newPdfBytes);

        const data = await pdfParse(newPdfBuffer);

        let fileName = data.text.trim().split('\n')[0];

        const boleto = await this.boletoRepository.findOne({
          where: {
            nome_sacado: Like(`%${fileName}%`),
          },
        });
        fileName = fileName.replace(/[^a-zA-Z0-9-_ ]/g, '');

        if (!fileName) {
          fileName = `pagina_${i + 1}`;
        }

        const outputFilePath = join(
          outputFolder,
          `${boleto.id}.${fileName}.pdf`,
        );

        await fs.writeFile(outputFilePath, newPdfBuffer);
        savedFilePaths.push(outputFilePath);
      }

      return savedFilePaths;
    } catch (error) {
      throw new Error(`Falha ao ler o PDF: ${error.message}`);
    }
  }
}
