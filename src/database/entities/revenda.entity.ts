import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('revenda')
export default class Revenda {
  @PrimaryGeneratedColumn()
  codrevenda: number;

  @Column('text')
  email: string;

  @Column('text')
  senha: string;

  @Column('text')
  razaosocial: string;

  @Column({ type: 'text', name: 'ativa' })
  ativa: string;

  @Column('text')
  cnpj: string;
}
