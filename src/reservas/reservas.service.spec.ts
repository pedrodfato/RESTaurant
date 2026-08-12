import { Test, TestingModule } from '@nestjs/testing';
import { ReservasService } from './reservas.service';
import { ConflictException } from '@nestjs/common';

describe('ReservasService', () => {
  it('deve lançar ConflictException quando a mesa não está disponível', async () => {
    const mockTx = {
      update: jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([]), // array vazio = ninguém foi atualizado
          }),
        }),
      }),
    };

    const mockDb = {
      query: {
        mesas: {
          findFirst: jest
            .fn()
            .mockResolvedValue({ id: 1, status: 'reservada', capacidade: 4 }),
        },
      },
      transaction: jest.fn((callback) => callback(mockTx)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservasService, { provide: 'DRIZZLE', useValue: mockDb }],
    }).compile();

    const service = module.get<ReservasService>(ReservasService);

    await expect(
      service.create({
        mesa_id: 1,
        numero_pessoas: 2,
        data_reserva: '2026-08-20T19:00:00.000Z',
        usuario_id: 1,
      }),
    ).rejects.toThrow(ConflictException);
  });
});
