import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { Candidate } from '../candidates/entities/candidate.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
  ) {}

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    sortCol?: string,
  ): Promise<{ data: Job[]; total: number }> {
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const sort: any = {};
    if (sortCol) {
      const [col, order] = sortCol.split('_');
      sort[col] = order.toLowerCase() === 'desc' ? -1 : 1;
    } else {
      sort['_id'] = -1; 
    }

    const [data, total] = await Promise.all([
      this.jobRepository.find({
        where: filter,
        skip,
        take: limit,
        order: sort,
      }),
      this.jobRepository.count(filter),
    ]);

    return { data, total };
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobRepository.findOneBy({ _id: new ObjectId(id) });
    if (!job) {
      throw new NotFoundException(`Vaga com id ${id} não encontrada`);
    }
    return job;
  }

  async create(jobData: Partial<Job>): Promise<Job> {
    const job = this.jobRepository.create(jobData);
    return this.jobRepository.save(job);
  }

  async update(id: string, jobData: Partial<Job>): Promise<Job> {
    const job = await this.jobRepository.findOneBy({ _id: new ObjectId(id) });
    if (!job) throw new NotFoundException('Job não encontrado');
    Object.assign(job, jobData, { updatedAt: new Date() });
    return this.jobRepository.save(job);
  }

  async remove(id: string): Promise<void> {
    await this.jobRepository.delete(id);
  }

  async getMatches(id: string): Promise<Candidate[]> {
    const job = await this.jobRepository.findOneBy({ _id: new ObjectId(id) });
    if (!job) throw new NotFoundException('Job não encontrado');

    const candidates = await this.candidateRepository.find();

    return candidates
      .map((c) => ({
        ...c,
        score: c.skills.filter((s) => job.skills.includes(s)).length,
      }))
      .sort((a, b) => b.score - a.score);
  }

  async inviteCandidate(jobId: string, candidateId: string) {
    const jobObjectId = new ObjectId(jobId);
    const candidateObjectId = new ObjectId(candidateId);

    const job = await this.jobRepository.findOneBy({ _id: jobObjectId });
    if (!job) throw new NotFoundException('Vaga não encontrada');

    const candidate = await this.candidateRepository.findOneBy({
      _id: candidateObjectId,
    });
    if (!candidate) throw new NotFoundException('Candidato não encontrado');

    const alreadyInvited =
      job.invitedCandidates?.some((id) => id.equals(candidateObjectId)) ||
      candidate.invitedJobs?.some((id) => id.equals(jobObjectId));

    if (alreadyInvited)
      return { message: 'Candidato já convidado para esta vaga' };

    job.invitedCandidates.push(candidateObjectId);
    candidate.invitedJobs.push(jobObjectId);

    await this.jobRepository.save(job);
    await this.candidateRepository.save(candidate);

    return { message: 'Candidato convidado com sucesso' };
  }

  async disqualifyCandidate(
    jobId: string,
    candidateId: string,
    reason: string,
  ) {
    const job = await this.jobRepository.findOne({
      where: { _id: new ObjectId(jobId) },
    });
    if (!job) throw new NotFoundException('Vaga não encontrada');

    const candidate = await this.candidateRepository.findOne({
      where: { _id: new ObjectId(candidateId) },
    });
    if (!candidate) throw new NotFoundException('Candidato não encontrado');

    candidate.invitedJobs =
      candidate.invitedJobs?.filter((id) => id.toString() !== jobId) || [];
    if (!candidate.disqualifications) candidate.disqualifications = [];
    candidate.disqualifications.push({ jobId, reason });

    await this.candidateRepository.save(candidate);

    job.invitedCandidates =
      job.invitedCandidates?.filter((id) => id.toString() !== candidateId) ||
      [];
    await this.jobRepository.save(job);

    return { message: 'Candidato desqualificado com sucesso' };
  }
}
