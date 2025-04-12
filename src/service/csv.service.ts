import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import csvParser from 'csv-parser';
import { BoletoDto } from '../dto/boleto.dto';

@Injectable()
export class CsvService {
  async converterCsvParaJson(buffer: Buffer): Promise<BoletoDto[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const stream = Readable.from(buffer);

      stream
        .pipe(csvParser({ separator: ';' }))
        .on('data', (row) => {
          row.unidade = Number(row.unidade);
          row.valor = parseFloat(row.valor);
          results.push(row);
        })
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });
  }
}
