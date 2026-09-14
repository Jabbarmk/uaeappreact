-- Migration 45: Broad touch-up — real group-pool images + gallery/services for all remaining categories
-- Pilot categories (Mobile Shops, Restaurants, Cafés, Fast Food) were seeded in migrate43/44.
-- Never touches: Hospitals/Clinics/Doctors & Specialists/Universities/Tuition Centres/Online Courses,
-- any business linked to doctors or university_profiles, or any business whose logo is not the
-- auto-generated bizcat-*.svg placeholder (protects custom-uploaded logos, vloggers, demo shops).
SET NAMES utf8mb4;

DROP TEMPORARY TABLE IF EXISTS grp_map;
CREATE TEMPORARY TABLE grp_map (group_name VARCHAR(100) PRIMARY KEY, slug VARCHAR(30));
INSERT INTO grp_map VALUES
('Automotive', 'automotive'),
('Construction & Contracting', 'construction'),
('Content Creators & Influencers', 'creators'),
('Discount & Department Stores', 'discount'),
('Education & Training', 'education'),
('Events & Celebrations', 'events'),
('Finance, Legal & Insurance', 'finance'),
('Food & Dining', 'foodother'),
('Health, Beauty & Wellness', 'beauty'),
('Hypermarkets & Supermarkets', 'supermarket'),
('Logistics & Transportation', 'logistics'),
('Maintenance & Home Services', 'maintenance'),
('Malls & Shopping Centres', 'malls'),
('Media & Entertainment', 'media'),
('Professional & Business Services', 'professional'),
('Property & Real Estate', 'realestate'),
('Security, Safety & Fire Protection', 'security'),
('Technology & Digital Services', 'tech'),
('Travel, Tourism & Accommodation', 'travel'),
('Wholesale & Retail Stores', 'retail');

DROP TEMPORARY TABLE IF EXISTS grp_services;
CREATE TEMPORARY TABLE grp_services (slug VARCHAR(30), ord INT, title VARCHAR(200), descr TEXT, icon VARCHAR(20));
INSERT INTO grp_services VALUES
('automotive', 0, 'Diagnostics & Inspection', 'Full vehicle health check with computerised diagnostics.', '🔍'),
('automotive', 1, 'Repair & Maintenance', 'Scheduled servicing, brakes, suspension and engine work.', '🔧'),
('automotive', 2, 'Genuine Parts', 'Original and OEM spare parts for all major makes.', '⚙️'),
('construction', 0, 'Design & Planning', 'Concept-to-permit design and engineering support.', '📐'),
('construction', 1, 'Turnkey Execution', 'Civil, MEP and finishing works delivered end to end.', '🏗️'),
('construction', 2, 'Project Management', 'Dedicated site supervision, safety and quality control.', '📋'),
('creators', 0, 'Brand Collaborations', 'Sponsored content and product placement campaigns.', '🤝'),
('creators', 1, 'Content Production', 'Professional filming, editing and post-production.', '🎬'),
('creators', 2, 'Audience Growth', 'Cross-platform promotion to an engaged UAE audience.', '📈'),
('discount', 0, 'Weekly Mega Deals', 'Rotating discounts across every department.', '🏷️'),
('discount', 1, 'Bulk & Family Packs', 'Extra savings on value packs and multipacks.', '📦'),
('discount', 2, 'Easy Exchange', 'Simple 7-day exchange policy on most items.', '🔄'),
('education', 0, 'Certified Programmes', 'Accredited curricula delivered by qualified educators.', '🎓'),
('education', 1, 'Small Group Classes', 'Personal attention with low student-teacher ratios.', '👩‍🏫'),
('education', 2, 'Flexible Timings', 'Morning, evening and weekend batches available.', '🕐'),
('events', 0, 'Full Event Planning', 'Concept, styling and coordination from start to finish.', '🎉'),
('events', 1, 'Decor & Staging', 'Themed decor, floral styling and stage setups.', '💐'),
('events', 2, 'Sound & Lighting', 'Professional AV production for any venue size.', '🎚️'),
('finance', 0, 'Advisory & Compliance', 'Expert guidance aligned with UAE regulations.', '⚖️'),
('finance', 1, 'Accounting & VAT', 'Bookkeeping, VAT filing and financial reporting.', '🧾'),
('finance', 2, 'Business Support', 'Tailored solutions for startups and SMEs.', '💼'),
('foodother', 0, 'Fresh Daily', 'Baked and prepared fresh every morning.', '🥐'),
('foodother', 1, 'Custom Orders', 'Cakes, trays and party orders made to spec.', '🎂'),
('foodother', 2, 'Catering & Delivery', 'Event catering and same-day delivery.', '🚚'),
('beauty', 0, 'Expert Stylists', 'Certified professionals using premium products.', '💇'),
('beauty', 1, 'Skin & Body Care', 'Facials, massage and wellness treatments.', '💆'),
('beauty', 2, 'Bridal Packages', 'Complete bridal and occasion packages.', '👰'),
('supermarket', 0, 'Fresh Produce Daily', 'Fruits, vegetables and bakery restocked every day.', '🥬'),
('supermarket', 1, 'Home Delivery', 'Same-day grocery delivery across the emirate.', '🛵'),
('supermarket', 2, 'Loyalty Rewards', 'Points and member-only prices on every visit.', '💳'),
('logistics', 0, 'Express Delivery', 'Same-day and next-day delivery across the UAE.', '⚡'),
('logistics', 1, 'Cargo & Freight', 'Air, sea and land freight with customs clearance.', '🚢'),
('logistics', 2, 'Secure Warehousing', 'Climate-controlled storage and inventory management.', '🏭'),
('maintenance', 0, '24/7 Call-Out', 'Emergency response any time, any day.', '🚨'),
('maintenance', 1, 'Certified Technicians', 'Licensed, insured and background-checked staff.', '🛠️'),
('maintenance', 2, 'Annual Contracts', 'Preventive maintenance plans for homes and offices.', '📅'),
('malls', 0, '200+ Stores', 'Fashion, electronics, dining and entertainment.', '🛍️'),
('malls', 1, 'Family Entertainment', 'Cinema, play areas and seasonal events.', '🎡'),
('malls', 2, 'Free Parking', 'Thousands of free covered parking spaces.', '🅿️'),
('media', 0, 'Live Performances', 'Bookings for events, shows and private functions.', '🎤'),
('media', 1, 'Studio Production', 'Recording, mixing and content production.', '🎧'),
('media', 2, 'Media Appearances', 'TV, radio and digital campaign collaborations.', '📺'),
('professional', 0, 'Company Formation', 'Mainland and free-zone business setup.', '🏢'),
('professional', 1, 'PRO & Documents', 'Visas, permits, attestation and government liaison.', '📄'),
('professional', 2, 'Ongoing Compliance', 'Renewals, amendments and corporate support.', '✅'),
('realestate', 0, 'Buy, Sell & Lease', 'Residential and commercial property services.', '🏠'),
('realestate', 1, 'Property Management', 'End-to-end management for landlords.', '🔑'),
('realestate', 2, 'Free Valuation', 'Accurate market valuations by RERA-certified agents.', '📊'),
('security', 0, 'Site Assessment', 'Free security survey and risk assessment.', '🔎'),
('security', 1, 'Installation & Setup', 'CCTV, access control and alarm installation.', '📹'),
('security', 2, 'Monitoring & Support', '24/7 monitoring and rapid maintenance response.', '🖥️'),
('tech', 0, 'Custom Development', 'Web, mobile and enterprise software builds.', '💻'),
('tech', 1, 'Cloud & Security', 'Migration, hosting and cybersecurity services.', '☁️'),
('tech', 2, 'Support & SLA', 'Managed IT support with guaranteed response times.', '🛡️'),
('travel', 0, 'Flights & Visas', 'Best-fare ticketing and UAE visa processing.', '✈️'),
('travel', 1, 'Tours & Packages', 'Desert safaris, city tours and holiday packages.', '🐪'),
('travel', 2, 'Hotel Bookings', 'Preferred rates at hotels and resorts worldwide.', '🏨'),
('retail', 0, 'Latest Collections', 'New arrivals every season from top brands.', '🆕'),
('retail', 1, 'Gift Wrapping', 'Complimentary gift wrapping on request.', '🎁'),
('retail', 2, 'Easy Returns', '7-day hassle-free return policy.', '↩️');

