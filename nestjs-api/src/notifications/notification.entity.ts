import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Group } from '../groups/group.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  group_id: number | null;

  @ManyToOne(() => Group, (g) => g.notifications, { nullable: true })
  @JoinColumn({ name: 'group_id' })
  group: Group | null;

  @Column({ length: 32 })
  type: string; // system | wedding | funeral | quran | meeting | custom

  @Column({ length: 256 })
  title: string;

  @Column({ type: 'text', nullable: true })
  body: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


