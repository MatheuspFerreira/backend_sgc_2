import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import Contrato from './contrato.entity';
import   LogAuditoriaContrato   from './log-auditoria.entity';

@Entity('cliente')
export default class Cliente {
  @PrimaryGeneratedColumn()
  codcliente: number;

  @Column('text')
  razaosocial: string;

  @Column('text')
  fantasia: string;

  @Column('text')
  cnpj: string;

  @Column('text')
  endereco: string;

  @Column('text')
  bairro: string;

  @Column('text')
  cidade: string;

  @Column('text')
  uf: string;

  @Column('text')
  cep: string;

  @Column('text')
  tel1: string;

  @Column('text')
  tel2: string;

  @Column('text')
  fax: string;

  @Column('text')
  email: string;

  @Column('text')
  inscricaoestadual: string;

  @Column('text')
  inscricaomunicipal: string;

  @Column('text')
  observacao: string;

  @Column({ name: 'nao_recebe_atestado' })
  naoRecebeAtestado: string;

  @Column({ name: 'Id' })
  id: number;

  @Column({ name: 'log_siac' })
  logSiac: string;

  @OneToMany(() => Contrato, (contrato) => contrato.cliente)
  contratos: Contrato[];

  @OneToMany(() => LogAuditoriaContrato, (log) => log.cliente)
  @JoinColumn({ name: 'codcliente', referencedColumnName: 'cdg_cliente' })
  logs: LogAuditoriaContrato[];


  
}
