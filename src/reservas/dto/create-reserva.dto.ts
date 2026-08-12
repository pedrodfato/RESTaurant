import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservaDto {


    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'ID da mesa', example: 1 })
    mesa_id: number;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Data da reserva', example: '2023-06-15T00:00:00.000' })
    data_reserva: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Número de pessoas', example: 4 })
    numero_pessoas: number;

}
