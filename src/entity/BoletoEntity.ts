import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LoteEntity } from './LoteEntity';

@Entity('boletos')
export class BoletoEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'nome_sacado' })
  nome_sacado: string;

  @ManyToOne(() => LoteEntity, (lote) => lote.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_lote' })
  lote: LoteEntity;

  @Column('decimal', { name: 'valor' })
  valor: number;

  @Column({ name: 'linha_digitavel' })
  linha_digitavel: string;

  @Column({ name: 'ativo', default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criado_em: Date;
}
