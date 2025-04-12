import { Module } from '@nestjs/common';
import { PdfService } from '../service/pdf.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {}
