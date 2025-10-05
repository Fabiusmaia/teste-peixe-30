import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { CandidatesModule } from './candidates/candidates.module';
import { JobsModule } from './jobs/jobs.module';
import { Candidate } from './candidates/entities/candidate.entity';
import { Job } from './jobs/entities/job.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URL,
      entities: [User, Candidate, Job],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CandidatesModule,
    JobsModule,
  ],
})
export class AppModule {}
