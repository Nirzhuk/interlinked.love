ALTER TABLE "events_comments" ALTER COLUMN "content" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events_comments" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "events_comments" ADD COLUMN "color" text DEFAULT 'violet' NOT NULL;--> statement-breakpoint
ALTER TABLE "events_comments" ADD COLUMN "location" text DEFAULT '' NOT NULL;