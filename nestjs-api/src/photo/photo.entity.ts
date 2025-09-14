import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { People } from '../people/people.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  original_name: string;

  @Column()
  mime_type: string;

  @Column()
  file_size: number;

  @Column()
  file_path: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  is_profile_picture: boolean;

  @Column({ default: true })
  is_active: boolean;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  people_id: number;

  @ManyToOne(() => User, user => user.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => People, people => people.photos, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'people_id' })
  people: People;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
