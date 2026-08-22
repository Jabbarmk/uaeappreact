-- Migration 33: product system upgrade
-- New product fields (media, commerce, variants, status), per-business product
-- subcategories, and a global seeded list of common variant options.

ALTER TABLE business_products
  ADD COLUMN short_description VARCHAR(500) NULL AFTER name,
  ADD COLUMN subcategory VARCHAR(100) NULL AFTER category,
  ADD COLUMN brand VARCHAR(100) NULL AFTER description,
  ADD COLUMN tags VARCHAR(500) NULL AFTER brand,
  ADD COLUMN sku VARCHAR(100) NULL AFTER tags,
  ADD COLUMN cost_price DECIMAL(12,2) NULL AFTER original_price,
  ADD COLUMN discount_percent DECIMAL(5,2) NULL AFTER cost_price,
  ADD COLUMN images TEXT NULL,
  ADD COLUMN videos TEXT NULL,
  ADD COLUMN variants TEXT NULL,
  ADD COLUMN status VARCHAR(10) NOT NULL DEFAULT 'draft',
  ADD COLUMN created_by VARCHAR(150) NULL;

-- Existing products stay publicly visible.
UPDATE business_products SET status = 'active';

CREATE TABLE IF NOT EXISTS business_product_subcategories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_id INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  KEY idx_biz_cat (business_id, category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS product_variant_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  value VARCHAR(100) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_type_value (type, value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO product_variant_options (type, value, sort_order) VALUES
  ('size','XS',1),('size','S',2),('size','M',3),('size','L',4),('size','XL',5),('size','XXL',6),('size','XXXL',7),
  ('size','36',10),('size','38',11),('size','40',12),('size','42',13),('size','44',14),('size','46',15),
  ('color','Black',1),('color','White',2),('color','Red',3),('color','Blue',4),('color','Navy Blue',5),
  ('color','Green',6),('color','Yellow',7),('color','Orange',8),('color','Pink',9),('color','Purple',10),
  ('color','Brown',11),('color','Beige',12),('color','Grey',13),('color','Silver',14),('color','Gold',15),('color','Maroon',16),
  ('material','Cotton',1),('material','Polyester',2),('material','Leather',3),('material','Wool',4),('material','Silk',5),
  ('material','Linen',6),('material','Denim',7),('material','Wood',8),('material','Metal',9),('material','Steel',10),
  ('material','Aluminium',11),('material','Glass',12),('material','Plastic',13),('material','Ceramic',14),('material','Marble',15),
  ('dimension','30x40 cm',1),('dimension','50x70 cm',2),('dimension','60x90 cm',3),('dimension','100x200 cm',4),
  ('dimension','120x60x75 cm',5),('dimension','180x90x75 cm',6),('dimension','200x100x90 cm',7);
