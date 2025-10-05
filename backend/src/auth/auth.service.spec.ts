import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('✅ deve retornar um access_token ao logar com sucesso', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser = {
        id: 'user-id-123',
        email: email,
        password: 'hashedPassword',
      };
      const expectedToken = 'fake-jwt-token';

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = await service.login(email, password);

      expect(result).toEqual({ access_token: expectedToken });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { sub: mockUser.id, email: mockUser.email },
        { expiresIn: '1h' },
      );
    });

    it('❌ deve lançar UnauthorizedException se o usuário não for encontrado', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(email, password)).rejects.toThrow(
        new UnauthorizedException('Usuário não encontrado'),
      );
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('❌ deve lançar UnauthorizedException se a senha estiver incorreta', async () => {
      const email = 'test@example.com';
      const password = 'wrongPassword';
      const mockUser = {
        id: 'user-id-123',
        email: email,
        password: 'hashedPassword',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(email, password)).rejects.toThrow(
        new UnauthorizedException('Senha incorreta'),
      );
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });
});
