import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Photo } from '../photo/photo.entity';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
