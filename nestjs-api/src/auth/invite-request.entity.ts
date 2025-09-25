import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('invite_requests')
export class InviteRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  name: string;

  @Column({ length: 256 })
  email: string;

  @Column({ type: 'text', nullable: true })
  message: string | null;

  @Column({ length: 24, default: 'pending', comment: 'pending | approved | rejected' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}


