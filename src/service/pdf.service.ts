import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import { fonts } from '../utils/Fonts';
import { preencherBoletoPdf } from '../utils/pdfContent/BoletoPdfContent';
import { BoletoEntity } from '../entity/BoletoEntity';

@Injectable()
export class PdfService {
  async gerarPdf(boletos: BoletoEntity[]): Promise<Buffer> {
    const docDefinitions = preencherBoletoPdf(boletos);
    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinitions);

    const chunks = [];
    pdfDoc.on('data', (chunk) => {
      chunks.push(chunk);
    });

    pdfDoc.end();

    return new Promise((resolve, reject) => {
      pdfDoc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });
      pdfDoc.on('error', (err) => {
        reject(err);
      });
    });
  }
}
