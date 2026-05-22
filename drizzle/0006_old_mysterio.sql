CREATE TABLE "reservas" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer,
	"mesa_id" integer,
	"data_reserva" date NOT NULL,
	"status" text
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_mesa_id_mesas_id_fk";
--> statement-breakpoint
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_usuario_id_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_mesa_id_mesas_id_fk" FOREIGN KEY ("mesa_id") REFERENCES "public"."mesas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "mesa_id";