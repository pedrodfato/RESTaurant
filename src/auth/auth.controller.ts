import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async signIn(@Body() signInDto: Record<string, any>) {

      
      const email = signInDto.email || signInDto.username;
      const password = signInDto.password || signInDto.senha;
    
      
    return await this.authService.signIn(email, password); 
  }
}