import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Photo } from '../photo/photo.entity';
import { FamilyBranch } from '../family-branch/family-branch.entity';

@Entity('people')
export class People {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ unique: true, nullable: true })
  registration_code: string;

  @Column({ nullable: true })
  father_id: number;

  @Column({ nullable: true })
  spouse_id: number;

  @Column({ nullable: true })
  birth_date: Date;

  @Column({ nullable: true })
  birth_place: string;

  @Column({ nullable: true })
  job: string;

  @Column({ nullable: true })
  current_location: string;

  @Column({ nullable: true })
  profile_photo: string;

  @Column({ default: false })
  profile_completed: boolean;

  @Column({ nullable: true })
  family_branch_id: number;

  // Self-referencing relationship - Father
  @ManyToOne(() => People, (people) => people.children, { nullable: true })
  @JoinColumn({ name: 'father_id' })
  father: People;

  // Self-referencing relationship - Children
  @OneToMany(() => People, (people) => people.father)
  children: People[];

  // Self-referencing relationship - Spouse
  @ManyToOne(() => People, (people) => people.spouse, { nullable: true })
  @JoinColumn({ name: 'spouse_id' })
  spouse: People;

  // Self-referencing relationship - Spouse (reverse)
  @OneToMany(() => People, (people) => people.spouse)
  spouseOf: People[];

  // Photos relationship
  @OneToMany(() => Photo, photo => photo.people)
  photos: Photo[];

  // Family Branch relationship
  @ManyToOne(() => FamilyBranch, branch => branch.members, { nullable: true })
  @JoinColumn({ name: 'family_branch_id' })
  familyBranch: FamilyBranch;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
