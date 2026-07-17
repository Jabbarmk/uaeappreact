-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: smartuae
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_users`
--

LOCK TABLES `admin_users` WRITE;
/*!40000 ALTER TABLE `admin_users` DISABLE KEYS */;
INSERT INTO `admin_users` VALUES (1,'admin','$2b$10$Fqev3SDuLIJ0tgfPGSdh.utAoa/ctlLN84Dwc70kLg51DyqEAx0Ai','Administrator','2026-04-13 21:02:17');
/*!40000 ALTER TABLE `admin_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_categories`
--

DROP TABLE IF EXISTS `business_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `main_category_id` int(11) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `group_name` varchar(100) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_main_cat` (`main_category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_categories`
--

LOCK TABLES `business_categories` WRITE;
/*!40000 ALTER TABLE `business_categories` DISABLE KEYS */;
INSERT INTO `business_categories` VALUES (1,'Giftshop',1,'🎁','Popular Categories',1,1),(2,'Sports',NULL,'🏀','Popular Categories',2,1),(3,'Furniture',NULL,'🛋️','Popular Categories',3,1),(4,'Toy Shop',NULL,'🧸','Popular Categories',4,1),(5,'Clinic',NULL,'🩺','Health and Fitness',5,1),(6,'Eye Hospital',NULL,'👁️','Health and Fitness',6,1),(7,'Pest Control',NULL,'🐜','Health and Fitness',7,1),(8,'Electrician',NULL,'💡','Health and Fitness',8,1),(9,'Hospital',NULL,'🏥','Health and Fitness',9,1),(10,'Clinics',NULL,'💊','Health and Fitness',10,1),(11,'Dental',NULL,'🦷','Health and Fitness',11,1),(12,'ENT Clinic',NULL,'👂','Health and Fitness',12,1),(13,'Plumber',NULL,'🔧','Home Services',13,1),(14,'Electrician',NULL,'💡','Home Services',14,1),(15,'Painter',NULL,'👩‍🎨','Home Services',15,1),(16,'AC Service',NULL,'❄️','Home Services',16,1),(17,'IT Company',NULL,'👩‍💻','Professional Services',17,1),(18,'Software',NULL,'💻','Professional Services',18,1),(19,'CCTV',NULL,'📹','Professional Services',19,1),(20,'Tax Consultant',NULL,'📊','Professional Services',20,1),(21,'IT Company',3,'🎁','Health and fitness',0,1),(22,'Mobile Apps',8,'🍔','',0,1),(23,'Restaurant',2,'🎁','',0,1);
/*!40000 ALTER TABLE `business_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_clients`
--

DROP TABLE IF EXISTS `business_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `logo` varchar(500) DEFAULT NULL,
  `website` varchar(500) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  CONSTRAINT `business_clients_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_clients`
--

