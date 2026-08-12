import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-auth.dto';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('/login')
  async signIn(@Body() signInDto: SignInDto) {
    const email = signInDto.email;
    const password = signInDto.senha;

    return await this.authService.signIn(email, password);
  }
}
