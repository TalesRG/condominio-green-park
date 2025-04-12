import { LoteEntity } from '../entity/LoteEntity';

export interface BoletoInterface {
  id: number;
  nome: string;
  lote: LoteEntity;
  valor: number;
  linha_digitavel: string;
  ativo: boolean;
  criado_em: Date;
}
