-- Migration 43: Seed Mobile Shops demo businesses (10 per emirate x 5 emirates)
-- Shared per-category image pool in assets/uploads/businesses/ (mobileshop-*.jpg).
SET NAMES utf8mb4;
SET @mobile_cat = (SELECT id FROM business_categories WHERE name = 'Mobile Shops' LIMIT 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Al Noor Phones', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Al Noor Phones is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.', 'Al Noor Phones is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.8, 'Al Fahidi St, Bur Dubai, Dubai', '+971552000137', '971552000274', 'alnoorphones@example.com', NULL, 1, 'approved', 2015, '20+', 'Dubai', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Deira Mobile Hub', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Deira Mobile Hub is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.', 'Deira Mobile Hub is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.6, 'Sheikh Zayed Rd, Trade Centre, Dubai', '+971552000411', '971552000548', 'deiramobilehub@example.com', NULL, 1, 'approved', 2017, '30+', 'Dubai', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Marina Cell World', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Marina Cell World is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.', 'Marina Cell World is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.0, 'Al Rigga Rd, Deira, Dubai', '+971552000685', '971552000822', 'marinacellworld@example.com', NULL, 1, 'approved', 2014, '5+', 'Dubai', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Jumeirah Smart Store', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Jumeirah Smart Store is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.', 'Jumeirah Smart Store is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.9, 'Jumeirah Beach Rd, Jumeirah 1, Dubai', '+971552000959', '971552001096', 'jumeirahsmartstore@example.com', NULL, 1, 'approved', 2009, '10+', 'Dubai', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Karama Phone Palace', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Karama Phone Palace is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.', 'Karama Phone Palace is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.3, 'Al Barsha 1, Mall Area, Dubai', '+971552001233', '971552001370', 'karamaphonepalace@example.com', NULL, 1, 'approved', 2017, '30+', 'Dubai', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Barsha Mobile Zone', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Barsha Mobile Zone is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.', 'Barsha Mobile Zone is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.8, 'Baniyas Square, Deira, Dubai', '+971552001507', '971552001644', 'barshamobilezone@example.com', NULL, 1, 'approved', 2010, '5+', 'Dubai', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Rigga Tech Mobiles', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Rigga Tech Mobiles is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.', 'Rigga Tech Mobiles is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.4, 'Al Karama Market Area, Dubai', '+971552001781', '971552001918', 'riggatechmobiles@example.com', NULL, 1, 'approved', 2019, '50+', 'Dubai', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Golden Phone Trading', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Golden Phone Trading is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.', 'Golden Phone Trading is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.0, 'Marina Walk, Dubai Marina, Dubai', '+971552002055', '971552002192', 'goldenphonetrading@example.com', NULL, 1, 'approved', 2010, '50+', 'Dubai', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Burj Mobile Centre', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Burj Mobile Centre is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.', 'Burj Mobile Centre is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.7, 'Mirdif City Area, Dubai', '+971552002329', '971552002466', 'burjmobilecentre@example.com', NULL, 1, 'approved', 2018, '50+', 'Dubai', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Oasis Cell Point', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Oasis Cell Point is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.', 'Oasis Cell Point is a trusted mobile phone shop in Dubai offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.6, 'Al Qusais Industrial 2, Dubai', '+971552002603', '971552002740', 'oasiscellpoint@example.com', NULL, 1, 'approved', 2007, '15+', 'Dubai', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Rolla Mobile Mart', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Rolla Mobile Mart is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.', 'Rolla Mobile Mart is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.5, 'Al Wahda St, Al Majaz, Sharjah', '+971552002877', '971552003014', 'rollamobilemart@example.com', NULL, 1, 'approved', 2006, '10+', 'Sharjah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Al Majaz Phones', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Al Majaz Phones is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.', 'Al Majaz Phones is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.5, 'King Faisal Rd, Al Qasimia, Sharjah', '+971552003151', '971552003288', 'almajazphones@example.com', NULL, 1, 'approved', 2018, '10+', 'Sharjah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Wahda Cell Station', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Wahda Cell Station is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.', 'Wahda Cell Station is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.5, 'Al Arouba St, Rolla, Sharjah', '+971552003425', '971552003562', 'wahdacellstation@example.com', NULL, 1, 'approved', 2006, '20+', 'Sharjah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Qasimia Mobile House', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Qasimia Mobile House is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.', 'Qasimia Mobile House is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.8, 'Corniche Rd, Al Majaz 3, Sharjah', '+971552003699', '971552003836', 'qasimiamobilehouse@example.com', NULL, 1, 'approved', 2016, '30+', 'Sharjah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Nahda Smart Phones', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Nahda Smart Phones is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.', 'Nahda Smart Phones is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.8, 'Al Taawun St, Al Nahda, Sharjah', '+971552003973', '971552004110', 'nahdasmartphones@example.com', NULL, 1, 'approved', 2019, '10+', 'Sharjah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Sharjah Phone Bazaar', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Sharjah Phone Bazaar is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.', 'Sharjah Phone Bazaar is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.1, 'Industrial Area 4, Sharjah', '+971552004247', '971552004384', 'sharjahphonebazaar@example.com', NULL, 1, 'approved', 2012, '50+', 'Sharjah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Al Khan Mobiles', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Al Khan Mobiles is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.', 'Al Khan Mobiles is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.0, 'Al Zahra St, Al Ghuwair, Sharjah', '+971552004521', '971552004658', 'alkhanmobiles@example.com', NULL, 1, 'approved', 2019, '10+', 'Sharjah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Muwaileh Tech Store', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Muwaileh Tech Store is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.', 'Muwaileh Tech Store is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.1, 'University City Rd, Muwaileh, Sharjah', '+971552004795', '971552004932', 'muwailehtechstore@example.com', NULL, 1, 'approved', 2013, '5+', 'Sharjah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Corniche Cell Corner', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Corniche Cell Corner is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.', 'Corniche Cell Corner is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.3, 'Al Khan Corniche, Sharjah', '+971552005069', '971552005206', 'cornichecellcorner@example.com', NULL, 1, 'approved', 2020, '10+', 'Sharjah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Taawun Mobile Plaza', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Taawun Mobile Plaza is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.', 'Taawun Mobile Plaza is a trusted mobile phone shop in Sharjah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.5, 'Maliha Rd, Industrial 12, Sharjah', '+971552005343', '971552005480', 'taawunmobileplaza@example.com', NULL, 1, 'approved', 2015, '30+', 'Sharjah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Hamdan Mobile Centre', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Hamdan Mobile Centre is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.', 'Hamdan Mobile Centre is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.6, 'Hamdan St, Al Danah, Abu Dhabi', '+971552005617', '971552005754', 'hamdanmobilecentre@example.com', NULL, 1, 'approved', 2018, '20+', 'Abu Dhabi', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Electra Phone House', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Electra Phone House is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.', 'Electra Phone House is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.1, 'Electra St, Al Zahiyah, Abu Dhabi', '+971552005891', '971552006028', 'electraphonehouse@example.com', NULL, 1, 'approved', 2007, '10+', 'Abu Dhabi', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Khalifa Smart Cells', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Khalifa Smart Cells is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.', 'Khalifa Smart Cells is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.2, 'Al Falah St, Al Nahyan, Abu Dhabi', '+971552006165', '971552006302', 'khalifasmartcells@example.com', NULL, 1, 'approved', 2020, '50+', 'Abu Dhabi', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Capital Mobile Mart', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Capital Mobile Mart is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.', 'Capital Mobile Mart is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.4, 'Khalifa St, Corniche Area, Abu Dhabi', '+971552006439', '971552006576', 'capitalmobilemart@example.com', NULL, 1, 'approved', 2019, '10+', 'Abu Dhabi', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Muroor Phone Gallery', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Muroor Phone Gallery is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.', 'Muroor Phone Gallery is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.1, 'Muroor Rd, Al Wahda, Abu Dhabi', '+971552006713', '971552006850', 'muroorphonegallery@example.com', NULL, 1, 'approved', 2007, '5+', 'Abu Dhabi', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Al Wahda Mobiles', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Al Wahda Mobiles is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.', 'Al Wahda Mobiles is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.9, 'Al Najda St, Al Danah, Abu Dhabi', '+971552006987', '971552007124', 'alwahdamobiles@example.com', NULL, 1, 'approved', 2011, '20+', 'Abu Dhabi', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Najda Cell Trading', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Najda Cell Trading is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.', 'Najda Cell Trading is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.3, 'Defence Rd, Al Nahyan, Abu Dhabi', '+971552007261', '971552007398', 'najdacelltrading@example.com', NULL, 1, 'approved', 2012, '15+', 'Abu Dhabi', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Corniche Phone Hub', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Corniche Phone Hub is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.', 'Corniche Phone Hub is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.0, 'Airport Rd, Al Rawdah, Abu Dhabi', '+971552007535', '971552007672', 'cornichephonehub@example.com', NULL, 1, 'approved', 2016, '15+', 'Abu Dhabi', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Mussafah Mobile Point', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Mussafah Mobile Point is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.', 'Mussafah Mobile Point is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.7, 'Al Salam St, Tourist Club, Abu Dhabi', '+971552007809', '971552007946', 'mussafahmobilepoint@example.com', NULL, 1, 'approved', 2018, '15+', 'Abu Dhabi', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Salam Smart Store', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Salam Smart Store is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.', 'Salam Smart Store is a trusted mobile phone shop in Abu Dhabi offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.5, 'Shabiya 9, Mussafah, Abu Dhabi', '+971552008083', '971552008220', 'salamsmartstore@example.com', NULL, 1, 'approved', 2008, '30+', 'Abu Dhabi', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Ajman Phone Centre', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Ajman Phone Centre is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.', 'Ajman Phone Centre is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.4, 'Sheikh Khalifa Bin Zayed St, Ajman', '+971552008357', '971552008494', 'ajmanphonecentre@example.com', NULL, 1, 'approved', 2018, '20+', 'Ajman', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Nuaimiya Mobile Shop', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Nuaimiya Mobile Shop is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.', 'Nuaimiya Mobile Shop is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.0, 'Al Ittihad St, Al Nakhil, Ajman', '+971552008631', '971552008768', 'nuaimiyamobileshop@example.com', NULL, 1, 'approved', 2012, '10+', 'Ajman', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Ittihad Cell House', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Ittihad Cell House is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.', 'Ittihad Cell House is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.3, 'Kuwait St, Al Nuaimiya, Ajman', '+971552008905', '971552009042', 'ittihadcellhouse@example.com', NULL, 1, 'approved', 2011, '20+', 'Ajman', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Rashidiya Phones', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Rashidiya Phones is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.', 'Rashidiya Phones is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.5, 'Al Quds St, Al Rashidiya, Ajman', '+971552009179', '971552009316', 'rashidiyaphones@example.com', NULL, 1, 'approved', 2021, '30+', 'Ajman', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Al Jurf Mobile Mart', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Al Jurf Mobile Mart is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.', 'Al Jurf Mobile Mart is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.5, 'Sheikh Rashid Bin Humaid St, Ajman', '+971552009453', '971552009590', 'aljurfmobilemart@example.com', NULL, 1, 'approved', 2007, '50+', 'Ajman', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Corniche Cell Zone', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Corniche Cell Zone is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.', 'Corniche Cell Zone is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.1, 'Al Jurf Industrial 1, Ajman', '+971552009727', '971552009864', 'cornichecellzone@example.com', NULL, 1, 'approved', 2015, '5+', 'Ajman', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Kuwait St Mobiles', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Kuwait St Mobiles is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.', 'Kuwait St Mobiles is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.4, 'Corniche Rd, Ajman Corniche, Ajman', '+971552010001', '971552010138', 'kuwaitstmobiles@example.com', NULL, 1, 'approved', 2019, '30+', 'Ajman', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Humaid Phone Plaza', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Humaid Phone Plaza is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.', 'Humaid Phone Plaza is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.8, 'University St, Al Jurf, Ajman', '+971552010275', '971552010412', 'humaidphoneplaza@example.com', NULL, 1, 'approved', 2018, '20+', 'Ajman', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Bustan Mobile Store', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Bustan Mobile Store is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.', 'Bustan Mobile Store is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.4, 'Al Bustan Area, Ajman', '+971552010549', '971552010686', 'bustanmobilestore@example.com', NULL, 1, 'approved', 2011, '5+', 'Ajman', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('City Cell Trading', @mobile_cat, 'Smartphones, accessories & expert repairs', 'City Cell Trading is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.', 'City Cell Trading is a trusted mobile phone shop in Ajman offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.3, 'China Mall Area, Al Jurf, Ajman', '+971552010823', '971552010960', 'citycelltrading@example.com', NULL, 1, 'approved', 2007, '50+', 'Ajman', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Fujairah Mobile House', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Fujairah Mobile House is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.', 'Fujairah Mobile House is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.1, 'Hamad Bin Abdullah Rd, Fujairah', '+971552011097', '971552011234', 'fujairahmobilehouse@example.com', NULL, 1, 'approved', 2017, '20+', 'Fujairah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Faseel Phone Centre', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Faseel Phone Centre is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.', 'Faseel Phone Centre is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.4, 'Sheikh Zayed Rd, Fujairah, Fujairah', '+971552011371', '971552011508', 'faseelphonecentre@example.com', NULL, 1, 'approved', 2007, '20+', 'Fujairah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Gurfa Cell Mart', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Gurfa Cell Mart is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.', 'Gurfa Cell Mart is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.9, 'Al Faseel Rd, Corniche, Fujairah', '+971552011645', '971552011782', 'gurfacellmart@example.com', NULL, 1, 'approved', 2021, '5+', 'Fujairah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Dibba Mobile Zone', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Dibba Mobile Zone is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.', 'Dibba Mobile Zone is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.6, 'Al Gurfa St, City Centre, Fujairah', '+971552011919', '971552012056', 'dibbamobilezone@example.com', NULL, 1, 'approved', 2020, '20+', 'Fujairah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Sakamkam Phones', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Sakamkam Phones is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.', 'Sakamkam Phones is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.5, 'Merashid Rd, Sakamkam, Fujairah', '+971552012193', '971552012330', 'sakamkamphones@example.com', NULL, 1, 'approved', 2014, '15+', 'Fujairah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Coast Mobile Trading', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Coast Mobile Trading is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.', 'Coast Mobile Trading is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.1, 'Al Sharqi St, Dibba Rd, Fujairah', '+971552012467', '971552012604', 'coastmobiletrading@example.com', NULL, 1, 'approved', 2009, '10+', 'Fujairah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Hilal Cell Corner', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Hilal Cell Corner is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.', 'Hilal Cell Corner is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.6, 'Corniche Rd, Fujairah Port Area, Fujairah', '+971552012741', '971552012878', 'hilalcellcorner@example.com', NULL, 1, 'approved', 2011, '50+', 'Fujairah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Port Phone Station', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Port Phone Station is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.', 'Port Phone Station is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.3, 'Madhab Rd, Madhab, Fujairah', '+971552013015', '971552013152', 'portphonestation@example.com', NULL, 1, 'approved', 2009, '30+', 'Fujairah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('Madhab Mobile Shop', @mobile_cat, 'Smartphones, accessories & expert repairs', 'Madhab Mobile Shop is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.', 'Madhab Mobile Shop is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.2, 'Al Hilal City Area, Fujairah', '+971552013289', '971552013426', 'madhabmobileshop@example.com', NULL, 1, 'approved', 2017, '50+', 'Fujairah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

INSERT INTO businesses (name, category_id, tagline, description, about, keywords, image, logo, rating, address, phone, whatsapp, email, website, is_active, status, established_year, employees, emirate, opening_time, closing_time, template, is_online_store, sections_config)
VALUES ('East Coast Cells', @mobile_cat, 'Smartphones, accessories & expert repairs', 'East Coast Cells is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.', 'East Coast Cells is a trusted mobile phone shop in Fujairah offering the latest smartphones, genuine accessories, and professional repair services.
We stock all major brands, offer trade-in deals, and back every sale with honest advice and after-sales support.', 'mobile, phone, smartphone, repair, accessories, sim, charger', 'mobileshop-cover.jpg', 'mobileshop-logo.jpg', 4.7, 'Fujairah Free Zone Area, Fujairah', '+971552013563', '971552013700', 'eastcoastcells@example.com', NULL, 1, 'approved', 2007, '20+', 'Fujairah', '09:00', '22:00', 'template2', 1, NULL);
SET @b = LAST_INSERT_ID();
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

-- Existing placeholder Mobile Shops rows: real logo/cover + products/services/gallery
UPDATE businesses SET logo='mobileshop-logo.jpg', image='mobileshop-cover.jpg', is_online_store=1 WHERE category_id=@mobile_cat AND logo LIKE 'bizcat-%';
SET @b = (SELECT id FROM businesses WHERE name LIKE 'Al Noor Mobile Shops' AND category_id=@mobile_cat LIMIT 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

SET @b = (SELECT id FROM businesses WHERE name LIKE 'Prime Mobile Shops' AND category_id=@mobile_cat LIMIT 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Smartphones', '📱', 0);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Accessories', '🔌', 1);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Audio', '🎧', 2);
INSERT INTO business_product_categories (business_id, name, icon, sort_order) VALUES (@b, 'Wearables', '⌚', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Smartphones', 'Android Smartphone 128GB', 'mobileshop-product-3.jpg', 899, 1099, 'Dual-SIM Android smartphone with 128GB storage, folio case included.', 'active', 0);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'Wireless Charging Pad', 'mobileshop-product-1.jpg', 79, 129, 'Fast Qi wireless charger, slim design, works with all modern phones.', 'active', 1);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Wireless Sports Earbuds', 'mobileshop-product-2.jpg', 149, 199, 'Bluetooth in-ear sports earbuds with magnetic clip and mic.', 'active', 2);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Accessories', 'USB Fast Charger + Cable', 'mobileshop-product-4.jpg', 49, 79, '5V/1A USB charger with 1m cable, CE certified.', 'active', 3);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Wearables', 'Smart Watch Band', 'mobileshop-product-5.jpg', 299, 399, 'E-ink smart watch with leather strap and 7-day battery.', 'active', 4);
INSERT INTO business_products (business_id, category, name, image, price, original_price, description, status, sort_order) VALUES (@b, 'Audio', 'Bluetooth Stereo Speaker', 'mobileshop-product-6.jpg', 199, 279, 'Portable dual-driver Bluetooth speaker with AUX input.', 'active', 5);
INSERT INTO business_service_sections (business_id, title, sort_order) VALUES (@b, 'Our Services', 0);
SET @svc = LAST_INSERT_ID();
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Screen Replacement', 'Original-quality screen replacement for all major brands, done in under an hour.', '🔧', 0);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Phone Unlocking', 'Network unlocking and software services for all smartphone models.', '🔓', 1);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Battery Replacement', 'Genuine battery replacement with warranty on parts and labour.', '🔋', 2);
INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order) VALUES (@b, @svc, 'Trade-In & Buyback', 'Instant valuation and cash trade-in for your old phones and tablets.', '💱', 3);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-1.jpg', 'Inside our store', 'Inside our store', 0);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order) VALUES (@b, 'mobileshop-gallery-2.jpg', 'Repair desk', 'Repair desk', 1);

