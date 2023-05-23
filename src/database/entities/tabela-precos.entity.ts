import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tbprecos')
export default class TabelaPrecos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  codproduto:number;

  @Column('text')
  software: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  versao_a_mensal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  versao_b_mensal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  versao_a_anual: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  versao_b_anual: number;

  @Column({
    name: 'promocional',
    type: 'enum',
    enum: ['F','S'],
  })
  promocional: String;

  @Column('date')
  dtinicial: Date;

  @Column('date')
  dtfinal: Date;

}
