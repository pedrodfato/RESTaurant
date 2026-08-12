import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req: Request, @Body() createReservaDto: CreateReservaDto) {
    let usuario_id = req['user'].sub;
    const data = {
      ...createReservaDto,
      usuario_id
    }

    return this.reservasService.create(data);
  }

  @Get()
  findAll() {
    return this.reservasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservasService.findOne(+id);
  }

  @Patch(':id/cancelar')
  @UseGuards(AuthGuard)
  update(@Req() req: Request, @Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    const usuario_id = req['user'].sub;
    const data = {
      ...updateReservaDto,
      usuario_id
    }
    return this.reservasService.update(+id, data);
  }
}
