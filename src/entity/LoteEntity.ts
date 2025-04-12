import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BoletoEntity } from './BoletoEntity';

@Entity('lotes')
export class LoteEntity {
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
