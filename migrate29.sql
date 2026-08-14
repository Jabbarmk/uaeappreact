-- migrate29: template2 becomes the only/default business template;
-- product categories become managed entities with image/icon.

ALTER TABLE businesses ALTER template SET DEFAULT 'template2';
UPDATE businesses SET template = 'template2';

CREATE TABLE IF NOT EXISTS business_product_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  image VARCHAR(500) NULL,
  icon VARCHAR(50) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_bpc_business (business_id)
);

-- Seed from categories already used by existing products
INSERT INTO business_product_categories (business_id, name)
SELECT DISTINCT bp.business_id, bp.category
FROM business_products bp
WHERE bp.category IS NOT NULL AND bp.category <> ''
  AND NOT EXISTS (
    SELECT 1 FROM business_product_categories c
    WHERE c.business_id = bp.business_id AND c.name = bp.category
  );
