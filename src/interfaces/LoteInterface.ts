import { BoletoEntity } from '../entity/BoletoEntity';

export interface LoteInterface {
  id: number;
  nome: string;
  ativo: boolean;
  criado_em: Date;
  boletos: BoletoEntity[];
}
