import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMesaDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da mesa é obrigatório.' })
  @ApiProperty({ description: 'Nome da mesa', example: 'Mesa 1' })
  nome: string;

  @IsNumber({}, { message: 'A capacidade da mesa deve ser um número.' })
  @IsNotEmpty({ message: 'A capacidade da mesa é obrigatória.' })
  @ApiProperty({ description: 'Capacidade da mesa', example: 4 })
  capacidade: number;

  @IsEnum(['disponivel', 'reservada', 'inativa'], {
    message: 'O status da mesa deve ser disponivel, reservada ou inativa.',
  })
  @IsNotEmpty({ message: 'O status da mesa é obrigatório.' })
  @ApiProperty({ description: 'Status da mesa', example: 'disponivel' })
  status: 'disponivel' | 'reservada' | 'inativa';
}
