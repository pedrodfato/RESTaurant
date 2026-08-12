import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'O email é obrigatório.' })
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @ApiProperty()
  senha: string;
}
