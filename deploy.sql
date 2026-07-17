-- deploy.sql — SMARTUAE production deploy (full, with demo data)
-- Consolidated: classifieds upgrades + real estate + events (schema + seed).
-- Run ONCE against the production DB. 'SET NAMES utf8mb4' below guarantees
-- emoji icons import correctly regardless of client charset.
--   mysql -u <user> -p <db> < deploy.sql
-- Prerequisite: the base schema (smartuae_full.sql) must already be loaded
-- (needs users, classifieds, classified_categories, business_categories).

SET NAMES utf8mb4;

-- ======================================================================
-- migrate5.sql — Classifieds enhancements
-- ======================================================================
-- migrate5.sql — Classifieds enhancements
--  • category-specific fields (cars / furniture)
--  • per-post expiry (admin editable)
--  • multiple images per post (classified_images)
--  • dummy seed data linked to a user
-- MySQL 5.7 / MariaDB compatible: plain ALTER (run once).

-- ── New category-specific columns ──────────────────────────────────────────────
ALTER TABLE `classifieds` ADD COLUMN `year` VARCHAR(20) DEFAULT NULL;
ALTER TABLE `classifieds` ADD COLUMN `mileage` VARCHAR(30) DEFAULT NULL;
ALTER TABLE `classifieds` ADD COLUMN `transmission` VARCHAR(30) DEFAULT NULL;
ALTER TABLE `classifieds` ADD COLUMN `fuel_type` VARCHAR(30) DEFAULT NULL;
ALTER TABLE `classifieds` ADD COLUMN `material` VARCHAR(60) DEFAULT NULL;
ALTER TABLE `classifieds` ADD COLUMN `dimensions` VARCHAR(60) DEFAULT NULL;
ALTER TABLE `classifieds` ADD COLUMN `furniture_type` VARCHAR(60) DEFAULT NULL;

-- ── Expiry (admin editable) ─────────────────────────────────────────────────────
ALTER TABLE `classifieds` ADD COLUMN `expires_at` DATETIME DEFAULT NULL;

-- New posts must be approved before going live.
ALTER TABLE `classifieds` ALTER `status` SET DEFAULT 'pending';

-- Keep already-approved rows alive for 30 days from now.
UPDATE `classifieds` SET `expires_at` = DATE_ADD(NOW(), INTERVAL 30 DAY) WHERE `expires_at` IS NULL;

-- ── Image gallery ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `classified_images` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `classified_id` INT(11) NOT NULL,
  `filename` VARCHAR(500) NOT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `classified_id` (`classified_id`),
  CONSTRAINT `classified_images_ibfk_1` FOREIGN KEY (`classified_id`) REFERENCES `classifieds` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Dummy seed data (linked to user id 2) ───────────────────────────────────────
SET @uid := (SELECT id FROM users ORDER BY id LIMIT 1);

-- helper note: each block inserts a classified then 3 gallery images for it.

