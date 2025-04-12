import { LoteEntity } from '../entity/LoteEntity';

export interface BoletoInterface {
  id: number;
  nome_sacado: string;
  lote: LoteEntity;
  valor: number;
  linha_digitavel: string;
  ativo: boolean;
  criado_em: Date;
}
