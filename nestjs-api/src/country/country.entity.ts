import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { City } from '../city/city.entity';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true, length: 3 })
  iso_code: string;

  @Column({ nullable: true })
  capital: string;

  @Column({ nullable: true })
  population: number;

  @Column({ nullable: true })
  area: number;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  subregion: string;

  @Column({ nullable: true })
  flag_url: string;

  @Column({ nullable: true })
  currency_code: string;

  @Column({ nullable: true })
  currency_name: string;

  @Column({ nullable: true })
  language_code: string;

  @Column({ nullable: true })
  language_name: string;

  @OneToMany(() => City, city => city.country)
  cities: City[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
