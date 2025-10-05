import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './entities/job.entity';
import { Candidate } from '../candidates/entities/candidate.entity';
import { ObjectId } from 'mongodb';

describe('JobsService', () => {
  let service: JobsService;
  let jobRepository: any;
  let candidateRepository: any;

  const validObjectId = '507f1f77bcf86cd799439011';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: getRepositoryToken(Job),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Candidate),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    jobRepository = module.get(getRepositoryToken(Job));
    candidateRepository = module.get(getRepositoryToken(Candidate));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar todos os jobs', async () => {
      const result = [{ title: 'Dev' }];
      jobRepository.find.mockResolvedValue(result);
      expect(await service.findAll()).toEqual({
        data: result,
        total: undefined,
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um job pelo id', async () => {
      const job = { title: 'Dev' };
      jobRepository.findOneBy.mockResolvedValue(job);
      expect(await service.findOne(validObjectId)).toEqual(job);
    });

    it('deve lançar erro se o job não for encontrado', async () => {
      jobRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(validObjectId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar um job existente', async () => {
      const job = { _id: validObjectId, title: 'Old' };
      const updated = { ...job, title: 'New' };

      jobRepository.findOneBy.mockResolvedValue(job);
      jobRepository.save.mockResolvedValue(updated);

      expect(await service.update(validObjectId, { title: 'New' })).toEqual(
        updated,
      );
    });

    it('deve lançar erro se o job não for encontrado', async () => {
      jobRepository.findOneBy.mockResolvedValue(null);
      await expect(service.update(validObjectId, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('deve criar e salvar um novo job', async () => {
      const jobData = { title: 'Novo Job', description: 'Descrição do job' };
      const createdJob = { _id: new ObjectId(), ...jobData };

      jobRepository.create.mockReturnValue(jobData);
      jobRepository.save.mockResolvedValue(createdJob);

      const result = await service.create(jobData);

      expect(jobRepository.create).toHaveBeenCalledWith(jobData);
      expect(jobRepository.save).toHaveBeenCalledWith(jobData);
      expect(result).toEqual(createdJob);
    });
  });

  describe('remove', () => {
    it('deve deletar um job corretamente', async () => {
      jobRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(validObjectId);

      expect(jobRepository.delete).toHaveBeenCalledWith(validObjectId);
    });
  });

  describe('inviteCandidate', () => {
    it('deve lançar erro se candidato não existir', async () => {
      const job = {
        _id: validObjectId,
        invitedCandidates: [new ObjectId(validObjectId)],
      };
      jobRepository.findOne.mockResolvedValue(job);
      candidateRepository.findOne.mockResolvedValue(null);

      await expect(
        service.disqualifyCandidate(validObjectId, validObjectId, 'Motivo'),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar erro se o candidato não existir', async () => {
      jobRepository.findOneBy.mockResolvedValue({ _id: validObjectId });
      candidateRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.inviteCandidate(validObjectId, validObjectId),
      ).rejects.toThrow(new NotFoundException('Candidato não encontrado'));
    });

    it('deve convidar um candidato com sucesso', async () => {
      const job = {
        _id: new ObjectId(),
        invitedCandidates: [],
      };
      const candidate = {
        _id: new ObjectId(),
        invitedJobs: [],
      };

      jobRepository.findOneBy.mockResolvedValue(job);
      candidateRepository.findOneBy.mockResolvedValue(candidate);

      const result = await service.inviteCandidate(
        job._id.toHexString(),
        candidate._id.toHexString(),
      );

      expect(job.invitedCandidates).toHaveLength(1);
      expect(candidate.invitedJobs).toHaveLength(1);
      expect(jobRepository.save).toHaveBeenCalledWith(job);
      expect(candidateRepository.save).toHaveBeenCalledWith(candidate);
      expect(result).toEqual({ message: 'Candidato convidado com sucesso' });
    });

    it('deve retornar mensagem se o candidato já foi convidado', async () => {
      const candidateId = new ObjectId();
      const job = {
        _id: new ObjectId(),
        invitedCandidates: [candidateId],
        save: jest.fn(),
      };
      const candidate = { _id: candidateId, invitedJobs: [], save: jest.fn() };

      jobRepository.findOneBy.mockResolvedValue(job);
      candidateRepository.findOneBy.mockResolvedValue(candidate);

      const result = await service.inviteCandidate(
        job._id.toHexString(),
        candidate._id.toHexString(),
      );

      expect(job.save).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Candidato já convidado para esta vaga',
      });
    });
  });

  describe('getMatches', () => {
    it('deve retornar candidatos ordenados por pontuação de skills', async () => {
      const job = {
        _id: new ObjectId(validObjectId),
        skills: ['nestjs', 'typescript', 'mongodb'],
      };
      const candidates = [
        { name: 'Candidato A', skills: ['nestjs'] },
        { name: 'Candidato B', skills: ['nestjs', 'typescript', 'mongodb'] },
        { name: 'Candidato C', skills: ['react', 'typescript'] },
      ];

      jobRepository.findOneBy.mockResolvedValue(job);
      candidateRepository.find.mockResolvedValue(candidates);

      const matches = await service.getMatches(validObjectId);

      expect(matches).toHaveLength(3);
      expect(matches[0].name).toBe('Candidato B');
      expect(matches[0].score).toBe(3);
    });

    it('deve lançar NotFoundException se a vaga não for encontrada', async () => {
      jobRepository.findOneBy.mockResolvedValue(null);
      await expect(service.getMatches(validObjectId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('disqualifyCandidate', () => {
    it('deve desqualificar candidato', async () => {
      const jobId = new ObjectId().toHexString();
      const candidateId = new ObjectId().toHexString();

      const job = {
        _id: jobId,
        invitedCandidates: [new ObjectId(candidateId)],
        disqualifiedCandidates: [],
      };

      const candidate = { _id: candidateId, status: 'invited' };

      jobRepository.findOne.mockResolvedValue(job);
      candidateRepository.findOne.mockResolvedValue(candidate);
      candidateRepository.save.mockResolvedValue(candidate);
      jobRepository.save.mockResolvedValue(job);

      const result = await service.disqualifyCandidate(
        jobId,
        candidateId,
        'Motivo de desqualificação',
      );

      expect(result).toBeDefined();
    });
  });
});
