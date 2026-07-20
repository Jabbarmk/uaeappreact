-- migrate8.sql — Main categories (20) + business sub-categories
--  • Replaces business_categories EXCEPT those still referenced by a business,
--    a popular_category, or a home_category (so nothing on-screen breaks).
--  • Each sub-category links to its main via group_name (name) AND main_category_id.
-- MySQL 5.7 / MariaDB compatible. Contains emoji — SET NAMES utf8mb4 handles it,
-- so a plain `mysql <db> < migrate8.sql` imports correctly.

SET NAMES utf8mb4;

-- ── 1) Remove business categories no longer needed (keep the referenced ones) ────
DELETE FROM business_categories
WHERE id NOT IN (SELECT category_id FROM businesses         WHERE category_id IS NOT NULL)
  AND id NOT IN (SELECT category_id FROM popular_categories WHERE category_id IS NOT NULL)
  AND id NOT IN (SELECT category_id FROM home_categories    WHERE category_id IS NOT NULL);

-- ── 2) Fresh main categories (20) ───────────────────────────────────────────────
DELETE FROM main_categories;
INSERT INTO main_categories (name, icon, sort_order, is_active) VALUES
('Food & Dining','🍽️',1,1),
('Malls & Shopping Centres','🏬',2,1),
('Hypermarkets & Supermarkets','🛒',3,1),
('Discount & Department Stores','🏷️',4,1),
('Wholesale & Retail Stores','🛍️',5,1),
('Property & Real Estate','🏠',6,1),
('Maintenance & Home Services','🛠️',7,1),
('Automotive','🚗',8,1),
('Health, Beauty & Wellness','🏥',9,1),
('Education & Training','🎓',10,1),
('Technology & Digital Services','💻',11,1),
('Travel, Tourism & Accommodation','✈️',12,1),
('Professional & Business Services','💼',13,1),
('Finance, Legal & Insurance','💰',14,1),
('Construction & Contracting','🏗️',15,1),
('Logistics & Transportation','🚚',16,1),
('Security, Safety & Fire Protection','🛡️',17,1),
('Events & Celebrations','🎉',18,1),
('Media & Entertainment','🎭',19,1),
('Content Creators & Influencers','📹',20,1);

-- ── 3) Business sub-categories under each main ──────────────────────────────────
SET @m := (SELECT id FROM main_categories WHERE name='Food & Dining');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Restaurants','🍴','Food & Dining',@m,1,1),
('Cafés','☕','Food & Dining',@m,2,1),
('Fast Food','🍔','Food & Dining',@m,3,1),
('Bakeries','🥐','Food & Dining',@m,4,1),
('Catering','🧑‍🍳','Food & Dining',@m,5,1),
('Cloud Kitchens','🍱','Food & Dining',@m,6,1),
('Food Trucks','🚚','Food & Dining',@m,7,1),
('Juice Shops','🧃','Food & Dining',@m,8,1),
('Sweet Shops','🍬','Food & Dining',@m,9,1);

SET @m := (SELECT id FROM main_categories WHERE name='Malls & Shopping Centres');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Shopping Malls','🏬','Malls & Shopping Centres',@m,1,1),
('Community Malls','🛍️','Malls & Shopping Centres',@m,2,1),
('Shopping Centres','🛒','Malls & Shopping Centres',@m,3,1),
('Retail Complexes','🏢','Malls & Shopping Centres',@m,4,1),
('Outlet Malls','🏷️','Malls & Shopping Centres',@m,5,1),
('Souks','🏪','Malls & Shopping Centres',@m,6,1);

SET @m := (SELECT id FROM main_categories WHERE name='Hypermarkets & Supermarkets');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Hypermarkets','🛒','Hypermarkets & Supermarkets',@m,1,1),
('Supermarkets','🛍️','Hypermarkets & Supermarkets',@m,2,1),
('Grocery Stores','🥦','Hypermarkets & Supermarkets',@m,3,1),
('Organic Food Stores','🌿','Hypermarkets & Supermarkets',@m,4,1),
('Convenience Stores','🏪','Hypermarkets & Supermarkets',@m,5,1),
('Mini-Marts','🧺','Hypermarkets & Supermarkets',@m,6,1);