LOCK TABLES `business_clients` WRITE;
/*!40000 ALTER TABLE `business_clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_gallery`
--

DROP TABLE IF EXISTS `business_gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_gallery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `image` varchar(500) NOT NULL,
  `caption` varchar(200) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  CONSTRAINT `business_gallery_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_gallery`
--

LOCK TABLES `business_gallery` WRITE;
/*!40000 ALTER TABLE `business_gallery` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_images`
--

DROP TABLE IF EXISTS `business_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `image` varchar(500) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  CONSTRAINT `business_images_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_images`
--

LOCK TABLES `business_images` WRITE;
/*!40000 ALTER TABLE `business_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_reels`
--

DROP TABLE IF EXISTS `business_reels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_reels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `video_url` varchar(1000) NOT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  CONSTRAINT `business_reels_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_reels`
--

LOCK TABLES `business_reels` WRITE;
/*!40000 ALTER TABLE `business_reels` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_reels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_services`
--

DROP TABLE IF EXISTS `business_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  CONSTRAINT `business_services_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_services`
--

LOCK TABLES `business_services` WRITE;
/*!40000 ALTER TABLE `business_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_sub_categories`
--

DROP TABLE IF EXISTS `business_sub_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_sub_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  CONSTRAINT `business_sub_categories_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_sub_categories`
--

LOCK TABLES `business_sub_categories` WRITE;
/*!40000 ALTER TABLE `business_sub_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_sub_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_testimonials`
--

DROP TABLE IF EXISTS `business_testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_testimonials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `client_name` varchar(200) NOT NULL,
  `client_photo` varchar(500) DEFAULT NULL,
  `client_company` varchar(200) DEFAULT NULL,
  `rating` tinyint(4) DEFAULT 5,
  `review` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  CONSTRAINT `business_testimonials_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_testimonials`
--

LOCK TABLES `business_testimonials` WRITE;
/*!40000 ALTER TABLE `business_testimonials` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_videos`
--

DROP TABLE IF EXISTS `business_videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `video_url` varchar(1000) NOT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `video_type` enum('youtube','vimeo','upload') DEFAULT 'youtube',
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  CONSTRAINT `business_videos_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_videos`
--

LOCK TABLES `business_videos` WRITE;
/*!40000 ALTER TABLE `business_videos` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_videos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `businesses`
--

DROP TABLE IF EXISTS `businesses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `businesses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 0.0,
  `distance` varchar(50) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `whatsapp` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `logo` varchar(500) DEFAULT NULL,
  `tagline` varchar(300) DEFAULT NULL,
  `about` text DEFAULT NULL,
  `established_year` year(4) DEFAULT NULL,
  `employees` varchar(50) DEFAULT NULL,
  `website` varchar(500) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `facebook` varchar(500) DEFAULT NULL,
  `instagram` varchar(500) DEFAULT NULL,
  `twitter` varchar(500) DEFAULT NULL,
  `youtube` varchar(500) DEFAULT NULL,
  `linkedin` varchar(500) DEFAULT NULL,
  `map_embed` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `emirate` varchar(100) DEFAULT NULL,
  `opening_time` varchar(20) DEFAULT NULL,
  `closing_time` varchar(20) DEFAULT NULL,
  `holiday` varchar(255) DEFAULT NULL,
  `snapchat` varchar(255) DEFAULT NULL,
  `tiktok` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `businesses_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `business_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `businesses`
--

LOCK TABLES `businesses` WRITE;
/*!40000 ALTER TABLE `businesses` DISABLE KEYS */;
INSERT INTO `businesses` VALUES (1,'Dubai Tours Company',1,'Tours Company\r\nFast-paced energetic video showing a 48-hour website creation challenge.\r\nScene 1: Countdown timer starting from 48:00 hours.\r\nScene 2: Designer working on laptop, fast typing, UI design appearing on screen.','dubai_tours.jpg',4.7,'12 Kms Away','Panampilly Nagar, Erna...','+971500000000','+971500000000',1,'2026-04-13 21:02:17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(2,'Safary Tours',1,'Tours Company','safary_tours.jpg',4.7,'12 Kms Away','Panampilly Nagar, Erna...','+971500000000','+971500000000',1,'2026-04-13 21:02:17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(3,'Dream Car Dubai',1,'Rental Car Company','dream_car.jpg',4.7,'12 Kms Away','Panampilly Nagar, Erna...','+971500000000','+971500000000',1,'2026-04-13 21:02:17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `businesses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classified_categories`
--

DROP TABLE IF EXISTS `classified_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `classified_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classified_categories`
--

LOCK TABLES `classified_categories` WRITE;
/*!40000 ALTER TABLE `classified_categories` DISABLE KEYS */;
INSERT INTO `classified_categories` VALUES (1,'Used Mobiles','📱',1,1),(2,'Used Electronics','💻',2,1),(3,'Used Furniture','🪑',3,1),(4,'Used Toys','🧸',4,1),(5,'Used Cars','🚗',5,1),(6,'Used Bikes','🏍️',6,1),(7,'Used Spare Parts','🔧',7,1),(8,'Used TV','📺',8,1);
/*!40000 ALTER TABLE `classified_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classified_sections`
--

DROP TABLE IF EXISTS `classified_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `classified_sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classified_sections`
--

LOCK TABLES `classified_sections` WRITE;
/*!40000 ALTER TABLE `classified_sections` DISABLE KEYS */;
INSERT INTO `classified_sections` VALUES (1,'Real Estate',1,1),(2,'Furniture',2,1),(3,'Electronics',3,1);
/*!40000 ALTER TABLE `classified_sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classifieds`
--

DROP TABLE IF EXISTS `classifieds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `classifieds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'AED',
  `category_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `age` varchar(50) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `warranty` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `condition_status` varchar(50) DEFAULT NULL,
  `version` varchar(100) DEFAULT NULL,
  `storage` varchar(100) DEFAULT NULL,
  `memory` varchar(100) DEFAULT NULL,
  `battery_health` varchar(50) DEFAULT NULL,
  `accompaniments` varchar(200) DEFAULT NULL,
  `carrier_lock` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `classifieds_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `classified_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `classifieds_ibfk_2` FOREIGN KEY (`section_id`) REFERENCES `classified_sections` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classifieds`
--

LOCK TABLES `classifieds` WRITE;
/*!40000 ALTER TABLE `classifieds` DISABLE KEYS */;
INSERT INTO `classifieds` VALUES (1,'Samsung s25 Ultra','Thinner design, greater choice. Galaxy S25 and S25+ both feature our most powerful, custom-made processor, optimized battery life and our most innovative AI.',2000.00,'AED',1,3,'samsung_s25.jpg','Al Nahda, Dubai','1 Year','s25','Yes','Grey','Samsung','New',NULL,'128 GB','8 GB and more','Above 85%','Box, Charger','No',1,'2026-04-13 21:02:17'),(2,'iPhone 15 Pro Max','Latest Apple flagship with A17 Pro chip.',3500.00,'AED',1,3,'iphone15.jpg','Al Nahda, Dubai','6 Months','15 Pro Max','Yes','Blue','Apple','New',NULL,'256 GB','8 GB','Above 90%','Box, Charger, Cable','No',1,'2026-04-13 21:02:17'),(3,'Luxury Villa','Beautiful 4-bedroom villa in prime location.',36000.00,'AED',NULL,1,'villa1.jpg','Dubai Marina',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-04-13 21:02:17'),(4,'Modern Apartment','Fully furnished 2-bedroom apartment.',36000.00,'AED',NULL,1,'apartment1.jpg','Downtown Dubai',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-04-13 21:02:17'),(5,'Leather Sofa Set','Premium leather sofa set, 3+2 seater.',36000.00,'AED',3,2,'sofa1.jpg','Deira, Dubai',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-04-13 21:02:17'),(6,'Office Chair','Ergonomic office chair with lumbar support.',36000.00,'AED',3,2,'chair1.jpg','Deira, Dubai',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-04-13 21:02:17');
/*!40000 ALTER TABLE `classifieds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `company` varchar(200) DEFAULT NULL,
  `company_logo` varchar(500) DEFAULT NULL,
  `salary_min` decimal(10,2) DEFAULT NULL,
  `salary_max` decimal(10,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'AED',
  `location` varchar(200) DEFAULT NULL,
  `job_type` enum('Fulltime','Part Time','Contract','Freelance') DEFAULT 'Fulltime',
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `benefits` text DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `posted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,'Arabic Teacher','Blems Education',NULL,1000.00,3000.00,'AED','Dubai, UAE','Fulltime','We\'re looking for a skilled DevOps Engineer to help streamline our deployment processes and maintain our cloud infrastructure.','3+ years of DevOps or infrastructure experience\nExperience with AWS, Azure, or Google Cloud\nProficiency in Docker and Kubernetes\nKnowledge of CI/CD tools (Jenkins, GitLab CI)\nExperience with infrastructure as Code (Terraform)\nUnderstanding of monitoring and logging tools\nScripting skills in Python or Bash','Competitive salary rates\nOpportunity for full-time conversion\nRemote work flexibility\nAccess to cutting-edge technologies\nCollaborative team environment\nProfessional development support\nFlexible schedule',1,1,'2026-04-13 21:02:17'),(2,'Web Developer','Smart Technologies',NULL,2000.00,5000.00,'AED','Dubai, UAE','Part Time','Looking for an experienced web developer to join our team.','3+ years of web development experience\nProficiency in PHP, JavaScript\nExperience with MySQL\nKnowledge of modern frameworks','Competitive salary\nFlexible hours\nRemote work options',1,1,'2026-04-13 21:02:17'),(3,'Marketing Manager','Digital Corp',NULL,3000.00,6000.00,'AED','Abu Dhabi, UAE','Contract','We need a marketing manager to lead our digital campaigns.','5+ years of marketing experience\nDigital marketing expertise\nTeam leadership skills','Great benefits package\nProfessional growth\nTeam events',1,1,'2026-04-13 21:02:17');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `main_categories`
--

DROP TABLE IF EXISTS `main_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `main_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `link` varchar(500) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `main_categories`
--

LOCK TABLES `main_categories` WRITE;
/*!40000 ALTER TABLE `main_categories` DISABLE KEYS */;
INSERT INTO `main_categories` VALUES (1,'Shopping','🛍️',NULL,1,1),(2,'Food','🍔',NULL,2,1),(3,'Health','❤️',NULL,3,1),(4,'Education','🎓',NULL,4,1),(5,'Cafe','☕',NULL,5,1),(6,'Colleges','🏫',NULL,6,1),(7,'Malls','🏬',NULL,7,1),(8,'IT Company','🍔','',0,1);
/*!40000 ALTER TABLE `main_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offer_reviews`
--

DROP TABLE IF EXISTS `offer_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `offer_reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `offer_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_name` varchar(150) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 5.0,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `offer_id` (`offer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offer_reviews`
--

LOCK TABLES `offer_reviews` WRITE;
/*!40000 ALTER TABLE `offer_reviews` DISABLE KEYS */;
INSERT INTO `offer_reviews` VALUES (1,1,NULL,'Sarah A.',5.0,'Amazing experience! Our guide was super friendly and knowledgeable.','2026-04-21 14:56:38'),(2,1,NULL,'Mohammed K.',4.5,'Great tour, well organised. Would definitely book again.','2026-04-21 14:56:38'),(3,2,NULL,'James P.',5.0,'Desert safari was the highlight of our trip!','2026-04-21 14:56:38'),(4,4,NULL,'Lena H.',5.0,'Drove the Lambo for a day - unforgettable!','2026-04-21 14:56:38');
/*!40000 ALTER TABLE `offer_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `offers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `details` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `original_price` decimal(10,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'AED',
  `discount_percent` int(11) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 0.0,
  `emirate` varchar(100) DEFAULT NULL,
  `ranking` int(11) DEFAULT 0,
  `valid_from` date DEFAULT NULL,
  `valid_to` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  KEY `category_id` (`category_id`),
  KEY `emirate` (`emirate`),
  KEY `is_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
INSERT INTO `offers` VALUES (1,1,1,'City Tour Package','Full day Dubai city tour with guide','Explore iconic Dubai landmarks including Burj Khalifa, Dubai Mall, Jumeirah Mosque, Dubai Marina. Pickup & drop off included. English speaking guide. Lunch included.','https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=1000&fit=crop',199.00,299.00,'AED',33,4.7,'Dubai',100,NULL,NULL,1,'2026-04-21 14:50:38'),(2,1,1,'Desert Safari Deluxe','Evening desert safari with BBQ dinner','Dune bashing, camel ride, sand boarding, traditional entertainment, BBQ dinner. 6 hours. Shared / private options.','https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&h=1000&fit=crop',149.00,249.00,'AED',40,4.8,'Dubai',95,NULL,NULL,1,'2026-04-21 14:50:38'),(3,2,1,'Abu Dhabi Day Trip','Grand Mosque + Louvre from Dubai','Visit Sheikh Zayed Grand Mosque, Louvre Abu Dhabi, Ferrari World photo stop. Full day. Lunch included.','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1000&fit=crop',249.00,349.00,'AED',29,4.6,'Dubai',80,NULL,NULL,1,'2026-04-21 14:50:38'),(4,3,1,'Luxury Sports Car Rental','Drive your dream ride for a day','Huge fleet of Lamborghini, Ferrari, Rolls Royce. Daily / weekly rates. Free delivery across Dubai.','https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=1000&fit=crop',899.00,1299.00,'AED',31,4.9,'Dubai',90,NULL,NULL,1,'2026-04-21 14:50:38'),(5,1,1,'Arabic Mezze Platter','Traditional mezze for 2 with hummus, fattoush & more','Full spread of hummus, mutabbal, fattoush, tabbouleh, falafel, warm bread. Serves 2 people. Ideal for a light lunch or starter.','https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=1000&fit=crop',79.00,120.00,'AED',34,4.8,'Dubai',88,NULL,NULL,1,'2026-04-21 21:30:46'),(6,2,1,'Grilled Seafood Combo','Fresh catch of the day grilled to perfection','Choice of hammour, shrimp or mixed grill. Served with rice, salad and garlic sauce. Catch changes daily.','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=1000&fit=crop',149.00,199.00,'AED',25,4.7,'Dubai',85,NULL,NULL,1,'2026-04-21 21:30:46'),(7,3,1,'Shawarma Family Box','10 wraps + fries + 4 drinks bundle','Chicken or mixed shawarma wraps made fresh to order. Includes large fries, garlic sauce, pickles and 4 soft drinks.','https://images.unsplash.com/photo-1561651188-d207bbec4ec3?w=800&h=1000&fit=crop',99.00,140.00,'AED',29,4.6,'Dubai',82,NULL,NULL,1,'2026-04-21 21:30:46'),(8,1,1,'Breakfast Feast','Full English + Arabic breakfast combined','Eggs your way, beans, sausage, labneh, olives, cheese, croissant, orange juice. Best way to start your day.','https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&h=1000&fit=crop',55.00,75.00,'AED',27,4.9,'Dubai',78,NULL,NULL,1,'2026-04-21 21:30:46'),(9,2,1,'Manakish & Coffee Deal','Freshly baked manakish with specialty coffee','Choose any manakish ù zaatar, cheese or mixed ù paired with a specialty latte or cappuccino. Perfect morning combo.','https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=1000&fit=crop',35.00,50.00,'AED',30,4.5,'Dubai',75,NULL,NULL,1,'2026-04-21 21:30:46'),(10,1,NULL,'Burger Offer','Shavarma with fruit lassi','','1777312182183.png',10.00,NULL,'',NULL,0.0,'Dubai',0,'2026-03-31','2026-04-29',0,'2026-04-27 17:31:01');
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(100) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` text DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES (1,'about','About Us','SMARTUAE is your go-to business directory in the UAE.',NULL,1,'2026-04-13 21:02:17'),(2,'contact','Contact Us','Get in touch with us for any inquiries.',NULL,1,'2026-04-13 21:02:17'),(3,'privacy','Privacy Policy','Your privacy is important to us.',NULL,1,'2026-04-13 21:02:17'),(4,'terms','Terms & Conditions','Please read our terms and conditions.',NULL,1,'2026-04-13 21:02:17');
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `popular_categories`
--

DROP TABLE IF EXISTS `popular_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `popular_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `link` varchar(500) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `popular_categories`
--

LOCK TABLES `popular_categories` WRITE;
/*!40000 ALTER TABLE `popular_categories` DISABLE KEYS */;
INSERT INTO `popular_categories` VALUES (1,'Car Rental','car_rental.jpg',NULL,1,1),(2,'Tours & Travels','tours.jpg',NULL,2,1);
/*!40000 ALTER TABLE `popular_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES (1,'site_name','SMARTUAE','2026-04-13 21:02:17'),(2,'site_tagline','Your Smart Business Directory','2026-04-13 21:02:17'),(3,'contact_phone','+971 50 000 0000','2026-04-13 21:02:17'),(4,'contact_email','info@smartuae.com','2026-04-13 21:02:17'),(5,'whatsapp','+971500000000','2026-04-13 21:02:17');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sliders`
--

DROP TABLE IF EXISTS `sliders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sliders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `subtitle` varchar(200) DEFAULT NULL,
  `button_text` varchar(100) DEFAULT NULL,
  `button_link` varchar(500) DEFAULT NULL,
  `image` varchar(500) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `business_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sliders`
--

LOCK TABLES `sliders` WRITE;
/*!40000 ALTER TABLE `sliders` DISABLE KEYS */;
INSERT INTO `sliders` VALUES (3,'Pan Furnitures','','Explore','','69e74a1c96a04.jpg',0,1,'2026-04-13 21:10:11',NULL),(4,'Jetour UAE','','Explore','','69e74a135657c.jpg',0,1,'2026-04-13 21:28:33',NULL),(5,'Malabar Gold','','Explore','http://smatflix.ae/','69e74a3d4c525.png',0,1,'2026-04-21 09:58:21',0),(6,'Damac Properties','','Explore','','69e74a5b56655.png',0,1,'2026-04-21 09:58:51',3);
/*!40000 ALTER TABLE `sliders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_profiles`
--

DROP TABLE IF EXISTS `user_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_profiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(200) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `photo` varchar(500) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `whatsapp` varchar(50) DEFAULT NULL,
  `linkedin` varchar(500) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `experience_years` int(11) DEFAULT 0,
  `education` varchar(500) DEFAULT NULL,
  `current_company` varchar(200) DEFAULT NULL,
  `work_experience` text DEFAULT NULL,
  `technical_skills` text DEFAULT NULL,
  `certifications` text DEFAULT NULL,
  `education_details` text DEFAULT NULL,
  `projects` text DEFAULT NULL,
  `languages` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profiles`
--

LOCK TABLES `user_profiles` WRITE;
/*!40000 ALTER TABLE `user_profiles` DISABLE KEYS */;
INSERT INTO `user_profiles` VALUES (1,'Abdul Jabbar','Experts in Digital Marketing, Web Design, App Design','69deb1b8de5f1.jpg','','+919516717777','','','',5,'Bed @ Kerala University','Smartflix Technologies','Web Designer | Smart Technologies | Jan 2020 - Jan 2024 | Bangalore, India\r\nWeb Designer | Smart Technologies | Jan 2020 - Jan 2024 | Bangalore, India\r\nWeb Designer | Smart Technologies | Jan 2020 - Jan 2024 | Bangalore, India','HTML, CSS, Microsoft Office','Google Ads, Adilab Institute, 2022','Btech @ Kerala University, Kerala, India | 2001-2004\r\nPUC @ Kerala University, Kerala, India | 2001-2004','Mobile App Development - Developed and involved in a mobile app project.','English, Hindi, Malayalam, Arabic',1,'2026-04-13 21:02:17');
/*!40000 ALTER TABLE `user_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-27 22:56:29
