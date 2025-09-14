import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { People } from '../people/people.entity';

export enum ActivityType {
  PROFILE_CREATED = 'profile_created',
  PROFILE_UPDATED = 'profile_updated',
  PROFILE_COMPLETED = 'profile_completed',
  PHOTO_UPLOADED = 'photo_uploaded',
  PHOTO_DELETED = 'photo_deleted',
  PROFILE_PHOTO_SET = 'profile_photo_set',
}

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  people_id: number;

  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  activity_type: ActivityType;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ nullable: true })
  ip_address: string;

  @Column({ nullable: true })
  user_agent: string;

  @ManyToOne(() => People, { nullable: false })
  @JoinColumn({ name: 'people_id' })
  people: People;

  @CreateDateColumn()
  created_at: Date;
}
