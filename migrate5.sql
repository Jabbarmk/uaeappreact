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
