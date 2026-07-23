-- migrate14.sql — Vlogger creator stats (extra fields for the Vloggers category)
--  • followers per platform, total views, award tier (Gold/…), awards, verified
-- Run AFTER migrate13 (needs the 5 vlogger businesses). Idempotent.
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `vlogger_profiles` (
  `business_id` INT(11) NOT NULL,
  `youtube_subscribers` INT(11) DEFAULT 0,
  `instagram_followers` INT(11) DEFAULT 0,
  `tiktok_followers` INT(11) DEFAULT 0,
  `total_views` BIGINT(20) DEFAULT 0,
  `content_niche` VARCHAR(80) DEFAULT NULL,
  `tier` VARCHAR(30) DEFAULT NULL,          -- award tier: Gold / Silver / Platinum / Bronze
  `awards` VARCHAR(300) DEFAULT NULL,       -- comma-separated award names
  `is_verified` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`business_id`),
  CONSTRAINT `vlogger_profiles_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed the 5 demo vloggers (idempotent via REPLACE on the PK).
REPLACE INTO `vlogger_profiles` (business_id, youtube_subscribers, instagram_followers, tiktok_followers, total_views, content_niche, tier, awards, is_verified)
SELECT id, 850000, 1200000, 600000, 45000000, 'Lifestyle', 'Gold', 'YouTube Gold Play Button, Best Lifestyle Creator 2024', 1 FROM businesses WHERE name='Dubai Daily Vlogs'
UNION ALL
SELECT id, 1400000, 2100000, 1100000, 120000000, 'Travel', 'Platinum', 'YouTube Diamond Nominee, Top Travel Creator 2023', 1 FROM businesses WHERE name='Sara Travels UAE'
UNION ALL
SELECT id, 420000, 680000, 900000, 38000000, 'Food', 'Gold', 'Best Food Reviewer 2024', 1 FROM businesses WHERE name='Bites with Bilal'
UNION ALL
SELECT id, 310000, 540000, 250000, 22000000, 'Fitness', 'Silver', 'Fitness Influencer of the Year 2022', 0 FROM businesses WHERE name='FitLife Dubai'
UNION ALL
SELECT id, 980000, 430000, 700000, 75000000, 'Gaming', 'Gold', 'YouTube Gold Play Button, Top MENA Gaming Creator', 1 FROM businesses WHERE name='GameZone Arabia';
