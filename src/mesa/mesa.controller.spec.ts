import { Test, TestingModule } from '@nestjs/testing';
import { MesaController } from './mesa.controller';
import { MesaService } from './mesa.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

describe('MesaController', () => {
  it('deve delegar findAll para o MesaService e devolver o resultado', async () => {
    const mesasMock = [
      { id: 1, nome: 'Mesa 1', capacidade: 4, status: 'disponivel' },
    ];
    const mesaServiceMock = {
      findAll: jest.fn().mockResolvedValue(mesasMock),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MesaController],
      providers: [{ provide: MesaService, useValue: mesaServiceMock }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    const controller = module.get<MesaController>(MesaController);

    const result = await controller.findAll();

    expect(result).toEqual(mesasMock);
    expect(mesaServiceMock.findAll).toHaveBeenCalledTimes(1);
  });
});
