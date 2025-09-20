import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, ManyToOne, ManyToMany } from 'typeorm';
import { People } from '../people/people.entity';
import { Photo } from '../photo/photo.entity';
import { Country } from '../country/country.entity';
import { City } from '../city/city.entity';
import { FamilyBranch } from '../family-branch/family-branch.entity';
import { Group } from '../groups/group.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  people_id: number;

  @OneToOne(() => People, { nullable: true })
  @JoinColumn({ name: 'people_id' })
  people: People;

  @OneToMany(() => Photo, photo => photo.user)
  photos: Photo[];

  @OneToMany(() => FamilyBranch, branch => branch.createdByUser)
  familyBranches: FamilyBranch[];

  @OneToMany(() => Group, group => group.createdByUser)
  createdGroups: Group[];

  @ManyToMany(() => Group, group => group.members)
  groups: Group[];

  @Column({
    type: 'varchar',
    length: 32,
    default: 'user',
    comment: 'User role: admin | branch_manager | user'
  })
  role: string;

  @Column({ nullable: true })
  country_id: number;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ nullable: true })
  city_id: number;

  @ManyToOne(() => City, { nullable: true })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
