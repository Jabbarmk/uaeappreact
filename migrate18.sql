-- migrate18.sql — Business "Services & Solutions": named sections + per-item popup details.
-- Run once.
SET NAMES utf8mb4;

-- ── Named sections per business ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `business_service_sections` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `business_id` INT(11) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  CONSTRAINT `bss_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Link service items to a section + add full "view more" text ──────────────────
ALTER TABLE `business_services` ADD COLUMN `section_id` INT(11) DEFAULT NULL AFTER `business_id`;
ALTER TABLE `business_services` ADD COLUMN `details` TEXT DEFAULT NULL AFTER `description`;
ALTER TABLE `business_services` ADD KEY `section_id` (`section_id`);
ALTER TABLE `business_services` ADD CONSTRAINT `bs_section_fk` FOREIGN KEY (`section_id`) REFERENCES `business_service_sections` (`id`) ON DELETE CASCADE;

-- ── Demo data for business 330 (City Gaming Streamers) ──────────────────────────
SET @b := 330;
INSERT INTO `business_service_sections` (`business_id`,`title`,`sort_order`) VALUES (@b,'Streaming Services',0);
SET @s := LAST_INSERT_ID();
INSERT INTO `business_services` (`business_id`,`section_id`,`title`,`description`,`details`,`icon`,`image`,`sort_order`) VALUES
 (@b,@s,'Sponsored Live Streams','Promote your brand to thousands of live viewers during prime-time gaming sessions.','Reach a highly engaged gaming audience with fully integrated brand placements, live shout-outs, on-screen overlays and dedicated gameplay segments. Packages include pre-stream promotion across social channels, mid-stream feature slots and post-stream highlight clips delivered to you for reuse.','📡','https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=600&fit=crop',0),
 (@b,@s,'Product Reviews & Unboxings','Honest, detailed reviews of gaming gear, peripherals and accessories on camera.','Our review process covers first impressions, build quality, real-world performance testing and an on-stream verdict. You receive a full-length review video plus short vertical clips optimised for Reels, Shorts and TikTok, along with performance analytics after publishing.','🎮','https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&h=600&fit=crop',1),
 (@b,@s,'Community Tournaments','We host and cast branded online tournaments for your product launch or campaign.','End-to-end tournament production: bracket setup, player onboarding, live casting with professional commentary, sponsor branding throughout, and a highlight reel at the end. Ideal for driving community engagement and generating buzz around a launch.','🏆',NULL,2);
