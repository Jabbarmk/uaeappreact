-- Migration 30: Customizable home page sections (Home Layout CMS)
-- Tables: home_sections (per-section visibility/order/settings),
--         home_menu_items (editable Explore SmartUAE shortcuts),
--         home_collections + home_collection_items (Explore the best in UAE).

CREATE TABLE IF NOT EXISTS home_sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_key VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(255) DEFAULT NULL,
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  settings TEXT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO home_sections (section_key, title, is_visible, sort_order, settings) VALUES
  ('slider',      NULL,                       1, 1, '{}'),
  ('featured',    'Featured Categories',      1, 2, '{"style":"scroll","auto":0,"speed":3,"visCols":4,"columns":3,"maxRows":2,"radius":33,"textPos":"outside"}'),
  ('hero',        'Find anything in UAE',     1, 3, '{"placeholder":"Businesses, offers, jobs, properties…"}'),
  ('explore',     'Explore SmartUAE',         1, 4, '{"style":"icons","auto":0,"timer":4}'),
  ('popular',     'Popular Right Now',        1, 5, '{"size":"m","rows":1,"auto":0,"timer":4}'),
  ('stats',       NULL,                       1, 6, '{"label1":"Businesses","label2":"Active Jobs","label3":"Listings"}'),
  ('collections', 'Explore the best in UAE',  1, 7, '{}')
ON DUPLICATE KEY UPDATE section_key = section_key;

CREATE TABLE IF NOT EXISTS home_menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  link VARCHAR(255) NOT NULL,
  icon VARCHAR(100) DEFAULT NULL,
  image VARCHAR(255) DEFAULT NULL,
  tone VARCHAR(20) NOT NULL DEFAULT 'purple',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO home_menu_items (label, link, icon, tone, sort_order)
SELECT * FROM (SELECT 'Businesses' l, '/categories' lk, 'fa-store' i, 'purple' t, 1 s
  UNION ALL SELECT 'Offers',       '/offers',       'fa-percent',        'amber',  2
  UNION ALL SELECT 'Events',       '/events',       'fa-calendar-day',   'pink',   3
  UNION ALL SELECT 'Jobs',         '/jobs',         'fa-briefcase',      'teal',   4
  UNION ALL SELECT 'Real Estate',  '/realestate',   'fa-building',       'teal',   5
  UNION ALL SELECT 'Doctors',      '/doctors',      'fa-user-md',        'pink',   6
  UNION ALL SELECT 'Classifieds',  '/classifieds',  'fa-tags',           'amber',  7
  UNION ALL SELECT 'Universities', '/universities', 'fa-graduation-cap', 'purple', 8
  UNION ALL SELECT 'Smart CV',     '/profile',      'fa-file-alt',       'purple', 9
  UNION ALL SELECT 'Search',       '/search',       'fa-search',         'teal',  10) seed
WHERE NOT EXISTS (SELECT 1 FROM home_menu_items);

CREATE TABLE IF NOT EXISTS home_collections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS home_collection_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  collection_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  image VARCHAR(255) DEFAULT NULL,
  business_id INT DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_hci_collection FOREIGN KEY (collection_id) REFERENCES home_collections(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
