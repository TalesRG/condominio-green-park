import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BoletoService } from '../service/boleto.service';
import { BoletoEntity } from '../entity/BoletoEntity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CsvService } from '../service/csv.service';
import { BoletoDto } from '../dto/boleto.dto';

@Controller('boleto')
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

    const data: BoletoDto[] = await this.csvService.converterCsvParaJson(
      file.buffer,
    );

    return this.boletoService.criarBoletos(data);
  }
}
