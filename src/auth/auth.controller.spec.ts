import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  it('deve extrair email e senha do body e delegar pro AuthService', async () => {
    const authServiceMock = {
      signIn: jest.fn().mockResolvedValue({ access_token: 'token-falso' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    const controller = module.get<AuthController>(AuthController);

    const result = await controller.signIn({ email: 'pedro@teste.com', senha: '123456' });

    expect(result).toEqual({ access_token: 'token-falso' });
    expect(authServiceMock.signIn).toHaveBeenCalledWith('pedro@teste.com', '123456');
  });
});
