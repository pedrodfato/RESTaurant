import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMesaDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da mesa é obrigatório.' })
  nome: string;

  @IsNumber({}, { message: 'A capacidade da mesa deve ser um número.' })
  @IsNotEmpty({ message: 'A capacidade da mesa é obrigatória.' })
  capacidade: number;
}
