import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { FamilyMember } from './family-member.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // OTP fields
  @Column({ nullable: true, type: 'varchar' })
  otp_code: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  otp_expires_at: Date | null;

  @Column({ type: 'int', default: 0 })
  otp_attempts: number;

  @Column({ nullable: true, type: 'timestamp' })
  otp_last_sent_at: Date | null;

  // Each user corresponds to exactly one family member
  @OneToOne(() => FamilyMember)
  @JoinColumn({ name: 'member_id' })
  member: FamilyMember;
}


