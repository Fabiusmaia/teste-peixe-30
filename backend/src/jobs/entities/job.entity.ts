import { ObjectId } from 'mongodb';
import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Job {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  salaryRange: string;

  @Column()
  skills: string[];

  @Column()
  invitedCandidates: ObjectId[];

  constructor() {
    this.invitedCandidates = [];
  }

  @Column({ default: new Date() })
  createdAt: Date;
}
