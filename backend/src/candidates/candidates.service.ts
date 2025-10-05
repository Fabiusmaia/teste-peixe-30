import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: MongoRepository<Candidate>,
  ) {}

  async findAll(): Promise<Candidate[]> {
    return this.candidateRepository.find();
  }

  async findOne(id: string): Promise<Candidate> {
    const candidate = await this.candidateRepository.findOneBy({ id });
    if (!candidate) {
      throw new NotFoundException(`Candidate com id ${id} não encontrado`);
    }
    return candidate;
  }

  async invite(id: string): Promise<Candidate> {
    const candidate = await this.candidateRepository.findOneBy({ id });
    if (!candidate)
      throw new NotFoundException(`Candidate com id ${id} não encontrado`);
    candidate.invited = true;
    return this.candidateRepository.save(candidate);
  }

  async remove(id: string): Promise<void> {
    await this.candidateRepository.delete(id);
  }
}
