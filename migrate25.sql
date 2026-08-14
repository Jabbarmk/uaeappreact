-- migrate25: businesses featured flag, sort order, coordinates for Near Me
ALTER TABLE businesses
  ADD COLUMN featured TINYINT(1) NOT NULL DEFAULT 0 AFTER rating,
  ADD COLUMN sort_order INT NOT NULL DEFAULT 0 AFTER featured,
  ADD COLUMN latitude DECIMAL(10,7) NULL AFTER sort_order,
  ADD COLUMN longitude DECIMAL(11,7) NULL AFTER latitude;

-- Backfill coordinates from Google Maps embed URLs (pattern ...!2d<lng>!3d<lat>!...)
UPDATE businesses
SET longitude = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(map_embed, '!2d', 2), '!2d', -1), '!', 1) AS DECIMAL(11,7)),
    latitude  = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(map_embed, '!3d', 2), '!3d', -1), '!', 1) AS DECIMAL(10,7))
WHERE map_embed LIKE '%!2d%' AND map_embed LIKE '%!3d%'
  AND latitude IS NULL AND longitude IS NULL;

-- Also handle share-link style "@lat,lng," in map_embed
UPDATE businesses
SET latitude  = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(map_embed, '@', -1), ',', 1), ',', 1) AS DECIMAL(10,7)),
    longitude = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(map_embed, '@', -1), ',', 2), ',', -1) AS DECIMAL(11,7))
WHERE map_embed LIKE '%@%,%' AND map_embed NOT LIKE '%!2d%'
  AND latitude IS NULL AND longitude IS NULL;

-- Drop garbage results (failed casts become 0 / out-of-range values)
UPDATE businesses
SET latitude = NULL, longitude = NULL
WHERE (latitude = 0 AND longitude = 0)
   OR latitude NOT BETWEEN -90 AND 90
   OR longitude NOT BETWEEN -180 AND 180;
