DO $$ BEGIN
 CREATE TYPE "public"."couple_type" AS ENUM('couple', 'family', 'friends', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "couples" ADD COLUMN "type" "couple_type" DEFAULT 'couple' NOT NULL;