/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  Long,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users_Table } from './users.entity';

@Entity('user_profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true, type: 'longtext' })
  favorites: string;

  @OneToOne(() => Users_Table, (user) => user.profile)
  user: Users_Table;
}
