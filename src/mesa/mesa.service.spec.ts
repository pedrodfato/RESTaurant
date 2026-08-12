import { Test, TestingModule } from '@nestjs/testing';
import { MesaService } from './mesa.service';

describe('MesaService', () => {
  it('deve retornar a mesa encontrada pelo id', async () => {
    const mesaMock = { id: 1, nome: 'Mesa 1', capacidade: 4, status: 'disponivel' };
    const mockDb = {
      query: {
        mesas: {
          findFirst: jest.fn().mockResolvedValue(mesaMock),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [MesaService, { provide: 'DRIZZLE', useValue: mockDb }],
    }).compile();

    const service = module.get<MesaService>(MesaService);

    const result = await service.findOne(1);

    expect(result).toEqual(mesaMock);
    expect(mockDb.query.mesas.findFirst).toHaveBeenCalledTimes(1);
  });
});
