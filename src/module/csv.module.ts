import { Module } from '@nestjs/common';
import { CsvService } from '../service/csv.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CsvService],
  exports: [CsvService],
})
export class CsvModule {}
