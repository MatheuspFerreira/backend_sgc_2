import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Status from '../interfaces/status-faturamento';
import Contrato from "./contrato.entity";
import Planos from "../interfaces/planos-faturamento";

@Entity('faturaitens_sgc')
export default class FaturaItens {
   
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sistema' })
  sistema: String;

  @Column({ name: 'fantasia' })
  fantasia: String;

  @Column({ name: 'cnpj' })
  cnpj: String;

  @Column({ name: 'versao' })
  versao: String;

  @Column({
    name: 'plano',
    type: 'enum',
    enum: ['mensal', 'anual']
  })
  plano: Planos;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['paga', 'aberta', 'vencida', 'cancelada', 'aguardando contestação'],
    default: "'aberta'"
  })
  status: Status;
  
 
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  valor: number;
 
  @Column({ type: 'date', default: new Date() })
  inicial: Date;

  @Column({ type: 'date'})
  final: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column('int')
  codcontrato: number;

  @ManyToOne(() => Contrato, (contrato) => contrato.contrato)
  @JoinColumn({ name: 'codcontrato', referencedColumnName: 'id' })
  contrato: Contrato;



  

    
    
    
    
    
    
    
    
 
}