import { Module } from '@nestjs/common';
import { MesaModule } from './mesa/mesa.module';
import { UsersModule } from './users/users.module';
import { DrizzleModule } from './db/drizzle.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DrizzleModule, MesaModule, UsersModule, AuthModule],
})
export class AppModule {}
