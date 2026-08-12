import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Inject } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import * as bcrypt from 'bcrypt';

import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject('DRIZZLE') private db: NodePgDatabase<typeof schema>) {}

  async create(createUserDto: CreateUserDto) {
    const { nome, email, senha } = createUserDto;

    const saltRounds = 10;

    const hashSenha = await bcrypt.hash(senha, saltRounds);

    const [newUser] = await this.db
      .insert(schema.users)
      .values({
        nome,
        email,
        senha: hashSenha,
      })
      .returning({
        id: schema.users.id,
        nome: schema.users.nome,
        email: schema.users.email,
        role: schema.users.role,
      });

    return newUser;
  }

  async findAll() {
    const data = await this.db.query.users.findMany({
      columns: { senha: false, role: false, email: false },
    });
    return data;
  }

  async findOneByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
  }
}
