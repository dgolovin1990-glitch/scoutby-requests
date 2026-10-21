CREATE TABLE `ticket_events` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`at` text NOT NULL,
	`action` text NOT NULL,
	`note` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `app_meta` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`house` text NOT NULL,
	`category` text NOT NULL,
	`additional` text DEFAULT '' NOT NULL,
	`urgency` text NOT NULL,
	`recipient` text NOT NULL,
	`status` text DEFAULT 'Новая' NOT NULL,
	`review` integer DEFAULT 1 NOT NULL,
	`source` text DEFAULT 'resident' NOT NULL,
	`source_date` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`token_hash` text,
	`version` integer DEFAULT 1 NOT NULL,
	`last_change` text
);