-- Eligible business ids (placeholder logo, allowed category, no doctors/university links)
DROP TEMPORARY TABLE IF EXISTS touchup_biz;
CREATE TEMPORARY TABLE touchup_biz AS
SELECT b.id, m.slug
FROM businesses b
JOIN business_categories bc ON bc.id = b.category_id
JOIN grp_map m ON m.group_name = bc.group_name
WHERE b.logo LIKE 'bizcat-%'
  AND bc.id NOT IN (25, 26, 27, 54, 85, 86, 5, 97, 98, 102)
  AND bc.group_name <> 'Doctors & Specialists'
  AND b.id NOT IN (SELECT business_id FROM doctors)
  AND b.id NOT IN (SELECT business_id FROM university_profiles);

-- 1. Real logo + cover from the group pool; make stats/clients sections eligible to show.
UPDATE businesses b JOIN touchup_biz t ON t.id = b.id
SET b.logo = CONCAT('grp-', t.slug, '-logo.jpg'),
    b.image = CONCAT('grp-', t.slug, '-cover.jpg'),
    b.show_stats = 1, b.show_clients = 1;

-- 2. Two gallery photos (only for businesses with no gallery yet).
INSERT INTO business_gallery (business_id, image, caption, title, sort_order)
SELECT t.id, CONCAT('grp-', t.slug, '-cover.jpg'), 'Our premises', 'Our premises', 0
FROM touchup_biz t WHERE NOT EXISTS (SELECT 1 FROM business_gallery g WHERE g.business_id = t.id);
INSERT INTO business_gallery (business_id, image, caption, title, sort_order)
SELECT t.id, CONCAT('grp-', t.slug, '-gallery.jpg'), 'At work', 'At work', 1
FROM touchup_biz t WHERE NOT EXISTS (SELECT 1 FROM business_gallery g WHERE g.business_id = t.id AND g.sort_order = 1);

-- 3. A "What We Offer" services section with 3 group-appropriate items (only where no services exist).
INSERT INTO business_service_sections (business_id, title, sort_order)
SELECT t.id, 'What We Offer', 0
FROM touchup_biz t
WHERE NOT EXISTS (SELECT 1 FROM business_services s WHERE s.business_id = t.id)
  AND NOT EXISTS (SELECT 1 FROM business_service_sections ss WHERE ss.business_id = t.id);

INSERT INTO business_services (business_id, section_id, title, description, icon, sort_order)
SELECT t.id, ss.id, gs.title, gs.descr, gs.icon, gs.ord
FROM touchup_biz t
JOIN business_service_sections ss ON ss.business_id = t.id AND ss.title = 'What We Offer'
JOIN grp_services gs ON gs.slug = t.slug
WHERE NOT EXISTS (SELECT 1 FROM business_services s WHERE s.business_id = t.id);

DROP TEMPORARY TABLE IF EXISTS touchup_biz;
DROP TEMPORARY TABLE IF EXISTS grp_services;
DROP TEMPORARY TABLE IF EXISTS grp_map;