SET @m := (SELECT id FROM main_categories WHERE name='Discount & Department Stores');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Discount Centres','🏷️','Discount & Department Stores',@m,1,1),
('Department Stores','🏬','Discount & Department Stores',@m,2,1),
('Variety Stores','🎁','Discount & Department Stores',@m,3,1),
('Factory Outlets','🏭','Discount & Department Stores',@m,4,1),
('Clearance Stores','📉','Discount & Department Stores',@m,5,1),
('Budget Stores','💰','Discount & Department Stores',@m,6,1);

SET @m := (SELECT id FROM main_categories WHERE name='Wholesale & Retail Stores');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Fashion','👗','Wholesale & Retail Stores',@m,1,1),
('Electronics','💻','Wholesale & Retail Stores',@m,2,1),
('Mobile Shops','📱','Wholesale & Retail Stores',@m,3,1),
('Jewellery','💎','Wholesale & Retail Stores',@m,4,1),
('Furniture','🛋️','Wholesale & Retail Stores',@m,5,1),
('Perfumes','🌸','Wholesale & Retail Stores',@m,6,1),
('Gifts','🎁','Wholesale & Retail Stores',@m,7,1),
('Baby Products','🍼','Wholesale & Retail Stores',@m,8,1),
('Sports Equipment','⚽','Wholesale & Retail Stores',@m,9,1);

SET @m := (SELECT id FROM main_categories WHERE name='Property & Real Estate');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Real Estate Agencies','🏘️','Property & Real Estate',@m,1,1),
('Property Developers','🏗️','Property & Real Estate',@m,2,1),
('Property Management','🔑','Property & Real Estate',@m,3,1),
('Real Estate Consultants','🤝','Property & Real Estate',@m,4,1),
('Commercial Properties','🏢','Property & Real Estate',@m,5,1),
('Holiday Homes','🏖️','Property & Real Estate',@m,6,1);

SET @m := (SELECT id FROM main_categories WHERE name='Maintenance & Home Services');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Cleaning','🧹','Maintenance & Home Services',@m,1,1),
('Plumbing','🚰','Maintenance & Home Services',@m,2,1),
('Electrical Work','⚡','Maintenance & Home Services',@m,3,1),
('AC Repair','❄️','Maintenance & Home Services',@m,4,1),
('Painting','🎨','Maintenance & Home Services',@m,5,1),
('Carpentry','🪚','Maintenance & Home Services',@m,6,1),
('Pest Control','🐜','Maintenance & Home Services',@m,7,1),
('Landscaping','🌳','Maintenance & Home Services',@m,8,1),
('Handyman Services','🔧','Maintenance & Home Services',@m,9,1);

SET @m := (SELECT id FROM main_categories WHERE name='Automotive');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('New Car Dealers','🚘','Automotive',@m,1,1),
('Used Car Dealers','🚙','Automotive',@m,2,1),
('Car Rentals','🔑','Automotive',@m,3,1),
('Garages','🔧','Automotive',@m,4,1),
('Car Wash','🧽','Automotive',@m,5,1),
('Spare Parts','⚙️','Automotive',@m,6,1),
('Tyres','🛞','Automotive',@m,7,1),
('Auto Accessories','🎛️','Automotive',@m,8,1),
('Vehicle Recovery','🚛','Automotive',@m,9,1);

SET @m := (SELECT id FROM main_categories WHERE name='Health, Beauty & Wellness');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Hospitals','🏥','Health, Beauty & Wellness',@m,1,1),
('Clinics','🩺','Health, Beauty & Wellness',@m,2,1),
('Pharmacies','💊','Health, Beauty & Wellness',@m,3,1),
('Dental Clinics','🦷','Health, Beauty & Wellness',@m,4,1),
('Laboratories','🧪','Health, Beauty & Wellness',@m,5,1),
('Beauty Salons','💇‍♀️','Health, Beauty & Wellness',@m,6,1),
('Barbershops','💈','Health, Beauty & Wellness',@m,7,1),
('Spas','💆','Health, Beauty & Wellness',@m,8,1),
('Fitness Centres','🏋️','Health, Beauty & Wellness',@m,9,1),
('Yoga Studios','🧘','Health, Beauty & Wellness',@m,10,1);

