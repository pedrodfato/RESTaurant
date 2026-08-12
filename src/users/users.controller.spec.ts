import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

describe('UsersController', () => {
  it('deve delegar o registro de usuário para o UsersService', async () => {
    const novoUsuario = {
      id: 1,
      nome: 'Pedro',
      email: 'pedro@teste.com',
      role: 'user',
    };
    const usersServiceMock = {
      create: jest.fn().mockResolvedValue(novoUsuario),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    const controller = module.get<UsersController>(UsersController);

    const dto = { nome: 'Pedro', email: 'pedro@teste.com', senha: '123456' };
    const result = await controller.create(dto);

    expect(result).toEqual(novoUsuario);
    expect(usersServiceMock.create).toHaveBeenCalledWith(dto);
  });
});
