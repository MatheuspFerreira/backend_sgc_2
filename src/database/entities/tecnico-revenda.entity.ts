import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tecnicorevenda')
export default class TecnicoRevenda {
  @PrimaryGeneratedColumn()
  codrevenda: number;

  @Column('integer')
  codtecnico: number;

  @Column('text')
  email: string;

  @Column('text')
  senha: string;

  @Column('text')
  nome: string;

  @Column('text')
  cel: string;

  @Column({ type: 'text', name: 'Licenciar_Clientes' })
  podeLicenciarClientes: string;

  @Column({ type: 'text', name: 'Consultar_Meus_Clientes' })
  podeConsultarMeusClientes: string;

  @Column({ type: 'text', name: 'suspensao' })
  podeSuspenderClientes: string;

  @Column({ type: 'text', name: 'inativo' })
  inativo: string;
}
