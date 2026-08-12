import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservaDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'ID da mesa', example: 1 })
  @IsPositive({ message: 'O ID da mesa deve ser um valor positivo.' })
  mesa_id: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Data da reserva',
    example: '2023-06-15T00:00:00.000',
  })
  data_reserva: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Número de pessoas', example: 4 })
  @IsPositive({ message: 'O número de pessoas deve ser um valor positivo.' })
  numero_pessoas: number;
}
