CREATE TYPE "public"."branch" AS ENUM('JP', 'EN', 'ID');--> statement-breakpoint
CREATE TABLE "song_talents" (
	"song_id" uuid NOT NULL,
	"talent_id" uuid NOT NULL,
	CONSTRAINT "song_talents_song_id_talent_id_pk" PRIMARY KEY("song_id","talent_id")
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"release_date" date,
	"youtube_url" text,
	"jacket_url" text,
	"type" text DEFAULT 'original',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "talents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(64) NOT NULL,
	"display_name" text NOT NULL,
	"generation" text NOT NULL,
	"image_url" text,
	"branch" "branch" NOT NULL,
	"youtube_channel_id" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "talents_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "song_talents" ADD CONSTRAINT "song_talents_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "song_talents" ADD CONSTRAINT "song_talents_talent_id_talents_id_fk" FOREIGN KEY ("talent_id") REFERENCES "public"."talents"("id") ON DELETE cascade ON UPDATE no action;