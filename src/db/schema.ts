import { pgTable, serial, text, integer, date } from 'drizzle-orm/pg-core';

export const mesas = pgTable('mesas', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  capacidade: integer('capacidade').notNull(),
  status: text('status', { enum: ['disponivel', 'reservada', 'inativa'] })
    .notNull()
    .default('disponivel'),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  email: text('email').notNull().unique(),
  senha: text('senha').notNull(),
  role: text('role', { enum: ['admin', 'user'] }).default('user'),
});

export const reservas = pgTable('reservas', {
  id: serial('id').primaryKey(),
  usuario_id: integer('usuario_id').references(() => users.id),
  mesa_id: integer('mesa_id').references(() => mesas.id),
  data_reserva: date('data_reserva').notNull(),
  status: text('status', { enum: ['ativa', 'cancelado'] }),
});
