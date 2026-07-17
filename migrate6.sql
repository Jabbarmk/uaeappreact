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
