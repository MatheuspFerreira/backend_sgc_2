import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

type Category = 'info' | 'atencao' | 'urgente' | 'sucesso';

@Entity('notificacoes')
export default class Notificacoes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    nullable: false,
  })
  titulo: string;

  @Column({
    length: 20,
    nullable: false,
  })
  mensagem: string;

  @Column({
    type: 'enum',
    enum: ['info', 'atencao', 'urgente', 'sucesso'],
    default: 'info',
  })
  categoria: Category;

  @Column({ name: 'usuarioid' })
  usuarioId: number;

  @Column({ name: 'usuariocodtecnico' })
  usuarioCodTecnico: number;

  @Column({ name: 'lidaem' })
  lidaEm: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' }) createdAt: Date;
}
