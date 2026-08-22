-- Migration 39: Real Estate hub page banners (multiple, image/video, auto-slide)
-- Section layout config lives in site_settings key 'realestate_layout'.
CREATE TABLE IF NOT EXISTS re_banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(500) NULL,
  video VARCHAR(500) NULL,
  title VARCHAR(255) NULL,
  subtitle VARCHAR(255) NULL,
  link VARCHAR(500) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
