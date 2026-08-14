-- migrate22.sql — Manageable top banner for the category businesses listing page
-- (/businesses?cat=ID). Each banner connects to a business category. Run once.
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `category_banners` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `category_id` INT(11) NOT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `title` VARCHAR(200) DEFAULT NULL,
  `subtitle` VARCHAR(300) DEFAULT NULL,
  `link` VARCHAR(500) DEFAULT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Demo banner for category 26 (inserted only if that category exists; getImageUrl
-- passes http URLs through unchanged).
INSERT INTO `category_banners` (`category_id`,`image`,`title`,`subtitle`,`sort_order`,`is_active`)
SELECT `id`,
       'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&fit=crop',
       NULL, NULL, 0, 1
FROM `business_categories` WHERE `id` = 26;
