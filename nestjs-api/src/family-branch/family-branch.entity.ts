import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { People } from '../people/people.entity';

@Entity('family_branches')
export class FamilyBranch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  generation_level: number; // سطح نسل (1 = پدربزرگ، 2 = پدر، 3 = خود فرد)

  @Column({ nullable: true })
  branch_color: string; // رنگ شاخه برای نمایش در UI

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  created_by_user_id: number;

  @Column({ nullable: true })
  root_person_id: number; // فرد ریشه این شاخه

  @Column({ nullable: true })
  parent_branch_id: number; // شاخه والد

  // Relations
  @ManyToOne(() => User, user => user.familyBranches, { nullable: true })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @ManyToOne(() => People, people => people.familyBranch, { nullable: true })
  @JoinColumn({ name: 'root_person_id' })
  rootPerson: People;

  @ManyToOne(() => FamilyBranch, branch => branch.subBranches, { nullable: true })
  @JoinColumn({ name: 'parent_branch_id' })
  parentBranch: FamilyBranch;

  @OneToMany(() => FamilyBranch, branch => branch.parentBranch)
  subBranches: FamilyBranch[];

  @OneToMany(() => People, people => people.familyBranch)
  members: People[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
