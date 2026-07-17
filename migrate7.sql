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
