import { Test, TestingModule } from '@nestjs/testing';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { AuthGuard } from '../auth/auth.guard';

describe('ReservasController', () => {
  it('deve extrair o usuario_id do token e combinar com o DTO antes de criar a reserva', async () => {
    const reservaMock = { id: 1, mesa_id: 2, usuario_id: 7, status: 'ativa' };
    const reservasServiceMock = {
      create: jest.fn().mockResolvedValue(reservaMock),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservasController],
      providers: [{ provide: ReservasService, useValue: reservasServiceMock }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    const controller = module.get<ReservasController>(ReservasController);

    const dto = { mesa_id: 2, numero_pessoas: 3, data_reserva: '2026-08-20T19:00:00.000Z' };
    const fakeRequest = { user: { sub: 7 } } as any;

    const result = await controller.create(fakeRequest, dto);

    expect(result).toEqual(reservaMock);
    expect(reservasServiceMock.create).toHaveBeenCalledWith({
      ...dto,
      usuario_id: 7,
    });
  });
});
