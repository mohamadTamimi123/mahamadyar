import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Group } from '../groups/group.entity';
import { User } from '../user/user.entity';

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

  // Approval system fields
  @Column({ default: false })
  requires_approval: boolean;

  @Column({ default: false })
  is_approved: boolean;

  @Column({ type: 'int', nullable: true })
  requested_by_user_id: number | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'requested_by_user_id' })
  requestedByUser: User;

  @Column({ type: 'int', nullable: true })
  approved_by_user_id: number | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by_user_id' })
  approvedByUser: User;

  @Column({ type: 'text', nullable: true })
  approval_notes: string | null;

  @Column({ type: 'timestamp', nullable: true })
  approved_at: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


