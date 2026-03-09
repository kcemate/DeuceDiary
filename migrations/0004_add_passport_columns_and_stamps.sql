ALTER TABLE "deuce_entries" ADD COLUMN "latitude" numeric;--> statement-breakpoint
ALTER TABLE "deuce_entries" ADD COLUMN "longitude" numeric;--> statement-breakpoint
CREATE TABLE "passport_stamps" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"city" varchar(200) NOT NULL,
	"region" varchar(200),
	"country" varchar(200) NOT NULL,
	"country_code" varchar(10),
	"latitude" numeric NOT NULL,
	"longitude" numeric NOT NULL,
	"entry_count" integer DEFAULT 1 NOT NULL,
	"first_visit_at" timestamp DEFAULT now(),
	"last_visit_at" timestamp DEFAULT now(),
	CONSTRAINT "uq_passport_stamps_user_city_country" UNIQUE("user_id","city","country")
);--> statement-breakpoint
CREATE INDEX "idx_passport_stamps_user" ON "passport_stamps" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "passport_stamps" ADD CONSTRAINT "passport_stamps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
