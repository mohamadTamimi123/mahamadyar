import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';
import { Notification } from '../notifications/notification.entity';
import { Event } from '../events/event.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  group_color: string;

  @Column({ default: true })
  is_active: boolean;

  @Column()
  created_by_user_id: number;

  @Column({ nullable: true })
  group_image: string;

  @Column({ default: false })
  is_private: boolean;

  @Column({ nullable: true })
  invite_code: string;

  // Relations
  @ManyToOne(() => User, user => user.createdGroups, { nullable: false })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @ManyToMany(() => User, user => user.groups)
  @JoinTable({
    name: 'group_members',
    joinColumn: { name: 'group_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
  })
  members: User[];

  @OneToMany(() => Notification, notification => notification.group)
  notifications: Notification[];

  @OneToMany(() => Event, event => event.group)
  events: Event[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}