SET @m := (SELECT id FROM main_categories WHERE name='Education & Training');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Schools','🏫','Education & Training',@m,1,1),
('Nurseries','🧸','Education & Training',@m,2,1),
('Universities','🎓','Education & Training',@m,3,1),
('Tuition Centres','📚','Education & Training',@m,4,1),
('Training Institutes','🧑‍🏫','Education & Training',@m,5,1),
('Driving Schools','🚘','Education & Training',@m,6,1),
('Language Centres','🗣️','Education & Training',@m,7,1),
('Online Courses','💻','Education & Training',@m,8,1);

SET @m := (SELECT id FROM main_categories WHERE name='Technology & Digital Services');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Software Companies','💻','Technology & Digital Services',@m,1,1),
('App Development','📱','Technology & Digital Services',@m,2,1),
('Website Design','🌐','Technology & Digital Services',@m,3,1),
('IT Support','🛠️','Technology & Digital Services',@m,4,1),
('Cybersecurity','🛡️','Technology & Digital Services',@m,5,1),
('Cloud Services','☁️','Technology & Digital Services',@m,6,1),
('AI Solutions','🤖','Technology & Digital Services',@m,7,1),
('Computer Shops','🖥️','Technology & Digital Services',@m,8,1);

SET @m := (SELECT id FROM main_categories WHERE name='Travel, Tourism & Accommodation');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Travel Agencies','✈️','Travel, Tourism & Accommodation',@m,1,1),
('Tour Operators','🗺️','Travel, Tourism & Accommodation',@m,2,1),
('Visa Services','🛂','Travel, Tourism & Accommodation',@m,3,1),
('Ticketing','🎫','Travel, Tourism & Accommodation',@m,4,1),
('Hotels','🏨','Travel, Tourism & Accommodation',@m,5,1),
('Resorts','🌴','Travel, Tourism & Accommodation',@m,6,1),
('Hotel Apartments','🏢','Travel, Tourism & Accommodation',@m,7,1),
('Holiday Homes','🏡','Travel, Tourism & Accommodation',@m,8,1),
('Desert Safaris','🐪','Travel, Tourism & Accommodation',@m,9,1),
('Yacht Rentals','🛥️','Travel, Tourism & Accommodation',@m,10,1);

SET @m := (SELECT id FROM main_categories WHERE name='Professional & Business Services');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Business Setup','🏢','Professional & Business Services',@m,1,1),
('PRO Services','🪪','Professional & Business Services',@m,2,1),
('Management Consultancy','📊','Professional & Business Services',@m,3,1),
('Recruitment','👥','Professional & Business Services',@m,4,1),
('Translation','🌐','Professional & Business Services',@m,5,1),
('Typing Centres','⌨️','Professional & Business Services',@m,6,1),
('Document Clearing','📄','Professional & Business Services',@m,7,1),
('Corporate Services','🤝','Professional & Business Services',@m,8,1);

SET @m := (SELECT id FROM main_categories WHERE name='Finance, Legal & Insurance');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Accounting','🧾','Finance, Legal & Insurance',@m,1,1),
('Auditing','📊','Finance, Legal & Insurance',@m,2,1),
('Tax Consultancy','🧮','Finance, Legal & Insurance',@m,3,1),
('Legal Services','⚖️','Finance, Legal & Insurance',@m,4,1),
('Insurance Brokers','🛡️','Finance, Legal & Insurance',@m,5,1),
('Financial Consultants','💹','Finance, Legal & Insurance',@m,6,1),
('Mortgage Advisors','🏦','Finance, Legal & Insurance',@m,7,1);

SET @m := (SELECT id FROM main_categories WHERE name='Construction & Contracting');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Building Contractors','🏗️','Construction & Contracting',@m,1,1),
('Civil Works','🚧','Construction & Contracting',@m,2,1),
('MEP Services','⚙️','Construction & Contracting',@m,3,1),
('Interior Fit-Out','🏠','Construction & Contracting',@m,4,1),
('Building Materials','🧱','Construction & Contracting',@m,5,1),
('Equipment Rental','🚜','Construction & Contracting',@m,6,1),
('Aluminium and Glass Works','🪟','Construction & Contracting',@m,7,1);

SET @m := (SELECT id FROM main_categories WHERE name='Logistics & Transportation');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Courier Services','📦','Logistics & Transportation',@m,1,1),
('Cargo Companies','🚢','Logistics & Transportation',@m,2,1),
('Freight Forwarding','🚛','Logistics & Transportation',@m,3,1),
('Warehousing','🏭','Logistics & Transportation',@m,4,1),
('Moving Companies','📦','Logistics & Transportation',@m,5,1),
('Delivery Services','🛵','Logistics & Transportation',@m,6,1),
('Bus Rentals','🚌','Logistics & Transportation',@m,7,1),
('Limousine Rentals','🚖','Logistics & Transportation',@m,8,1);

