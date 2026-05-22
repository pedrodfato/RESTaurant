import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    // Busca o usuário pelo e-mail (username)
    const user = await this.usersService.findOneByEmail(username);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // Compara a senha informada com o hash guardado no banco
    const isMatch = await bcrypt.compare(pass, user.senha);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // Cria o payload do JWT com os dados do usuário
    const payload = {
      sub: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
    };

    // Gera e retorna o token de acesso assinado
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
