-- migrate19.sql — Business detail-page templates + online-store products.
-- Run once.
SET NAMES utf8mb4;

-- ── Template + online-store settings on the business ────────────────────────────
ALTER TABLE `businesses` ADD COLUMN `template` VARCHAR(20) NOT NULL DEFAULT 'template1';
ALTER TABLE `businesses` ADD COLUMN `is_online_store` TINYINT(1) NOT NULL DEFAULT 0;
ALTER TABLE `businesses` ADD COLUMN `store_url` VARCHAR(500) DEFAULT NULL;

-- ── Products (Template 2 storefront) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `business_products` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `business_id` INT(11) NOT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `name` VARCHAR(200) NOT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `price` DECIMAL(12,2) DEFAULT NULL,
  `original_price` DECIMAL(12,2) DEFAULT NULL,
  `currency` VARCHAR(10) DEFAULT 'AED',
  `description` TEXT DEFAULT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  CONSTRAINT `bp_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Demo: turn business 330 into a Template-2 online store ───────────────────────
SET @b := 330;
UPDATE `businesses` SET `template`='template2', `is_online_store`=1, `store_url`='https://alnoor-store.example.ae' WHERE `id`=@b;

INSERT INTO `business_products` (`business_id`,`category`,`name`,`image`,`price`,`original_price`,`currency`,`description`,`sort_order`) VALUES
 (@b,'Streaming Kit','RGB Streaming Microphone','https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',349,449,'AED','Studio-grade USB condenser microphone with RGB lighting, shock mount and pop filter. Plug-and-play for streaming and podcasting.',0),
 (@b,'Streaming Kit','4K Streaming Webcam','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',599,699,'AED','Ultra-sharp 4K webcam with auto-focus, HDR and a built-in privacy shutter. Perfect for pro-quality live streams.',1),
 (@b,'Streaming Kit','Adjustable Ring Light','https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&h=600&fit=crop',199,259,'AED','18-inch dimmable ring light with three colour temperatures and a sturdy tripod stand for flawless on-camera lighting.',2),
 (@b,'Gaming Gear','Wireless Gaming Headset','https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=600&fit=crop',429,529,'AED','Low-latency wireless headset with surround sound, noise-cancelling mic and 30-hour battery life.',3),
 (@b,'Gaming Gear','Pro Mechanical Keyboard','https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&h=600&fit=crop',379,459,'AED','Hot-swappable mechanical keyboard with per-key RGB, aluminium frame and tactile switches built for gaming.',4),
 (@b,'Gaming Gear','Ultralight Gaming Mouse','https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',249,319,'AED','59g ultralight mouse with a 26K optical sensor, PTFE glides and a flexible paracord cable.',5);