SET @m := (SELECT id FROM main_categories WHERE name='Security, Safety & Fire Protection');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Security Companies','👮','Security, Safety & Fire Protection',@m,1,1),
('Security Guards','💂','Security, Safety & Fire Protection',@m,2,1),
('CCTV Systems','📹','Security, Safety & Fire Protection',@m,3,1),
('Access Control','🔐','Security, Safety & Fire Protection',@m,4,1),
('Event Security','🛡️','Security, Safety & Fire Protection',@m,5,1),
('Fire Equipment','🧯','Security, Safety & Fire Protection',@m,6,1),
('PPE Suppliers','🦺','Security, Safety & Fire Protection',@m,7,1),
('Safety Equipment','⛑️','Security, Safety & Fire Protection',@m,8,1),
('Fire Alarms','🚨','Security, Safety & Fire Protection',@m,9,1),
('Gas Detectors','☢️','Security, Safety & Fire Protection',@m,10,1),
('Safety Signage','⚠️','Security, Safety & Fire Protection',@m,11,1);

SET @m := (SELECT id FROM main_categories WHERE name='Events & Celebrations');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Event Management','🎪','Events & Celebrations',@m,1,1),
('Wedding Planners','💍','Events & Celebrations',@m,2,1),
('Birthday Planners','🎂','Events & Celebrations',@m,3,1),
('Event Decorators','🎈','Events & Celebrations',@m,4,1),
('Party Halls','🏛️','Events & Celebrations',@m,5,1),
('DJs','🎧','Events & Celebrations',@m,6,1),
('Catering','🍽️','Events & Celebrations',@m,7,1),
('Sound Rental','🔊','Events & Celebrations',@m,8,1),
('Lighting Rental','💡','Events & Celebrations',@m,9,1);

SET @m := (SELECT id FROM main_categories WHERE name='Media & Entertainment');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Radio Jockeys','📻','Media & Entertainment',@m,1,1),
('Video Jockeys','📺','Media & Entertainment',@m,2,1),
('TV Presenters','🎙️','Media & Entertainment',@m,3,1),
('News Anchors','📰','Media & Entertainment',@m,4,1),
('Actors','🎭','Media & Entertainment',@m,5,1),
('Models','📸','Media & Entertainment',@m,6,1),
('Singers','🎤','Media & Entertainment',@m,7,1),
('Musicians','🎸','Media & Entertainment',@m,8,1),
('Comedians','😂','Media & Entertainment',@m,9,1),
('Production Houses','🎬','Media & Entertainment',@m,10,1);

SET @m := (SELECT id FROM main_categories WHERE name='Content Creators & Influencers');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('Vloggers','📹','Content Creators & Influencers',@m,1,1),
('Bloggers','✍️','Content Creators & Influencers',@m,2,1),
('Podcasters','🎙️','Content Creators & Influencers',@m,3,1),
('Social-Media Influencers','📱','Content Creators & Influencers',@m,4,1),
('Food Creators','🍜','Content Creators & Influencers',@m,5,1),
('Travel Creators','✈️','Content Creators & Influencers',@m,6,1),
('Lifestyle Creators','🌟','Content Creators & Influencers',@m,7,1),
('Tech Reviewers','💻','Content Creators & Influencers',@m,8,1),
('Gaming Streamers','🎮','Content Creators & Influencers',@m,9,1);

-- ── 4) Fold preserved legacy categories (still used by a business) into the new set ─
-- Names are the singular legacy ones and don't collide with any new category above.
UPDATE business_categories SET group_name='Food & Dining',             main_category_id=(SELECT id FROM main_categories WHERE name='Food & Dining')             WHERE name='Restaurant';
UPDATE business_categories SET group_name='Health, Beauty & Wellness', main_category_id=(SELECT id FROM main_categories WHERE name='Health, Beauty & Wellness') WHERE name='Clinic';
UPDATE business_categories SET group_name='Wholesale & Retail Stores', main_category_id=(SELECT id FROM main_categories WHERE name='Wholesale & Retail Stores') WHERE name='Giftshop';
