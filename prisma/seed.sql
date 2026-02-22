-- ============================================================
-- QRlamenü Premium - Veritabanı Kurulum Dosyası (MySQL)
-- phpMyAdmin İçe Aktar ile kullanılmak üzere hazırlanmıştır.
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ── TABLOLARI OLUŞTUR ──────────────────────────────────────

-- SuperAdmin
CREATE TABLE IF NOT EXISTS `SuperAdmin` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NULL,
  `role` VARCHAR(191) NOT NULL DEFAULT 'SUPER_ADMIN',
  `emailVerified` DATETIME(3) NULL,
  `verificationToken` VARCHAR(191) NULL,
  `verificationTokenExpires` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `SuperAdmin_email_key` (`email`),
  UNIQUE INDEX `SuperAdmin_verificationToken_key` (`verificationToken`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SubscriptionPlan
CREATE TABLE IF NOT EXISTS `SubscriptionPlan` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `price` DOUBLE NOT NULL DEFAULT 0,
  `branchLimit` INT NOT NULL DEFAULT 1,
  `tableLimit` INT NOT NULL DEFAULT 10,
  `features` JSON NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `SubscriptionPlan_name_key` (`name`),
  UNIQUE INDEX `SubscriptionPlan_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tenant
CREATE TABLE IF NOT EXISTS `Tenant` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `customDomain` VARCHAR(191) NULL,
  `logoUrl` VARCHAR(191) NULL,
  `ownerEmail` VARCHAR(191) NOT NULL,
  `status` ENUM('ACTIVE','SUSPENDED','EXPIRED','TRIAL') NOT NULL DEFAULT 'ACTIVE',
  `theme` VARCHAR(191) NOT NULL DEFAULT 'LITE',
  `trialExpiresAt` DATETIME(3) NULL,
  `planId` VARCHAR(191) NOT NULL,
  `settings` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Tenant_slug_key` (`slug`),
  UNIQUE INDEX `Tenant_customDomain_key` (`customDomain`),
  INDEX `Tenant_slug_idx` (`slug`),
  CONSTRAINT `Tenant_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `SubscriptionPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User
CREATE TABLE IF NOT EXISTS `User` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NULL,
  `role` ENUM('ADMIN','WAITER','KITCHEN') NOT NULL DEFAULT 'ADMIN',
  `tenantId` VARCHAR(191) NOT NULL,
  `emailVerified` DATETIME(3) NULL,
  `verificationToken` VARCHAR(191) NULL,
  `verificationTokenExpires` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `User_email_key` (`email`),
  UNIQUE INDEX `User_verificationToken_key` (`verificationToken`),
  INDEX `User_tenantId_idx` (`tenantId`),
  CONSTRAINT `User_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Session
CREATE TABLE IF NOT EXISTS `Session` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NULL,
  `superAdminId` VARCHAR(191) NULL,
  `token` VARCHAR(191) NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Session_token_key` (`token`),
  INDEX `Session_userId_idx` (`userId`),
  INDEX `Session_superAdminId_idx` (`superAdminId`),
  CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Session_superAdminId_fkey` FOREIGN KEY (`superAdminId`) REFERENCES `SuperAdmin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Category
CREATE TABLE IF NOT EXISTS `Category` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `order` INT NOT NULL DEFAULT 0,
  `imageUrl` VARCHAR(191) NULL,
  `tenantId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `Category_tenantId_idx` (`tenantId`),
  CONSTRAINT `Category_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product
CREATE TABLE IF NOT EXISTS `Product` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  `price` DOUBLE NOT NULL,
  `imageUrl` VARCHAR(191) NULL,
  `isAvailable` TINYINT(1) NOT NULL DEFAULT 1,
  `isPopular` TINYINT(1) NOT NULL DEFAULT 0,
  `order` INT NOT NULL DEFAULT 0,
  `categoryId` VARCHAR(191) NOT NULL,
  `tenantId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `Product_tenantId_idx` (`tenantId`),
  INDEX `Product_categoryId_idx` (`categoryId`),
  CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Product_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order
CREATE TABLE IF NOT EXISTS `Order` (
  `id` VARCHAR(191) NOT NULL,
  `tableId` VARCHAR(191) NULL,
  `totalAmount` DOUBLE NOT NULL,
  `status` ENUM('PENDING','PREPARING','SERVED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `tenantId` VARCHAR(191) NOT NULL,
  `items` JSON NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `Order_tenantId_idx` (`tenantId`),
  CONSTRAINT `Order_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Theme
CREATE TABLE IF NOT EXISTS `Theme` (
  `id` VARCHAR(191) NOT NULL,
  `key` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  `previewUrl` VARCHAR(191) NULL,
  `isPremium` TINYINT(1) NOT NULL DEFAULT 0,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `order` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Theme_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- WaiterCall
CREATE TABLE IF NOT EXISTS `WaiterCall` (
  `id` VARCHAR(191) NOT NULL,
  `tableId` VARCHAR(191) NOT NULL,
  `status` ENUM('PENDING','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `tenantId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `WaiterCall_tenantId_idx` (`tenantId`),
  CONSTRAINT `WaiterCall_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Transaction
CREATE TABLE IF NOT EXISTS `Transaction` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `amount` DOUBLE NOT NULL,
  `reward` VARCHAR(191) NULL,
  `paymentMethod` VARCHAR(191) NOT NULL,
  `status` ENUM('COMPLETED','PENDING','FAILED','CANCELLED') NOT NULL DEFAULT 'COMPLETED',
  `tenantId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `Transaction_tenantId_idx` (`tenantId`),
  CONSTRAINT `Transaction_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SystemLog
CREATE TABLE IF NOT EXISTS `SystemLog` (
  `id` VARCHAR(191) NOT NULL,
  `level` ENUM('INFO','SUCCESS','WARNING','ERROR') NOT NULL DEFAULT 'INFO',
  `message` VARCHAR(191) NOT NULL,
  `category` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lead
CREATE TABLE IF NOT EXISTS `Lead` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `restaurant` VARCHAR(191) NULL,
  `email` VARCHAR(191) NULL,
  `phone` VARCHAR(191) NULL,
  `status` ENUM('PENDING','CONTACTED','CONVERTED','LOST') NOT NULL DEFAULT 'PENDING',
  `notes` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SystemConfig
CREATE TABLE IF NOT EXISTS `SystemConfig` (
  `id` VARCHAR(191) NOT NULL,
  `key` VARCHAR(191) NOT NULL,
  `value` JSON NOT NULL,
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `SystemConfig_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PrintAgent
CREATE TABLE IF NOT EXISTS `PrintAgent` (
  `id` VARCHAR(191) NOT NULL,
  `tenantId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `agentId` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'OFFLINE',
  `version` VARCHAR(191) NULL,
  `latency` INT NULL,
  `lastSeen` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `PrintAgent_agentId_key` (`agentId`),
  INDEX `PrintAgent_tenantId_idx` (`tenantId`),
  CONSTRAINT `PrintAgent_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AuditLog
CREATE TABLE IF NOT EXISTS `AuditLog` (
  `id` VARCHAR(191) NOT NULL,
  `adminId` VARCHAR(191) NULL,
  `adminEmail` VARCHAR(191) NULL,
  `action` VARCHAR(191) NOT NULL,
  `details` VARCHAR(191) NULL,
  `ipAddress` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Campaign
CREATE TABLE IF NOT EXISTS `Campaign` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `content` VARCHAR(191) NULL,
  `imageUrl` VARCHAR(191) NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `tenantId` VARCHAR(191) NOT NULL,
  `startDate` DATETIME(3) NULL,
  `endDate` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `Campaign_tenantId_idx` (`tenantId`),
  CONSTRAINT `Campaign_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Prisma Migrations Tablosu
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` VARCHAR(36) NOT NULL,
  `checksum` VARCHAR(64) NOT NULL,
  `finished_at` DATETIME(3) NULL,
  `migration_name` VARCHAR(255) NOT NULL,
  `logs` TEXT NULL,
  `rolled_back_at` DATETIME(3) NULL,
  `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── VERİLERİ EKLE (SEED) ──────────────────────────────────

-- 1. Super Admin
INSERT INTO `SuperAdmin` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES
('sa_001', 'admin@qrlamenu.com', 'pbkdf2:sha512:310000:8c752b4233d6bf60bd9956752b994c6edf22a7e7db6d0aebd9ac9ada02622bb7:4dda46ebed0da304a28bbbb2c480fa1d36c2098d3d3310025654e658ff6c86df9403780d839866a71abe072a5e0f6b40400b658a8f0f4ab9b899aa83aa653436', 'Sistem Yöneticisi', 'SUPER_ADMIN', NOW(3), NOW(3));

-- 1b. Temalar
INSERT INTO `Theme` (`id`, `key`, `name`, `description`, `isPremium`, `isActive`, `order`, `createdAt`, `updatedAt`) VALUES
('theme_001', 'LITE', 'Lite Theme', 'Hızlı ve sade görünüm', 0, 1, 1, NOW(3), NOW(3)),
('theme_002', 'CLASSIC', 'Classic Theme', 'Geleneksel menü düzeni', 0, 1, 2, NOW(3), NOW(3)),
('theme_003', 'MODERN', 'Modern Theme', 'Şık ve dinamik tasarım', 1, 1, 3, NOW(3), NOW(3)),
('theme_004', 'SIGNATURE', 'Signature Theme', 'Premium restoranlar için', 1, 1, 4, NOW(3), NOW(3)),
('theme_005', 'FASTFOOD', 'Fast Food', 'Hızlı sipariş odaklı', 0, 1, 5, NOW(3), NOW(3)),
('theme_006', 'LUXURY', 'Luxury', 'Lüks ve elit sunum', 1, 1, 6, NOW(3), NOW(3));

-- 2. Premium Plan
INSERT INTO `SubscriptionPlan` (`id`, `name`, `code`, `price`, `branchLimit`, `tableLimit`, `features`, `createdAt`, `updatedAt`) VALUES
('plan_001', 'Premium', 'premium', 999, 10, 100, '["Her Şey Dahil"]', NOW(3), NOW(3));

-- 3. Tenant (Restoran)
INSERT INTO `Tenant` (`id`, `name`, `slug`, `ownerEmail`, `logoUrl`, `planId`, `theme`, `status`, `createdAt`, `updatedAt`) VALUES
('tenant_001', 'QRlamenü Premium', 'qrlamenu-premium', 'restoran@qrlamenu.com', 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop', 'plan_001', 'MODERN', 'ACTIVE', NOW(3), NOW(3));

-- 4. User (Restoran Müdürü)
INSERT INTO `User` (`id`, `email`, `password`, `name`, `role`, `tenantId`, `createdAt`, `updatedAt`) VALUES
('user_001', 'restoran@qrlamenu.com', 'pbkdf2:sha512:310000:8f2c1d6805b5d43cb8814da6adf0d942a66b42c30663c826a6d7b6d23d0eaf20:88bb0adebe8ff53d3b8954ad8035173986ea911f811790d7b2208cb5b6cb1b2cf4cc541e2214e151d528d2fb961651404e88ee3e0eecb7cd74b652d58556f19b', 'Restoran Müdürü', 'ADMIN', 'tenant_001', NOW(3), NOW(3));

-- 5. Kategoriler
INSERT INTO `Category` (`id`, `name`, `order`, `imageUrl`, `tenantId`, `createdAt`, `updatedAt`) VALUES
('cat_001', 'Özel Kahvaltılar', 1, 'https://images.unsplash.com/photo-1533089862017-5614ecd6d056?w=800&auto=format&fit=crop', 'tenant_001', NOW(3), NOW(3)),
('cat_002', 'Gurme Burgerler', 2, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop', 'tenant_001', NOW(3), NOW(3)),
('cat_003', 'İtalyan Mutfağı', 3, 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&auto=format&fit=crop', 'tenant_001', NOW(3), NOW(3)),
('cat_004', 'Tatlı & Kahve', 4, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop', 'tenant_001', NOW(3), NOW(3));

-- 6. Ürünler - Kahvaltılar
INSERT INTO `Product` (`id`, `name`, `description`, `price`, `imageUrl`, `isAvailable`, `isPopular`, `order`, `categoryId`, `tenantId`, `createdAt`, `updatedAt`) VALUES
('prod_001', 'Serpme Köy Kahvaltısı', 'Organik reçeller, köy peynirleri, bal-kaymak ve sıcak ekmek sepeti.', 450, 'https://images.unsplash.com/photo-1544510802-39c4a8677c7d?w=800&auto=format&fit=crop', 1, 0, 0, 'cat_001', 'tenant_001', NOW(3), NOW(3)),
('prod_002', 'Pancak Kulesi', 'Akçaağaç şurubu, taze orman meyveleri ve pudra şekeri ile.', 280, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop', 1, 0, 1, 'cat_001', 'tenant_001', NOW(3), NOW(3)),
('prod_003', 'Avokado Toast', 'Ekşi maya ekmek üzeri avokado poşe yumurta ve çörek otu.', 240, 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=800&auto=format&fit=crop', 1, 0, 2, 'cat_001', 'tenant_001', NOW(3), NOW(3)),
('prod_004', 'Menemen', 'Çakallı usulü, bol kaşarlı ve tereyağlı.', 180, 'https://images.unsplash.com/photo-1594975543793-6a3f91244498?w=800&auto=format&fit=crop', 1, 0, 3, 'cat_001', 'tenant_001', NOW(3), NOW(3));

-- 6b. Ürünler - Burgerler
INSERT INTO `Product` (`id`, `name`, `description`, `price`, `imageUrl`, `isAvailable`, `isPopular`, `order`, `categoryId`, `tenantId`, `createdAt`, `updatedAt`) VALUES
('prod_005', 'Truffle Mushroom Burger', 'Trüf mantarlı mayonez, karamelize soğan ve 180gr dana köfte.', 380, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop', 1, 1, 0, 'cat_002', 'tenant_001', NOW(3), NOW(3)),
('prod_006', 'Texas BBQ Burger', 'Çıtır soğan halkaları, cheddar peyniri ve özel BBQ sos.', 360, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop', 1, 0, 1, 'cat_002', 'tenant_001', NOW(3), NOW(3)),
('prod_007', 'Crispy Chicken Burger', 'Özel baharatlı panelenmiş tavuk göğsü ve coleslaw salatası.', 320, 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop', 1, 0, 2, 'cat_002', 'tenant_001', NOW(3), NOW(3));

-- 6c. Ürünler - İtalyan
INSERT INTO `Product` (`id`, `name`, `description`, `price`, `imageUrl`, `isAvailable`, `isPopular`, `order`, `categoryId`, `tenantId`, `createdAt`, `updatedAt`) VALUES
('prod_008', 'Pizza Margherita', 'San Marzano domates sosu, manda mozzarella ve taze fesleğen.', 300, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop', 1, 0, 0, 'cat_003', 'tenant_001', NOW(3), NOW(3)),
('prod_009', 'Fettuccine Alfredo', 'Parmesan tekerinde hazırlanan kremalı ve tavuklu makarna.', 340, 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&auto=format&fit=crop', 1, 1, 1, 'cat_003', 'tenant_001', NOW(3), NOW(3)),
('prod_010', 'Lazanya', 'Bolonez soslu, beşamel soslu ve fırınlanmış.', 360, 'https://images.unsplash.com/photo-1574868235948-f9f25759ef09?w=800&auto=format&fit=crop', 1, 0, 2, 'cat_003', 'tenant_001', NOW(3), NOW(3));

-- 6d. Ürünler - Tatlı & Kahve
INSERT INTO `Product` (`id`, `name`, `description`, `price`, `imageUrl`, `isAvailable`, `isPopular`, `order`, `categoryId`, `tenantId`, `createdAt`, `updatedAt`) VALUES
('prod_011', 'San Sebastian Cheesecake', 'Belçika çikolatası sosu ile servis edilir.', 210, 'https://images.unsplash.com/photo-1606312619070-d48b706521bf?w=800&auto=format&fit=crop', 1, 1, 0, 'cat_004', 'tenant_001', NOW(3), NOW(3)),
('prod_012', 'Belçika Waffle', 'Taze meyveler, dondurma ve çikolata sosu.', 240, 'https://images.unsplash.com/photo-1562961801-6c483d2ba3da?w=800&auto=format&fit=crop', 1, 0, 1, 'cat_004', 'tenant_001', NOW(3), NOW(3)),
('prod_013', 'Iced Americano', '%100 Arabica çekirdeklerinden.', 90, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop', 1, 0, 2, 'cat_004', 'tenant_001', NOW(3), NOW(3)),
('prod_014', 'Türk Kahvesi', 'Çifte kavrulmuş, lokum ile.', 60, 'https://images.unsplash.com/photo-1576092768241-dec231847233?w=800&auto=format&fit=crop', 1, 0, 3, 'cat_004', 'tenant_001', NOW(3), NOW(3));

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- KURULUM TAMAMLANDI!
-- Super Admin: admin@qrlamenu.com / admin
-- Restoran Admin: restoran@qrlamenu.com / 123
-- ============================================================
