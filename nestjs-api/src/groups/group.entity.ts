import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Notification } from '../notifications/notification.entity';
import { Event } from '../events/event.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  country: string;

  @Column({ length: 128 })
  city: string;

  @Column({ length: 256 })
  name: string;

  @Column({ type: 'int', nullable: true })
  leader_user_id: number | null;

  @OneToMany(() => Notification, (n) => n.group)
  notifications: Notification[];

  @OneToMany(() => Event, (e) => e.group)
  events: Event[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


