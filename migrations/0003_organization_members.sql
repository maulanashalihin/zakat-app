-- Step 1: Create organization_members table for many-to-many relationship
CREATE TABLE `organization_members` (
  `id` text PRIMARY KEY,
  `user_id` text NOT NULL,
  `organization_id` text NOT NULL,
  `role` text DEFAULT 'viewer' NOT NULL,
  `sector_id` text,
  `is_active` integer DEFAULT 1,
  `joined_at` integer,
  `created_at` integer,
  `updated_at` integer,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON DELETE SET NULL
);

-- Step 2: Create indexes for organization_members
CREATE INDEX `idx_org_members_user_org` ON `organization_members` (`user_id`, `organization_id`);
CREATE INDEX `idx_org_members_organization` ON `organization_members` (`organization_id`);
CREATE INDEX `idx_org_members_user` ON `organization_members` (`user_id`);
CREATE INDEX `idx_org_members_role` ON `organization_members` (`role`);

-- Step 3: Migrate existing user data to organization_members
-- Copy existing organization_id and role to new table
INSERT INTO `organization_members` (`id`, `user_id`, `organization_id`, `role`, `sector_id`, `is_active`, `joined_at`, `created_at`, `updated_at`)
SELECT 
  lower(hex(randomblob(16))),
  `id`,
  `organization_id`,
  COALESCE(`role`, 'viewer'),
  `sector_id`,
  `is_active`,
  `created_at`,
  `created_at`,
  `updated_at`
FROM `users`
WHERE `organization_id` IS NOT NULL;

-- Step 4: Update users table - rename columns
-- Add new columns first
ALTER TABLE `users` ADD COLUMN `global_role` text DEFAULT 'user' NOT NULL;
ALTER TABLE `users` ADD COLUMN `primary_organization_id` text;

-- Migrate super_admin users
UPDATE `users` SET `global_role` = 'super_admin' WHERE `role` = 'super_admin';

-- Set primary organization from old organization_id
UPDATE `users` SET `primary_organization_id` = `organization_id` WHERE `organization_id` IS NOT NULL;

-- Note: We keep old columns for backward compatibility during transition
-- They can be removed in a future migration
