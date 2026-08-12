import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  it('deve lançar UnauthorizedException quando o usuário não existe', async () => {
    const usersServiceMock = {
      findOneByEmail: jest.fn().mockResolvedValue(null),
    };
    const jwtServiceMock = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    const service = module.get<AuthService>(AuthService);

    await expect(service.signIn('naoexiste@teste.com', '123456')).rejects.toThrow(
      UnauthorizedException,
    );
    expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
  });
});
