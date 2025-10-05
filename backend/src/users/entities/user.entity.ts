import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  id: string; 

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;
}
