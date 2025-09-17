import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Group } from '../groups/group.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  group_id: number | null;

  @ManyToOne(() => Group, (g) => g.events, { nullable: true })
  @JoinColumn({ name: 'group_id' })
  group: Group | null;

  @Column({ length: 64 })
  type: string; // wedding | funeral | quran | meeting | other

  @Column({ length: 256 })
  title: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ length: 256, nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


