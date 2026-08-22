-- Migration 40: vertical listing card media (image or video) for RE companies
ALTER TABLE real_estate_companies ADD COLUMN card_media VARCHAR(500) NULL AFTER banner;
