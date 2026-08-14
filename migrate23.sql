-- migrate23.sql — Optional business link on a category banner. Tapping the banner
-- opens that business's detail page. Run once.
SET NAMES utf8mb4;

ALTER TABLE `category_banners`
  ADD COLUMN `business_id` INT(11) DEFAULT NULL AFTER `category_id`;
