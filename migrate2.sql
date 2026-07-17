-- migrate2.sql — CV/Jobs feature additions
-- MySQL 5.7 compatible (no IF NOT EXISTS on ALTER). Run once on a fresh DB.

-- ── user_profiles: visa status + notice period ────────────────────────────────
ALTER TABLE user_profiles
  ADD COLUMN visa_status VARCHAR(50) NULL AFTER location,
  ADD COLUMN notice_period VARCHAR(30) NULL AFTER visa_status;

-- ── jobs: business link, work model, emirate ──────────────────────────────────
ALTER TABLE jobs
  ADD COLUMN business_id INT NULL AFTER company,
  ADD COLUMN work_model ENUM('Remote','Hybrid','On-site') NULL AFTER job_type,
  ADD COLUMN emirate VARCHAR(50) NULL AFTER location;

-- ── Global skills master list ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  usage_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_skill_name (name)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ── Global languages master list ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS languages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  usage_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_language_name (name)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ── Job applications ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  user_id INT NOT NULL,
  cover_letter TEXT NULL,
  status ENUM('pending','shortlisted','rejected') NOT NULL DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_job_user (job_id, user_id),
  INDEX idx_job (job_id),
  INDEX idx_user (user_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ── Seed common skills ────────────────────────────────────────────────────────
INSERT IGNORE INTO skills (name) VALUES
  ('JavaScript'),('TypeScript'),('React'),('Angular'),('Vue.js'),('Node.js'),('Express.js'),
  ('Python'),('Django'),('Flask'),('Java'),('Spring Boot'),('C#'),('.NET'),('PHP'),('Laravel'),
  ('Ruby'),('Ruby on Rails'),('Go'),('Rust'),('Kotlin'),('Swift'),('Objective-C'),('Flutter'),
  ('React Native'),('HTML'),('CSS'),('Sass'),('Tailwind CSS'),('Bootstrap'),('jQuery'),
  ('SQL'),('MySQL'),('PostgreSQL'),('MongoDB'),('Redis'),('Oracle'),('SQL Server'),('Firebase'),
  ('AWS'),('Azure'),('Google Cloud'),('Docker'),('Kubernetes'),('Terraform'),('Jenkins'),('CI/CD'),
  ('Git'),('Linux'),('Bash'),('GraphQL'),('REST API'),('Microservices'),('RabbitMQ'),('Kafka'),
  ('Machine Learning'),('Deep Learning'),('Data Science'),('Data Analysis'),('TensorFlow'),('PyTorch'),
  ('Power BI'),('Tableau'),('Excel'),('Figma'),('Adobe Photoshop'),('Adobe Illustrator'),('Adobe XD'),
  ('UI/UX Design'),('Graphic Design'),('Video Editing'),('Premiere Pro'),('After Effects'),
  ('Digital Marketing'),('SEO'),('SEM'),('Google Ads'),('Social Media Marketing'),('Content Writing'),
  ('Copywriting'),('Email Marketing'),('Brand Management'),('Market Research'),
  ('Project Management'),('Agile'),('Scrum'),('Jira'),('Product Management'),('Business Analysis'),
  ('Accounting'),('Bookkeeping'),('Financial Analysis'),('Audit'),('Taxation'),('QuickBooks'),('SAP'),
  ('Sales'),('Business Development'),('Negotiation'),('Customer Service'),('CRM'),('Salesforce'),
  ('Human Resources'),('Recruitment'),('Payroll'),('Training & Development'),
  ('Supply Chain'),('Logistics'),('Procurement'),('Inventory Management'),('Operations Management'),
  ('Civil Engineering'),('Mechanical Engineering'),('Electrical Engineering'),('AutoCAD'),('Revit'),
  ('Construction Management'),('Quantity Surveying'),('Health & Safety'),('HSE'),
  ('Nursing'),('Pharmacy'),('Medical Coding'),('Patient Care'),
  ('Teaching'),('Curriculum Development'),('Translation'),('Legal Research'),('Contract Management'),
  ('Hospitality'),('Food & Beverage'),('Housekeeping'),('Front Office'),('Event Management'),
  ('Real Estate'),('Property Management'),('Leasing'),
  ('Communication'),('Leadership'),('Teamwork'),('Problem Solving'),('Time Management'),
  ('Microsoft Office'),('Data Entry'),('Administration'),('Customer Support');

-- ── Seed common languages ─────────────────────────────────────────────────────
INSERT IGNORE INTO languages (name) VALUES
  ('English'),('Arabic'),('Hindi'),('Urdu'),('Malayalam'),('Tamil'),('Telugu'),('Bengali'),
  ('Punjabi'),('Tagalog'),('French'),('Spanish'),('German'),('Italian'),('Russian'),('Mandarin'),
  ('Cantonese'),('Japanese'),('Korean'),('Portuguese'),('Dutch'),('Turkish'),('Persian (Farsi)'),
  ('Pashto'),('Sinhala'),('Nepali'),('Indonesian'),('Malay'),('Swahili'),('Amharic'),('Somali'),
  ('Greek'),('Polish'),('Romanian'),('Ukrainian'),('Marathi'),('Gujarati'),('Kannada'),('Sindhi');
