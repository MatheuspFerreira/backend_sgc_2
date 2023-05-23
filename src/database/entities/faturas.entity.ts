import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import Status from '../interfaces/status-faturamento';


@Entity('faturas_sgc')
export default class Faturas {
   
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['paga', 'aberta', 'vencida', 'cancelada', 'aguardando contestação'],
    default: "'aberta'",
  })
  status: Status;
  
  @Column({ name: 'competencia', type: 'date' })
  competencia: Date;

  @Column({ name: 'vencimento', type: 'date' })
  vencimento: Date;
 
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  valor: number;

  @Column({ name: 'data_aprovacao', type: 'date' })
  data_aprovacao: Date;

  @Column({ name: 'aprovador' })
  aprovador: String;

  @Column({ name: 'codrevenda' })
  codrevenda: number;
  
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

 
 
}