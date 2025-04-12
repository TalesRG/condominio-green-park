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
    @Query('nome') nome: string,
    @Query('valor_inicial') valorInicial: number,
    @Query('valor_final') valorFinal: number,
    @Query('id_lote') idLote: number,
  ) {
    if (nome || valorInicial || valorFinal || idLote) {
      const filtros = {
        nome,
        valorInicial,
        valorFinal,
        idLote,
      };
      return this.boletoService.recuperarBoletosComFiltro(filtros);
    }
    return this.boletoService.recuperarTodosBoletos();
  }
}
