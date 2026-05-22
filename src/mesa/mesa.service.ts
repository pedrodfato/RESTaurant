import { Injectable, Inject } from '@nestjs/common';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class MesaService {
  constructor(@Inject('DRIZZLE') private db: NodePgDatabase<typeof schema>) {}

  async create(createMesaDto: CreateMesaDto) {
    const [mesa] = await this.db
      .insert(schema.mesas)
      .values(createMesaDto)
      .returning({
        id: schema.mesas.id,
        nome: schema.mesas.nome,
        capacidade: schema.mesas.capacidade,
        status: schema.mesas.status,
      });
    return mesa;
  }

  async findAll() {
    return this.db.query.mesas.findMany();
  }

  findOne(id: number) {
    return this.db.query.mesas.findFirst({ where: eq(schema.mesas.id, id) });
  }

  update(id: number, updateMesaDto: UpdateMesaDto) {
    return this.db
      .update(schema.mesas)
      .set(updateMesaDto)
      .where(eq(schema.mesas.id, id));
  }

  remove(id: number) {
    return this.db.delete(schema.mesas).where(eq(schema.mesas.id, id));
  }
}
