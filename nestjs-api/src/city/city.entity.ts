import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Country } from '../country/country.entity';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  country_id: number;

  @ManyToOne(() => Country, country => country.cities)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ nullable: true })
  latitude: number;

  @Column({ nullable: true })
  longitude: number;

  @Column({ nullable: true, type: 'bigint' })
  population: number;

  @Column({ nullable: true })
  state_province: string;

  @Column({ nullable: true })
  timezone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
