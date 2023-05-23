import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import Cliente from './cliente.entity';

@Entity()
export default class LogAuditoriaContrato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cdg_contrato: number;

  @Column()
  cdg_revenda: number;

  @Column()
  cdg_tecrevenda: number;

  @Column()
  atendente_inspell: number;

  @Column()
  cdg_cliente: number;

  
  @Column({
    name: 'acao',
    type: 'enum',
    enum: ['criado', 'suspenso','cancelado','reativado', 'aguardando cancelamento', 'alterado'],
   
  })
  acao: String;

  @Column()
  comentario: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.logs)
  @JoinColumn({ name: 'cdg_cliente', referencedColumnName: 'codcliente' })
  cliente: Cliente;


  
}

  
