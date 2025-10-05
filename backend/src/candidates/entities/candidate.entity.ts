import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
@Entity()
export class Candidate {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  skills: string[];

  @Column()
  experienceYears: number;

  @Column({ default: 0 })
  score: number;

  @Column({ default: false })
  invited: boolean;

  @Column()
  invitedJobs: ObjectId[];

  constructor() {
    this.invitedJobs = [];
  }

  @Column({ type: 'simple-json', nullable: true })
  disqualifications?: { jobId: string; reason: string }[];

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;
}
