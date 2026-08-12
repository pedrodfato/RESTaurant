import { Inject, Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import * as schema from '../db/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

@Injectable()
export class ReservasService {
  constructor(@Inject('DRIZZLE') private db: NodePgDatabase<typeof schema>) {}

  async create(createReservaDto: CreateReservaDto & { usuario_id: number }) {
    const mesa = await this.db.query.mesas.findFirst({
      where: eq(schema.mesas.id, createReservaDto.mesa_id),
    });
      if (!mesa){
      throw new NotFoundException('Mesa não encontrada');
    }
    else if (mesa.status !== 'disponivel'){
      throw new ConflictException('Mesa não disponível para reserva'); 
    }
    if (createReservaDto.numero_pessoas > mesa.capacidade){
      throw new ConflictException('Número de pessoas excede a capacidade da mesa');
    }

    if (new Date(createReservaDto.data_reserva) < new Date()){
      throw new ConflictException('Data de reserva inválida');
    }

    if(new Date(createReservaDto.data_reserva).getHours() < 7 || new Date(createReservaDto.data_reserva).getHours() >= 23){
      throw new ConflictException('Horário de reserva inválido. O restaurante funciona das 07:00 às 23:00.');
    }
    
    const reserva = await this.db.transaction(async (tx) => {

      const [novaReserva] = await tx.insert(schema.reservas)
      .values({...createReservaDto, status: 'ativa', data_reserva: new Date(createReservaDto.data_reserva)})
      .returning({
        mesa_id: schema.reservas.mesa_id,
        usuario_id: schema.reservas.usuario_id,
        data_reserva: schema.reservas.data_reserva,
        status: schema.reservas.status,
        numero_pessoas: schema.reservas.numero_pessoas,
        id: schema.reservas.id,
      })

      await tx.update(schema.mesas)
        .set({ status: 'reservada' })
        .where(eq(schema.mesas.id, createReservaDto.mesa_id))

      return novaReserva;
    })
    return reserva;
  }

  findAll() {
    return this.db.query.reservas.findMany({
      columns: {
        usuario_id: false,
      },
    });
  }

  findOne(id: number) {
    return this.db.query.reservas.findFirst({
      where: eq(schema.reservas.id, id),
      columns: {
        usuario_id: false,
      },
    });
  }

  async update(id: number, updateReservaDto: UpdateReservaDto & { usuario_id: number }) {
        const reserva = await this.db.query.reservas.findFirst({
      where: eq(schema.reservas.id, id),
    })
  

    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada');
    }

    if (reserva.usuario_id != updateReservaDto.usuario_id) {
      throw new ForbiddenException('Você não tem permissão para cancelar esta reserva');
    }

    if (reserva.status != 'ativa') {
        throw new ConflictException('Reserva já está cancelada');
      }

    await this.db.transaction(async (tx) => {

              if (!reserva.mesa_id) {
  throw new ConflictException('Reserva sem mesa associada.');
}

      await tx.update(schema.reservas)
        .set({ status: 'cancelada' })
        .where(eq(schema.reservas.id, id));


      await tx.update(schema.mesas)
        .set({ status: 'disponivel' })
        .where(eq(schema.mesas.id, reserva.mesa_id));
  
      
    })
    return { message: 'Reserva cancelada com sucesso' };
  }

  async remove(id: number) {

  }
}