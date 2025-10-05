import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sortCol') sortCol?: string,
  ) {
    const pageNumber = parseInt(page ?? '1'); 
    const pageSize = parseInt(limit ?? '10'); 

    const { data, total } = await this.jobsService.findAll(
      pageNumber,
      pageSize,
      search,
      sortCol,
    );

    return {
      data,
      total,
      page: pageNumber,
      pageSize,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Job> {
    return this.jobsService.findOne(id);
  }

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.jobsService.remove(id);
  }

  @Get(':id/matches')
  getMatches(@Param('id') id: string) {
    return this.jobsService.getMatches(id);
  }

  @Post(':id/invite/:candidateId')
  inviteCandidate(
    @Param('id') id: string,
    @Param('candidateId') candidateId: string,
  ) {
    return this.jobsService.inviteCandidate(id, candidateId);
  }

  @Post(':id/disqualify/:candidateId')
  disqualifyCandidate(
    @Param('id') id: string,
    @Param('candidateId') candidateId: string,
    @Body('reason') reason: string,
  ) {
    return this.jobsService.disqualifyCandidate(id, candidateId, reason);
  }
}
