import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('produto')
export default class Produto {
  @PrimaryGeneratedColumn()
  codproduto: number;

  @Column('text')
  produto: string;
}
