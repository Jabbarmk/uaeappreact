-- migrate17.sql — Classifieds demo seed: 5 listings per category (8 categories) + gallery images.
-- Run once. Images are hosted Unsplash URLs (getImageUrl passes http URLs through unchanged).
SET NAMES utf8mb4;
SET @uid := (SELECT id FROM users ORDER BY id LIMIT 1);

-- ── Category 1 ──────────────────────────────────────────────────────────────
INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,storage,memory,battery_health,carrier_lock,image,status,is_active,expires_at)
VALUES (@uid,'iPhone 15 Pro 256GB','Sealed-clean condition, Apple warranty valid till 2026, box + cable.',3650,'AED',1,'Dubai Marina, Dubai','Apple','iPhone 15 Pro','Natural Titanium','Like New','256GB','8GB','98%','Unlocked','https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1592286927505-1def25115558?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,storage,memory,battery_health,carrier_lock,image,status,is_active,expires_at)
VALUES (@uid,'Samsung Galaxy S24 Ultra','Snapdragon 8 Gen 3, S-Pen, dual sim. Barely used.',3400,'AED',1,'Al Barsha, Dubai','Samsung','Galaxy S24 Ultra','Titanium Grey','Like New','256GB','12GB','96%','Unlocked','https://images.unsplash.com/photo-1592286927505-1def25115558?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1592286927505-1def25115558?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,storage,memory,battery_health,carrier_lock,image,status,is_active,expires_at)
VALUES (@uid,'iPhone 12 128GB','Reliable daily phone, screen replaced with original panel.',1350,'AED',1,'Sharjah','Apple','iPhone 12','Blue','Good','128GB','4GB','87%','Unlocked','https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,storage,memory,battery_health,carrier_lock,image,status,is_active,expires_at)
VALUES (@uid,'Xiaomi 13T Pro','Leica camera, 120W fast charge, mint condition.',1450,'AED',1,'Abu Dhabi','Xiaomi','13T Pro','Alpine Blue','Good','256GB','12GB','93%','Unlocked','https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,storage,memory,battery_health,carrier_lock,image,status,is_active,expires_at)
VALUES (@uid,'OnePlus 11 5G','Fast and smooth, Hasselblad camera, includes case.',1200,'AED',1,'Al Nahda, Sharjah','OnePlus','11 5G','Titan Black','Good','128GB','8GB','90%','Unlocked','https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1592286927505-1def25115558?w=800&h=800&fit=crop',2);

-- ── Category 2 ──────────────────────────────────────────────────────────────
INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,warranty,accompaniments,image,status,is_active,expires_at)
VALUES (@uid,'MacBook Air M2 2023','13-inch, 8-core, perfect for study & work. AppleCare active.',3900,'AED',2,'Deira, Dubai','Apple','MacBook Air M2','Midnight','Like New','6 months','Charger + Sleeve','https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,warranty,accompaniments,image,status,is_active,expires_at)
VALUES (@uid,'Sony WH-1000XM5','Best-in-class noise cancelling headphones, boxed.',950,'AED',2,'Ajman','Sony','WH-1000XM5','Black','Like New','3 months','Case + Cable','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,warranty,accompaniments,image,status,is_active,expires_at)
VALUES (@uid,'Dell XPS 15 Laptop','i7, 16GB RAM, 512GB SSD. Great for design work.',2800,'AED',2,'Jumeirah, Dubai','Dell','XPS 15','Silver','Good','None','Charger','https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,warranty,accompaniments,image,status,is_active,expires_at)
VALUES (@uid,'iPad Air 5th Gen','M1 chip, Wi-Fi 64GB, with Apple Pencil 2.',1900,'AED',2,'Dubai Marina, Dubai','Apple','iPad Air 5','Space Grey','Good','None','Pencil + Cover','https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,warranty,accompaniments,image,status,is_active,expires_at)
VALUES (@uid,'PlayStation 5 Slim','Disc edition with 2 controllers and 3 games.',1650,'AED',2,'Al Barsha, Dubai','Sony','PS5 Slim','White','Good','None','2 Controllers + Games','https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',2);

-- ── Category 3 ──────────────────────────────────────────────────────────────
INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,color,condition_status,furniture_type,material,dimensions,image,status,is_active,expires_at)
VALUES (@uid,'3-Seater Leather Sofa','Genuine leather, very comfortable, smoke-free home.',2200,'AED',3,'Sharjah','Cognac Brown','Good','Sofa','Genuine Leather','220 x 95 cm','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,color,condition_status,furniture_type,material,dimensions,image,status,is_active,expires_at)
VALUES (@uid,'King Size Bed with Mattress','Solid oak frame, medium-firm mattress included.',1900,'AED',3,'Abu Dhabi','Walnut','Good','Bed','Solid Oak','200 x 180 cm','https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,color,condition_status,furniture_type,material,dimensions,image,status,is_active,expires_at)
VALUES (@uid,'6-Seater Dining Set','Marble-top table with 6 cushioned chairs.',2600,'AED',3,'Al Nahda, Sharjah','White & Gold','Like New','Dining Set','Marble & Steel','180 x 90 cm','https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,color,condition_status,furniture_type,material,dimensions,image,status,is_active,expires_at)
VALUES (@uid,'Ergonomic Office Chair','Herman-Miller style, full adjustable, lumbar support.',650,'AED',3,'Deira, Dubai','Black','Good','Office Chair','Mesh & Aluminium','120 x 65 cm','https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,color,condition_status,furniture_type,material,dimensions,image,status,is_active,expires_at)
VALUES (@uid,'5-Door Wardrobe','Spacious sliding-door wardrobe with mirror.',1400,'AED',3,'Ajman','White','Fair','Wardrobe','MDF Laminate','250 x 220 cm','https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&h=800&fit=crop',2);

-- ── Category 4 ──────────────────────────────────────────────────────────────
INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,color,condition_status,age,material,image,status,is_active,expires_at)
VALUES (@uid,'LEGO Technic Bugatti Set','Complete set with manual, all pieces present.',450,'AED',4,'Jumeirah, Dubai','LEGO','Blue','Like New','9+ years','ABS Plastic','https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,color,condition_status,age,material,image,status,is_active,expires_at)
VALUES (@uid,'Kids Electric Ride-On Car','12V battery, remote control for parents. Works great.',380,'AED',4,'Dubai Marina, Dubai','Generic','Red','Good','3-6 years','Plastic & Metal','https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,color,condition_status,age,material,image,status,is_active,expires_at)
VALUES (@uid,'Wooden Train Play Set','Large wooden track with trains, eco-friendly.',180,'AED',4,'Al Barsha, Dubai','Hape','Multicolor','Good','2-5 years','Solid Wood','https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,color,condition_status,age,material,image,status,is_active,expires_at)
VALUES (@uid,'Barbie Dreamhouse','3-storey dollhouse with accessories, gently used.',320,'AED',4,'Sharjah','Mattel','Pink','Good','3+ years','Plastic','https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,color,condition_status,age,material,image,status,is_active,expires_at)
VALUES (@uid,'Building Blocks Mega Box','500+ pieces creative blocks, complete with box.',120,'AED',4,'Abu Dhabi','Mega Bloks','Assorted','Good','1-4 years','ABS Plastic','https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=800&fit=crop',2);

-- ── Category 5 ──────────────────────────────────────────────────────────────
INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,year,mileage,transmission,fuel_type,image,status,is_active,expires_at)
VALUES (@uid,'Mercedes-Benz C200 2020','AMG line, full service history, GCC specs.',135000,'AED',5,'Al Nahda, Sharjah','Mercedes-Benz','C200','Obsidian Black','Like New','2020','52,000 km','Automatic','Petrol','https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,year,mileage,transmission,fuel_type,image,status,is_active,expires_at)
VALUES (@uid,'BMW X5 xDrive40i 2019','7-seater, panoramic roof, second owner.',175000,'AED',5,'Deira, Dubai','BMW','X5 xDrive40i','Alpine White','Good','2019','78,000 km','Automatic','Petrol','https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,year,mileage,transmission,fuel_type,image,status,is_active,expires_at)
VALUES (@uid,'Hyundai Elantra 2021','Economical, single owner, accident free.',52000,'AED',5,'Ajman','Hyundai','Elantra','Grey','Good','2021','61,000 km','Automatic','Petrol','https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,year,mileage,transmission,fuel_type,image,status,is_active,expires_at)
VALUES (@uid,'Ford Mustang GT 2018','5.0 V8, sport exhaust, well maintained.',128000,'AED',5,'Jumeirah, Dubai','Ford','Mustang GT','Race Red','Good','2018','55,000 km','Automatic','Petrol','https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,year,mileage,transmission,fuel_type,image,status,is_active,expires_at)
VALUES (@uid,'Kia Sportage 2022','Family SUV, warranty valid, low mileage.',78000,'AED',5,'Dubai Marina, Dubai','Kia','Sportage','Silver','Like New','2022','34,000 km','Automatic','Petrol','https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=800&fit=crop',2);

-- ── Category 6 ──────────────────────────────────────────────────────────────
INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,year,mileage,transmission,fuel_type,image,status,is_active,expires_at)
VALUES (@uid,'Harley-Davidson Iron 883','Custom exhaust, well serviced, papers clear.',38000,'AED',6,'Al Barsha, Dubai','Harley-Davidson','Iron 883','Matte Black','Good','2019','18,000 km','Manual','Petrol','https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,year,mileage,transmission,fuel_type,image,status,is_active,expires_at)
VALUES (@uid,'Yamaha MT-07','Agile naked bike, new tyres, great condition.',22000,'AED',6,'Sharjah','Yamaha','MT-07','Cyan Blue','Like New','2021','9,500 km','Manual','Petrol','https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,year,mileage,transmission,fuel_type,image,status,is_active,expires_at)
VALUES (@uid,'Kawasaki Ninja 400','Beginner friendly sportbike, single owner.',19500,'AED',6,'Abu Dhabi','Kawasaki','Ninja 400','Green','Good','2020','12,000 km','Manual','Petrol','https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,year,mileage,transmission,fuel_type,image,status,is_active,expires_at)
VALUES (@uid,'Honda PCX 150 Scooter','Fuel efficient city scooter, fully serviced.',8500,'AED',6,'Al Nahda, Sharjah','Honda','PCX 150','White','Good','2021','15,000 km','Automatic','Petrol','https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,year,mileage,transmission,fuel_type,image,status,is_active,expires_at)
VALUES (@uid,'BMW R1250 GS','Adventure tourer, panniers included, GCC.',62000,'AED',6,'Deira, Dubai','BMW','R1250 GS','Grey','Good','2020','25,000 km','Manual','Petrol','https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&h=800&fit=crop',2);

-- ── Category 7 ──────────────────────────────────────────────────────────────
INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,warranty,image,status,is_active,expires_at)
VALUES (@uid,'Toyota Land Cruiser Alloy Rims','Set of 4 original 18-inch rims, no cracks.',2400,'AED',7,'Ajman','Toyota','LC 18-inch','Silver','Good','None','https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1571988840298-3b5301d5109b?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,warranty,image,status,is_active,expires_at)
VALUES (@uid,'BMW N52 Engine Assembly','Complete engine, low mileage import, tested.',6500,'AED',7,'Jumeirah, Dubai','BMW','N52','Grey','Good','1 month','https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1571988840298-3b5301d5109b?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,warranty,image,status,is_active,expires_at)
VALUES (@uid,'Bosch Car Battery 70Ah','Barely used battery, holds charge perfectly.',280,'AED',7,'Dubai Marina, Dubai','Bosch','S4 70Ah','Black','Like New','3 months','https://images.unsplash.com/photo-1571988840298-3b5301d5109b?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1571988840298-3b5301d5109b?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,warranty,image,status,is_active,expires_at)
VALUES (@uid,'Mercedes Headlight Pair','OEM LED headlights for W205, no defects.',1900,'AED',7,'Al Barsha, Dubai','Mercedes-Benz','W205 LED','Clear','Good','None','https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,warranty,image,status,is_active,expires_at)
VALUES (@uid,'Set of 4 Michelin Tyres','235/45 R18, 80% tread remaining.',900,'AED',7,'Sharjah','Michelin','Pilot Sport 4','Black','Good','None','https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=800&fit=crop',2);

-- ── Category 8 ──────────────────────────────────────────────────────────────
INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,version,dimensions,warranty,image,status,is_active,expires_at)
VALUES (@uid,'Samsung 65" QLED 4K TV','Crystal clear picture, wall mount included.',2600,'AED',8,'Abu Dhabi','Samsung','QN65Q70','Black','Like New','4K QLED','65 inch','3 months','https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1552975084-6e027cd345c2?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1601944177325-f8867652837f?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,version,dimensions,warranty,image,status,is_active,expires_at)
VALUES (@uid,'LG OLED 55" C2','Perfect blacks, gaming 120Hz, boxed.',3100,'AED',8,'Al Nahda, Sharjah','LG','OLED55C2','Black','Like New','4K OLED','55 inch','6 months','https://images.unsplash.com/photo-1552975084-6e027cd345c2?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1552975084-6e027cd345c2?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1601944177325-f8867652837f?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1571988840298-3b5301d5109b?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,version,dimensions,warranty,image,status,is_active,expires_at)
VALUES (@uid,'Sony Bravia 50" 4K','Reliable smart TV, Google TV built in.',1500,'AED',8,'Deira, Dubai','Sony','KD-50X75','Black','Good','4K LED','50 inch','None','https://images.unsplash.com/photo-1601944177325-f8867652837f?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1601944177325-f8867652837f?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1571988840298-3b5301d5109b?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,version,dimensions,warranty,image,status,is_active,expires_at)
VALUES (@uid,'TCL 43" Full HD Smart TV','Compact bedroom TV, works perfectly.',650,'AED',8,'Ajman','TCL','43S5400','Black','Good','Full HD','43 inch','None','https://images.unsplash.com/photo-1571988840298-3b5301d5109b?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1571988840298-3b5301d5109b?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&h=800&fit=crop',2);

INSERT INTO classifieds (user_id,title,description,price,currency,category_id,location,brand,model,color,condition_status,version,dimensions,warranty,image,status,is_active,expires_at)
VALUES (@uid,'Hisense 75" 4K UHD','Big screen for living room, minor stand wear.',2200,'AED',8,'Jumeirah, Dubai','Hisense','75A6K','Black','Good','4K UHD','75 inch','None','https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=800&fit=crop','approved',1,DATE_ADD(NOW(), INTERVAL 30 DAY));
SET @cid := LAST_INSERT_ID();
INSERT INTO classified_images (classified_id,filename,sort_order) VALUES (@cid,'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=900&h=900&fit=crop',0),(@cid,'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&h=800&fit=crop',1),(@cid,'https://images.unsplash.com/photo-1552975084-6e027cd345c2?w=800&h=800&fit=crop',2);