-- Used Mobiles (category 1) ------------------------------------------------------
INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,storage,memory,battery_health,carrier_lock,image,status,is_active,expires_at)
VALUES (@uid,'iPhone 14 Pro Max 256GB','Immaculate condition, no scratches, with original box and charger.',3200,'AED',1,'Dubai Marina, Dubai','Apple','iPhone 14 Pro Max','Deep Purple','Like New','256GB','6GB','94%','Unlocked','mobile-1-a.svg','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'mobile-1-a.svg',0),(@cid,'mobile-1-b.svg',1),(@cid,'mobile-1-c.svg',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,storage,memory,battery_health,carrier_lock,image,status,is_active,expires_at)
VALUES (@uid,'Samsung Galaxy S23 Ultra','Snapdragon 8 Gen 2, S-Pen included. Light use.',2750,'AED',1,'Al Barsha, Dubai','Samsung','Galaxy S23 Ultra','Phantom Black','Good','512GB','12GB','89%','Unlocked','mobile-2-a.svg','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'mobile-2-a.svg',0),(@cid,'mobile-2-b.svg',1),(@cid,'mobile-2-c.svg',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,storage,memory,battery_health,carrier_lock,image,status,is_active,expires_at)
VALUES (@uid,'Google Pixel 8 Pro','Stock Android, amazing camera. Minor wear on edges.',1900,'AED',1,'Sharjah','Google','Pixel 8 Pro','Obsidian','Good','128GB','12GB','92%','Unlocked','mobile-3-a.svg','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'mobile-3-a.svg',0),(@cid,'mobile-3-b.svg',1),(@cid,'mobile-3-c.svg',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,storage,memory,battery_health,carrier_lock,image,status,is_active,expires_at)
VALUES (@uid,'iPhone 13 128GB','Battery service done. Great everyday phone.',1500,'AED',1,'Abu Dhabi','Apple','iPhone 13','Midnight','Fair','128GB','4GB','100%','Unlocked','mobile-4-a.svg','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'mobile-4-a.svg',0),(@cid,'mobile-4-b.svg',1),(@cid,'mobile-4-c.svg',2);

-- Used Cars (category 5) ---------------------------------------------------------
INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,year,mileage,transmission,fuel_type,image,status,is_active,expires_at)
VALUES (@uid,'Toyota Land Cruiser GXR 2019','GCC specs, full service history, single owner.',185000,'AED',5,'Dubai','Toyota','Land Cruiser GXR','Pearl White','Good','2019','98,000 km','Automatic','Petrol','car-1-a.svg','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'car-1-a.svg',0),(@cid,'car-1-b.svg',1),(@cid,'car-1-c.svg',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,year,mileage,transmission,fuel_type,image,status,is_active,expires_at)
VALUES (@uid,'Nissan Patrol Platinum 2021','Top of the line, warranty until 2026.',245000,'AED',5,'Abu Dhabi','Nissan','Patrol Platinum','Black','Like New','2021','45,000 km','Automatic','Petrol','car-2-a.svg','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'car-2-a.svg',0),(@cid,'car-2-b.svg',1),(@cid,'car-2-c.svg',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,year,mileage,transmission,fuel_type,image,status,is_active,expires_at)
VALUES (@uid,'Honda Civic 2020','Economical, well maintained, accident free.',62000,'AED',5,'Sharjah','Honda','Civic','Silver','Good','2020','72,000 km','Automatic','Petrol','car-3-a.svg','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'car-3-a.svg',0),(@cid,'car-3-b.svg',1),(@cid,'car-3-c.svg',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,year,mileage,transmission,fuel_type,image,status,is_active,expires_at)
VALUES (@uid,'Tesla Model 3 2022','Long Range, autopilot, free supercharging.',155000,'AED',5,'Dubai','Tesla','Model 3','Red','Like New','2022','30,000 km','Automatic','Electric','car-4-a.svg','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'car-4-a.svg',0),(@cid,'car-4-b.svg',1),(@cid,'car-4-c.svg',2);

-- Used Furniture (category 3) ----------------------------------------------------
INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,color,condition_status,furniture_type,material,dimensions,image,status,is_active,expires_at)
VALUES (@uid,'L-Shaped Fabric Sofa','Comfortable 5-seater, smoke-free home.',1800,'AED',3,'Jumeirah, Dubai','Grey','Good','Sofa','Fabric & Wood','280 x 200 cm','furniture-1-a.svg','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'furniture-1-a.svg',0),(@cid,'furniture-1-b.svg',1),(@cid,'furniture-1-c.svg',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,color,condition_status,furniture_type,material,dimensions,image,status,is_active,expires_at)
VALUES (@uid,'Solid Oak Dining Table + 6 Chairs','Sturdy and elegant, minor surface marks.',2400,'AED',3,'Al Reem, Abu Dhabi','Brown','Good','Dining Set','Solid Oak','180 x 90 cm','furniture-2-a.svg','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'furniture-2-a.svg',0),(@cid,'furniture-2-b.svg',1),(@cid,'furniture-2-c.svg',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,color,condition_status,furniture_type,material,dimensions,image,status,is_active,expires_at)
VALUES (@uid,'King Size Bed with Mattress','Upholstered headboard, medium-firm mattress included.',1600,'AED',3,'Sharjah','Beige','Like New','Bed','Wood & Foam','200 x 180 cm','furniture-3-a.svg','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'furniture-3-a.svg',0),(@cid,'furniture-3-b.svg',1),(@cid,'furniture-3-c.svg',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,color,condition_status,furniture_type,material,dimensions,image,status,is_active,expires_at)
VALUES (@uid,'5-Door Wardrobe','Spacious with mirror, easy to dismantle for moving.',950,'AED',3,'Deira, Dubai','White','Fair','Wardrobe','MDF','250 x 60 cm','furniture-4-a.svg','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'furniture-4-a.svg',0),(@cid,'furniture-4-b.svg',1),(@cid,'furniture-4-c.svg',2);

-- ======================================================================
-- migrate6.sql — Real Estate module
-- ======================================================================
-- migrate6.sql — Real Estate module
--  • property_categories (icons, dashboard-editable)
--  • real_estate_companies (major players, featured logo slider)
--  • properties (+ property_images gallery)
--  • real_estate_projects / off-plan (+ project_images gallery)
--  • all linked to a user, approval workflow (status + is_active)
-- MySQL 5.7 / MariaDB compatible. Safe to run once.
-- IMPORTANT: this file contains emoji (property_categories.icon). Import with the
-- utf8mb4 client charset or the emoji will be double-encoded (mojibake):
--   mysql -u root --default-character-set=utf8mb4 smartuae < migrate6.sql

-- ── Property categories ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `property_categories` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO property_categories (name, icon, sort_order) VALUES
  ('Bedspace', '🛏️', 1),
  ('Private/Sharing Rooms', '🚪', 2),
  ('Flat for Rent', '🏢', 3),
  ('Villa for Rent', '🏡', 4),
  ('Flat for Sale', '🏬', 5),
  ('Villa for Sale', '🏠', 6);

-- ── Real estate companies (major players) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS `real_estate_companies` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) DEFAULT NULL,
  `name` VARCHAR(200) NOT NULL,
  `logo` VARCHAR(500) DEFAULT NULL,
  `banner` VARCHAR(500) DEFAULT NULL,
  `about` TEXT DEFAULT NULL,
  `phone` VARCHAR(40) DEFAULT NULL,
  `whatsapp` VARCHAR(40) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `website` VARCHAR(200) DEFAULT NULL,
  `emirate` VARCHAR(50) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT 0,
  `sort_order` INT(11) DEFAULT 0,
  `status` ENUM('pending','approved','rejected') DEFAULT 'pending',
  `is_active` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Properties ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `properties` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) DEFAULT NULL,
  `company_id` INT(11) DEFAULT NULL,
  `category_id` INT(11) DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `purpose` VARCHAR(10) DEFAULT NULL,
  `price` DECIMAL(14,2) DEFAULT NULL,
  `currency` VARCHAR(10) DEFAULT 'AED',
  `rent_period` VARCHAR(20) DEFAULT NULL,
  `bedrooms` VARCHAR(20) DEFAULT NULL,
  `bathrooms` VARCHAR(20) DEFAULT NULL,
  `area_sqft` VARCHAR(30) DEFAULT NULL,
  `furnished` VARCHAR(30) DEFAULT NULL,
  `parking` VARCHAR(30) DEFAULT NULL,
  `amenities` TEXT DEFAULT NULL,
  `location` VARCHAR(200) DEFAULT NULL,
  `emirate` VARCHAR(50) DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `status` ENUM('pending','approved','rejected') DEFAULT 'pending',
  `is_active` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `company_id` (`company_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `property_images` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `property_id` INT(11) NOT NULL,
  `filename` VARCHAR(500) NOT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `property_images_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Off-plan projects ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `real_estate_projects` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) DEFAULT NULL,
  `company_id` INT(11) DEFAULT NULL,
  `name` VARCHAR(200) NOT NULL,
  `developer` VARCHAR(200) DEFAULT NULL,
  `location` VARCHAR(200) DEFAULT NULL,
  `emirate` VARCHAR(50) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `starting_price` DECIMAL(14,2) DEFAULT NULL,
  `currency` VARCHAR(10) DEFAULT 'AED',
  `handover` VARCHAR(50) DEFAULT NULL,
  `payment_plan` VARCHAR(200) DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT 0,
  `status` ENUM('pending','approved','rejected') DEFAULT 'pending',
  `is_active` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `project_images` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `project_id` INT(11) NOT NULL,
  `filename` VARCHAR(500) NOT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_images_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `real_estate_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Seed: companies ─────────────────────────────────────────────────────────────
SET @uid := (SELECT id FROM users ORDER BY id LIMIT 1);

INSERT INTO real_estate_companies (user_id,name,logo,banner,about,phone,whatsapp,email,website,emirate,address,is_featured,sort_order,status,is_active)
VALUES (@uid,'Emaar Properties','emaar-logo.svg','emaar-banner.svg','Emaar is one of the most valuable real estate development companies in the world, the master developer behind Downtown Dubai, Dubai Marina and Burj Khalifa.','+97144661688','971544661688','sales@emaar.ae','https://www.emaar.com','Dubai','Downtown Dubai, Emaar Square',1,1,'approved',1);
SET @emaar := LAST_INSERT_ID();
INSERT INTO real_estate_companies (user_id,name,logo,banner,about,phone,whatsapp,email,website,emirate,address,is_featured,sort_order,status,is_active)
VALUES (@uid,'DAMAC Properties','damac-logo.svg','damac-banner.svg','DAMAC Properties is a luxury real estate developer delivering iconic residential, commercial and leisure properties across the region.','+97144209999','971544209999','info@damacproperties.com','https://www.damacproperties.com','Dubai','DAMAC Park Towers, DIFC',1,2,'approved',1);
SET @damac := LAST_INSERT_ID();
INSERT INTO real_estate_companies (user_id,name,logo,banner,about,phone,whatsapp,email,website,emirate,address,is_featured,sort_order,status,is_active)
VALUES (@uid,'Nakheel','nakheel-logo.svg','nakheel-banner.svg','Nakheel is a world-leading master developer whose landmark projects include Palm Jumeirah, The World and Deira Islands.','+97148908000','971544908000','customercare@nakheel.com','https://www.nakheel.com','Dubai','Palm Jumeirah, Al Sufouh',1,3,'approved',1);
SET @nakheel := LAST_INSERT_ID();
INSERT INTO real_estate_companies (user_id,name,logo,banner,about,phone,whatsapp,email,website,emirate,address,is_featured,sort_order,status,is_active)
VALUES (@uid,'Aldar Properties','aldar-logo.svg','aldar-banner.svg','Aldar is the leading real estate developer in Abu Dhabi, creating integrated communities on Yas Island, Saadiyat Island and beyond.','+97120181111','971544181111','customercare@aldar.com','https://www.aldar.com','Abu Dhabi','Yas Island, HQ Building',1,4,'approved',1);
SET @aldar := LAST_INSERT_ID();

-- ── Seed: properties (helper inserts 3 gallery images each) ──────────────────────
-- Bedspace
INSERT INTO properties (user_id,company_id,category_id,title,description,purpose,price,currency,rent_period,bedrooms,bathrooms,area_sqft,furnished,parking,amenities,location,emirate,image,status,is_active)
VALUES (@uid,NULL,1,'Bedspace in Bur Dubai','Clean, well-maintained bed space for executive bachelors. Includes WiFi, DEWA and weekly cleaning.','Rent',1200,'AED','Monthly','Shared','Shared','Shared','Furnished','No','WiFi, A/C, Cleaning','Bur Dubai','Dubai','prop-1-a.svg','approved',1);
SET @p := LAST_INSERT_ID();
INSERT INTO property_images (property_id,filename,sort_order) VALUES (@p,'prop-1-a.svg',0),(@p,'prop-1-b.svg',1),(@p,'prop-1-c.svg',2);

INSERT INTO properties (user_id,company_id,category_id,title,description,purpose,price,currency,rent_period,bedrooms,bathrooms,area_sqft,furnished,parking,amenities,location,emirate,image,status,is_active)
VALUES (@uid,NULL,1,'Ladies Bedspace in Deira','Female-only bed space close to metro. All bills included, fully furnished.','Rent',1000,'AED','Monthly','Shared','Shared','Shared','Furnished','No','WiFi, Metro nearby','Deira','Dubai','prop-2-a.svg','approved',1);
SET @p := LAST_INSERT_ID();
INSERT INTO property_images (property_id,filename,sort_order) VALUES (@p,'prop-2-a.svg',0),(@p,'prop-2-b.svg',1),(@p,'prop-2-c.svg',2);

-- Private/Sharing Rooms
INSERT INTO properties (user_id,company_id,category_id,title,description,purpose,price,currency,rent_period,bedrooms,bathrooms,area_sqft,furnished,parking,amenities,location,emirate,image,status,is_active)
VALUES (@uid,NULL,2,'Private Room in Al Nahda','Spacious private room with attached bathroom in a family apartment.','Rent',2500,'AED','Monthly','1','1','220 sqft','Furnished','Yes','Attached bath, Balcony','Al Nahda','Sharjah','prop-3-a.svg','approved',1);
SET @p := LAST_INSERT_ID();
INSERT INTO property_images (property_id,filename,sort_order) VALUES (@p,'prop-3-a.svg',0),(@p,'prop-3-b.svg',1),(@p,'prop-3-c.svg',2);

INSERT INTO properties (user_id,company_id,category_id,title,description,purpose,price,currency,rent_period,bedrooms,bathrooms,area_sqft,furnished,parking,amenities,location,emirate,image,status,is_active)
VALUES (@uid,NULL,2,'Sharing Room in JLT','Partition room available in a clean sharing apartment, lake view tower.','Rent',1800,'AED','Monthly','Shared','1','180 sqft','Partly Furnished','No','Pool, Gym, Lake view','Jumeirah Lake Towers','Dubai','prop-4-a.svg','approved',1);
SET @p := LAST_INSERT_ID();
INSERT INTO property_images (property_id,filename,sort_order) VALUES (@p,'prop-4-a.svg',0),(@p,'prop-4-b.svg',1),(@p,'prop-4-c.svg',2);

-- Flat for Rent
INSERT INTO properties (user_id,company_id,category_id,title,description,purpose,price,currency,rent_period,bedrooms,bathrooms,area_sqft,furnished,parking,amenities,location,emirate,image,status,is_active)
VALUES (@uid,@emaar,3,'1BR Apartment in Dubai Marina','Bright one-bedroom with full marina view, chiller free, walking distance to the beach.','Rent',75000,'AED','Yearly','1','2','780 sqft','Unfurnished','Yes','Pool, Gym, Marina view, Security','Dubai Marina','Dubai','prop-5-a.svg','approved',1);
SET @p := LAST_INSERT_ID();
INSERT INTO property_images (property_id,filename,sort_order) VALUES (@p,'prop-5-a.svg',0),(@p,'prop-5-b.svg',1),(@p,'prop-5-c.svg',2);

INSERT INTO properties (user_id,company_id,category_id,title,description,purpose,price,currency,rent_period,bedrooms,bathrooms,area_sqft,furnished,parking,amenities,location,emirate,image,status,is_active)
VALUES (@uid,@damac,3,'2BR Apartment in JVC','Modern two-bedroom in a quiet community, close to schools and Circle Mall.','Rent',95000,'AED','Yearly','2','3','1250 sqft','Furnished','Yes','Pool, Gym, Kids play area','Jumeirah Village Circle','Dubai','prop-6-a.svg','approved',1);
SET @p := LAST_INSERT_ID();
INSERT INTO property_images (property_id,filename,sort_order) VALUES (@p,'prop-6-a.svg',0),(@p,'prop-6-b.svg',1),(@p,'prop-6-c.svg',2);

-- Villa for Rent
INSERT INTO properties (user_id,company_id,category_id,title,description,purpose,price,currency,rent_period,bedrooms,bathrooms,area_sqft,furnished,parking,amenities,location,emirate,image,status,is_active)
VALUES (@uid,@emaar,4,'4BR Villa in Arabian Ranches','Type 14 villa with private garden and maid room in a sought-after community.','Rent',220000,'AED','Yearly','4','5','3500 sqft','Unfurnished','Yes','Private garden, Maid room, Community pool','Arabian Ranches','Dubai','prop-7-a.svg','approved',1);
SET @p := LAST_INSERT_ID();
INSERT INTO property_images (property_id,filename,sort_order) VALUES (@p,'prop-7-a.svg',0),(@p,'prop-7-b.svg',1),(@p,'prop-7-c.svg',2);

INSERT INTO properties (user_id,company_id,category_id,title,description,purpose,price,currency,rent_period,bedrooms,bathrooms,area_sqft,furnished,parking,amenities,location,emirate,image,status,is_active)
VALUES (@uid,@aldar,4,'5BR Luxury Villa in Al Barari','Ultra-luxury villa surrounded by greenery with a private pool and home cinema.','Rent',350000,'AED','Yearly','5','6','6000 sqft','Furnished','Yes','Private pool, Home cinema, Smart home','Al Barari','Dubai','prop-8-a.svg','approved',1);
SET @p := LAST_INSERT_ID();
INSERT INTO property_images (property_id,filename,sort_order) VALUES (@p,'prop-8-a.svg',0),(@p,'prop-8-b.svg',1),(@p,'prop-8-c.svg',2);

-- Flat for Sale
INSERT INTO properties (user_id,company_id,category_id,title,description,purpose,price,currency,rent_period,bedrooms,bathrooms,area_sqft,furnished,parking,amenities,location,emirate,image,status,is_active)
VALUES (@uid,@emaar,5,'2BR for Sale in Downtown','Burj Khalifa view apartment, high floor, ready to move in, strong rental yield.','Sale',2100000,'AED',NULL,'2','3','1300 sqft','Furnished','Yes','Burj view, Pool, Gym, Concierge','Downtown Dubai','Dubai','prop-9-a.svg','approved',1);
SET @p := LAST_INSERT_ID();
INSERT INTO property_images (property_id,filename,sort_order) VALUES (@p,'prop-9-a.svg',0),(@p,'prop-9-b.svg',1),(@p,'prop-9-c.svg',2);

INSERT INTO properties (user_id,company_id,category_id,title,description,purpose,price,currency,rent_period,bedrooms,bathrooms,area_sqft,furnished,parking,amenities,location,emirate,image,status,is_active)
VALUES (@uid,@damac,5,'Studio for Sale in Business Bay','Smart studio with canal view, ideal investment, handover-ready.','Sale',850000,'AED',NULL,'Studio','1','480 sqft','Furnished','Yes','Canal view, Pool, Gym','Business Bay','Dubai','prop-10-a.svg','approved',1);
SET @p := LAST_INSERT_ID();
INSERT INTO property_images (property_id,filename,sort_order) VALUES (@p,'prop-10-a.svg',0),(@p,'prop-10-b.svg',1),(@p,'prop-10-c.svg',2);

-- Villa for Sale
INSERT INTO properties (user_id,company_id,category_id,title,description,purpose,price,currency,rent_period,bedrooms,bathrooms,area_sqft,furnished,parking,amenities,location,emirate,image,status,is_active)
VALUES (@uid,@nakheel,6,'Signature Villa on Palm Jumeirah','Beachfront signature villa with private beach access and infinity pool.','Sale',12000000,'AED',NULL,'5','6','7200 sqft','Furnished','Yes','Private beach, Infinity pool, Sea view','Palm Jumeirah','Dubai','prop-11-a.svg','approved',1);
SET @p := LAST_INSERT_ID();
INSERT INTO property_images (property_id,filename,sort_order) VALUES (@p,'prop-11-a.svg',0),(@p,'prop-11-b.svg',1),(@p,'prop-11-c.svg',2);

INSERT INTO properties (user_id,company_id,category_id,title,description,purpose,price,currency,rent_period,bedrooms,bathrooms,area_sqft,furnished,parking,amenities,location,emirate,image,status,is_active)
VALUES (@uid,@aldar,6,'4BR Villa in Saadiyat Island','Contemporary villa steps from the beach in a premium Abu Dhabi community.','Sale',8500000,'AED',NULL,'4','5','5200 sqft','Unfurnished','Yes','Beach access, Garden, Smart home','Saadiyat Island','Abu Dhabi','prop-12-a.svg','approved',1);
SET @p := LAST_INSERT_ID();
INSERT INTO property_images (property_id,filename,sort_order) VALUES (@p,'prop-12-a.svg',0),(@p,'prop-12-b.svg',1),(@p,'prop-12-c.svg',2);

-- ── Seed: off-plan projects (2 gallery images each) ─────────────────────────────
INSERT INTO real_estate_projects (user_id,company_id,name,developer,location,emirate,description,starting_price,currency,handover,payment_plan,image,is_featured,status,is_active)
VALUES (@uid,@emaar,'Emaar Beachfront','Emaar Properties','Dubai Harbour','Dubai','An exclusive island destination between Palm Jumeirah and JBR with private beach living.',1500000,'AED','Q4 2026','80/20 Payment Plan','proj-1-a.svg',1,'approved',1);
SET @pr := LAST_INSERT_ID();
INSERT INTO project_images (project_id,filename,sort_order) VALUES (@pr,'proj-1-a.svg',0),(@pr,'proj-1-b.svg',1);

INSERT INTO real_estate_projects (user_id,company_id,name,developer,location,emirate,description,starting_price,currency,handover,payment_plan,image,is_featured,status,is_active)
VALUES (@uid,@damac,'DAMAC Lagoons','DAMAC Properties','Dubailand','Dubai','Mediterranean-inspired waterfront community of villas and townhouses around crystal lagoons.',1800000,'AED','Q2 2027','70/30 Payment Plan','proj-2-a.svg',1,'approved',1);
SET @pr := LAST_INSERT_ID();
INSERT INTO project_images (project_id,filename,sort_order) VALUES (@pr,'proj-2-a.svg',0),(@pr,'proj-2-b.svg',1);

INSERT INTO real_estate_projects (user_id,company_id,name,developer,location,emirate,description,starting_price,currency,handover,payment_plan,image,is_featured,status,is_active)
VALUES (@uid,@nakheel,'Palm Beach Towers','Nakheel','Palm Jumeirah','Dubai','Three iconic towers at the gateway of Palm Jumeirah with resort-style amenities.',2600000,'AED','Q1 2027','60/40 Payment Plan','proj-3-a.svg',1,'approved',1);
SET @pr := LAST_INSERT_ID();
INSERT INTO project_images (project_id,filename,sort_order) VALUES (@pr,'proj-3-a.svg',0),(@pr,'proj-3-b.svg',1);

INSERT INTO real_estate_projects (user_id,company_id,name,developer,location,emirate,description,starting_price,currency,handover,payment_plan,image,is_featured,status,is_active)
VALUES (@uid,@aldar,'Saadiyat Lagoons','Aldar Properties','Saadiyat Island','Abu Dhabi','A nature-inspired community of standalone villas surrounded by mangroves and wildlife.',2200000,'AED','Q3 2026','75/25 Payment Plan','proj-4-a.svg',1,'approved',1);
SET @pr := LAST_INSERT_ID();
INSERT INTO project_images (project_id,filename,sort_order) VALUES (@pr,'proj-4-a.svg',0),(@pr,'proj-4-b.svg',1);

-- ======================================================================
-- migrate7.sql — Events module
-- ======================================================================
-- migrate7.sql — Events module
--  • event_categories (dashboard-editable, with icons)
--  • events (title, description, location/venue, poster, dates+times, price, booking, organizer)
--  • user_id + approval status kept for future user submissions (admin-created = approved)
-- MySQL 5.7 / MariaDB compatible. Safe to run once.
-- IMPORTANT: this file contains emoji (event_categories.icon). Import with the
-- utf8mb4 client charset or the emoji will be double-encoded (mojibake):
--   mysql -u root --default-character-set=utf8mb4 smartuae < migrate7.sql

-- ── Event categories ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `event_categories` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO event_categories (name, icon, sort_order) VALUES
  ('Events', '🎉', 1),
  ('Tech Events', '💻', 2),
  ('Business Meets', '💼', 3),
  ('Weddings & Occasions', '💍', 4),
  ('Movies & Shows', '🎬', 5),
  ('Parks & Recreation', '🌳', 6);

-- ── Events ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) DEFAULT NULL,
  `category_id` INT(11) DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `poster` VARCHAR(500) DEFAULT NULL,
  `location` VARCHAR(200) DEFAULT NULL,
  `venue` VARCHAR(200) DEFAULT NULL,
  `emirate` VARCHAR(50) DEFAULT NULL,
  `event_date` DATE DEFAULT NULL,
  `end_date` DATE DEFAULT NULL,
  `start_time` VARCHAR(20) DEFAULT NULL,
  `end_time` VARCHAR(20) DEFAULT NULL,
  `price` DECIMAL(10,2) DEFAULT NULL,
  `currency` VARCHAR(10) DEFAULT 'AED',
  `booking_url` VARCHAR(300) DEFAULT NULL,
  `organizer` VARCHAR(200) DEFAULT NULL,
  `organizer_phone` VARCHAR(40) DEFAULT NULL,
  `organizer_whatsapp` VARCHAR(40) DEFAULT NULL,
  `organizer_email` VARCHAR(150) DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT 0,
  `status` ENUM('pending','approved','rejected') DEFAULT 'pending',
  `is_active` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `user_id` (`user_id`),
  KEY `event_date` (`event_date`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `event_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Seed: ~2 events per category (dates relative to today so they stay upcoming) ─
SET @uid := (SELECT id FROM users ORDER BY id LIMIT 1);

INSERT INTO events (user_id,category_id,title,description,poster,location,venue,emirate,event_date,end_date,start_time,end_time,price,currency,booking_url,organizer,organizer_phone,organizer_whatsapp,organizer_email,is_featured,status,is_active) VALUES
-- Events (general)
(@uid,1,'Dubai Shopping Festival','The city''s biggest retail celebration with mega sales, raffles, fireworks and live entertainment across Dubai.','event-1.svg','Downtown Dubai','Multiple Locations','Dubai',DATE_ADD(CURDATE(), INTERVAL 20 DAY),DATE_ADD(CURDATE(), INTERVAL 50 DAY),'10:00 AM','11:00 PM',0,'AED','https://www.mydsf.ae','Dubai Festivals','+97145551000','971545551000','info@dsf.ae',1,'approved',1),
(@uid,1,'UAE National Day Celebration','Family-friendly national day festivities with parades, drone shows and traditional performances.','event-2.svg','Corniche','Abu Dhabi Corniche','Abu Dhabi',DATE_ADD(CURDATE(), INTERVAL 35 DAY),DATE_ADD(CURDATE(), INTERVAL 36 DAY),'04:00 PM','10:00 PM',0,'AED',NULL,'Abu Dhabi Events','+97124441000','971544441000','events@abudhabi.ae',0,'approved',1),
-- Tech Events
(@uid,2,'GITEX Global 2026','The largest tech and startup show in the Middle East — AI, cloud, fintech and Web3 across 20+ halls.','event-3.svg','Dubai World Trade Centre','DWTC Halls 1-20','Dubai',DATE_ADD(CURDATE(), INTERVAL 45 DAY),DATE_ADD(CURDATE(), INTERVAL 49 DAY),'10:00 AM','06:00 PM',250,'AED','https://www.gitex.com','Dubai World Trade Centre','+97143321000','971543321000','info@gitex.com',1,'approved',1),
(@uid,2,'AI & Web3 Summit Dubai','A one-day summit on applied AI, LLMs and blockchain with hands-on workshops and startup pitches.','event-4.svg','Business Bay','Grand Millennium Hotel','Dubai',DATE_ADD(CURDATE(), INTERVAL 12 DAY),NULL,'09:00 AM','05:00 PM',150,'AED','https://aisummit.ae','TechTalks UAE','+97144442000','971544442000','hello@aisummit.ae',0,'approved',1),
-- Business Meets
(@uid,3,'Dubai Startup Founders Meetup','Monthly informal meetup for founders and investors — pitch practice, intros and networking.','event-5.svg','DIFC','Emirates Financial Towers','Dubai',DATE_ADD(CURDATE(), INTERVAL 7 DAY),NULL,'06:30 PM','09:00 PM',0,'AED','https://meetup.com/dubai-founders','Dubai Founders Club','+97145553000','971545553000','team@founders.ae',0,'approved',1),
(@uid,3,'UAE SME Business Networking Night','Connect with SME owners, suppliers and service providers over dinner. Includes a short panel on funding.','event-6.svg','Sharjah','Sheraton Sharjah Beach Resort','Sharjah',DATE_ADD(CURDATE(), INTERVAL 18 DAY),NULL,'07:00 PM','10:30 PM',120,'AED',NULL,'SME Council UAE','+97165554000','971565554000','connect@smeuae.ae',0,'approved',1),
-- Weddings & Occasions
(@uid,4,'Luxury Wedding Expo Dubai','Meet 100+ vendors — planners, venues, photographers and designers — all under one roof.','event-7.svg','Jumeirah','Madinat Jumeirah','Dubai',DATE_ADD(CURDATE(), INTERVAL 25 DAY),DATE_ADD(CURDATE(), INTERVAL 27 DAY),'11:00 AM','09:00 PM',75,'AED','https://weddingexpo.ae','Bridal Events UAE','+97144445000','971544445000','info@weddingexpo.ae',1,'approved',1),
(@uid,4,'Bridal Fashion Showcase','An evening runway show featuring regional couture houses and bespoke bridal collections.','event-8.svg','Al Barsha','Grand Hyatt Ballroom','Dubai',DATE_ADD(CURDATE(), INTERVAL 40 DAY),NULL,'07:30 PM','10:00 PM',200,'AED','https://bridalshow.ae','Couture Collective','+97144446000','971544446000','rsvp@bridalshow.ae',0,'approved',1),
-- Movies & Shows
(@uid,5,'Dubai International Film Festival','Ten days of regional and world cinema — premieres, Q&As and an outdoor screening series.','event-9.svg','Madinat Jumeirah','Madinat Arena','Dubai',DATE_ADD(CURDATE(), INTERVAL 60 DAY),DATE_ADD(CURDATE(), INTERVAL 69 DAY),'02:00 PM','11:30 PM',90,'AED','https://diff.ae','DIFF Organisers','+97144447000','971544447000','box@diff.ae',1,'approved',1),
(@uid,5,'Cirque Live — Coca-Cola Arena','A world-touring acrobatic spectacle making its Middle East debut for six nights only.','event-10.svg','City Walk','Coca-Cola Arena','Dubai',DATE_ADD(CURDATE(), INTERVAL 15 DAY),DATE_ADD(CURDATE(), INTERVAL 20 DAY),'08:00 PM','10:30 PM',195,'AED','https://coca-cola-arena.com','Live Nation ME','+97144448000','971544448000','tickets@arena.ae',0,'approved',1),
-- Parks & Recreation
(@uid,6,'Global Village Season Opening','The new season opens with pavilions from 90 cultures, street food, rides and nightly fireworks.','event-11.svg','Sheikh Mohammed Bin Zayed Rd','Global Village','Dubai',DATE_ADD(CURDATE(), INTERVAL 30 DAY),DATE_ADD(CURDATE(), INTERVAL 150 DAY),'04:00 PM','12:00 AM',25,'AED','https://www.globalvillage.ae','Global Village','+97144449000','971544449000','info@globalvillage.ae',1,'approved',1),
(@uid,6,'Miracle Garden Family Day','A family morning at the world''s largest natural flower garden, with kids'' activities and photo trails.','event-12.svg','Dubailand','Dubai Miracle Garden','Dubai',DATE_ADD(CURDATE(), INTERVAL 10 DAY),NULL,'09:00 AM','01:00 PM',55,'AED','https://www.dubaimiraclegarden.com','Miracle Garden','+97144450000','971544450000','visit@miraclegarden.ae',0,'approved',1);
