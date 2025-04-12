import { Body, Controller, Post } from '@nestjs/common';
import { BoletoService } from '../service/boleto/boleto.service';
import { BoletoDto } from '../dto/boleto.dto';
import { BoletoEntity } from '../entity/BoletoEntity';

@Controller('boleto')
export class BoletoController {
  constructor(private readonly boletoService: BoletoService) {}

  @Post('/criar')
  async criarBoleto(@Body() novoBoleto: BoletoDto): Promise<BoletoEntity> {
    return this.boletoService.criarBoleto(novoBoleto);
  }
}
