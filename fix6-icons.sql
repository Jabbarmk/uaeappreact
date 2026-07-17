-- Fix mojibake emoji icons in property_categories (re-import with utf8mb4).
UPDATE property_categories SET icon = '🛏️' WHERE id = 1;
UPDATE property_categories SET icon = '🚪' WHERE id = 2;
UPDATE property_categories SET icon = '🏢' WHERE id = 3;
UPDATE property_categories SET icon = '🏡' WHERE id = 4;
UPDATE property_categories SET icon = '🏬' WHERE id = 5;
UPDATE property_categories SET icon = '🏠' WHERE id = 6;
