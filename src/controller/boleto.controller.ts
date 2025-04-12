import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BoletoService } from '../service/boleto.service';
import { BoletoEntity } from '../entity/BoletoEntity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CsvService } from '../service/csv.service';
import { BoletoDto } from '../dto/boleto.dto';

@Controller('boletos')
export class BoletoController {
  constructor(
    private readonly boletoService: BoletoService,
    private readonly csvService: CsvService,
  ) {}

  @Post('/criar')
  @UseInterceptors(FileInterceptor('file'))
  async criarBoleto(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado.');
    }

    if (file.mimetype !== 'text/csv') {
      throw new BadRequestException('O arquivo deve ser um arquivo CSV.');
    }

    const boletosExtraidos: BoletoDto[] =
      await this.csvService.converterCsvParaJson(file.buffer);

    return this.boletoService.criarBoletos(boletosExtraidos);
  }

  @Get()
  async recuperarBoletosComFiltro(
    @Query('nome') nome?: string,
    @Query('valor_inicial') valorInicial?: string,
    @Query('valor_final') valorFinal?: string,
    @Query('id_lote') idLote?: string,
    @Query('relatorio') relatorio?: string,
  ) {
    const filtros = {
      nome,
      valorInicial: valorInicial ? parseFloat(valorInicial) : undefined,
      valorFinal: valorFinal ? parseFloat(valorFinal) : undefined,
      idLote: idLote ? parseInt(idLote, 10) : undefined,
      relatorio: relatorio ? parseInt(relatorio, 10) : undefined,
    };

    return this.boletoService.recuperarBoletosComFiltro(filtros);
  }
}
