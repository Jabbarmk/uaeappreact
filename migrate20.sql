-- migrate20.sql — Dedicated cover media (multiple images + video) per business.
-- Independent from the gallery. Run once.
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `business_cover_media` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `business_id` INT(11) NOT NULL,
  `type` ENUM('image','video') NOT NULL DEFAULT 'image',
  `file` VARCHAR(500) NOT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  CONSTRAINT `bcm_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Demo: give business 330 a multi-image cover (getImageUrl passes http URLs through).
SET @b := 330;
INSERT INTO `business_cover_media` (`business_id`,`type`,`file`,`sort_order`) VALUES
 (@b,'image','https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1000&h=700&fit=crop',0),
 (@b,'image','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&h=700&fit=crop',1),
 (@b,'image','https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1000&h=700&fit=crop',2);
