CREATE TABLE "bingo_cards" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"group_id" varchar,
	"month" varchar(7) NOT NULL,
	"squares" jsonb NOT NULL,
	"completed_squares" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "uq_bingo_cards_user_month" UNIQUE("user_id","month")
);
--> statement-breakpoint
CREATE TABLE "bingo_completions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"card_id" varchar NOT NULL,
	"completed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "challenge_completions" (
	"id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "challenge_completions_challenge_id_user_id_unique" UNIQUE("challenge_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" varchar NOT NULL,
	"king_id" varchar NOT NULL,
	"deuce_king_id" integer NOT NULL,
	"title" varchar(140) NOT NULL,
	"template_key" varchar(50),
	"period_start" timestamp with time zone NOT NULL,
	"period_end" timestamp with time zone NOT NULL,
	"is_auto_selected" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deuce_kings" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"period_start" timestamp with time zone NOT NULL,
	"period_end" timestamp with time zone NOT NULL,
	"log_count" integer NOT NULL,
	"consecutive_wins" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
);
--> statement-breakpoint
DROP INDEX "idx_group_members_user_group";--> statement-breakpoint
ALTER TABLE "deuce_entries" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "group_members" ALTER COLUMN "joined_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "groups" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "groups" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invites" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "is_default" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "streak_alerts" ALTER COLUMN "triggered_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "streak_alerts" ALTER COLUMN "notified" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "deuce_count" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "referral_count" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "deuce_entries" ADD COLUMN "latitude" numeric;--> statement-breakpoint
ALTER TABLE "deuce_entries" ADD COLUMN "longitude" numeric;--> statement-breakpoint
ALTER TABLE "groups" ADD COLUMN "avatar_url" varchar;--> statement-breakpoint
ALTER TABLE "bingo_cards" ADD CONSTRAINT "bingo_cards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bingo_cards" ADD CONSTRAINT "bingo_cards_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bingo_completions" ADD CONSTRAINT "bingo_completions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bingo_completions" ADD CONSTRAINT "bingo_completions_card_id_bingo_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."bingo_cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_completions" ADD CONSTRAINT "challenge_completions_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_completions" ADD CONSTRAINT "challenge_completions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_king_id_users_id_fk" FOREIGN KEY ("king_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_deuce_king_id_deuce_kings_id_fk" FOREIGN KEY ("deuce_king_id") REFERENCES "public"."deuce_kings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deuce_kings" ADD CONSTRAINT "deuce_kings_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deuce_kings" ADD CONSTRAINT "deuce_kings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passport_stamps" ADD CONSTRAINT "passport_stamps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_bingo_cards_user_month" ON "bingo_cards" USING btree ("user_id","month");--> statement-breakpoint
CREATE INDEX "idx_bingo_completions_user" ON "bingo_completions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_bingo_completions_card" ON "bingo_completions" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "idx_challenge_completions_challenge" ON "challenge_completions" USING btree ("challenge_id");--> statement-breakpoint
CREATE INDEX "idx_challenges_group_period" ON "challenges" USING btree ("group_id","period_start");--> statement-breakpoint
CREATE INDEX "idx_deuce_kings_group_period" ON "deuce_kings" USING btree ("group_id","period_start");--> statement-breakpoint
CREATE INDEX "idx_passport_stamps_user" ON "passport_stamps" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_deuce_entries_group_logged" ON "deuce_entries" USING btree ("group_id","logged_at");--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "uq_group_members_user_group" UNIQUE("user_id","group_id");--> statement-breakpoint
ALTER TABLE "push_tokens" ADD CONSTRAINT "uq_push_tokens_token" UNIQUE("token");--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "uq_referrals_referee" UNIQUE("referee_id");