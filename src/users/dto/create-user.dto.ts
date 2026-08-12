import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @ApiProperty()
  nome: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'O email é obrigatório.' })
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(3, { message: 'A senha deve ter pelo menos 3 caracteres.' })
  @ApiProperty()
  senha: string;
}
