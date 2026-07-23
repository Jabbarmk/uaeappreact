-- migrate13.sql — 5 dummy Vloggers (business category 'Vloggers')
-- Idempotent: removes any prior run of these demo names first.
SET NAMES utf8mb4;

SET @cat := (SELECT id FROM business_categories WHERE name='Vloggers' LIMIT 1);

DELETE FROM businesses WHERE name IN
  ('Dubai Daily Vlogs','Sara Travels UAE','Bites with Bilal','FitLife Dubai','GameZone Arabia');

INSERT INTO businesses (name, category_id, logo, image, tagline, about, description, emirate, address, phone, whatsapp, email, website, instagram, youtube, tiktok, rating, established_year, status, is_active) VALUES
('Dubai Daily Vlogs', @cat, 'vlog-1-logo.svg', 'vlog-1-cover.svg', 'Your daily dose of Dubai life',
 'Dubai Daily Vlogs follows the everyday adventures, events and hidden gems of Dubai — from brunches to desert nights.',
 'Daily lifestyle vlogs covering Dubai events, food and culture.',
 'Dubai','Business Bay, Dubai','+971501112201','971501112201','hello@dubaidailyvlogs.ae','https://youtube.com/@dubaidailyvlogs','dubaidailyvlogs','dubaidailyvlogs','dubaidailyvlogs',4.8,2019,'approved',1),

('Sara Travels UAE', @cat, 'vlog-2-logo.svg', 'vlog-2-cover.svg', 'Exploring the Emirates & beyond',
 'Sara documents travel guides, staycations and road trips across all seven emirates with tips on where to stay and what to do.',
 'Travel vlogger sharing UAE staycations and destination guides.',
 'Abu Dhabi','Al Reem Island, Abu Dhabi','+971502223302','971502223302','sara@saratravels.ae','https://youtube.com/@saratravels','saratravelsuae','saratravelsuae','saratravels',4.9,2020,'approved',1),

('Bites with Bilal', @cat, 'vlog-3-logo.svg', 'vlog-3-cover.svg', 'Honest food reviews across the UAE',
 'Bilal reviews restaurants, street food and new openings around the UAE with honest ratings and hidden-gem finds.',
 'Food vlogger and restaurant reviewer covering the UAE dining scene.',
 'Dubai','JLT, Dubai','+971503334403','971503334403','bilal@biteswithbilal.ae','https://youtube.com/@biteswithbilal','biteswithbilal','biteswithbilal','biteswithbilal',4.7,2021,'approved',1),

('FitLife Dubai', @cat, 'vlog-4-logo.svg', 'vlog-4-cover.svg', 'Fitness, wellness & motivation',
 'FitLife Dubai shares workout routines, gym reviews, nutrition tips and transformation journeys for the UAE fitness community.',
 'Fitness and wellness vlogger with workouts and gym reviews.',
 'Sharjah','Al Nahda, Sharjah','+971504445503','971504445503','coach@fitlifedubai.ae','https://youtube.com/@fitlifedubai','fitlifedubai','fitlifedubai','fitlifedubai',4.6,2018,'approved',1),

('GameZone Arabia', @cat, 'vlog-5-logo.svg', 'vlog-5-cover.svg', 'Gaming reviews & live streams',
 'GameZone Arabia covers game reviews, esports coverage and live streams with a focus on the regional gaming scene.',
 'Gaming vlogger and streamer covering reviews and esports.',
 'Dubai','Dubai Internet City, Dubai','+971505556603','971505556603','play@gamezonearabia.ae','https://youtube.com/@gamezonearabia','gamezonearabia','gamezonearabia','gamezonearabia',4.8,2022,'approved',1);
