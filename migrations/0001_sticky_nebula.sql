CREATE TABLE `app_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`default_beras_per_jiwa` real DEFAULT 2.5,
	`default_uang_per_jiwa` integer DEFAULT 40000,
	`active_period_id` text,
	`enable_email_notifications` integer DEFAULT false,
	`require_approval_for_changes` integer DEFAULT false,
	`updated_at` integer,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`active_period_id`) REFERENCES `periods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_settings_organization_id_unique` ON `app_settings` (`organization_id`);--> statement-breakpoint
CREATE TABLE `attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`file_name` text NOT NULL,
	`file_url` text NOT NULL,
	`file_type` text,
	`file_size` integer,
	`uploaded_by` text,
	`description` text,
	`created_at` integer,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`user_id` text,
	`user_name` text,
	`action` text NOT NULL,
	`table_name` text NOT NULL,
	`record_id` text NOT NULL,
	`old_data` text,
	`new_data` text,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `central_aid` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`mustahik_id` text,
	`sumber_dana` text NOT NULL,
	`keterangan_sumber` text,
	`nominal` integer NOT NULL,
	`status_pencairan` text DEFAULT 'pending',
	`tanggal_cair` integer,
	`periode_id` text,
	`catatan` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`mustahik_id`) REFERENCES `mustahik`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`periode_id`) REFERENCES `periods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `distributions` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`mustahik_id` text NOT NULL,
	`mustahik_allocation_id` text,
	`tanggal_distribusi` integer NOT NULL,
	`petugas_id` text NOT NULL,
	`jumlah_beras` real DEFAULT 0,
	`jumlah_uang` integer DEFAULT 0,
	`status` text DEFAULT 'berhasil',
	`bukti_foto_url` text,
	`catatan` text,
	`created_at` integer,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`mustahik_id`) REFERENCES `mustahik`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`mustahik_allocation_id`) REFERENCES `mustahik_allocations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`petugas_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `mustahik` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`sector_id` text NOT NULL,
	`pekerjaan` text,
	`deskripsi_kondisi` text,
	`tanggungan` integer DEFAULT 0,
	`jumlah_jiwa` integer DEFAULT 1 NOT NULL,
	`kategori_prioritas` text DEFAULT 'sedang',
	`status_distribusi` text DEFAULT 'belum_disalurkan',
	`tanggal_distribusi` integer,
	`petugas_penyalur_id` text,
	`catatan_distribusi` text,
	`periode_id` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`petugas_penyalur_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`periode_id`) REFERENCES `periods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `mustahik_allocations` (
	`id` text PRIMARY KEY NOT NULL,
	`mustahik_id` text NOT NULL,
	`periode_id` text,
	`alokasi_beras` real DEFAULT 0,
	`alokasi_uang_lokal` integer DEFAULT 0,
	`bantuan_pusat_id` text,
	`total_bantuan` integer DEFAULT 0,
	`sudah_diterima` integer DEFAULT false,
	`tanggal_diterima` integer,
	`created_at` integer,
	FOREIGN KEY (`mustahik_id`) REFERENCES `mustahik`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`periode_id`) REFERENCES `periods`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bantuan_pusat_id`) REFERENCES `central_aid`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `muzaki` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`sector_id` text NOT NULL,
	`jumlah_jiwa` integer DEFAULT 1 NOT NULL,
	`jenis_zakat` text NOT NULL,
	`jumlah_beras` real DEFAULT 0,
	`jumlah_uang` integer DEFAULT 0,
	`infaq` integer DEFAULT 0,
	`petugas_id` text NOT NULL,
	`periode_id` text,
	`notes` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`petugas_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`periode_id`) REFERENCES `periods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `onboarding_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`current_step` integer DEFAULT 1 NOT NULL,
	`completed_steps` text DEFAULT '[]',
	`is_completed` integer DEFAULT false,
	`temp_data` text,
	`created_organization_id` text,
	`started_at` integer,
	`completed_at` integer,
	`expires_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `onboarding_sessions_user_id_unique` ON `onboarding_sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`address` text,
	`phone` text,
	`email` text,
	`logo_url` text,
	`primary_color` text DEFAULT '#3b82f6',
	`is_active` integer DEFAULT true,
	`plan` text DEFAULT 'free',
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_slug_unique` ON `organizations` (`slug`);--> statement-breakpoint
CREATE TABLE `periods` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`year_hijri` integer NOT NULL,
	`year_masehi` integer NOT NULL,
	`name` text NOT NULL,
	`start_date` integer,
	`end_date` integer,
	`is_active` integer DEFAULT false,
	`created_at` integer,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sectors` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`color` text DEFAULT '#3b82f6',
	`is_active` integer DEFAULT true,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `users` ADD `role` text DEFAULT 'viewer' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `organization_id` text REFERENCES organizations(id);--> statement-breakpoint
ALTER TABLE `users` ADD `sector_id` text REFERENCES sectors(id);--> statement-breakpoint
ALTER TABLE `users` ADD `is_active` integer DEFAULT true;