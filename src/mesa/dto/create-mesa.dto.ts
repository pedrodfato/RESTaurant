import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';

export class CreateMesaDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da mesa é obrigatório.' })
  nome: string;

  @IsNumber({}, { message: 'A capacidade da mesa deve ser um número.' })
  @IsNotEmpty({ message: 'A capacidade da mesa é obrigatória.' })
  capacidade: number;

  @IsEnum(['disponivel', 'reservada', 'inativa'], {
    message: 'O status da mesa deve ser disponivel, reservada ou inativa.',
  })
  @IsNotEmpty({ message: 'O status da mesa é obrigatório.' })
  status: 'disponivel' | 'reservada' | 'inativa';
}
