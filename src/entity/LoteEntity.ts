import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BoletoEntity } from './BoletoEntity';
import { LoteInterface } from '../interfaces/LoteInterface';

@Entity('lotes')
export class LoteEntity implements LoteInterface {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'nome' })
  nome: string;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criado_em: Date;

  @OneToMany(() => BoletoEntity, (boleto) => boleto.lote, {
    cascade: true,
  })
  boletos: BoletoEntity[];
}
