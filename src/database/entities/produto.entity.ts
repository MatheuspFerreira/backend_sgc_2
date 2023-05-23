import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('produto')
export default class Produto {
  @PrimaryGeneratedColumn()
  codproduto: number;

  @Column('text')
  produto: string;

  @Column({
    type: 'enum',
    enum: ['S', 'N'],
    default: 'N'
  })
  exibir_sgc: 'S' | 'N';

}
