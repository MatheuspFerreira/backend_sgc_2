import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('atendente')
export default class Atendente {
  @PrimaryGeneratedColumn()
  registro: number;

  @Column('text')
  login: string;

  @Column('text')
  senha: string;

  @Column('text')
  nome: string;

  @Column('text')
  email: string;

  @Column({ type: 'text', name: 'ativo' })
  ativo: string;
}
