import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { Candidate } from './entities/candidate.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(): Promise<Candidate[]> {
    return this.candidatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Candidate> {
    return this.candidatesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.candidatesService.remove(id);
  }

  @Patch(':id/invite')
  async invite(@Param('id') id: string) {
    return this.candidatesService.invite(id);
  }
}
