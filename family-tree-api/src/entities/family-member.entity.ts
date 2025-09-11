import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('family_members')
export class FamilyMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  family_name: string;

  @Column({ nullable: true, type: 'varchar' })
  father_name: string | null;

  @Column({ nullable: true, type: 'int' })
  father_id: number | null;

  @Column({ nullable: true, unique: true, type: 'varchar' })
  invite_code: string | null;

  @Column({ nullable: true, unique: true, type: 'varchar' })
  email: string | null;

  @Column({ nullable: true, type: 'varchar' })
  password: string | null;

  @Column({ nullable: true, type: 'varchar' })
  phone: string | null;

  // Profile fields
  @Column({ nullable: true, type: 'varchar' })
  profile_image: string | null;

  @Column({ nullable: true, type: 'varchar' })
  national_id: string | null;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // Relationship: Many-to-One (Many children can have one father)
  @ManyToOne(() => FamilyMember, father => father.children, { nullable: true })
  @JoinColumn({ name: 'father_id' })
  father: FamilyMember;

  // Relationship: One-to-Many (One father can have many children)
  @OneToMany(() => FamilyMember, child => child.father)
  children: FamilyMember[];
}
