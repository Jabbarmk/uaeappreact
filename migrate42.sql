-- Migration 42: Structured restaurant/cafe/fast-food menu (named sections + priced items)
-- Separate from business_gallery/business_services since menu items need price/currency
-- and section grouping (Best Sellers, Combo Offers, Breakfast, Lunch, Dinner).

CREATE TABLE IF NOT EXISTS business_menu_sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY business_id (business_id),
  CONSTRAINT bms_ibfk_1 FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS business_menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_id INT NOT NULL,
  section_id INT DEFAULT NULL,
  name VARCHAR(200) NOT NULL,
  image VARCHAR(500) DEFAULT NULL,
  price DECIMAL(10,2) DEFAULT NULL,
  currency VARCHAR(10) DEFAULT 'AED',
  description TEXT DEFAULT NULL,
  is_veg TINYINT(1) DEFAULT NULL,
  is_available TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY business_id (business_id),
  KEY section_id (section_id),
  CONSTRAINT bmi_ibfk_1 FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  CONSTRAINT bmi_ibfk_2 FOREIGN KEY (section_id) REFERENCES business_menu_sections(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
