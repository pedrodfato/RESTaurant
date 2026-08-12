import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  it('deve criar um usuário salvando a senha em hash, não em texto puro', async () => {
    const novoUsuario = {
      id: 1,
      nome: 'Pedro',
      email: 'pedro@teste.com',
      role: 'user',
    };
    const returningMock = jest.fn().mockResolvedValue([novoUsuario]);
    const valuesMock = jest.fn().mockReturnValue({ returning: returningMock });
    const mockDb = {
      insert: jest.fn().mockReturnValue({ values: valuesMock }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: 'DRIZZLE', useValue: mockDb }],
    }).compile();

    const service = module.get<UsersService>(UsersService);

    const result = await service.create({
      nome: 'Pedro',
      email: 'pedro@teste.com',
      senha: '123456',
    });

    expect(result).toEqual(novoUsuario);

    const dadosInseridos = valuesMock.mock.calls[0][0];
    expect(dadosInseridos.senha).not.toBe('123456');
  });
});
