import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { CancelarReservaDto } from './dto/cancelar-reserva.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/currentuser.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createReservaDto: CreateReservaDto,
  ) {
    const data = {
      ...createReservaDto,
      usuario_id: user.sub,
    };

    return this.reservasService.create(data);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@CurrentUser() user: JwtPayload) {
    return this.reservasService.findAll(user.role, user.sub);
  }

  @Patch(':id/cancelar')
  @UseGuards(AuthGuard)
  cancelar(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() cancelarReservaDto: CancelarReservaDto,
  ) {
    const usuario_id = user.sub;
    const data = {
      ...cancelarReservaDto,
      usuario_id,
    };
    return this.reservasService.update(+id, data);
  }
}
