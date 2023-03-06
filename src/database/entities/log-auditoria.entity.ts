import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import Revenda from './revenda.entity';
import TecnicoRevenda from './tecnico-revenda.entity';
import Atendente from './atendente.entity';
import Cliente from './cliente.entity';
import Contrato from './contrato.entity';

@Entity()
export class LogAuditoriaContrato {
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
    enum: ['criado', 'suspenso','cancelado','reativado'],
   
  })
  acao: String;

  @Column()
  comentario: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
  
}