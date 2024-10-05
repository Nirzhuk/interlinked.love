ALTER TABLE "events" ADD COLUMN "title" text DEFAULT 'Event' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "color" text DEFAULT 'violet' NOT NULL;--> statement-breakpoint
ALTER TABLE "events_comments" DROP COLUMN IF EXISTS "title";--> statement-breakpoint
ALTER TABLE "events_comments" DROP COLUMN IF EXISTS "color";--> statement-breakpoint
ALTER TABLE "events_comments" DROP COLUMN IF EXISTS "location";