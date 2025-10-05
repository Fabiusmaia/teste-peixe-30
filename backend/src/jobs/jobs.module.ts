import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Candidate } from '../candidates/entities/candidate.entity';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { CandidatesModule } from '../candidates/candidates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Candidate]),
    CandidatesModule, 
  ],
  providers: [JobsService],
  controllers: [JobsController],
  exports: [JobsService],
})
export class JobsModule {}
