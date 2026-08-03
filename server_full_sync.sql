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
) ENGINE=InnoDB AUTO_INCREMENT=210 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_categories`
--

LOCK TABLES `business_categories` WRITE;
/*!40000 ALTER TABLE `business_categories` DISABLE KEYS */;
INSERT INTO `business_categories` VALUES (1,'Giftshop',13,'🎁','Wholesale & Retail Stores',1,1),(5,'Clinic',17,'🩺','Health, Beauty & Wellness',5,1),(25,'Restaurants',9,'🍴','Food & Dining',1,1),(26,'Cafés',9,'☕','Food & Dining',2,1),(27,'Fast Food',9,'🍔','Food & Dining',3,1),(28,'Bakeries',9,'🥐','Food & Dining',4,1),(29,'Catering',9,'🧑‍🍳','Food & Dining',5,1),(30,'Cloud Kitchens',9,'🍱','Food & Dining',6,1),(31,'Food Trucks',9,'🚚','Food & Dining',7,1),(32,'Juice Shops',9,'🧃','Food & Dining',8,1),(33,'Sweet Shops',9,'🍬','Food & Dining',9,1),(34,'Shopping Malls',10,'🏬','Malls & Shopping Centres',1,1),(35,'Community Malls',10,'🛍️','Malls & Shopping Centres',2,1),(36,'Shopping Centres',10,'🛒','Malls & Shopping Centres',3,1),(37,'Retail Complexes',10,'🏢','Malls & Shopping Centres',4,1),(38,'Outlet Malls',10,'🏷️','Malls & Shopping Centres',5,1),(39,'Souks',10,'🏪','Malls & Shopping Centres',6,1),(40,'Hypermarkets',11,'🛒','Hypermarkets & Supermarkets',1,1),(41,'Supermarkets',11,'🛍️','Hypermarkets & Supermarkets',2,1),(42,'Grocery Stores',11,'🥦','Hypermarkets & Supermarkets',3,1),(43,'Organic Food Stores',11,'🌿','Hypermarkets & Supermarkets',4,1),(44,'Convenience Stores',11,'🏪','Hypermarkets & Supermarkets',5,1),(45,'Mini-Marts',11,'🧺','Hypermarkets & Supermarkets',6,1),(46,'Discount Centres',12,'🏷️','Discount & Department Stores',1,1),(47,'Department Stores',12,'🏬','Discount & Department Stores',2,1),(48,'Variety Stores',12,'🎁','Discount & Department Stores',3,1),(49,'Factory Outlets',12,'🏭','Discount & Department Stores',4,1),(50,'Clearance Stores',12,'📉','Discount & Department Stores',5,1),(51,'Budget Stores',12,'💰','Discount & Department Stores',6,1),(52,'Fashion',13,'👗','Wholesale & Retail Stores',1,1),(53,'Electronics',13,'💻','Wholesale & Retail Stores',2,1),(54,'Mobile Shops',13,'📱','Wholesale & Retail Stores',3,1),(55,'Jewellery',13,'💎','Wholesale & Retail Stores',4,1),(56,'Furniture',13,'🛋️','Wholesale & Retail Stores',5,1),(57,'Perfumes',13,'🌸','Wholesale & Retail Stores',6,1),(58,'Gifts',13,'🎁','Wholesale & Retail Stores',7,1),(59,'Baby Products',13,'🍼','Wholesale & Retail Stores',8,1),(60,'Sports Equipment',13,'⚽','Wholesale & Retail Stores',9,1),(61,'Real Estate Agencies',14,'🏘️','Property & Real Estate',1,1),(62,'Property Developers',14,'🏗️','Property & Real Estate',2,1),(63,'Property Management',14,'🔑','Property & Real Estate',3,1),(64,'Real Estate Consultants',14,'🤝','Property & Real Estate',4,1),(65,'Commercial Properties',14,'🏢','Property & Real Estate',5,1),(66,'Holiday Homes',14,'🏖️','Property & Real Estate',6,1),(67,'Cleaning',15,'🧹','Maintenance & Home Services',1,1),(68,'Plumbing',15,'🚰','Maintenance & Home Services',2,1),(69,'Electrical Work',15,'⚡','Maintenance & Home Services',3,1),(70,'AC Repair',15,'❄️','Maintenance & Home Services',4,1),(71,'Painting',15,'🎨','Maintenance & Home Services',5,1),(72,'Carpentry',15,'🪚','Maintenance & Home Services',6,1),(73,'Pest Control',15,'🐜','Maintenance & Home Services',7,1),(74,'Landscaping',15,'🌳','Maintenance & Home Services',8,1),(75,'Handyman Services',15,'🔧','Maintenance & Home Services',9,1),(76,'New Car Dealers',16,'🚘','Automotive',1,1),(77,'Used Car Dealers',16,'🚙','Automotive',2,1),(78,'Car Rentals',16,'🔑','Automotive',3,1),(79,'Garages',16,'🔧','Automotive',4,1),(80,'Car Wash',16,'🧽','Automotive',5,1),(81,'Spare Parts',16,'⚙️','Automotive',6,1),(82,'Tyres',16,'🛞','Automotive',7,1),(83,'Auto Accessories',16,'🎛️','Automotive',8,1),(84,'Vehicle Recovery',16,'🚛','Automotive',9,1),(85,'Hospitals',17,'🏥','Health, Beauty & Wellness',1,1),(86,'Clinics',17,'🩺','Health, Beauty & Wellness',2,1),(87,'Pharmacies',17,'💊','Health, Beauty & Wellness',3,1),(88,'Dental Clinics',17,'🦷','Health, Beauty & Wellness',4,1),(89,'Laboratories',17,'🧪','Health, Beauty & Wellness',5,1),(90,'Beauty Salons',17,'💇‍♀️','Health, Beauty & Wellness',6,1),(91,'Barbershops',17,'💈','Health, Beauty & Wellness',7,1),(92,'Spas',17,'💆','Health, Beauty & Wellness',8,1),(93,'Fitness Centres',17,'🏋️','Health, Beauty & Wellness',9,1),(94,'Yoga Studios',17,'🧘','Health, Beauty & Wellness',10,1),(95,'Schools',18,'🏫','Education & Training',1,1),(96,'Nurseries',18,'🧸','Education & Training',2,1),(97,'Universities',18,'🎓','Education & Training',3,1),(98,'Tuition Centres',18,'📚','Education & Training',4,1),(99,'Training Institutes',18,'🧑‍🏫','Education & Training',5,1),(100,'Driving Schools',18,'🚘','Education & Training',6,1),(101,'Language Centres',18,'🗣️','Education & Training',7,1),(102,'Online Courses',18,'💻','Education & Training',8,1),(103,'Software Companies',19,'💻','Technology & Digital Services',1,1),(104,'App Development',19,'📱','Technology & Digital Services',2,1),(105,'Website Design',19,'🌐','Technology & Digital Services',3,1),(106,'IT Support',19,'🛠️','Technology & Digital Services',4,1),(107,'Cybersecurity',19,'🛡️','Technology & Digital Services',5,1),(108,'Cloud Services',19,'☁️','Technology & Digital Services',6,1),(109,'AI Solutions',19,'🤖','Technology & Digital Services',7,1),(110,'Computer Shops',19,'🖥️','Technology & Digital Services',8,1),(111,'Travel Agencies',20,'✈️','Travel, Tourism & Accommodation',1,1),(112,'Tour Operators',20,'🗺️','Travel, Tourism & Accommodation',2,1),(113,'Visa Services',20,'🛂','Travel, Tourism & Accommodation',3,1),(114,'Ticketing',20,'🎫','Travel, Tourism & Accommodation',4,1),(115,'Hotels',20,'🏨','Travel, Tourism & Accommodation',5,1),(116,'Resorts',20,'🌴','Travel, Tourism & Accommodation',6,1),(117,'Hotel Apartments',20,'🏢','Travel, Tourism & Accommodation',7,1),(118,'Holiday Homes',20,'🏡','Travel, Tourism & Accommodation',8,1),(119,'Desert Safaris',20,'🐪','Travel, Tourism & Accommodation',9,1),(120,'Yacht Rentals',20,'🛥️','Travel, Tourism & Accommodation',10,1),(121,'Business Setup',21,'🏢','Professional & Business Services',1,1),(122,'PRO Services',21,'🪪','Professional & Business Services',2,1),(123,'Management Consultancy',21,'📊','Professional & Business Services',3,1),(124,'Recruitment',21,'👥','Professional & Business Services',4,1),(125,'Translation',21,'🌐','Professional & Business Services',5,1),(126,'Typing Centres',21,'⌨️','Professional & Business Services',6,1),(127,'Document Clearing',21,'📄','Professional & Business Services',7,1),(128,'Corporate Services',21,'🤝','Professional & Business Services',8,1),(129,'Accounting',22,'🧾','Finance, Legal & Insurance',1,1),(130,'Auditing',22,'📊','Finance, Legal & Insurance',2,1),(131,'Tax Consultancy',22,'🧮','Finance, Legal & Insurance',3,1),(132,'Legal Services',22,'⚖️','Finance, Legal & Insurance',4,1),(133,'Insurance Brokers',22,'🛡️','Finance, Legal & Insurance',5,1),(134,'Financial Consultants',22,'💹','Finance, Legal & Insurance',6,1),(135,'Mortgage Advisors',22,'🏦','Finance, Legal & Insurance',7,1),(136,'Building Contractors',23,'🏗️','Construction & Contracting',1,1),(137,'Civil Works',23,'🚧','Construction & Contracting',2,1),(138,'MEP Services',23,'⚙️','Construction & Contracting',3,1),(139,'Interior Fit-Out',23,'🏠','Construction & Contracting',4,1),(140,'Building Materials',23,'🧱','Construction & Contracting',5,1),(141,'Equipment Rental',23,'🚜','Construction & Contracting',6,1),(142,'Aluminium and Glass Works',23,'🪟','Construction & Contracting',7,1),(143,'Courier Services',24,'📦','Logistics & Transportation',1,1),(144,'Cargo Companies',24,'🚢','Logistics & Transportation',2,1),(145,'Freight Forwarding',24,'🚛','Logistics & Transportation',3,1),(146,'Warehousing',24,'🏭','Logistics & Transportation',4,1),(147,'Moving Companies',24,'📦','Logistics & Transportation',5,1),(148,'Delivery Services',24,'🛵','Logistics & Transportation',6,1),(149,'Bus Rentals',24,'🚌','Logistics & Transportation',7,1),(150,'Limousine Rentals',24,'🚖','Logistics & Transportation',8,1),(151,'Security Companies',25,'👮','Security, Safety & Fire Protection',1,1),(152,'Security Guards',25,'💂','Security, Safety & Fire Protection',2,1),(153,'CCTV Systems',25,'📹','Security, Safety & Fire Protection',3,1),(154,'Access Control',25,'🔐','Security, Safety & Fire Protection',4,1),(155,'Event Security',25,'🛡️','Security, Safety & Fire Protection',5,1),(156,'Fire Equipment',25,'🧯','Security, Safety & Fire Protection',6,1),(157,'PPE Suppliers',25,'🦺','Security, Safety & Fire Protection',7,1),(158,'Safety Equipment',25,'⛑️','Security, Safety & Fire Protection',8,1),(159,'Fire Alarms',25,'🚨','Security, Safety & Fire Protection',9,1),(160,'Gas Detectors',25,'☢️','Security, Safety & Fire Protection',10,1),(161,'Safety Signage',25,'⚠️','Security, Safety & Fire Protection',11,1),(162,'Event Management',26,'🎪','Events & Celebrations',1,1),(163,'Wedding Planners',26,'💍','Events & Celebrations',2,1),(164,'Birthday Planners',26,'🎂','Events & Celebrations',3,1),(165,'Event Decorators',26,'🎈','Events & Celebrations',4,1),(166,'Party Halls',26,'🏛️','Events & Celebrations',5,1),(167,'DJs',26,'🎧','Events & Celebrations',6,1),(168,'Catering',26,'🍽️','Events & Celebrations',7,1),(169,'Sound Rental',26,'🔊','Events & Celebrations',8,1),(170,'Lighting Rental',26,'💡','Events & Celebrations',9,1),(171,'Radio Jockeys',27,'📻','Media & Entertainment',1,1),(172,'Video Jockeys',27,'📺','Media & Entertainment',2,1),(173,'TV Presenters',27,'🎙️','Media & Entertainment',3,1),(174,'News Anchors',27,'📰','Media & Entertainment',4,1),(175,'Actors',27,'🎭','Media & Entertainment',5,1),(176,'Models',27,'📸','Media & Entertainment',6,1),(177,'Singers',27,'🎤','Media & Entertainment',7,1),(178,'Musicians',27,'🎸','Media & Entertainment',8,1),(179,'Comedians',27,'😂','Media & Entertainment',9,1),(180,'Production Houses',27,'🎬','Media & Entertainment',10,1),(181,'Vloggers',28,'📹','Content Creators & Influencers',1,1),(182,'Bloggers',28,'✍️','Content Creators & Influencers',2,1),(183,'Podcasters',28,'🎙️','Content Creators & Influencers',3,1),(184,'Social-Media Influencers',28,'📱','Content Creators & Influencers',4,1),(185,'Food Creators',28,'🍜','Content Creators & Influencers',5,1),(186,'Travel Creators',28,'✈️','Content Creators & Influencers',6,1),(187,'Lifestyle Creators',28,'🌟','Content Creators & Influencers',7,1),(188,'Tech Reviewers',28,'💻','Content Creators & Influencers',8,1),(189,'Gaming Streamers',28,'🎮','Content Creators & Influencers',9,1),(190,'General Physicians',29,'🩺','Doctors & Specialists',1,1),(191,'Pediatricians',29,'🧒','Doctors & Specialists',2,1),(192,'Cardiologists',29,'❤️','Doctors & Specialists',3,1),(193,'Orthopaedic Doctors',29,'🦴','Doctors & Specialists',4,1),(194,'Neurologists',29,'🧠','Doctors & Specialists',5,1),(195,'Ophthalmologists',29,'👁️','Doctors & Specialists',6,1),(196,'ENT Specialists',29,'👂','Doctors & Specialists',7,1),(197,'Dentists',29,'🦷','Doctors & Specialists',8,1),(198,'Dermatologists',29,'🧴','Doctors & Specialists',9,1),(199,'Gynaecologists',29,'🤰','Doctors & Specialists',10,1),(200,'Pulmonologists',29,'🫁','Doctors & Specialists',11,1),(201,'Gastroenterologists',29,'🍽️','Doctors & Specialists',12,1),(202,'Endocrinologists',29,'🩸','Doctors & Specialists',13,1),(203,'Psychiatrists',29,'🧠','Doctors & Specialists',14,1),(204,'Psychologists',29,'🧑‍⚕️','Doctors & Specialists',15,1),(205,'Radiologists',29,'🩻','Doctors & Specialists',16,1),(206,'Pathologists',29,'🔬','Doctors & Specialists',17,1),(207,'Dietitians & Nutritionists',29,'🥗','Doctors & Specialists',18,1),(208,'Physiotherapists',29,'🏃','Doctors & Specialists',19,1),(209,'Online Doctor Consultations',29,'💻','Doctors & Specialists',20,1);
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
-- Table structure for table `business_views`
--

DROP TABLE IF EXISTS `business_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_views` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `emirate` varchar(100) DEFAULT 'Unknown',
  `count` int(11) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_biz_emirate` (`business_id`,`emirate`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_views`
--

LOCK TABLES `business_views` WRITE;
/*!40000 ALTER TABLE `business_views` DISABLE KEYS */;
INSERT INTO `business_views` VALUES (1,1,'Dubai',57),(2,2,'Dubai',94),(3,3,'Dubai',131),(4,4,'Dubai',168),(8,1,'Abu Dhabi',24),(9,2,'Abu Dhabi',43),(10,3,'Abu Dhabi',62),(11,4,'Abu Dhabi',21);
/*!40000 ALTER TABLE `business_views` ENABLE KEYS */;
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
  `requested_category_name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 0.0,
  `distance` varchar(50) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `whatsapp` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `status` enum('pending','approved','rejected') DEFAULT 'approved',
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
) ENGINE=InnoDB AUTO_INCREMENT=336 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `businesses`
--

LOCK TABLES `businesses` WRITE;
/*!40000 ALTER TABLE `businesses` DISABLE KEYS */;
INSERT INTO `businesses` VALUES (1,'Dubai Tours Company',119,NULL,'Tours Company\r\nFast-paced energetic video showing a 48-hour website creation challenge.\r\nScene 1: Countdown timer starting from 48:00 hours.\r\nScene 2: Designer working on laptop, fast typing, UI design appearing on screen.','dubai_tours.jpg',4.7,'12 Kms Away','Panampilly Nagar, Erna...','+971500000000','+971500000000',1,'approved','2026-04-13 21:02:17','','','',NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai','','',NULL,NULL,NULL),(2,'Safary Tours',111,NULL,'Tours Company','safary_tours.jpg',4.7,'12 Kms Away','Panampilly Nagar, Erna...','+971500000000','+971500000000',1,'approved','2026-04-13 21:02:17','','','',NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai','','',NULL,NULL,NULL),(3,'Dream Car Dubai',78,NULL,'Rental Car Company','dream_car.jpg',4.7,'12 Kms Away','Panampilly Nagar, Erna...','+971500000000','+971500000000',1,'approved','2026-04-13 21:02:17','','','',NULL,NULL,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai','','',NULL,NULL,NULL),(4,'Zoya Flowers',1,NULL,'Flower Shop','',0.0,NULL,'Dubai, UAE','+971559164496','971559164496',1,'approved','2026-06-02 02:59:05','','Flower Shop','',NULL,NULL,'www.gmail.com','jabbarmk@gmail.com',NULL,NULL,NULL,NULL,NULL,NULL,2,'Dubai','','',NULL,NULL,NULL),(5,'Gulf International University',97,NULL,'A leading private university in Dubai with accredited programmes across business, technology and engineering.','uni-1-banner.svg',4.6,NULL,'Academic City, Dubai','+97144005000','971544005000',1,'approved','2026-07-20 14:42:47','uni-1-logo.svg','Shaping future leaders since 1998','Gulf International University is a leading private university in Dubai offering accredited undergraduate and postgraduate programmes across business, technology and engineering.',1998,NULL,'https://giu.example.ae','admissions@giu.ac.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(6,'Emirates University of Technology',97,NULL,'A research-driven institution in Abu Dhabi specialising in computing, AI, healthcare and applied sciences.','1784559950005.png',4.8,NULL,'Masdar City, Abu Dhabi','+97120117000','971521170000',1,'approved','2026-07-20 14:42:47','1784559957461.png','Innovate. Research. Lead.','Emirates University of Technology is a research-driven institution in Abu Dhabi specialising in computing, artificial intelligence, healthcare and applied sciences.',2002,NULL,'https://eut.example.ae','info@eut.ac.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi','','',NULL,NULL,NULL),(7,'Dubai Daily Vlogs',181,NULL,'Daily lifestyle vlogs covering Dubai events, food and culture.','vlog-1-cover.svg',4.8,NULL,'Business Bay, Dubai','+971501112201','971501112201',1,'approved','2026-07-23 15:15:51','vlog-1-logo.svg','Your daily dose of Dubai life','Dubai Daily Vlogs follows the everyday adventures, events and hidden gems of Dubai — from brunches to desert nights.',2019,NULL,'https://youtube.com/@dubaidailyvlogs','hello@dubaidailyvlogs.ae',NULL,'dubaidailyvlogs',NULL,'dubaidailyvlogs',NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,'dubaidailyvlogs'),(8,'Sara Travels UAE',181,NULL,'Travel vlogger sharing UAE staycations and destination guides.','vlog-2-cover.svg',4.9,NULL,'Al Reem Island, Abu Dhabi','+971502223302','971502223302',1,'approved','2026-07-23 15:15:51','vlog-2-logo.svg','Exploring the Emirates & beyond','Sara documents travel guides, staycations and road trips across all seven emirates with tips on where to stay and what to do.',2020,NULL,'https://youtube.com/@saratravels','sara@saratravels.ae',NULL,'saratravelsuae',NULL,'saratravelsuae',NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,'saratravels'),(9,'Bites with Bilal',181,NULL,'Food vlogger and restaurant reviewer covering the UAE dining scene.','vlog-3-cover.svg',4.7,NULL,'JLT, Dubai','+971503334403','971503334403',1,'approved','2026-07-23 15:15:51','vlog-3-logo.svg','Honest food reviews across the UAE','Bilal reviews restaurants, street food and new openings around the UAE with honest ratings and hidden-gem finds.',2021,NULL,'https://youtube.com/@biteswithbilal','bilal@biteswithbilal.ae',NULL,'biteswithbilal',NULL,'biteswithbilal',NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,'biteswithbilal'),(10,'FitLife Dubai',181,NULL,'Fitness and wellness vlogger with workouts and gym reviews.','vlog-4-cover.svg',4.6,NULL,'Al Nahda, Sharjah','+971504445503','971504445503',1,'approved','2026-07-23 15:15:51','vlog-4-logo.svg','Fitness, wellness & motivation','FitLife Dubai shares workout routines, gym reviews, nutrition tips and transformation journeys for the UAE fitness community.',2018,NULL,'https://youtube.com/@fitlifedubai','coach@fitlifedubai.ae',NULL,'fitlifedubai',NULL,'fitlifedubai',NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,'fitlifedubai'),(11,'GameZone Arabia',181,NULL,'Gaming vlogger and streamer covering reviews and esports.','vlog-5-cover.svg',4.8,NULL,'Dubai Internet City, Dubai','+971505556603','971505556603',1,'approved','2026-07-23 15:15:51','vlog-5-logo.svg','Gaming reviews & live streams','GameZone Arabia covers game reviews, esports coverage and live streams with a focus on the regional gaming scene.',2022,NULL,'https://youtube.com/@gamezonearabia','play@gamezonearabia.ae',NULL,'gamezonearabia',NULL,'gamezonearabia',NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,'gamezonearabia'),(12,'City Care Clinic',86,NULL,'Multi-specialty clinic in Dubai.','hosp-1-logo.svg',4.5,NULL,'Al Barsha, Dubai','+97144100001','97144100001',1,'approved','2026-07-23 19:44:54','hosp-1-logo.svg','Trusted family healthcare','City Care Clinic is a leading clinic in Dubai offering multi-specialty care across departments.',NULL,NULL,NULL,'info@citycareclinic.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(13,'Prime Medical Center',86,NULL,'Multi-specialty clinic in Dubai.','hosp-2-logo.svg',4.5,NULL,'Jumeirah, Dubai','+97144100002','97144100002',1,'approved','2026-07-23 19:44:54','hosp-2-logo.svg','Advanced specialist care','Prime Medical Center is a leading clinic in Dubai offering multi-specialty care across departments.',NULL,NULL,NULL,'info@primemedicalcenter.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(14,'Aster Clinic',86,NULL,'Multi-specialty clinic in Sharjah.','hosp-3-logo.svg',4.6,NULL,'Al Nahda, Sharjah','+97165100003','97165100003',1,'approved','2026-07-23 19:44:54','hosp-3-logo.svg','Care you can trust','Aster Clinic is a leading clinic in Sharjah offering multi-specialty care across departments.',NULL,NULL,NULL,'info@asterclinic.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(15,'Emirates Specialty Hospital',85,NULL,'Multi-specialty hospital in Abu Dhabi.','1784879575942.jpg',4.7,NULL,'Corniche, Abu Dhabi','+97124100004','97124100004',1,'approved','2026-07-23 19:44:54','1784879582114.jpg','Excellence in specialty medicine','Emirates Specialty Hospital is a leading hospital in Abu Dhabi offering multi-specialty care across departments.',NULL,NULL,'','info@emiratesspecialtyhospital.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi','','',NULL,NULL,NULL),(16,'Gulf Health Hospital',85,NULL,'Multi-specialty hospital in Dubai.','hosp-5-logo.svg',4.7,NULL,'Deira, Dubai','+97144100005','97144100005',1,'approved','2026-07-23 19:44:54','hosp-5-logo.svg','Compassionate, quality care','Gulf Health Hospital is a leading hospital in Dubai offering multi-specialty care across departments.',NULL,NULL,NULL,'info@gulfhealthhospital.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(17,'Al Noor Medical Centre',86,NULL,'Multi-specialty clinic in Ajman.','1784879474663.png',4.8,NULL,'Al Rashidiya, Ajman','+97167100006','97167100006',1,'approved','2026-07-23 19:44:54','1784879542241.jpg','Your health, our priority','Al Noor Medical Centre is a leading clinic in Ajman offering multi-specialty care across departments.',NULL,NULL,'','info@alnoormedicalcentre.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman','','',NULL,NULL,NULL),(18,'Al Noor Clinic',5,NULL,'Quality clinic in Dubai.','bizcat-5.svg',4.2,NULL,'Business Bay, Dubai','+971510000000','971510000000',1,'approved','2026-07-24 16:07:37','bizcat-5.svg','Trusted Clinic in Dubai','Al Noor Clinic offers quality clinic services in Dubai, UAE.',NULL,NULL,NULL,'info@alnoorclinic.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(19,'Prime Clinic',5,NULL,'Quality clinic in Abu Dhabi.','bizcat-5.svg',4.3,NULL,'Corniche, Abu Dhabi','+971510000037','971510000037',1,'approved','2026-07-24 16:07:37','bizcat-5.svg','Trusted Clinic in Abu Dhabi','Prime Clinic offers quality clinic services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@primeclinic.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(20,'Gulf Restaurants',25,NULL,'Quality restaurants in Abu Dhabi.','bizcat-25.svg',4.3,NULL,'Corniche, Abu Dhabi','+971510000074','971510000074',1,'approved','2026-07-24 16:07:37','bizcat-25.svg','Trusted Restaurants in Abu Dhabi','Gulf Restaurants offers quality restaurants services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@gulfrestaurants.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(21,'Emirates Restaurants',25,NULL,'Quality restaurants in Sharjah.','bizcat-25.svg',4.4,NULL,'Al Nahda, Sharjah','+971510000111','971510000111',1,'approved','2026-07-24 16:07:37','bizcat-25.svg','Trusted Restaurants in Sharjah','Emirates Restaurants offers quality restaurants services in Sharjah, UAE.',NULL,NULL,NULL,'info@emiratesrestaurants.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(22,'Royal Cafés',26,NULL,'Quality cafés in Sharjah.','bizcat-26.svg',4.4,NULL,'Al Nahda, Sharjah','+971510000148','971510000148',1,'approved','2026-07-24 16:07:37','bizcat-26.svg','Trusted Cafés in Sharjah','Royal Cafés offers quality cafés services in Sharjah, UAE.',NULL,NULL,NULL,'info@royalcafs.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(23,'City Cafés',26,NULL,'Quality cafés in Ajman.','bizcat-26.svg',4.5,NULL,'Al Rashidiya, Ajman','+971510000185','971510000185',1,'approved','2026-07-24 16:07:37','bizcat-26.svg','Trusted Cafés in Ajman','City Cafés offers quality cafés services in Ajman, UAE.',NULL,NULL,NULL,'info@citycafs.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(24,'Elite Fast Food',27,NULL,'Quality fast food in Ajman.','bizcat-27.svg',4.5,NULL,'Al Rashidiya, Ajman','+971510000222','971510000222',1,'approved','2026-07-24 16:07:37','bizcat-27.svg','Trusted Fast Food in Ajman','Elite Fast Food offers quality fast food services in Ajman, UAE.',NULL,NULL,NULL,'info@elitefastfood.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(25,'Oasis Fast Food',27,NULL,'Quality fast food in Fujairah.','bizcat-27.svg',4.6,NULL,'City Centre, Fujairah','+971510000259','971510000259',1,'approved','2026-07-24 16:07:37','bizcat-27.svg','Trusted Fast Food in Fujairah','Oasis Fast Food offers quality fast food services in Fujairah, UAE.',NULL,NULL,NULL,'info@oasisfastfood.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(26,'Pearl Bakeries',28,NULL,'Quality bakeries in Fujairah.','bizcat-28.svg',4.6,NULL,'City Centre, Fujairah','+971510000296','971510000296',1,'approved','2026-07-24 16:07:37','bizcat-28.svg','Trusted Bakeries in Fujairah','Pearl Bakeries offers quality bakeries services in Fujairah, UAE.',NULL,NULL,NULL,'info@pearlbakeries.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(27,'Crown Bakeries',28,NULL,'Quality bakeries in Ras Al Khaimah.','bizcat-28.svg',4.7,NULL,'Al Nakheel, Ras Al Khaimah','+971510000333','971510000333',1,'approved','2026-07-24 16:07:37','bizcat-28.svg','Trusted Bakeries in Ras Al Khaimah','Crown Bakeries offers quality bakeries services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@crownbakeries.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(28,'Golden Catering',29,NULL,'Quality catering in Ras Al Khaimah.','bizcat-29.svg',4.7,NULL,'Al Nakheel, Ras Al Khaimah','+971510000370','971510000370',1,'approved','2026-07-24 16:07:37','bizcat-29.svg','Trusted Catering in Ras Al Khaimah','Golden Catering offers quality catering services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@goldencatering.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(29,'Star Catering',29,NULL,'Quality catering in Umm Al Quwain.','bizcat-29.svg',4.8,NULL,'King Faisal Rd, Umm Al Quwain','+971510000407','971510000407',1,'approved','2026-07-24 16:07:37','bizcat-29.svg','Trusted Catering in Umm Al Quwain','Star Catering offers quality catering services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@starcatering.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(30,'Al Noor Cloud Kitchens',30,NULL,'Quality cloud kitchens in Umm Al Quwain.','bizcat-30.svg',4.8,NULL,'King Faisal Rd, Umm Al Quwain','+971510000444','971510000444',1,'approved','2026-07-24 16:07:37','bizcat-30.svg','Trusted Cloud Kitchens in Umm Al Quwain','Al Noor Cloud Kitchens offers quality cloud kitchens services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@alnoorcloudkitchens.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(31,'Prime Cloud Kitchens',30,NULL,'Quality cloud kitchens in Dubai.','bizcat-30.svg',4.9,NULL,'Business Bay, Dubai','+971510000481','971510000481',1,'approved','2026-07-24 16:07:37','bizcat-30.svg','Trusted Cloud Kitchens in Dubai','Prime Cloud Kitchens offers quality cloud kitchens services in Dubai, UAE.',NULL,NULL,NULL,'info@primecloudkitchens.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(32,'Gulf Food Trucks',31,NULL,'Quality food trucks in Dubai.','bizcat-31.svg',4.9,NULL,'Business Bay, Dubai','+971510000518','971510000518',1,'approved','2026-07-24 16:07:37','bizcat-31.svg','Trusted Food Trucks in Dubai','Gulf Food Trucks offers quality food trucks services in Dubai, UAE.',NULL,NULL,NULL,'info@gulffoodtrucks.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(33,'Emirates Food Trucks',31,NULL,'Quality food trucks in Abu Dhabi.','bizcat-31.svg',4.2,NULL,'Corniche, Abu Dhabi','+971510000555','971510000555',1,'approved','2026-07-24 16:07:37','bizcat-31.svg','Trusted Food Trucks in Abu Dhabi','Emirates Food Trucks offers quality food trucks services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@emiratesfoodtrucks.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(34,'Royal Juice Shops',32,NULL,'Quality juice shops in Abu Dhabi.','bizcat-32.svg',4.2,NULL,'Corniche, Abu Dhabi','+971510000592','971510000592',1,'approved','2026-07-24 16:07:37','bizcat-32.svg','Trusted Juice Shops in Abu Dhabi','Royal Juice Shops offers quality juice shops services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@royaljuiceshops.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(35,'City Juice Shops',32,NULL,'Quality juice shops in Sharjah.','bizcat-32.svg',4.3,NULL,'Al Nahda, Sharjah','+971510000629','971510000629',1,'approved','2026-07-24 16:07:37','bizcat-32.svg','Trusted Juice Shops in Sharjah','City Juice Shops offers quality juice shops services in Sharjah, UAE.',NULL,NULL,NULL,'info@cityjuiceshops.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(36,'Elite Sweet Shops',33,NULL,'Quality sweet shops in Sharjah.','bizcat-33.svg',4.3,NULL,'Al Nahda, Sharjah','+971510000666','971510000666',1,'approved','2026-07-24 16:07:37','bizcat-33.svg','Trusted Sweet Shops in Sharjah','Elite Sweet Shops offers quality sweet shops services in Sharjah, UAE.',NULL,NULL,NULL,'info@elitesweetshops.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(37,'Oasis Sweet Shops',33,NULL,'Quality sweet shops in Ajman.','bizcat-33.svg',4.4,NULL,'Al Rashidiya, Ajman','+971510000703','971510000703',1,'approved','2026-07-24 16:07:37','bizcat-33.svg','Trusted Sweet Shops in Ajman','Oasis Sweet Shops offers quality sweet shops services in Ajman, UAE.',NULL,NULL,NULL,'info@oasissweetshops.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(38,'Pearl Shopping Malls',34,NULL,'Quality shopping malls in Ajman.','bizcat-34.svg',4.4,NULL,'Al Rashidiya, Ajman','+971510000740','971510000740',1,'approved','2026-07-24 16:07:37','bizcat-34.svg','Trusted Shopping Malls in Ajman','Pearl Shopping Malls offers quality shopping malls services in Ajman, UAE.',NULL,NULL,NULL,'info@pearlshoppingmalls.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(39,'Crown Shopping Malls',34,NULL,'Quality shopping malls in Fujairah.','bizcat-34.svg',4.5,NULL,'City Centre, Fujairah','+971510000777','971510000777',1,'approved','2026-07-24 16:07:37','bizcat-34.svg','Trusted Shopping Malls in Fujairah','Crown Shopping Malls offers quality shopping malls services in Fujairah, UAE.',NULL,NULL,NULL,'info@crownshoppingmalls.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(40,'Golden Community Malls',35,NULL,'Quality community malls in Fujairah.','bizcat-35.svg',4.5,NULL,'City Centre, Fujairah','+971510000814','971510000814',1,'approved','2026-07-24 16:07:37','bizcat-35.svg','Trusted Community Malls in Fujairah','Golden Community Malls offers quality community malls services in Fujairah, UAE.',NULL,NULL,NULL,'info@goldencommunitymalls.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(41,'Star Community Malls',35,NULL,'Quality community malls in Ras Al Khaimah.','bizcat-35.svg',4.6,NULL,'Al Nakheel, Ras Al Khaimah','+971510000851','971510000851',1,'approved','2026-07-24 16:07:37','bizcat-35.svg','Trusted Community Malls in Ras Al Khaimah','Star Community Malls offers quality community malls services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@starcommunitymalls.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(42,'Al Noor Shopping Centres',36,NULL,'Quality shopping centres in Ras Al Khaimah.','bizcat-36.svg',4.6,NULL,'Al Nakheel, Ras Al Khaimah','+971510000888','971510000888',1,'approved','2026-07-24 16:07:37','bizcat-36.svg','Trusted Shopping Centres in Ras Al Khaimah','Al Noor Shopping Centres offers quality shopping centres services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@alnoorshoppingcentres.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(43,'Prime Shopping Centres',36,NULL,'Quality shopping centres in Umm Al Quwain.','bizcat-36.svg',4.7,NULL,'King Faisal Rd, Umm Al Quwain','+971510000925','971510000925',1,'approved','2026-07-24 16:07:37','bizcat-36.svg','Trusted Shopping Centres in Umm Al Quwain','Prime Shopping Centres offers quality shopping centres services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@primeshoppingcentres.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(44,'Gulf Retail Complexes',37,NULL,'Quality retail complexes in Umm Al Quwain.','bizcat-37.svg',4.7,NULL,'King Faisal Rd, Umm Al Quwain','+971510000962','971510000962',1,'approved','2026-07-24 16:07:37','bizcat-37.svg','Trusted Retail Complexes in Umm Al Quwain','Gulf Retail Complexes offers quality retail complexes services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@gulfretailcomplexes.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(45,'Emirates Retail Complexes',37,NULL,'Quality retail complexes in Dubai.','bizcat-37.svg',4.8,NULL,'Business Bay, Dubai','+971510000999','971510000999',1,'approved','2026-07-24 16:07:37','bizcat-37.svg','Trusted Retail Complexes in Dubai','Emirates Retail Complexes offers quality retail complexes services in Dubai, UAE.',NULL,NULL,NULL,'info@emiratesretailcomplexes.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(46,'Royal Outlet Malls',38,NULL,'Quality outlet malls in Dubai.','bizcat-38.svg',4.8,NULL,'Business Bay, Dubai','+971510001036','971510001036',1,'approved','2026-07-24 16:07:37','bizcat-38.svg','Trusted Outlet Malls in Dubai','Royal Outlet Malls offers quality outlet malls services in Dubai, UAE.',NULL,NULL,NULL,'info@royaloutletmalls.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(47,'City Outlet Malls',38,NULL,'Quality outlet malls in Abu Dhabi.','bizcat-38.svg',4.9,NULL,'Corniche, Abu Dhabi','+971510001073','971510001073',1,'approved','2026-07-24 16:07:37','bizcat-38.svg','Trusted Outlet Malls in Abu Dhabi','City Outlet Malls offers quality outlet malls services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@cityoutletmalls.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(48,'Elite Souks',39,NULL,'Quality souks in Abu Dhabi.','bizcat-39.svg',4.9,NULL,'Corniche, Abu Dhabi','+971510001110','971510001110',1,'approved','2026-07-24 16:07:37','bizcat-39.svg','Trusted Souks in Abu Dhabi','Elite Souks offers quality souks services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@elitesouks.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(49,'Oasis Souks',39,NULL,'Quality souks in Sharjah.','bizcat-39.svg',4.2,NULL,'Al Nahda, Sharjah','+971510001147','971510001147',1,'approved','2026-07-24 16:07:37','bizcat-39.svg','Trusted Souks in Sharjah','Oasis Souks offers quality souks services in Sharjah, UAE.',NULL,NULL,NULL,'info@oasissouks.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(50,'Pearl Hypermarkets',40,NULL,'Quality hypermarkets in Sharjah.','bizcat-40.svg',4.2,NULL,'Al Nahda, Sharjah','+971510001184','971510001184',1,'approved','2026-07-24 16:07:37','bizcat-40.svg','Trusted Hypermarkets in Sharjah','Pearl Hypermarkets offers quality hypermarkets services in Sharjah, UAE.',NULL,NULL,NULL,'info@pearlhypermarkets.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(51,'Crown Hypermarkets',40,NULL,'Quality hypermarkets in Ajman.','bizcat-40.svg',4.3,NULL,'Al Rashidiya, Ajman','+971510001221','971510001221',1,'approved','2026-07-24 16:07:37','bizcat-40.svg','Trusted Hypermarkets in Ajman','Crown Hypermarkets offers quality hypermarkets services in Ajman, UAE.',NULL,NULL,NULL,'info@crownhypermarkets.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(52,'Golden Supermarkets',41,NULL,'Quality supermarkets in Ajman.','bizcat-41.svg',4.3,NULL,'Al Rashidiya, Ajman','+971510001258','971510001258',1,'approved','2026-07-24 16:07:37','bizcat-41.svg','Trusted Supermarkets in Ajman','Golden Supermarkets offers quality supermarkets services in Ajman, UAE.',NULL,NULL,NULL,'info@goldensupermarkets.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(53,'Star Supermarkets',41,NULL,'Quality supermarkets in Fujairah.','bizcat-41.svg',4.4,NULL,'City Centre, Fujairah','+971510001295','971510001295',1,'approved','2026-07-24 16:07:37','bizcat-41.svg','Trusted Supermarkets in Fujairah','Star Supermarkets offers quality supermarkets services in Fujairah, UAE.',NULL,NULL,NULL,'info@starsupermarkets.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(54,'Al Noor Grocery Stores',42,NULL,'Quality grocery stores in Fujairah.','bizcat-42.svg',4.4,NULL,'City Centre, Fujairah','+971510001332','971510001332',1,'approved','2026-07-24 16:07:37','bizcat-42.svg','Trusted Grocery Stores in Fujairah','Al Noor Grocery Stores offers quality grocery stores services in Fujairah, UAE.',NULL,NULL,NULL,'info@alnoorgrocerystores.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(55,'Prime Grocery Stores',42,NULL,'Quality grocery stores in Ras Al Khaimah.','bizcat-42.svg',4.5,NULL,'Al Nakheel, Ras Al Khaimah','+971510001369','971510001369',1,'approved','2026-07-24 16:07:37','bizcat-42.svg','Trusted Grocery Stores in Ras Al Khaimah','Prime Grocery Stores offers quality grocery stores services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@primegrocerystores.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(56,'Gulf Organic Food Stores',43,NULL,'Quality organic food stores in Ras Al Khaimah.','bizcat-43.svg',4.5,NULL,'Al Nakheel, Ras Al Khaimah','+971510001406','971510001406',1,'approved','2026-07-24 16:07:37','bizcat-43.svg','Trusted Organic Food Stores in Ras Al Khaimah','Gulf Organic Food Stores offers quality organic food stores services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@gulforganicfoodstores.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(57,'Emirates Organic Food Stores',43,NULL,'Quality organic food stores in Umm Al Quwain.','bizcat-43.svg',4.6,NULL,'King Faisal Rd, Umm Al Quwain','+971510001443','971510001443',1,'approved','2026-07-24 16:07:37','bizcat-43.svg','Trusted Organic Food Stores in Umm Al Quwain','Emirates Organic Food Stores offers quality organic food stores services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@emiratesorganicfoodstores.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(58,'Royal Convenience Stores',44,NULL,'Quality convenience stores in Umm Al Quwain.','bizcat-44.svg',4.6,NULL,'King Faisal Rd, Umm Al Quwain','+971510001480','971510001480',1,'approved','2026-07-24 16:07:37','bizcat-44.svg','Trusted Convenience Stores in Umm Al Quwain','Royal Convenience Stores offers quality convenience stores services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@royalconveniencestores.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(59,'City Convenience Stores',44,NULL,'Quality convenience stores in Dubai.','bizcat-44.svg',4.7,NULL,'Business Bay, Dubai','+971510001517','971510001517',1,'approved','2026-07-24 16:07:37','bizcat-44.svg','Trusted Convenience Stores in Dubai','City Convenience Stores offers quality convenience stores services in Dubai, UAE.',NULL,NULL,NULL,'info@cityconveniencestores.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(60,'Elite Mini-Marts',45,NULL,'Quality mini-marts in Dubai.','bizcat-45.svg',4.7,NULL,'Business Bay, Dubai','+971510001554','971510001554',1,'approved','2026-07-24 16:07:37','bizcat-45.svg','Trusted Mini-Marts in Dubai','Elite Mini-Marts offers quality mini-marts services in Dubai, UAE.',NULL,NULL,NULL,'info@eliteminimarts.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(61,'Oasis Mini-Marts',45,NULL,'Quality mini-marts in Abu Dhabi.','bizcat-45.svg',4.8,NULL,'Corniche, Abu Dhabi','+971510001591','971510001591',1,'approved','2026-07-24 16:07:37','bizcat-45.svg','Trusted Mini-Marts in Abu Dhabi','Oasis Mini-Marts offers quality mini-marts services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@oasisminimarts.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(62,'Pearl Discount Centres',46,NULL,'Quality discount centres in Abu Dhabi.','bizcat-46.svg',4.8,NULL,'Corniche, Abu Dhabi','+971510001628','971510001628',1,'approved','2026-07-24 16:07:37','bizcat-46.svg','Trusted Discount Centres in Abu Dhabi','Pearl Discount Centres offers quality discount centres services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@pearldiscountcentres.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(63,'Crown Discount Centres',46,NULL,'Quality discount centres in Sharjah.','bizcat-46.svg',4.9,NULL,'Al Nahda, Sharjah','+971510001665','971510001665',1,'approved','2026-07-24 16:07:37','bizcat-46.svg','Trusted Discount Centres in Sharjah','Crown Discount Centres offers quality discount centres services in Sharjah, UAE.',NULL,NULL,NULL,'info@crowndiscountcentres.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(64,'Golden Department Stores',47,NULL,'Quality department stores in Sharjah.','bizcat-47.svg',4.9,NULL,'Al Nahda, Sharjah','+971510001702','971510001702',1,'approved','2026-07-24 16:07:37','bizcat-47.svg','Trusted Department Stores in Sharjah','Golden Department Stores offers quality department stores services in Sharjah, UAE.',NULL,NULL,NULL,'info@goldendepartmentstores.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(65,'Star Department Stores',47,NULL,'Quality department stores in Ajman.','bizcat-47.svg',4.2,NULL,'Al Rashidiya, Ajman','+971510001739','971510001739',1,'approved','2026-07-24 16:07:37','bizcat-47.svg','Trusted Department Stores in Ajman','Star Department Stores offers quality department stores services in Ajman, UAE.',NULL,NULL,NULL,'info@stardepartmentstores.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(66,'Al Noor Variety Stores',48,NULL,'Quality variety stores in Ajman.','bizcat-48.svg',4.2,NULL,'Al Rashidiya, Ajman','+971510001776','971510001776',1,'approved','2026-07-24 16:07:37','bizcat-48.svg','Trusted Variety Stores in Ajman','Al Noor Variety Stores offers quality variety stores services in Ajman, UAE.',NULL,NULL,NULL,'info@alnoorvarietystores.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(67,'Prime Variety Stores',48,NULL,'Quality variety stores in Fujairah.','bizcat-48.svg',4.3,NULL,'City Centre, Fujairah','+971510001813','971510001813',1,'approved','2026-07-24 16:07:37','bizcat-48.svg','Trusted Variety Stores in Fujairah','Prime Variety Stores offers quality variety stores services in Fujairah, UAE.',NULL,NULL,NULL,'info@primevarietystores.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(68,'Gulf Factory Outlets',49,NULL,'Quality factory outlets in Fujairah.','bizcat-49.svg',4.3,NULL,'City Centre, Fujairah','+971510001850','971510001850',1,'approved','2026-07-24 16:07:37','bizcat-49.svg','Trusted Factory Outlets in Fujairah','Gulf Factory Outlets offers quality factory outlets services in Fujairah, UAE.',NULL,NULL,NULL,'info@gulffactoryoutlets.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(69,'Emirates Factory Outlets',49,NULL,'Quality factory outlets in Ras Al Khaimah.','bizcat-49.svg',4.4,NULL,'Al Nakheel, Ras Al Khaimah','+971510001887','971510001887',1,'approved','2026-07-24 16:07:37','bizcat-49.svg','Trusted Factory Outlets in Ras Al Khaimah','Emirates Factory Outlets offers quality factory outlets services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@emiratesfactoryoutlets.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(70,'Royal Clearance Stores',50,NULL,'Quality clearance stores in Ras Al Khaimah.','bizcat-50.svg',4.4,NULL,'Al Nakheel, Ras Al Khaimah','+971510001924','971510001924',1,'approved','2026-07-24 16:07:37','bizcat-50.svg','Trusted Clearance Stores in Ras Al Khaimah','Royal Clearance Stores offers quality clearance stores services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@royalclearancestores.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(71,'City Clearance Stores',50,NULL,'Quality clearance stores in Umm Al Quwain.','bizcat-50.svg',4.5,NULL,'King Faisal Rd, Umm Al Quwain','+971510001961','971510001961',1,'approved','2026-07-24 16:07:37','bizcat-50.svg','Trusted Clearance Stores in Umm Al Quwain','City Clearance Stores offers quality clearance stores services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@cityclearancestores.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(72,'Elite Budget Stores',51,NULL,'Quality budget stores in Umm Al Quwain.','bizcat-51.svg',4.5,NULL,'King Faisal Rd, Umm Al Quwain','+971510001998','971510001998',1,'approved','2026-07-24 16:07:37','bizcat-51.svg','Trusted Budget Stores in Umm Al Quwain','Elite Budget Stores offers quality budget stores services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@elitebudgetstores.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(73,'Oasis Budget Stores',51,NULL,'Quality budget stores in Dubai.','bizcat-51.svg',4.6,NULL,'Business Bay, Dubai','+971510002035','971510002035',1,'approved','2026-07-24 16:07:37','bizcat-51.svg','Trusted Budget Stores in Dubai','Oasis Budget Stores offers quality budget stores services in Dubai, UAE.',NULL,NULL,NULL,'info@oasisbudgetstores.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(74,'Pearl Fashion',52,NULL,'Quality fashion in Dubai.','bizcat-52.svg',4.6,NULL,'Business Bay, Dubai','+971510002072','971510002072',1,'approved','2026-07-24 16:07:37','bizcat-52.svg','Trusted Fashion in Dubai','Pearl Fashion offers quality fashion services in Dubai, UAE.',NULL,NULL,NULL,'info@pearlfashion.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(75,'Crown Fashion',52,NULL,'Quality fashion in Abu Dhabi.','bizcat-52.svg',4.7,NULL,'Corniche, Abu Dhabi','+971510002109','971510002109',1,'approved','2026-07-24 16:07:37','bizcat-52.svg','Trusted Fashion in Abu Dhabi','Crown Fashion offers quality fashion services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@crownfashion.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(76,'Golden Electronics',53,NULL,'Quality electronics in Abu Dhabi.','bizcat-53.svg',4.7,NULL,'Corniche, Abu Dhabi','+971510002146','971510002146',1,'approved','2026-07-24 16:07:37','bizcat-53.svg','Trusted Electronics in Abu Dhabi','Golden Electronics offers quality electronics services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@goldenelectronics.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(77,'Star Electronics',53,NULL,'Quality electronics in Sharjah.','bizcat-53.svg',4.8,NULL,'Al Nahda, Sharjah','+971510002183','971510002183',1,'approved','2026-07-24 16:07:37','bizcat-53.svg','Trusted Electronics in Sharjah','Star Electronics offers quality electronics services in Sharjah, UAE.',NULL,NULL,NULL,'info@starelectronics.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(78,'Al Noor Mobile Shops',54,NULL,'Quality mobile shops in Sharjah.','bizcat-54.svg',4.8,NULL,'Al Nahda, Sharjah','+971510002220','971510002220',1,'approved','2026-07-24 16:07:37','bizcat-54.svg','Trusted Mobile Shops in Sharjah','Al Noor Mobile Shops offers quality mobile shops services in Sharjah, UAE.',NULL,NULL,NULL,'info@alnoormobileshops.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(79,'Prime Mobile Shops',54,NULL,'Quality mobile shops in Ajman.','bizcat-54.svg',4.9,NULL,'Al Rashidiya, Ajman','+971510002257','971510002257',1,'approved','2026-07-24 16:07:37','bizcat-54.svg','Trusted Mobile Shops in Ajman','Prime Mobile Shops offers quality mobile shops services in Ajman, UAE.',NULL,NULL,NULL,'info@primemobileshops.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(80,'Gulf Jewellery',55,NULL,'Quality jewellery in Ajman.','bizcat-55.svg',4.9,NULL,'Al Rashidiya, Ajman','+971510002294','971510002294',1,'approved','2026-07-24 16:07:37','bizcat-55.svg','Trusted Jewellery in Ajman','Gulf Jewellery offers quality jewellery services in Ajman, UAE.',NULL,NULL,NULL,'info@gulfjewellery.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(81,'Emirates Jewellery',55,NULL,'Quality jewellery in Fujairah.','bizcat-55.svg',4.2,NULL,'City Centre, Fujairah','+971510002331','971510002331',1,'approved','2026-07-24 16:07:37','bizcat-55.svg','Trusted Jewellery in Fujairah','Emirates Jewellery offers quality jewellery services in Fujairah, UAE.',NULL,NULL,NULL,'info@emiratesjewellery.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(82,'Royal Furniture',56,NULL,'Quality furniture in Fujairah.','bizcat-56.svg',4.2,NULL,'City Centre, Fujairah','+971510002368','971510002368',1,'approved','2026-07-24 16:07:37','bizcat-56.svg','Trusted Furniture in Fujairah','Royal Furniture offers quality furniture services in Fujairah, UAE.',NULL,NULL,NULL,'info@royalfurniture.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(83,'City Furniture',56,NULL,'Quality furniture in Ras Al Khaimah.','bizcat-56.svg',4.3,NULL,'Al Nakheel, Ras Al Khaimah','+971510002405','971510002405',1,'approved','2026-07-24 16:07:37','bizcat-56.svg','Trusted Furniture in Ras Al Khaimah','City Furniture offers quality furniture services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@cityfurniture.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(84,'Elite Perfumes',57,NULL,'Quality perfumes in Ras Al Khaimah.','bizcat-57.svg',4.3,NULL,'Al Nakheel, Ras Al Khaimah','+971510002442','971510002442',1,'approved','2026-07-24 16:07:37','bizcat-57.svg','Trusted Perfumes in Ras Al Khaimah','Elite Perfumes offers quality perfumes services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@eliteperfumes.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(85,'Oasis Perfumes',57,NULL,'Quality perfumes in Umm Al Quwain.','bizcat-57.svg',4.4,NULL,'King Faisal Rd, Umm Al Quwain','+971510002479','971510002479',1,'approved','2026-07-24 16:07:37','bizcat-57.svg','Trusted Perfumes in Umm Al Quwain','Oasis Perfumes offers quality perfumes services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@oasisperfumes.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(86,'Pearl Gifts',58,NULL,'Quality gifts in Umm Al Quwain.','bizcat-58.svg',4.4,NULL,'King Faisal Rd, Umm Al Quwain','+971510002516','971510002516',1,'approved','2026-07-24 16:07:37','bizcat-58.svg','Trusted Gifts in Umm Al Quwain','Pearl Gifts offers quality gifts services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@pearlgifts.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(87,'Crown Gifts',58,NULL,'Quality gifts in Dubai.','bizcat-58.svg',4.5,NULL,'Business Bay, Dubai','+971510002553','971510002553',1,'approved','2026-07-24 16:07:37','bizcat-58.svg','Trusted Gifts in Dubai','Crown Gifts offers quality gifts services in Dubai, UAE.',NULL,NULL,NULL,'info@crowngifts.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(88,'Golden Baby Products',59,NULL,'Quality baby products in Dubai.','bizcat-59.svg',4.5,NULL,'Business Bay, Dubai','+971510002590','971510002590',1,'approved','2026-07-24 16:07:37','bizcat-59.svg','Trusted Baby Products in Dubai','Golden Baby Products offers quality baby products services in Dubai, UAE.',NULL,NULL,NULL,'info@goldenbabyproducts.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(89,'Star Baby Products',59,NULL,'Quality baby products in Abu Dhabi.','bizcat-59.svg',4.6,NULL,'Corniche, Abu Dhabi','+971510002627','971510002627',1,'approved','2026-07-24 16:07:37','bizcat-59.svg','Trusted Baby Products in Abu Dhabi','Star Baby Products offers quality baby products services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@starbabyproducts.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(90,'Al Noor Sports Equipment',60,NULL,'Quality sports equipment in Abu Dhabi.','bizcat-60.svg',4.6,NULL,'Corniche, Abu Dhabi','+971510002664','971510002664',1,'approved','2026-07-24 16:07:37','bizcat-60.svg','Trusted Sports Equipment in Abu Dhabi','Al Noor Sports Equipment offers quality sports equipment services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@alnoorsportsequipment.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(91,'Prime Sports Equipment',60,NULL,'Quality sports equipment in Sharjah.','bizcat-60.svg',4.7,NULL,'Al Nahda, Sharjah','+971510002701','971510002701',1,'approved','2026-07-24 16:07:37','bizcat-60.svg','Trusted Sports Equipment in Sharjah','Prime Sports Equipment offers quality sports equipment services in Sharjah, UAE.',NULL,NULL,NULL,'info@primesportsequipment.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(92,'Gulf Real Estate Agencies',61,NULL,'Quality real estate agencies in Sharjah.','bizcat-61.svg',4.7,NULL,'Al Nahda, Sharjah','+971510002738','971510002738',1,'approved','2026-07-24 16:07:37','bizcat-61.svg','Trusted Real Estate Agencies in Sharjah','Gulf Real Estate Agencies offers quality real estate agencies services in Sharjah, UAE.',NULL,NULL,NULL,'info@gulfrealestateagencies.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(93,'Emirates Real Estate Agencies',61,NULL,'Quality real estate agencies in Ajman.','bizcat-61.svg',4.8,NULL,'Al Rashidiya, Ajman','+971510002775','971510002775',1,'approved','2026-07-24 16:07:37','bizcat-61.svg','Trusted Real Estate Agencies in Ajman','Emirates Real Estate Agencies offers quality real estate agencies services in Ajman, UAE.',NULL,NULL,NULL,'info@emiratesrealestateagencies.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(94,'Royal Property Developers',62,NULL,'Quality property developers in Ajman.','bizcat-62.svg',4.8,NULL,'Al Rashidiya, Ajman','+971510002812','971510002812',1,'approved','2026-07-24 16:07:37','bizcat-62.svg','Trusted Property Developers in Ajman','Royal Property Developers offers quality property developers services in Ajman, UAE.',NULL,NULL,NULL,'info@royalpropertydevelopers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(95,'City Property Developers',62,NULL,'Quality property developers in Fujairah.','bizcat-62.svg',4.9,NULL,'City Centre, Fujairah','+971510002849','971510002849',1,'approved','2026-07-24 16:07:37','bizcat-62.svg','Trusted Property Developers in Fujairah','City Property Developers offers quality property developers services in Fujairah, UAE.',NULL,NULL,NULL,'info@citypropertydevelopers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(96,'Elite Property Management',63,NULL,'Quality property management in Fujairah.','bizcat-63.svg',4.9,NULL,'City Centre, Fujairah','+971510002886','971510002886',1,'approved','2026-07-24 16:07:37','bizcat-63.svg','Trusted Property Management in Fujairah','Elite Property Management offers quality property management services in Fujairah, UAE.',NULL,NULL,NULL,'info@elitepropertymanagement.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(97,'Oasis Property Management',63,NULL,'Quality property management in Ras Al Khaimah.','bizcat-63.svg',4.2,NULL,'Al Nakheel, Ras Al Khaimah','+971510002923','971510002923',1,'approved','2026-07-24 16:07:37','bizcat-63.svg','Trusted Property Management in Ras Al Khaimah','Oasis Property Management offers quality property management services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@oasispropertymanagement.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(98,'Pearl Real Estate Consultants',64,NULL,'Quality real estate consultants in Ras Al Khaimah.','bizcat-64.svg',4.2,NULL,'Al Nakheel, Ras Al Khaimah','+971510002960','971510002960',1,'approved','2026-07-24 16:07:37','bizcat-64.svg','Trusted Real Estate Consultants in Ras Al Khaimah','Pearl Real Estate Consultants offers quality real estate consultants services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@pearlrealestateconsultants.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(99,'Crown Real Estate Consultants',64,NULL,'Quality real estate consultants in Umm Al Quwain.','bizcat-64.svg',4.3,NULL,'King Faisal Rd, Umm Al Quwain','+971510002997','971510002997',1,'approved','2026-07-24 16:07:37','bizcat-64.svg','Trusted Real Estate Consultants in Umm Al Quwain','Crown Real Estate Consultants offers quality real estate consultants services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@crownrealestateconsultants.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(100,'Golden Commercial Properties',65,NULL,'Quality commercial properties in Umm Al Quwain.','bizcat-65.svg',4.3,NULL,'King Faisal Rd, Umm Al Quwain','+971510003034','971510003034',1,'approved','2026-07-24 16:07:37','bizcat-65.svg','Trusted Commercial Properties in Umm Al Quwain','Golden Commercial Properties offers quality commercial properties services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@goldencommercialproperties.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(101,'Star Commercial Properties',65,NULL,'Quality commercial properties in Dubai.','bizcat-65.svg',4.4,NULL,'Business Bay, Dubai','+971510003071','971510003071',1,'approved','2026-07-24 16:07:37','bizcat-65.svg','Trusted Commercial Properties in Dubai','Star Commercial Properties offers quality commercial properties services in Dubai, UAE.',NULL,NULL,NULL,'info@starcommercialproperties.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(102,'Al Noor Holiday Homes',66,NULL,'Quality holiday homes in Dubai.','bizcat-66.svg',4.4,NULL,'Business Bay, Dubai','+971510003108','971510003108',1,'approved','2026-07-24 16:07:37','bizcat-66.svg','Trusted Holiday Homes in Dubai','Al Noor Holiday Homes offers quality holiday homes services in Dubai, UAE.',NULL,NULL,NULL,'info@alnoorholidayhomes.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(103,'Prime Holiday Homes',66,NULL,'Quality holiday homes in Abu Dhabi.','bizcat-66.svg',4.5,NULL,'Corniche, Abu Dhabi','+971510003145','971510003145',1,'approved','2026-07-24 16:07:37','bizcat-66.svg','Trusted Holiday Homes in Abu Dhabi','Prime Holiday Homes offers quality holiday homes services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@primeholidayhomes.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(104,'Gulf Cleaning',67,NULL,'Quality cleaning in Abu Dhabi.','bizcat-67.svg',4.5,NULL,'Corniche, Abu Dhabi','+971510003182','971510003182',1,'approved','2026-07-24 16:07:37','bizcat-67.svg','Trusted Cleaning in Abu Dhabi','Gulf Cleaning offers quality cleaning services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@gulfcleaning.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(105,'Emirates Cleaning',67,NULL,'Quality cleaning in Sharjah.','bizcat-67.svg',4.6,NULL,'Al Nahda, Sharjah','+971510003219','971510003219',1,'approved','2026-07-24 16:07:37','bizcat-67.svg','Trusted Cleaning in Sharjah','Emirates Cleaning offers quality cleaning services in Sharjah, UAE.',NULL,NULL,NULL,'info@emiratescleaning.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(106,'Royal Plumbing',68,NULL,'Quality plumbing in Sharjah.','bizcat-68.svg',4.6,NULL,'Al Nahda, Sharjah','+971510003256','971510003256',1,'approved','2026-07-24 16:07:37','bizcat-68.svg','Trusted Plumbing in Sharjah','Royal Plumbing offers quality plumbing services in Sharjah, UAE.',NULL,NULL,NULL,'info@royalplumbing.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(107,'City Plumbing',68,NULL,'Quality plumbing in Ajman.','bizcat-68.svg',4.7,NULL,'Al Rashidiya, Ajman','+971510003293','971510003293',1,'approved','2026-07-24 16:07:37','bizcat-68.svg','Trusted Plumbing in Ajman','City Plumbing offers quality plumbing services in Ajman, UAE.',NULL,NULL,NULL,'info@cityplumbing.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(108,'Elite Electrical Work',69,NULL,'Quality electrical work in Ajman.','bizcat-69.svg',4.7,NULL,'Al Rashidiya, Ajman','+971510003330','971510003330',1,'approved','2026-07-24 16:07:37','bizcat-69.svg','Trusted Electrical Work in Ajman','Elite Electrical Work offers quality electrical work services in Ajman, UAE.',NULL,NULL,NULL,'info@eliteelectricalwork.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(109,'Oasis Electrical Work',69,NULL,'Quality electrical work in Fujairah.','bizcat-69.svg',4.8,NULL,'City Centre, Fujairah','+971510003367','971510003367',1,'approved','2026-07-24 16:07:37','bizcat-69.svg','Trusted Electrical Work in Fujairah','Oasis Electrical Work offers quality electrical work services in Fujairah, UAE.',NULL,NULL,NULL,'info@oasiselectricalwork.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(110,'Pearl AC Repair',70,NULL,'Quality ac repair in Fujairah.','bizcat-70.svg',4.8,NULL,'City Centre, Fujairah','+971510003404','971510003404',1,'approved','2026-07-24 16:07:37','bizcat-70.svg','Trusted AC Repair in Fujairah','Pearl AC Repair offers quality ac repair services in Fujairah, UAE.',NULL,NULL,NULL,'info@pearlacrepair.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(111,'Crown AC Repair',70,NULL,'Quality ac repair in Ras Al Khaimah.','bizcat-70.svg',4.9,NULL,'Al Nakheel, Ras Al Khaimah','+971510003441','971510003441',1,'approved','2026-07-24 16:07:37','bizcat-70.svg','Trusted AC Repair in Ras Al Khaimah','Crown AC Repair offers quality ac repair services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@crownacrepair.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(112,'Golden Painting',71,NULL,'Quality painting in Ras Al Khaimah.','bizcat-71.svg',4.9,NULL,'Al Nakheel, Ras Al Khaimah','+971510003478','971510003478',1,'approved','2026-07-24 16:07:37','bizcat-71.svg','Trusted Painting in Ras Al Khaimah','Golden Painting offers quality painting services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@goldenpainting.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(113,'Star Painting',71,NULL,'Quality painting in Umm Al Quwain.','bizcat-71.svg',4.2,NULL,'King Faisal Rd, Umm Al Quwain','+971510003515','971510003515',1,'approved','2026-07-24 16:07:37','bizcat-71.svg','Trusted Painting in Umm Al Quwain','Star Painting offers quality painting services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@starpainting.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(114,'Al Noor Carpentry',72,NULL,'Quality carpentry in Umm Al Quwain.','bizcat-72.svg',4.2,NULL,'King Faisal Rd, Umm Al Quwain','+971510003552','971510003552',1,'approved','2026-07-24 16:07:37','bizcat-72.svg','Trusted Carpentry in Umm Al Quwain','Al Noor Carpentry offers quality carpentry services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@alnoorcarpentry.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(115,'Prime Carpentry',72,NULL,'Quality carpentry in Dubai.','bizcat-72.svg',4.3,NULL,'Business Bay, Dubai','+971510003589','971510003589',1,'approved','2026-07-24 16:07:37','bizcat-72.svg','Trusted Carpentry in Dubai','Prime Carpentry offers quality carpentry services in Dubai, UAE.',NULL,NULL,NULL,'info@primecarpentry.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(116,'Gulf Pest Control',73,NULL,'Quality pest control in Dubai.','bizcat-73.svg',4.3,NULL,'Business Bay, Dubai','+971510003626','971510003626',1,'approved','2026-07-24 16:07:37','bizcat-73.svg','Trusted Pest Control in Dubai','Gulf Pest Control offers quality pest control services in Dubai, UAE.',NULL,NULL,NULL,'info@gulfpestcontrol.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(117,'Emirates Pest Control',73,NULL,'Quality pest control in Abu Dhabi.','bizcat-73.svg',4.4,NULL,'Corniche, Abu Dhabi','+971510003663','971510003663',1,'approved','2026-07-24 16:07:37','bizcat-73.svg','Trusted Pest Control in Abu Dhabi','Emirates Pest Control offers quality pest control services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@emiratespestcontrol.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(118,'Royal Landscaping',74,NULL,'Quality landscaping in Abu Dhabi.','bizcat-74.svg',4.4,NULL,'Corniche, Abu Dhabi','+971510003700','971510003700',1,'approved','2026-07-24 16:07:37','bizcat-74.svg','Trusted Landscaping in Abu Dhabi','Royal Landscaping offers quality landscaping services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@royallandscaping.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(119,'City Landscaping',74,NULL,'Quality landscaping in Sharjah.','bizcat-74.svg',4.5,NULL,'Al Nahda, Sharjah','+971510003737','971510003737',1,'approved','2026-07-24 16:07:37','bizcat-74.svg','Trusted Landscaping in Sharjah','City Landscaping offers quality landscaping services in Sharjah, UAE.',NULL,NULL,NULL,'info@citylandscaping.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(120,'Elite Handyman Services',75,NULL,'Quality handyman services in Sharjah.','bizcat-75.svg',4.5,NULL,'Al Nahda, Sharjah','+971510003774','971510003774',1,'approved','2026-07-24 16:07:37','bizcat-75.svg','Trusted Handyman Services in Sharjah','Elite Handyman Services offers quality handyman services services in Sharjah, UAE.',NULL,NULL,NULL,'info@elitehandymanservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(121,'Oasis Handyman Services',75,NULL,'Quality handyman services in Ajman.','bizcat-75.svg',4.6,NULL,'Al Rashidiya, Ajman','+971510003811','971510003811',1,'approved','2026-07-24 16:07:37','bizcat-75.svg','Trusted Handyman Services in Ajman','Oasis Handyman Services offers quality handyman services services in Ajman, UAE.',NULL,NULL,NULL,'info@oasishandymanservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(122,'Pearl New Car Dealers',76,NULL,'Quality new car dealers in Ajman.','bizcat-76.svg',4.6,NULL,'Al Rashidiya, Ajman','+971510003848','971510003848',1,'approved','2026-07-24 16:07:37','bizcat-76.svg','Trusted New Car Dealers in Ajman','Pearl New Car Dealers offers quality new car dealers services in Ajman, UAE.',NULL,NULL,NULL,'info@pearlnewcardealers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(123,'Crown New Car Dealers',76,NULL,'Quality new car dealers in Fujairah.','bizcat-76.svg',4.7,NULL,'City Centre, Fujairah','+971510003885','971510003885',1,'approved','2026-07-24 16:07:37','bizcat-76.svg','Trusted New Car Dealers in Fujairah','Crown New Car Dealers offers quality new car dealers services in Fujairah, UAE.',NULL,NULL,NULL,'info@crownnewcardealers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(124,'Golden Used Car Dealers',77,NULL,'Quality used car dealers in Fujairah.','bizcat-77.svg',4.7,NULL,'City Centre, Fujairah','+971510003922','971510003922',1,'approved','2026-07-24 16:07:37','bizcat-77.svg','Trusted Used Car Dealers in Fujairah','Golden Used Car Dealers offers quality used car dealers services in Fujairah, UAE.',NULL,NULL,NULL,'info@goldenusedcardealers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(125,'Star Used Car Dealers',77,NULL,'Quality used car dealers in Ras Al Khaimah.','bizcat-77.svg',4.8,NULL,'Al Nakheel, Ras Al Khaimah','+971510003959','971510003959',1,'approved','2026-07-24 16:07:37','bizcat-77.svg','Trusted Used Car Dealers in Ras Al Khaimah','Star Used Car Dealers offers quality used car dealers services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@starusedcardealers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(126,'Al Noor Garages',79,NULL,'Quality garages in Ras Al Khaimah.','bizcat-79.svg',4.8,NULL,'Al Nakheel, Ras Al Khaimah','+971510003996','971510003996',1,'approved','2026-07-24 16:07:37','bizcat-79.svg','Trusted Garages in Ras Al Khaimah','Al Noor Garages offers quality garages services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@alnoorgarages.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(127,'Prime Garages',79,NULL,'Quality garages in Umm Al Quwain.','bizcat-79.svg',4.9,NULL,'King Faisal Rd, Umm Al Quwain','+971510004033','971510004033',1,'approved','2026-07-24 16:07:37','bizcat-79.svg','Trusted Garages in Umm Al Quwain','Prime Garages offers quality garages services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@primegarages.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(128,'Gulf Car Wash',80,NULL,'Quality car wash in Umm Al Quwain.','bizcat-80.svg',4.9,NULL,'King Faisal Rd, Umm Al Quwain','+971510004070','971510004070',1,'approved','2026-07-24 16:07:37','bizcat-80.svg','Trusted Car Wash in Umm Al Quwain','Gulf Car Wash offers quality car wash services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@gulfcarwash.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(129,'Emirates Car Wash',80,NULL,'Quality car wash in Dubai.','bizcat-80.svg',4.2,NULL,'Business Bay, Dubai','+971510004107','971510004107',1,'approved','2026-07-24 16:07:37','bizcat-80.svg','Trusted Car Wash in Dubai','Emirates Car Wash offers quality car wash services in Dubai, UAE.',NULL,NULL,NULL,'info@emiratescarwash.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(130,'Royal Spare Parts',81,NULL,'Quality spare parts in Dubai.','bizcat-81.svg',4.2,NULL,'Business Bay, Dubai','+971510004144','971510004144',1,'approved','2026-07-24 16:07:37','bizcat-81.svg','Trusted Spare Parts in Dubai','Royal Spare Parts offers quality spare parts services in Dubai, UAE.',NULL,NULL,NULL,'info@royalspareparts.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(131,'City Spare Parts',81,NULL,'Quality spare parts in Abu Dhabi.','bizcat-81.svg',4.3,NULL,'Corniche, Abu Dhabi','+971510004181','971510004181',1,'approved','2026-07-24 16:07:37','bizcat-81.svg','Trusted Spare Parts in Abu Dhabi','City Spare Parts offers quality spare parts services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@cityspareparts.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(132,'Elite Tyres',82,NULL,'Quality tyres in Abu Dhabi.','bizcat-82.svg',4.3,NULL,'Corniche, Abu Dhabi','+971510004218','971510004218',1,'approved','2026-07-24 16:07:37','bizcat-82.svg','Trusted Tyres in Abu Dhabi','Elite Tyres offers quality tyres services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@elitetyres.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(133,'Oasis Tyres',82,NULL,'Quality tyres in Sharjah.','bizcat-82.svg',4.4,NULL,'Al Nahda, Sharjah','+971510004255','971510004255',1,'approved','2026-07-24 16:07:37','bizcat-82.svg','Trusted Tyres in Sharjah','Oasis Tyres offers quality tyres services in Sharjah, UAE.',NULL,NULL,NULL,'info@oasistyres.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(134,'Pearl Auto Accessories',83,NULL,'Quality auto accessories in Sharjah.','bizcat-83.svg',4.4,NULL,'Al Nahda, Sharjah','+971510004292','971510004292',1,'approved','2026-07-24 16:07:37','bizcat-83.svg','Trusted Auto Accessories in Sharjah','Pearl Auto Accessories offers quality auto accessories services in Sharjah, UAE.',NULL,NULL,NULL,'info@pearlautoaccessories.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(135,'Crown Auto Accessories',83,NULL,'Quality auto accessories in Ajman.','bizcat-83.svg',4.5,NULL,'Al Rashidiya, Ajman','+971510004329','971510004329',1,'approved','2026-07-24 16:07:37','bizcat-83.svg','Trusted Auto Accessories in Ajman','Crown Auto Accessories offers quality auto accessories services in Ajman, UAE.',NULL,NULL,NULL,'info@crownautoaccessories.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(136,'Golden Vehicle Recovery',84,NULL,'Quality vehicle recovery in Ajman.','bizcat-84.svg',4.5,NULL,'Al Rashidiya, Ajman','+971510004366','971510004366',1,'approved','2026-07-24 16:07:37','bizcat-84.svg','Trusted Vehicle Recovery in Ajman','Golden Vehicle Recovery offers quality vehicle recovery services in Ajman, UAE.',NULL,NULL,NULL,'info@goldenvehiclerecovery.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(137,'Star Vehicle Recovery',84,NULL,'Quality vehicle recovery in Fujairah.','bizcat-84.svg',4.6,NULL,'City Centre, Fujairah','+971510004403','971510004403',1,'approved','2026-07-24 16:07:37','bizcat-84.svg','Trusted Vehicle Recovery in Fujairah','Star Vehicle Recovery offers quality vehicle recovery services in Fujairah, UAE.',NULL,NULL,NULL,'info@starvehiclerecovery.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(138,'Al Noor Pharmacies',87,NULL,'Quality pharmacies in Fujairah.','bizcat-87.svg',4.6,NULL,'City Centre, Fujairah','+971510004440','971510004440',1,'approved','2026-07-24 16:07:37','bizcat-87.svg','Trusted Pharmacies in Fujairah','Al Noor Pharmacies offers quality pharmacies services in Fujairah, UAE.',NULL,NULL,NULL,'info@alnoorpharmacies.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(139,'Prime Pharmacies',87,NULL,'Quality pharmacies in Ras Al Khaimah.','bizcat-87.svg',4.7,NULL,'Al Nakheel, Ras Al Khaimah','+971510004477','971510004477',1,'approved','2026-07-24 16:07:37','bizcat-87.svg','Trusted Pharmacies in Ras Al Khaimah','Prime Pharmacies offers quality pharmacies services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@primepharmacies.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(140,'Gulf Dental Clinics',88,NULL,'Quality dental clinics in Ras Al Khaimah.','bizcat-88.svg',4.7,NULL,'Al Nakheel, Ras Al Khaimah','+971510004514','971510004514',1,'approved','2026-07-24 16:07:37','bizcat-88.svg','Trusted Dental Clinics in Ras Al Khaimah','Gulf Dental Clinics offers quality dental clinics services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@gulfdentalclinics.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(141,'Emirates Dental Clinics',88,NULL,'Quality dental clinics in Umm Al Quwain.','bizcat-88.svg',4.8,NULL,'King Faisal Rd, Umm Al Quwain','+971510004551','971510004551',1,'approved','2026-07-24 16:07:37','bizcat-88.svg','Trusted Dental Clinics in Umm Al Quwain','Emirates Dental Clinics offers quality dental clinics services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@emiratesdentalclinics.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(142,'Royal Laboratories',89,NULL,'Quality laboratories in Umm Al Quwain.','bizcat-89.svg',4.8,NULL,'King Faisal Rd, Umm Al Quwain','+971510004588','971510004588',1,'approved','2026-07-24 16:07:37','bizcat-89.svg','Trusted Laboratories in Umm Al Quwain','Royal Laboratories offers quality laboratories services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@royallaboratories.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(143,'City Laboratories',89,NULL,'Quality laboratories in Dubai.','bizcat-89.svg',4.9,NULL,'Business Bay, Dubai','+971510004625','971510004625',1,'approved','2026-07-24 16:07:37','bizcat-89.svg','Trusted Laboratories in Dubai','City Laboratories offers quality laboratories services in Dubai, UAE.',NULL,NULL,NULL,'info@citylaboratories.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(144,'Elite Beauty Salons',90,NULL,'Quality beauty salons in Dubai.','bizcat-90.svg',4.9,NULL,'Business Bay, Dubai','+971510004662','971510004662',1,'approved','2026-07-24 16:07:37','bizcat-90.svg','Trusted Beauty Salons in Dubai','Elite Beauty Salons offers quality beauty salons services in Dubai, UAE.',NULL,NULL,NULL,'info@elitebeautysalons.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(145,'Oasis Beauty Salons',90,NULL,'Quality beauty salons in Abu Dhabi.','bizcat-90.svg',4.2,NULL,'Corniche, Abu Dhabi','+971510004699','971510004699',1,'approved','2026-07-24 16:07:37','bizcat-90.svg','Trusted Beauty Salons in Abu Dhabi','Oasis Beauty Salons offers quality beauty salons services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@oasisbeautysalons.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(146,'Pearl Barbershops',91,NULL,'Quality barbershops in Abu Dhabi.','bizcat-91.svg',4.2,NULL,'Corniche, Abu Dhabi','+971510004736','971510004736',1,'approved','2026-07-24 16:07:37','bizcat-91.svg','Trusted Barbershops in Abu Dhabi','Pearl Barbershops offers quality barbershops services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@pearlbarbershops.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(147,'Crown Barbershops',91,NULL,'Quality barbershops in Sharjah.','bizcat-91.svg',4.3,NULL,'Al Nahda, Sharjah','+971510004773','971510004773',1,'approved','2026-07-24 16:07:37','bizcat-91.svg','Trusted Barbershops in Sharjah','Crown Barbershops offers quality barbershops services in Sharjah, UAE.',NULL,NULL,NULL,'info@crownbarbershops.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(148,'Golden Spas',92,NULL,'Quality spas in Sharjah.','bizcat-92.svg',4.3,NULL,'Al Nahda, Sharjah','+971510004810','971510004810',1,'approved','2026-07-24 16:07:37','bizcat-92.svg','Trusted Spas in Sharjah','Golden Spas offers quality spas services in Sharjah, UAE.',NULL,NULL,NULL,'info@goldenspas.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(149,'Star Spas',92,NULL,'Quality spas in Ajman.','bizcat-92.svg',4.4,NULL,'Al Rashidiya, Ajman','+971510004847','971510004847',1,'approved','2026-07-24 16:07:37','bizcat-92.svg','Trusted Spas in Ajman','Star Spas offers quality spas services in Ajman, UAE.',NULL,NULL,NULL,'info@starspas.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(150,'Al Noor Fitness Centres',93,NULL,'Quality fitness centres in Ajman.','bizcat-93.svg',4.4,NULL,'Al Rashidiya, Ajman','+971510004884','971510004884',1,'approved','2026-07-24 16:07:37','bizcat-93.svg','Trusted Fitness Centres in Ajman','Al Noor Fitness Centres offers quality fitness centres services in Ajman, UAE.',NULL,NULL,NULL,'info@alnoorfitnesscentres.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(151,'Prime Fitness Centres',93,NULL,'Quality fitness centres in Fujairah.','bizcat-93.svg',4.5,NULL,'City Centre, Fujairah','+971510004921','971510004921',1,'approved','2026-07-24 16:07:37','bizcat-93.svg','Trusted Fitness Centres in Fujairah','Prime Fitness Centres offers quality fitness centres services in Fujairah, UAE.',NULL,NULL,NULL,'info@primefitnesscentres.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(152,'Gulf Yoga Studios',94,NULL,'Quality yoga studios in Fujairah.','bizcat-94.svg',4.5,NULL,'City Centre, Fujairah','+971510004958','971510004958',1,'approved','2026-07-24 16:07:37','bizcat-94.svg','Trusted Yoga Studios in Fujairah','Gulf Yoga Studios offers quality yoga studios services in Fujairah, UAE.',NULL,NULL,NULL,'info@gulfyogastudios.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(153,'Emirates Yoga Studios',94,NULL,'Quality yoga studios in Ras Al Khaimah.','bizcat-94.svg',4.6,NULL,'Al Nakheel, Ras Al Khaimah','+971510004995','971510004995',1,'approved','2026-07-24 16:07:37','bizcat-94.svg','Trusted Yoga Studios in Ras Al Khaimah','Emirates Yoga Studios offers quality yoga studios services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@emiratesyogastudios.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(154,'Royal Schools',95,NULL,'Quality schools in Ras Al Khaimah.','bizcat-95.svg',4.6,NULL,'Al Nakheel, Ras Al Khaimah','+971510005032','971510005032',1,'approved','2026-07-24 16:07:37','bizcat-95.svg','Trusted Schools in Ras Al Khaimah','Royal Schools offers quality schools services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@royalschools.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(155,'City Schools',95,NULL,'Quality schools in Umm Al Quwain.','bizcat-95.svg',4.7,NULL,'King Faisal Rd, Umm Al Quwain','+971510005069','971510005069',1,'approved','2026-07-24 16:07:37','bizcat-95.svg','Trusted Schools in Umm Al Quwain','City Schools offers quality schools services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@cityschools.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(156,'Elite Nurseries',96,NULL,'Quality nurseries in Umm Al Quwain.','bizcat-96.svg',4.7,NULL,'King Faisal Rd, Umm Al Quwain','+971510005106','971510005106',1,'approved','2026-07-24 16:07:37','bizcat-96.svg','Trusted Nurseries in Umm Al Quwain','Elite Nurseries offers quality nurseries services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@elitenurseries.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(157,'Oasis Nurseries',96,NULL,'Quality nurseries in Dubai.','bizcat-96.svg',4.8,NULL,'Business Bay, Dubai','+971510005143','971510005143',1,'approved','2026-07-24 16:07:37','bizcat-96.svg','Trusted Nurseries in Dubai','Oasis Nurseries offers quality nurseries services in Dubai, UAE.',NULL,NULL,NULL,'info@oasisnurseries.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(158,'Pearl Tuition Centres',98,NULL,'Quality tuition centres in Dubai.','bizcat-98.svg',4.8,NULL,'Business Bay, Dubai','+971510005180','971510005180',1,'approved','2026-07-24 16:07:37','bizcat-98.svg','Trusted Tuition Centres in Dubai','Pearl Tuition Centres offers quality tuition centres services in Dubai, UAE.',NULL,NULL,NULL,'info@pearltuitioncentres.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(159,'Crown Tuition Centres',98,NULL,'Quality tuition centres in Abu Dhabi.','bizcat-98.svg',4.9,NULL,'Corniche, Abu Dhabi','+971510005217','971510005217',1,'approved','2026-07-24 16:07:37','bizcat-98.svg','Trusted Tuition Centres in Abu Dhabi','Crown Tuition Centres offers quality tuition centres services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@crowntuitioncentres.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(160,'Golden Training Institutes',99,NULL,'Quality training institutes in Abu Dhabi.','bizcat-99.svg',4.9,NULL,'Corniche, Abu Dhabi','+971510005254','971510005254',1,'approved','2026-07-24 16:07:37','bizcat-99.svg','Trusted Training Institutes in Abu Dhabi','Golden Training Institutes offers quality training institutes services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@goldentraininginstitutes.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(161,'Star Training Institutes',99,NULL,'Quality training institutes in Sharjah.','bizcat-99.svg',4.2,NULL,'Al Nahda, Sharjah','+971510005291','971510005291',1,'approved','2026-07-24 16:07:37','bizcat-99.svg','Trusted Training Institutes in Sharjah','Star Training Institutes offers quality training institutes services in Sharjah, UAE.',NULL,NULL,NULL,'info@startraininginstitutes.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(162,'Al Noor Driving Schools',100,NULL,'Quality driving schools in Sharjah.','bizcat-100.svg',4.2,NULL,'Al Nahda, Sharjah','+971510005328','971510005328',1,'approved','2026-07-24 16:07:37','bizcat-100.svg','Trusted Driving Schools in Sharjah','Al Noor Driving Schools offers quality driving schools services in Sharjah, UAE.',NULL,NULL,NULL,'info@alnoordrivingschools.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(163,'Prime Driving Schools',100,NULL,'Quality driving schools in Ajman.','bizcat-100.svg',4.3,NULL,'Al Rashidiya, Ajman','+971510005365','971510005365',1,'approved','2026-07-24 16:07:37','bizcat-100.svg','Trusted Driving Schools in Ajman','Prime Driving Schools offers quality driving schools services in Ajman, UAE.',NULL,NULL,NULL,'info@primedrivingschools.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(164,'Gulf Language Centres',101,NULL,'Quality language centres in Ajman.','bizcat-101.svg',4.3,NULL,'Al Rashidiya, Ajman','+971510005402','971510005402',1,'approved','2026-07-24 16:07:37','bizcat-101.svg','Trusted Language Centres in Ajman','Gulf Language Centres offers quality language centres services in Ajman, UAE.',NULL,NULL,NULL,'info@gulflanguagecentres.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(165,'Emirates Language Centres',101,NULL,'Quality language centres in Fujairah.','bizcat-101.svg',4.4,NULL,'City Centre, Fujairah','+971510005439','971510005439',1,'approved','2026-07-24 16:07:37','bizcat-101.svg','Trusted Language Centres in Fujairah','Emirates Language Centres offers quality language centres services in Fujairah, UAE.',NULL,NULL,NULL,'info@emirateslanguagecentres.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(166,'Royal Online Courses',102,NULL,'Quality online courses in Fujairah.','bizcat-102.svg',4.4,NULL,'City Centre, Fujairah','+971510005476','971510005476',1,'approved','2026-07-24 16:07:37','bizcat-102.svg','Trusted Online Courses in Fujairah','Royal Online Courses offers quality online courses services in Fujairah, UAE.',NULL,NULL,NULL,'info@royalonlinecourses.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(167,'City Online Courses',102,NULL,'Quality online courses in Ras Al Khaimah.','bizcat-102.svg',4.5,NULL,'Al Nakheel, Ras Al Khaimah','+971510005513','971510005513',1,'approved','2026-07-24 16:07:37','bizcat-102.svg','Trusted Online Courses in Ras Al Khaimah','City Online Courses offers quality online courses services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@cityonlinecourses.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(168,'Elite Software Companies',103,NULL,'Quality software companies in Ras Al Khaimah.','bizcat-103.svg',4.5,NULL,'Al Nakheel, Ras Al Khaimah','+971510005550','971510005550',1,'approved','2026-07-24 16:07:37','bizcat-103.svg','Trusted Software Companies in Ras Al Khaimah','Elite Software Companies offers quality software companies services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@elitesoftwarecompanies.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(169,'Oasis Software Companies',103,NULL,'Quality software companies in Umm Al Quwain.','bizcat-103.svg',4.6,NULL,'King Faisal Rd, Umm Al Quwain','+971510005587','971510005587',1,'approved','2026-07-24 16:07:37','bizcat-103.svg','Trusted Software Companies in Umm Al Quwain','Oasis Software Companies offers quality software companies services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@oasissoftwarecompanies.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(170,'Pearl App Development',104,NULL,'Quality app development in Umm Al Quwain.','bizcat-104.svg',4.6,NULL,'King Faisal Rd, Umm Al Quwain','+971510005624','971510005624',1,'approved','2026-07-24 16:07:37','bizcat-104.svg','Trusted App Development in Umm Al Quwain','Pearl App Development offers quality app development services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@pearlappdevelopment.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(171,'Crown App Development',104,NULL,'Quality app development in Dubai.','bizcat-104.svg',4.7,NULL,'Business Bay, Dubai','+971510005661','971510005661',1,'approved','2026-07-24 16:07:37','bizcat-104.svg','Trusted App Development in Dubai','Crown App Development offers quality app development services in Dubai, UAE.',NULL,NULL,NULL,'info@crownappdevelopment.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(172,'Golden Website Design',105,NULL,'Quality website design in Dubai.','bizcat-105.svg',4.7,NULL,'Business Bay, Dubai','+971510005698','971510005698',1,'approved','2026-07-24 16:07:37','bizcat-105.svg','Trusted Website Design in Dubai','Golden Website Design offers quality website design services in Dubai, UAE.',NULL,NULL,NULL,'info@goldenwebsitedesign.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(173,'Star Website Design',105,NULL,'Quality website design in Abu Dhabi.','bizcat-105.svg',4.8,NULL,'Corniche, Abu Dhabi','+971510005735','971510005735',1,'approved','2026-07-24 16:07:37','bizcat-105.svg','Trusted Website Design in Abu Dhabi','Star Website Design offers quality website design services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@starwebsitedesign.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(174,'Al Noor IT Support',106,NULL,'Quality it support in Abu Dhabi.','bizcat-106.svg',4.8,NULL,'Corniche, Abu Dhabi','+971510005772','971510005772',1,'approved','2026-07-24 16:07:37','bizcat-106.svg','Trusted IT Support in Abu Dhabi','Al Noor IT Support offers quality it support services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@alnooritsupport.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(175,'Prime IT Support',106,NULL,'Quality it support in Sharjah.','bizcat-106.svg',4.9,NULL,'Al Nahda, Sharjah','+971510005809','971510005809',1,'approved','2026-07-24 16:07:37','bizcat-106.svg','Trusted IT Support in Sharjah','Prime IT Support offers quality it support services in Sharjah, UAE.',NULL,NULL,NULL,'info@primeitsupport.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(176,'Gulf Cybersecurity',107,NULL,'Quality cybersecurity in Sharjah.','bizcat-107.svg',4.9,NULL,'Al Nahda, Sharjah','+971510005846','971510005846',1,'approved','2026-07-24 16:07:37','bizcat-107.svg','Trusted Cybersecurity in Sharjah','Gulf Cybersecurity offers quality cybersecurity services in Sharjah, UAE.',NULL,NULL,NULL,'info@gulfcybersecurity.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(177,'Emirates Cybersecurity',107,NULL,'Quality cybersecurity in Ajman.','bizcat-107.svg',4.2,NULL,'Al Rashidiya, Ajman','+971510005883','971510005883',1,'approved','2026-07-24 16:07:37','bizcat-107.svg','Trusted Cybersecurity in Ajman','Emirates Cybersecurity offers quality cybersecurity services in Ajman, UAE.',NULL,NULL,NULL,'info@emiratescybersecurity.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(178,'Royal Cloud Services',108,NULL,'Quality cloud services in Ajman.','bizcat-108.svg',4.2,NULL,'Al Rashidiya, Ajman','+971510005920','971510005920',1,'approved','2026-07-24 16:07:37','bizcat-108.svg','Trusted Cloud Services in Ajman','Royal Cloud Services offers quality cloud services services in Ajman, UAE.',NULL,NULL,NULL,'info@royalcloudservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(179,'City Cloud Services',108,NULL,'Quality cloud services in Fujairah.','bizcat-108.svg',4.3,NULL,'City Centre, Fujairah','+971510005957','971510005957',1,'approved','2026-07-24 16:07:37','bizcat-108.svg','Trusted Cloud Services in Fujairah','City Cloud Services offers quality cloud services services in Fujairah, UAE.',NULL,NULL,NULL,'info@citycloudservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(180,'Elite AI Solutions',109,NULL,'Quality ai solutions in Fujairah.','bizcat-109.svg',4.3,NULL,'City Centre, Fujairah','+971510005994','971510005994',1,'approved','2026-07-24 16:07:37','bizcat-109.svg','Trusted AI Solutions in Fujairah','Elite AI Solutions offers quality ai solutions services in Fujairah, UAE.',NULL,NULL,NULL,'info@eliteaisolutions.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(181,'Oasis AI Solutions',109,NULL,'Quality ai solutions in Ras Al Khaimah.','bizcat-109.svg',4.4,NULL,'Al Nakheel, Ras Al Khaimah','+971510006031','971510006031',1,'approved','2026-07-24 16:07:37','bizcat-109.svg','Trusted AI Solutions in Ras Al Khaimah','Oasis AI Solutions offers quality ai solutions services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@oasisaisolutions.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(182,'Pearl Computer Shops',110,NULL,'Quality computer shops in Ras Al Khaimah.','bizcat-110.svg',4.4,NULL,'Al Nakheel, Ras Al Khaimah','+971510006068','971510006068',1,'approved','2026-07-24 16:07:37','bizcat-110.svg','Trusted Computer Shops in Ras Al Khaimah','Pearl Computer Shops offers quality computer shops services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@pearlcomputershops.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(183,'Crown Computer Shops',110,NULL,'Quality computer shops in Umm Al Quwain.','bizcat-110.svg',4.5,NULL,'King Faisal Rd, Umm Al Quwain','+971510006105','971510006105',1,'approved','2026-07-24 16:07:37','bizcat-110.svg','Trusted Computer Shops in Umm Al Quwain','Crown Computer Shops offers quality computer shops services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@crowncomputershops.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(184,'Golden Tour Operators',112,NULL,'Quality tour operators in Umm Al Quwain.','bizcat-112.svg',4.5,NULL,'King Faisal Rd, Umm Al Quwain','+971510006142','971510006142',1,'approved','2026-07-24 16:07:37','bizcat-112.svg','Trusted Tour Operators in Umm Al Quwain','Golden Tour Operators offers quality tour operators services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@goldentouroperators.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(185,'Star Tour Operators',112,NULL,'Quality tour operators in Dubai.','bizcat-112.svg',4.6,NULL,'Business Bay, Dubai','+971510006179','971510006179',1,'approved','2026-07-24 16:07:37','bizcat-112.svg','Trusted Tour Operators in Dubai','Star Tour Operators offers quality tour operators services in Dubai, UAE.',NULL,NULL,NULL,'info@startouroperators.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(186,'Al Noor Visa Services',113,NULL,'Quality visa services in Dubai.','bizcat-113.svg',4.6,NULL,'Business Bay, Dubai','+971510006216','971510006216',1,'approved','2026-07-24 16:07:37','bizcat-113.svg','Trusted Visa Services in Dubai','Al Noor Visa Services offers quality visa services services in Dubai, UAE.',NULL,NULL,NULL,'info@alnoorvisaservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(187,'Prime Visa Services',113,NULL,'Quality visa services in Abu Dhabi.','bizcat-113.svg',4.7,NULL,'Corniche, Abu Dhabi','+971510006253','971510006253',1,'approved','2026-07-24 16:07:37','bizcat-113.svg','Trusted Visa Services in Abu Dhabi','Prime Visa Services offers quality visa services services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@primevisaservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(188,'Gulf Ticketing',114,NULL,'Quality ticketing in Abu Dhabi.','bizcat-114.svg',4.7,NULL,'Corniche, Abu Dhabi','+971510006290','971510006290',1,'approved','2026-07-24 16:07:37','bizcat-114.svg','Trusted Ticketing in Abu Dhabi','Gulf Ticketing offers quality ticketing services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@gulfticketing.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(189,'Emirates Ticketing',114,NULL,'Quality ticketing in Sharjah.','bizcat-114.svg',4.8,NULL,'Al Nahda, Sharjah','+971510006327','971510006327',1,'approved','2026-07-24 16:07:37','bizcat-114.svg','Trusted Ticketing in Sharjah','Emirates Ticketing offers quality ticketing services in Sharjah, UAE.',NULL,NULL,NULL,'info@emiratesticketing.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(190,'Royal Hotels',115,NULL,'Quality hotels in Sharjah.','bizcat-115.svg',4.8,NULL,'Al Nahda, Sharjah','+971510006364','971510006364',1,'approved','2026-07-24 16:07:37','bizcat-115.svg','Trusted Hotels in Sharjah','Royal Hotels offers quality hotels services in Sharjah, UAE.',NULL,NULL,NULL,'info@royalhotels.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(191,'City Hotels',115,NULL,'Quality hotels in Ajman.','bizcat-115.svg',4.9,NULL,'Al Rashidiya, Ajman','+971510006401','971510006401',1,'approved','2026-07-24 16:07:37','bizcat-115.svg','Trusted Hotels in Ajman','City Hotels offers quality hotels services in Ajman, UAE.',NULL,NULL,NULL,'info@cityhotels.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(192,'Elite Resorts',116,NULL,'Quality resorts in Ajman.','bizcat-116.svg',4.9,NULL,'Al Rashidiya, Ajman','+971510006438','971510006438',1,'approved','2026-07-24 16:07:37','bizcat-116.svg','Trusted Resorts in Ajman','Elite Resorts offers quality resorts services in Ajman, UAE.',NULL,NULL,NULL,'info@eliteresorts.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(193,'Oasis Resorts',116,NULL,'Quality resorts in Fujairah.','bizcat-116.svg',4.2,NULL,'City Centre, Fujairah','+971510006475','971510006475',1,'approved','2026-07-24 16:07:37','bizcat-116.svg','Trusted Resorts in Fujairah','Oasis Resorts offers quality resorts services in Fujairah, UAE.',NULL,NULL,NULL,'info@oasisresorts.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(194,'Pearl Hotel Apartments',117,NULL,'Quality hotel apartments in Fujairah.','bizcat-117.svg',4.2,NULL,'City Centre, Fujairah','+971510006512','971510006512',1,'approved','2026-07-24 16:07:37','bizcat-117.svg','Trusted Hotel Apartments in Fujairah','Pearl Hotel Apartments offers quality hotel apartments services in Fujairah, UAE.',NULL,NULL,NULL,'info@pearlhotelapartments.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(195,'Crown Hotel Apartments',117,NULL,'Quality hotel apartments in Ras Al Khaimah.','bizcat-117.svg',4.3,NULL,'Al Nakheel, Ras Al Khaimah','+971510006549','971510006549',1,'approved','2026-07-24 16:07:37','bizcat-117.svg','Trusted Hotel Apartments in Ras Al Khaimah','Crown Hotel Apartments offers quality hotel apartments services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@crownhotelapartments.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(196,'Golden Holiday Homes',118,NULL,'Quality holiday homes in Ras Al Khaimah.','bizcat-118.svg',4.3,NULL,'Al Nakheel, Ras Al Khaimah','+971510006586','971510006586',1,'approved','2026-07-24 16:07:37','bizcat-118.svg','Trusted Holiday Homes in Ras Al Khaimah','Golden Holiday Homes offers quality holiday homes services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@goldenholidayhomes.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(197,'Star Holiday Homes',118,NULL,'Quality holiday homes in Umm Al Quwain.','bizcat-118.svg',4.4,NULL,'King Faisal Rd, Umm Al Quwain','+971510006623','971510006623',1,'approved','2026-07-24 16:07:37','bizcat-118.svg','Trusted Holiday Homes in Umm Al Quwain','Star Holiday Homes offers quality holiday homes services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@starholidayhomes.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(198,'Al Noor Yacht Rentals',120,NULL,'Quality yacht rentals in Umm Al Quwain.','bizcat-120.svg',4.4,NULL,'King Faisal Rd, Umm Al Quwain','+971510006660','971510006660',1,'approved','2026-07-24 16:07:37','bizcat-120.svg','Trusted Yacht Rentals in Umm Al Quwain','Al Noor Yacht Rentals offers quality yacht rentals services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@alnooryachtrentals.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(199,'Prime Yacht Rentals',120,NULL,'Quality yacht rentals in Dubai.','bizcat-120.svg',4.5,NULL,'Business Bay, Dubai','+971510006697','971510006697',1,'approved','2026-07-24 16:07:37','bizcat-120.svg','Trusted Yacht Rentals in Dubai','Prime Yacht Rentals offers quality yacht rentals services in Dubai, UAE.',NULL,NULL,NULL,'info@primeyachtrentals.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(200,'Gulf Business Setup',121,NULL,'Quality business setup in Dubai.','bizcat-121.svg',4.5,NULL,'Business Bay, Dubai','+971510006734','971510006734',1,'approved','2026-07-24 16:07:37','bizcat-121.svg','Trusted Business Setup in Dubai','Gulf Business Setup offers quality business setup services in Dubai, UAE.',NULL,NULL,NULL,'info@gulfbusinesssetup.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(201,'Emirates Business Setup',121,NULL,'Quality business setup in Abu Dhabi.','bizcat-121.svg',4.6,NULL,'Corniche, Abu Dhabi','+971510006771','971510006771',1,'approved','2026-07-24 16:07:37','bizcat-121.svg','Trusted Business Setup in Abu Dhabi','Emirates Business Setup offers quality business setup services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@emiratesbusinesssetup.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(202,'Royal PRO Services',122,NULL,'Quality pro services in Abu Dhabi.','bizcat-122.svg',4.6,NULL,'Corniche, Abu Dhabi','+971510006808','971510006808',1,'approved','2026-07-24 16:07:37','bizcat-122.svg','Trusted PRO Services in Abu Dhabi','Royal PRO Services offers quality pro services services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@royalproservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(203,'City PRO Services',122,NULL,'Quality pro services in Sharjah.','bizcat-122.svg',4.7,NULL,'Al Nahda, Sharjah','+971510006845','971510006845',1,'approved','2026-07-24 16:07:37','bizcat-122.svg','Trusted PRO Services in Sharjah','City PRO Services offers quality pro services services in Sharjah, UAE.',NULL,NULL,NULL,'info@cityproservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(204,'Elite Management Consultancy',123,NULL,'Quality management consultancy in Sharjah.','bizcat-123.svg',4.7,NULL,'Al Nahda, Sharjah','+971510006882','971510006882',1,'approved','2026-07-24 16:07:37','bizcat-123.svg','Trusted Management Consultancy in Sharjah','Elite Management Consultancy offers quality management consultancy services in Sharjah, UAE.',NULL,NULL,NULL,'info@elitemanagementconsultancy.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(205,'Oasis Management Consultancy',123,NULL,'Quality management consultancy in Ajman.','bizcat-123.svg',4.8,NULL,'Al Rashidiya, Ajman','+971510006919','971510006919',1,'approved','2026-07-24 16:07:37','bizcat-123.svg','Trusted Management Consultancy in Ajman','Oasis Management Consultancy offers quality management consultancy services in Ajman, UAE.',NULL,NULL,NULL,'info@oasismanagementconsultancy.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(206,'Pearl Recruitment',124,NULL,'Quality recruitment in Ajman.','bizcat-124.svg',4.8,NULL,'Al Rashidiya, Ajman','+971510006956','971510006956',1,'approved','2026-07-24 16:07:37','bizcat-124.svg','Trusted Recruitment in Ajman','Pearl Recruitment offers quality recruitment services in Ajman, UAE.',NULL,NULL,NULL,'info@pearlrecruitment.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(207,'Crown Recruitment',124,NULL,'Quality recruitment in Fujairah.','bizcat-124.svg',4.9,NULL,'City Centre, Fujairah','+971510006993','971510006993',1,'approved','2026-07-24 16:07:37','bizcat-124.svg','Trusted Recruitment in Fujairah','Crown Recruitment offers quality recruitment services in Fujairah, UAE.',NULL,NULL,NULL,'info@crownrecruitment.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(208,'Golden Translation',125,NULL,'Quality translation in Fujairah.','bizcat-125.svg',4.9,NULL,'City Centre, Fujairah','+971510007030','971510007030',1,'approved','2026-07-24 16:07:37','bizcat-125.svg','Trusted Translation in Fujairah','Golden Translation offers quality translation services in Fujairah, UAE.',NULL,NULL,NULL,'info@goldentranslation.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(209,'Star Translation',125,NULL,'Quality translation in Ras Al Khaimah.','bizcat-125.svg',4.2,NULL,'Al Nakheel, Ras Al Khaimah','+971510007067','971510007067',1,'approved','2026-07-24 16:07:37','bizcat-125.svg','Trusted Translation in Ras Al Khaimah','Star Translation offers quality translation services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@startranslation.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(210,'Al Noor Typing Centres',126,NULL,'Quality typing centres in Ras Al Khaimah.','bizcat-126.svg',4.2,NULL,'Al Nakheel, Ras Al Khaimah','+971510007104','971510007104',1,'approved','2026-07-24 16:07:37','bizcat-126.svg','Trusted Typing Centres in Ras Al Khaimah','Al Noor Typing Centres offers quality typing centres services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@alnoortypingcentres.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(211,'Prime Typing Centres',126,NULL,'Quality typing centres in Umm Al Quwain.','bizcat-126.svg',4.3,NULL,'King Faisal Rd, Umm Al Quwain','+971510007141','971510007141',1,'approved','2026-07-24 16:07:37','bizcat-126.svg','Trusted Typing Centres in Umm Al Quwain','Prime Typing Centres offers quality typing centres services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@primetypingcentres.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(212,'Gulf Document Clearing',127,NULL,'Quality document clearing in Umm Al Quwain.','bizcat-127.svg',4.3,NULL,'King Faisal Rd, Umm Al Quwain','+971510007178','971510007178',1,'approved','2026-07-24 16:07:37','bizcat-127.svg','Trusted Document Clearing in Umm Al Quwain','Gulf Document Clearing offers quality document clearing services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@gulfdocumentclearing.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(213,'Emirates Document Clearing',127,NULL,'Quality document clearing in Dubai.','bizcat-127.svg',4.4,NULL,'Business Bay, Dubai','+971510007215','971510007215',1,'approved','2026-07-24 16:07:37','bizcat-127.svg','Trusted Document Clearing in Dubai','Emirates Document Clearing offers quality document clearing services in Dubai, UAE.',NULL,NULL,NULL,'info@emiratesdocumentclearing.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(214,'Royal Corporate Services',128,NULL,'Quality corporate services in Dubai.','bizcat-128.svg',4.4,NULL,'Business Bay, Dubai','+971510007252','971510007252',1,'approved','2026-07-24 16:07:37','bizcat-128.svg','Trusted Corporate Services in Dubai','Royal Corporate Services offers quality corporate services services in Dubai, UAE.',NULL,NULL,NULL,'info@royalcorporateservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(215,'City Corporate Services',128,NULL,'Quality corporate services in Abu Dhabi.','bizcat-128.svg',4.5,NULL,'Corniche, Abu Dhabi','+971510007289','971510007289',1,'approved','2026-07-24 16:07:37','bizcat-128.svg','Trusted Corporate Services in Abu Dhabi','City Corporate Services offers quality corporate services services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@citycorporateservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(216,'Elite Accounting',129,NULL,'Quality accounting in Abu Dhabi.','bizcat-129.svg',4.5,NULL,'Corniche, Abu Dhabi','+971510007326','971510007326',1,'approved','2026-07-24 16:07:37','bizcat-129.svg','Trusted Accounting in Abu Dhabi','Elite Accounting offers quality accounting services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@eliteaccounting.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(217,'Oasis Accounting',129,NULL,'Quality accounting in Sharjah.','bizcat-129.svg',4.6,NULL,'Al Nahda, Sharjah','+971510007363','971510007363',1,'approved','2026-07-24 16:07:37','bizcat-129.svg','Trusted Accounting in Sharjah','Oasis Accounting offers quality accounting services in Sharjah, UAE.',NULL,NULL,NULL,'info@oasisaccounting.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(218,'Pearl Auditing',130,NULL,'Quality auditing in Sharjah.','bizcat-130.svg',4.6,NULL,'Al Nahda, Sharjah','+971510007400','971510007400',1,'approved','2026-07-24 16:07:37','bizcat-130.svg','Trusted Auditing in Sharjah','Pearl Auditing offers quality auditing services in Sharjah, UAE.',NULL,NULL,NULL,'info@pearlauditing.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(219,'Crown Auditing',130,NULL,'Quality auditing in Ajman.','bizcat-130.svg',4.7,NULL,'Al Rashidiya, Ajman','+971510007437','971510007437',1,'approved','2026-07-24 16:07:37','bizcat-130.svg','Trusted Auditing in Ajman','Crown Auditing offers quality auditing services in Ajman, UAE.',NULL,NULL,NULL,'info@crownauditing.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(220,'Golden Tax Consultancy',131,NULL,'Quality tax consultancy in Ajman.','bizcat-131.svg',4.7,NULL,'Al Rashidiya, Ajman','+971510007474','971510007474',1,'approved','2026-07-24 16:07:37','bizcat-131.svg','Trusted Tax Consultancy in Ajman','Golden Tax Consultancy offers quality tax consultancy services in Ajman, UAE.',NULL,NULL,NULL,'info@goldentaxconsultancy.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(221,'Star Tax Consultancy',131,NULL,'Quality tax consultancy in Fujairah.','bizcat-131.svg',4.8,NULL,'City Centre, Fujairah','+971510007511','971510007511',1,'approved','2026-07-24 16:07:37','bizcat-131.svg','Trusted Tax Consultancy in Fujairah','Star Tax Consultancy offers quality tax consultancy services in Fujairah, UAE.',NULL,NULL,NULL,'info@startaxconsultancy.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(222,'Al Noor Legal Services',132,NULL,'Quality legal services in Fujairah.','bizcat-132.svg',4.8,NULL,'City Centre, Fujairah','+971510007548','971510007548',1,'approved','2026-07-24 16:07:37','bizcat-132.svg','Trusted Legal Services in Fujairah','Al Noor Legal Services offers quality legal services services in Fujairah, UAE.',NULL,NULL,NULL,'info@alnoorlegalservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(223,'Prime Legal Services',132,NULL,'Quality legal services in Ras Al Khaimah.','bizcat-132.svg',4.9,NULL,'Al Nakheel, Ras Al Khaimah','+971510007585','971510007585',1,'approved','2026-07-24 16:07:37','bizcat-132.svg','Trusted Legal Services in Ras Al Khaimah','Prime Legal Services offers quality legal services services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@primelegalservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(224,'Gulf Insurance Brokers',133,NULL,'Quality insurance brokers in Ras Al Khaimah.','bizcat-133.svg',4.9,NULL,'Al Nakheel, Ras Al Khaimah','+971510007622','971510007622',1,'approved','2026-07-24 16:07:37','bizcat-133.svg','Trusted Insurance Brokers in Ras Al Khaimah','Gulf Insurance Brokers offers quality insurance brokers services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@gulfinsurancebrokers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(225,'Emirates Insurance Brokers',133,NULL,'Quality insurance brokers in Umm Al Quwain.','bizcat-133.svg',4.2,NULL,'King Faisal Rd, Umm Al Quwain','+971510007659','971510007659',1,'approved','2026-07-24 16:07:37','bizcat-133.svg','Trusted Insurance Brokers in Umm Al Quwain','Emirates Insurance Brokers offers quality insurance brokers services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@emiratesinsurancebrokers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(226,'Royal Financial Consultants',134,NULL,'Quality financial consultants in Umm Al Quwain.','bizcat-134.svg',4.2,NULL,'King Faisal Rd, Umm Al Quwain','+971510007696','971510007696',1,'approved','2026-07-24 16:07:37','bizcat-134.svg','Trusted Financial Consultants in Umm Al Quwain','Royal Financial Consultants offers quality financial consultants services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@royalfinancialconsultants.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(227,'City Financial Consultants',134,NULL,'Quality financial consultants in Dubai.','bizcat-134.svg',4.3,NULL,'Business Bay, Dubai','+971510007733','971510007733',1,'approved','2026-07-24 16:07:37','bizcat-134.svg','Trusted Financial Consultants in Dubai','City Financial Consultants offers quality financial consultants services in Dubai, UAE.',NULL,NULL,NULL,'info@cityfinancialconsultants.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(228,'Elite Mortgage Advisors',135,NULL,'Quality mortgage advisors in Dubai.','bizcat-135.svg',4.3,NULL,'Business Bay, Dubai','+971510007770','971510007770',1,'approved','2026-07-24 16:07:37','bizcat-135.svg','Trusted Mortgage Advisors in Dubai','Elite Mortgage Advisors offers quality mortgage advisors services in Dubai, UAE.',NULL,NULL,NULL,'info@elitemortgageadvisors.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(229,'Oasis Mortgage Advisors',135,NULL,'Quality mortgage advisors in Abu Dhabi.','bizcat-135.svg',4.4,NULL,'Corniche, Abu Dhabi','+971510007807','971510007807',1,'approved','2026-07-24 16:07:37','bizcat-135.svg','Trusted Mortgage Advisors in Abu Dhabi','Oasis Mortgage Advisors offers quality mortgage advisors services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@oasismortgageadvisors.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(230,'Pearl Building Contractors',136,NULL,'Quality building contractors in Abu Dhabi.','bizcat-136.svg',4.4,NULL,'Corniche, Abu Dhabi','+971510007844','971510007844',1,'approved','2026-07-24 16:07:37','bizcat-136.svg','Trusted Building Contractors in Abu Dhabi','Pearl Building Contractors offers quality building contractors services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@pearlbuildingcontractors.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(231,'Crown Building Contractors',136,NULL,'Quality building contractors in Sharjah.','bizcat-136.svg',4.5,NULL,'Al Nahda, Sharjah','+971510007881','971510007881',1,'approved','2026-07-24 16:07:37','bizcat-136.svg','Trusted Building Contractors in Sharjah','Crown Building Contractors offers quality building contractors services in Sharjah, UAE.',NULL,NULL,NULL,'info@crownbuildingcontractors.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(232,'Golden Civil Works',137,NULL,'Quality civil works in Sharjah.','bizcat-137.svg',4.5,NULL,'Al Nahda, Sharjah','+971510007918','971510007918',1,'approved','2026-07-24 16:07:37','bizcat-137.svg','Trusted Civil Works in Sharjah','Golden Civil Works offers quality civil works services in Sharjah, UAE.',NULL,NULL,NULL,'info@goldencivilworks.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(233,'Star Civil Works',137,NULL,'Quality civil works in Ajman.','bizcat-137.svg',4.6,NULL,'Al Rashidiya, Ajman','+971510007955','971510007955',1,'approved','2026-07-24 16:07:37','bizcat-137.svg','Trusted Civil Works in Ajman','Star Civil Works offers quality civil works services in Ajman, UAE.',NULL,NULL,NULL,'info@starcivilworks.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(234,'Al Noor MEP Services',138,NULL,'Quality mep services in Ajman.','bizcat-138.svg',4.6,NULL,'Al Rashidiya, Ajman','+971510007992','971510007992',1,'approved','2026-07-24 16:07:37','bizcat-138.svg','Trusted MEP Services in Ajman','Al Noor MEP Services offers quality mep services services in Ajman, UAE.',NULL,NULL,NULL,'info@alnoormepservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(235,'Prime MEP Services',138,NULL,'Quality mep services in Fujairah.','bizcat-138.svg',4.7,NULL,'City Centre, Fujairah','+971510008029','971510008029',1,'approved','2026-07-24 16:07:37','bizcat-138.svg','Trusted MEP Services in Fujairah','Prime MEP Services offers quality mep services services in Fujairah, UAE.',NULL,NULL,NULL,'info@primemepservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(236,'Gulf Interior Fit-Out',139,NULL,'Quality interior fit-out in Fujairah.','bizcat-139.svg',4.7,NULL,'City Centre, Fujairah','+971510008066','971510008066',1,'approved','2026-07-24 16:07:37','bizcat-139.svg','Trusted Interior Fit-Out in Fujairah','Gulf Interior Fit-Out offers quality interior fit-out services in Fujairah, UAE.',NULL,NULL,NULL,'info@gulfinteriorfitout.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(237,'Emirates Interior Fit-Out',139,NULL,'Quality interior fit-out in Ras Al Khaimah.','bizcat-139.svg',4.8,NULL,'Al Nakheel, Ras Al Khaimah','+971510008103','971510008103',1,'approved','2026-07-24 16:07:37','bizcat-139.svg','Trusted Interior Fit-Out in Ras Al Khaimah','Emirates Interior Fit-Out offers quality interior fit-out services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@emiratesinteriorfitout.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(238,'Royal Building Materials',140,NULL,'Quality building materials in Ras Al Khaimah.','bizcat-140.svg',4.8,NULL,'Al Nakheel, Ras Al Khaimah','+971510008140','971510008140',1,'approved','2026-07-24 16:07:37','bizcat-140.svg','Trusted Building Materials in Ras Al Khaimah','Royal Building Materials offers quality building materials services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@royalbuildingmaterials.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(239,'City Building Materials',140,NULL,'Quality building materials in Umm Al Quwain.','bizcat-140.svg',4.9,NULL,'King Faisal Rd, Umm Al Quwain','+971510008177','971510008177',1,'approved','2026-07-24 16:07:37','bizcat-140.svg','Trusted Building Materials in Umm Al Quwain','City Building Materials offers quality building materials services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@citybuildingmaterials.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(240,'Elite Equipment Rental',141,NULL,'Quality equipment rental in Umm Al Quwain.','bizcat-141.svg',4.9,NULL,'King Faisal Rd, Umm Al Quwain','+971510008214','971510008214',1,'approved','2026-07-24 16:07:37','bizcat-141.svg','Trusted Equipment Rental in Umm Al Quwain','Elite Equipment Rental offers quality equipment rental services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@eliteequipmentrental.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(241,'Oasis Equipment Rental',141,NULL,'Quality equipment rental in Dubai.','bizcat-141.svg',4.2,NULL,'Business Bay, Dubai','+971510008251','971510008251',1,'approved','2026-07-24 16:07:37','bizcat-141.svg','Trusted Equipment Rental in Dubai','Oasis Equipment Rental offers quality equipment rental services in Dubai, UAE.',NULL,NULL,NULL,'info@oasisequipmentrental.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(242,'Pearl Aluminium and Glass Works',142,NULL,'Quality aluminium and glass works in Dubai.','bizcat-142.svg',4.2,NULL,'Business Bay, Dubai','+971510008288','971510008288',1,'approved','2026-07-24 16:07:37','bizcat-142.svg','Trusted Aluminium and Glass Works in Dubai','Pearl Aluminium and Glass Works offers quality aluminium and glass works services in Dubai, UAE.',NULL,NULL,NULL,'info@pearlaluminiumandglassworks.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(243,'Crown Aluminium and Glass Works',142,NULL,'Quality aluminium and glass works in Abu Dhabi.','bizcat-142.svg',4.3,NULL,'Corniche, Abu Dhabi','+971510008325','971510008325',1,'approved','2026-07-24 16:07:37','bizcat-142.svg','Trusted Aluminium and Glass Works in Abu Dhabi','Crown Aluminium and Glass Works offers quality aluminium and glass works services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@crownaluminiumandglassworks.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(244,'Golden Courier Services',143,NULL,'Quality courier services in Abu Dhabi.','bizcat-143.svg',4.3,NULL,'Corniche, Abu Dhabi','+971510008362','971510008362',1,'approved','2026-07-24 16:07:37','bizcat-143.svg','Trusted Courier Services in Abu Dhabi','Golden Courier Services offers quality courier services services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@goldencourierservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(245,'Star Courier Services',143,NULL,'Quality courier services in Sharjah.','bizcat-143.svg',4.4,NULL,'Al Nahda, Sharjah','+971510008399','971510008399',1,'approved','2026-07-24 16:07:37','bizcat-143.svg','Trusted Courier Services in Sharjah','Star Courier Services offers quality courier services services in Sharjah, UAE.',NULL,NULL,NULL,'info@starcourierservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(246,'Al Noor Cargo Companies',144,NULL,'Quality cargo companies in Sharjah.','bizcat-144.svg',4.4,NULL,'Al Nahda, Sharjah','+971510008436','971510008436',1,'approved','2026-07-24 16:07:37','bizcat-144.svg','Trusted Cargo Companies in Sharjah','Al Noor Cargo Companies offers quality cargo companies services in Sharjah, UAE.',NULL,NULL,NULL,'info@alnoorcargocompanies.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(247,'Prime Cargo Companies',144,NULL,'Quality cargo companies in Ajman.','bizcat-144.svg',4.5,NULL,'Al Rashidiya, Ajman','+971510008473','971510008473',1,'approved','2026-07-24 16:07:37','bizcat-144.svg','Trusted Cargo Companies in Ajman','Prime Cargo Companies offers quality cargo companies services in Ajman, UAE.',NULL,NULL,NULL,'info@primecargocompanies.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(248,'Gulf Freight Forwarding',145,NULL,'Quality freight forwarding in Ajman.','bizcat-145.svg',4.5,NULL,'Al Rashidiya, Ajman','+971510008510','971510008510',1,'approved','2026-07-24 16:07:37','bizcat-145.svg','Trusted Freight Forwarding in Ajman','Gulf Freight Forwarding offers quality freight forwarding services in Ajman, UAE.',NULL,NULL,NULL,'info@gulffreightforwarding.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(249,'Emirates Freight Forwarding',145,NULL,'Quality freight forwarding in Fujairah.','bizcat-145.svg',4.6,NULL,'City Centre, Fujairah','+971510008547','971510008547',1,'approved','2026-07-24 16:07:37','bizcat-145.svg','Trusted Freight Forwarding in Fujairah','Emirates Freight Forwarding offers quality freight forwarding services in Fujairah, UAE.',NULL,NULL,NULL,'info@emiratesfreightforwarding.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(250,'Royal Warehousing',146,NULL,'Quality warehousing in Fujairah.','bizcat-146.svg',4.6,NULL,'City Centre, Fujairah','+971510008584','971510008584',1,'approved','2026-07-24 16:07:37','bizcat-146.svg','Trusted Warehousing in Fujairah','Royal Warehousing offers quality warehousing services in Fujairah, UAE.',NULL,NULL,NULL,'info@royalwarehousing.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(251,'City Warehousing',146,NULL,'Quality warehousing in Ras Al Khaimah.','bizcat-146.svg',4.7,NULL,'Al Nakheel, Ras Al Khaimah','+971510008621','971510008621',1,'approved','2026-07-24 16:07:37','bizcat-146.svg','Trusted Warehousing in Ras Al Khaimah','City Warehousing offers quality warehousing services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@citywarehousing.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(252,'Elite Moving Companies',147,NULL,'Quality moving companies in Ras Al Khaimah.','bizcat-147.svg',4.7,NULL,'Al Nakheel, Ras Al Khaimah','+971510008658','971510008658',1,'approved','2026-07-24 16:07:37','bizcat-147.svg','Trusted Moving Companies in Ras Al Khaimah','Elite Moving Companies offers quality moving companies services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@elitemovingcompanies.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(253,'Oasis Moving Companies',147,NULL,'Quality moving companies in Umm Al Quwain.','bizcat-147.svg',4.8,NULL,'King Faisal Rd, Umm Al Quwain','+971510008695','971510008695',1,'approved','2026-07-24 16:07:37','bizcat-147.svg','Trusted Moving Companies in Umm Al Quwain','Oasis Moving Companies offers quality moving companies services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@oasismovingcompanies.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(254,'Pearl Delivery Services',148,NULL,'Quality delivery services in Umm Al Quwain.','bizcat-148.svg',4.8,NULL,'King Faisal Rd, Umm Al Quwain','+971510008732','971510008732',1,'approved','2026-07-24 16:07:37','bizcat-148.svg','Trusted Delivery Services in Umm Al Quwain','Pearl Delivery Services offers quality delivery services services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@pearldeliveryservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(255,'Crown Delivery Services',148,NULL,'Quality delivery services in Dubai.','bizcat-148.svg',4.9,NULL,'Business Bay, Dubai','+971510008769','971510008769',1,'approved','2026-07-24 16:07:37','bizcat-148.svg','Trusted Delivery Services in Dubai','Crown Delivery Services offers quality delivery services services in Dubai, UAE.',NULL,NULL,NULL,'info@crowndeliveryservices.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(256,'Golden Bus Rentals',149,NULL,'Quality bus rentals in Dubai.','bizcat-149.svg',4.9,NULL,'Business Bay, Dubai','+971510008806','971510008806',1,'approved','2026-07-24 16:07:37','bizcat-149.svg','Trusted Bus Rentals in Dubai','Golden Bus Rentals offers quality bus rentals services in Dubai, UAE.',NULL,NULL,NULL,'info@goldenbusrentals.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(257,'Star Bus Rentals',149,NULL,'Quality bus rentals in Abu Dhabi.','bizcat-149.svg',4.2,NULL,'Corniche, Abu Dhabi','+971510008843','971510008843',1,'approved','2026-07-24 16:07:37','bizcat-149.svg','Trusted Bus Rentals in Abu Dhabi','Star Bus Rentals offers quality bus rentals services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@starbusrentals.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(258,'Al Noor Limousine Rentals',150,NULL,'Quality limousine rentals in Abu Dhabi.','bizcat-150.svg',4.2,NULL,'Corniche, Abu Dhabi','+971510008880','971510008880',1,'approved','2026-07-24 16:07:37','bizcat-150.svg','Trusted Limousine Rentals in Abu Dhabi','Al Noor Limousine Rentals offers quality limousine rentals services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@alnoorlimousinerentals.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(259,'Prime Limousine Rentals',150,NULL,'Quality limousine rentals in Sharjah.','bizcat-150.svg',4.3,NULL,'Al Nahda, Sharjah','+971510008917','971510008917',1,'approved','2026-07-24 16:07:37','bizcat-150.svg','Trusted Limousine Rentals in Sharjah','Prime Limousine Rentals offers quality limousine rentals services in Sharjah, UAE.',NULL,NULL,NULL,'info@primelimousinerentals.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(260,'Gulf Security Companies',151,NULL,'Quality security companies in Sharjah.','bizcat-151.svg',4.3,NULL,'Al Nahda, Sharjah','+971510008954','971510008954',1,'approved','2026-07-24 16:07:37','bizcat-151.svg','Trusted Security Companies in Sharjah','Gulf Security Companies offers quality security companies services in Sharjah, UAE.',NULL,NULL,NULL,'info@gulfsecuritycompanies.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(261,'Emirates Security Companies',151,NULL,'Quality security companies in Ajman.','bizcat-151.svg',4.4,NULL,'Al Rashidiya, Ajman','+971510008991','971510008991',1,'approved','2026-07-24 16:07:37','bizcat-151.svg','Trusted Security Companies in Ajman','Emirates Security Companies offers quality security companies services in Ajman, UAE.',NULL,NULL,NULL,'info@emiratessecuritycompanies.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(262,'Royal Security Guards',152,NULL,'Quality security guards in Ajman.','bizcat-152.svg',4.4,NULL,'Al Rashidiya, Ajman','+971510009028','971510009028',1,'approved','2026-07-24 16:07:37','bizcat-152.svg','Trusted Security Guards in Ajman','Royal Security Guards offers quality security guards services in Ajman, UAE.',NULL,NULL,NULL,'info@royalsecurityguards.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(263,'City Security Guards',152,NULL,'Quality security guards in Fujairah.','bizcat-152.svg',4.5,NULL,'City Centre, Fujairah','+971510009065','971510009065',1,'approved','2026-07-24 16:07:37','bizcat-152.svg','Trusted Security Guards in Fujairah','City Security Guards offers quality security guards services in Fujairah, UAE.',NULL,NULL,NULL,'info@citysecurityguards.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(264,'Elite CCTV Systems',153,NULL,'Quality cctv systems in Fujairah.','bizcat-153.svg',4.5,NULL,'City Centre, Fujairah','+971510009102','971510009102',1,'approved','2026-07-24 16:07:37','bizcat-153.svg','Trusted CCTV Systems in Fujairah','Elite CCTV Systems offers quality cctv systems services in Fujairah, UAE.',NULL,NULL,NULL,'info@elitecctvsystems.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(265,'Oasis CCTV Systems',153,NULL,'Quality cctv systems in Ras Al Khaimah.','bizcat-153.svg',4.6,NULL,'Al Nakheel, Ras Al Khaimah','+971510009139','971510009139',1,'approved','2026-07-24 16:07:37','bizcat-153.svg','Trusted CCTV Systems in Ras Al Khaimah','Oasis CCTV Systems offers quality cctv systems services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@oasiscctvsystems.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(266,'Pearl Access Control',154,NULL,'Quality access control in Ras Al Khaimah.','bizcat-154.svg',4.6,NULL,'Al Nakheel, Ras Al Khaimah','+971510009176','971510009176',1,'approved','2026-07-24 16:07:37','bizcat-154.svg','Trusted Access Control in Ras Al Khaimah','Pearl Access Control offers quality access control services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@pearlaccesscontrol.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(267,'Crown Access Control',154,NULL,'Quality access control in Umm Al Quwain.','bizcat-154.svg',4.7,NULL,'King Faisal Rd, Umm Al Quwain','+971510009213','971510009213',1,'approved','2026-07-24 16:07:37','bizcat-154.svg','Trusted Access Control in Umm Al Quwain','Crown Access Control offers quality access control services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@crownaccesscontrol.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(268,'Golden Event Security',155,NULL,'Quality event security in Umm Al Quwain.','bizcat-155.svg',4.7,NULL,'King Faisal Rd, Umm Al Quwain','+971510009250','971510009250',1,'approved','2026-07-24 16:07:37','bizcat-155.svg','Trusted Event Security in Umm Al Quwain','Golden Event Security offers quality event security services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@goldeneventsecurity.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(269,'Star Event Security',155,NULL,'Quality event security in Dubai.','bizcat-155.svg',4.8,NULL,'Business Bay, Dubai','+971510009287','971510009287',1,'approved','2026-07-24 16:07:37','bizcat-155.svg','Trusted Event Security in Dubai','Star Event Security offers quality event security services in Dubai, UAE.',NULL,NULL,NULL,'info@stareventsecurity.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(270,'Al Noor Fire Equipment',156,NULL,'Quality fire equipment in Dubai.','bizcat-156.svg',4.8,NULL,'Business Bay, Dubai','+971510009324','971510009324',1,'approved','2026-07-24 16:07:37','bizcat-156.svg','Trusted Fire Equipment in Dubai','Al Noor Fire Equipment offers quality fire equipment services in Dubai, UAE.',NULL,NULL,NULL,'info@alnoorfireequipment.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(271,'Prime Fire Equipment',156,NULL,'Quality fire equipment in Abu Dhabi.','bizcat-156.svg',4.9,NULL,'Corniche, Abu Dhabi','+971510009361','971510009361',1,'approved','2026-07-24 16:07:37','bizcat-156.svg','Trusted Fire Equipment in Abu Dhabi','Prime Fire Equipment offers quality fire equipment services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@primefireequipment.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(272,'Gulf PPE Suppliers',157,NULL,'Quality ppe suppliers in Abu Dhabi.','bizcat-157.svg',4.9,NULL,'Corniche, Abu Dhabi','+971510009398','971510009398',1,'approved','2026-07-24 16:07:37','bizcat-157.svg','Trusted PPE Suppliers in Abu Dhabi','Gulf PPE Suppliers offers quality ppe suppliers services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@gulfppesuppliers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(273,'Emirates PPE Suppliers',157,NULL,'Quality ppe suppliers in Sharjah.','bizcat-157.svg',4.2,NULL,'Al Nahda, Sharjah','+971510009435','971510009435',1,'approved','2026-07-24 16:07:37','bizcat-157.svg','Trusted PPE Suppliers in Sharjah','Emirates PPE Suppliers offers quality ppe suppliers services in Sharjah, UAE.',NULL,NULL,NULL,'info@emiratesppesuppliers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(274,'Royal Safety Equipment',158,NULL,'Quality safety equipment in Sharjah.','bizcat-158.svg',4.2,NULL,'Al Nahda, Sharjah','+971510009472','971510009472',1,'approved','2026-07-24 16:07:37','bizcat-158.svg','Trusted Safety Equipment in Sharjah','Royal Safety Equipment offers quality safety equipment services in Sharjah, UAE.',NULL,NULL,NULL,'info@royalsafetyequipment.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(275,'City Safety Equipment',158,NULL,'Quality safety equipment in Ajman.','bizcat-158.svg',4.3,NULL,'Al Rashidiya, Ajman','+971510009509','971510009509',1,'approved','2026-07-24 16:07:37','bizcat-158.svg','Trusted Safety Equipment in Ajman','City Safety Equipment offers quality safety equipment services in Ajman, UAE.',NULL,NULL,NULL,'info@citysafetyequipment.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(276,'Elite Fire Alarms',159,NULL,'Quality fire alarms in Ajman.','bizcat-159.svg',4.3,NULL,'Al Rashidiya, Ajman','+971510009546','971510009546',1,'approved','2026-07-24 16:07:37','bizcat-159.svg','Trusted Fire Alarms in Ajman','Elite Fire Alarms offers quality fire alarms services in Ajman, UAE.',NULL,NULL,NULL,'info@elitefirealarms.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(277,'Oasis Fire Alarms',159,NULL,'Quality fire alarms in Fujairah.','bizcat-159.svg',4.4,NULL,'City Centre, Fujairah','+971510009583','971510009583',1,'approved','2026-07-24 16:07:37','bizcat-159.svg','Trusted Fire Alarms in Fujairah','Oasis Fire Alarms offers quality fire alarms services in Fujairah, UAE.',NULL,NULL,NULL,'info@oasisfirealarms.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(278,'Pearl Gas Detectors',160,NULL,'Quality gas detectors in Fujairah.','bizcat-160.svg',4.4,NULL,'City Centre, Fujairah','+971510009620','971510009620',1,'approved','2026-07-24 16:07:37','bizcat-160.svg','Trusted Gas Detectors in Fujairah','Pearl Gas Detectors offers quality gas detectors services in Fujairah, UAE.',NULL,NULL,NULL,'info@pearlgasdetectors.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(279,'Crown Gas Detectors',160,NULL,'Quality gas detectors in Ras Al Khaimah.','bizcat-160.svg',4.5,NULL,'Al Nakheel, Ras Al Khaimah','+971510009657','971510009657',1,'approved','2026-07-24 16:07:37','bizcat-160.svg','Trusted Gas Detectors in Ras Al Khaimah','Crown Gas Detectors offers quality gas detectors services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@crowngasdetectors.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(280,'Golden Safety Signage',161,NULL,'Quality safety signage in Ras Al Khaimah.','bizcat-161.svg',4.5,NULL,'Al Nakheel, Ras Al Khaimah','+971510009694','971510009694',1,'approved','2026-07-24 16:07:37','bizcat-161.svg','Trusted Safety Signage in Ras Al Khaimah','Golden Safety Signage offers quality safety signage services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@goldensafetysignage.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(281,'Star Safety Signage',161,NULL,'Quality safety signage in Umm Al Quwain.','bizcat-161.svg',4.6,NULL,'King Faisal Rd, Umm Al Quwain','+971510009731','971510009731',1,'approved','2026-07-24 16:07:37','bizcat-161.svg','Trusted Safety Signage in Umm Al Quwain','Star Safety Signage offers quality safety signage services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@starsafetysignage.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(282,'Al Noor Event Management',162,NULL,'Quality event management in Umm Al Quwain.','bizcat-162.svg',4.6,NULL,'King Faisal Rd, Umm Al Quwain','+971510009768','971510009768',1,'approved','2026-07-24 16:07:37','bizcat-162.svg','Trusted Event Management in Umm Al Quwain','Al Noor Event Management offers quality event management services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@alnooreventmanagement.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(283,'Prime Event Management',162,NULL,'Quality event management in Dubai.','bizcat-162.svg',4.7,NULL,'Business Bay, Dubai','+971510009805','971510009805',1,'approved','2026-07-24 16:07:37','bizcat-162.svg','Trusted Event Management in Dubai','Prime Event Management offers quality event management services in Dubai, UAE.',NULL,NULL,NULL,'info@primeeventmanagement.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(284,'Gulf Wedding Planners',163,NULL,'Quality wedding planners in Dubai.','bizcat-163.svg',4.7,NULL,'Business Bay, Dubai','+971510009842','971510009842',1,'approved','2026-07-24 16:07:37','bizcat-163.svg','Trusted Wedding Planners in Dubai','Gulf Wedding Planners offers quality wedding planners services in Dubai, UAE.',NULL,NULL,NULL,'info@gulfweddingplanners.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(285,'Emirates Wedding Planners',163,NULL,'Quality wedding planners in Abu Dhabi.','bizcat-163.svg',4.8,NULL,'Corniche, Abu Dhabi','+971510009879','971510009879',1,'approved','2026-07-24 16:07:37','bizcat-163.svg','Trusted Wedding Planners in Abu Dhabi','Emirates Wedding Planners offers quality wedding planners services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@emiratesweddingplanners.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(286,'Royal Birthday Planners',164,NULL,'Quality birthday planners in Abu Dhabi.','bizcat-164.svg',4.8,NULL,'Corniche, Abu Dhabi','+971510009916','971510009916',1,'approved','2026-07-24 16:07:37','bizcat-164.svg','Trusted Birthday Planners in Abu Dhabi','Royal Birthday Planners offers quality birthday planners services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@royalbirthdayplanners.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(287,'City Birthday Planners',164,NULL,'Quality birthday planners in Sharjah.','bizcat-164.svg',4.9,NULL,'Al Nahda, Sharjah','+971510009953','971510009953',1,'approved','2026-07-24 16:07:37','bizcat-164.svg','Trusted Birthday Planners in Sharjah','City Birthday Planners offers quality birthday planners services in Sharjah, UAE.',NULL,NULL,NULL,'info@citybirthdayplanners.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(288,'Elite Event Decorators',165,NULL,'Quality event decorators in Sharjah.','bizcat-165.svg',4.9,NULL,'Al Nahda, Sharjah','+971510009990','971510009990',1,'approved','2026-07-24 16:07:37','bizcat-165.svg','Trusted Event Decorators in Sharjah','Elite Event Decorators offers quality event decorators services in Sharjah, UAE.',NULL,NULL,NULL,'info@eliteeventdecorators.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(289,'Oasis Event Decorators',165,NULL,'Quality event decorators in Ajman.','bizcat-165.svg',4.2,NULL,'Al Rashidiya, Ajman','+971510010027','971510010027',1,'approved','2026-07-24 16:07:37','bizcat-165.svg','Trusted Event Decorators in Ajman','Oasis Event Decorators offers quality event decorators services in Ajman, UAE.',NULL,NULL,NULL,'info@oasiseventdecorators.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(290,'Pearl Party Halls',166,NULL,'Quality party halls in Ajman.','bizcat-166.svg',4.2,NULL,'Al Rashidiya, Ajman','+971510010064','971510010064',1,'approved','2026-07-24 16:07:37','bizcat-166.svg','Trusted Party Halls in Ajman','Pearl Party Halls offers quality party halls services in Ajman, UAE.',NULL,NULL,NULL,'info@pearlpartyhalls.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(291,'Crown Party Halls',166,NULL,'Quality party halls in Fujairah.','bizcat-166.svg',4.3,NULL,'City Centre, Fujairah','+971510010101','971510010101',1,'approved','2026-07-24 16:07:37','bizcat-166.svg','Trusted Party Halls in Fujairah','Crown Party Halls offers quality party halls services in Fujairah, UAE.',NULL,NULL,NULL,'info@crownpartyhalls.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(292,'Golden DJs',167,NULL,'Quality djs in Fujairah.','bizcat-167.svg',4.3,NULL,'City Centre, Fujairah','+971510010138','971510010138',1,'approved','2026-07-24 16:07:37','bizcat-167.svg','Trusted DJs in Fujairah','Golden DJs offers quality djs services in Fujairah, UAE.',NULL,NULL,NULL,'info@goldendjs.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(293,'Star DJs',167,NULL,'Quality djs in Ras Al Khaimah.','bizcat-167.svg',4.4,NULL,'Al Nakheel, Ras Al Khaimah','+971510010175','971510010175',1,'approved','2026-07-24 16:07:37','bizcat-167.svg','Trusted DJs in Ras Al Khaimah','Star DJs offers quality djs services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@stardjs.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(294,'Al Noor Catering',168,NULL,'Quality catering in Ras Al Khaimah.','bizcat-168.svg',4.4,NULL,'Al Nakheel, Ras Al Khaimah','+971510010212','971510010212',1,'approved','2026-07-24 16:07:37','bizcat-168.svg','Trusted Catering in Ras Al Khaimah','Al Noor Catering offers quality catering services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@alnoorcatering.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(295,'Prime Catering',168,NULL,'Quality catering in Umm Al Quwain.','bizcat-168.svg',4.5,NULL,'King Faisal Rd, Umm Al Quwain','+971510010249','971510010249',1,'approved','2026-07-24 16:07:37','bizcat-168.svg','Trusted Catering in Umm Al Quwain','Prime Catering offers quality catering services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@primecatering.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(296,'Gulf Sound Rental',169,NULL,'Quality sound rental in Umm Al Quwain.','bizcat-169.svg',4.5,NULL,'King Faisal Rd, Umm Al Quwain','+971510010286','971510010286',1,'approved','2026-07-24 16:07:37','bizcat-169.svg','Trusted Sound Rental in Umm Al Quwain','Gulf Sound Rental offers quality sound rental services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@gulfsoundrental.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(297,'Emirates Sound Rental',169,NULL,'Quality sound rental in Dubai.','bizcat-169.svg',4.6,NULL,'Business Bay, Dubai','+971510010323','971510010323',1,'approved','2026-07-24 16:07:37','bizcat-169.svg','Trusted Sound Rental in Dubai','Emirates Sound Rental offers quality sound rental services in Dubai, UAE.',NULL,NULL,NULL,'info@emiratessoundrental.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(298,'Royal Lighting Rental',170,NULL,'Quality lighting rental in Dubai.','bizcat-170.svg',4.6,NULL,'Business Bay, Dubai','+971510010360','971510010360',1,'approved','2026-07-24 16:07:37','bizcat-170.svg','Trusted Lighting Rental in Dubai','Royal Lighting Rental offers quality lighting rental services in Dubai, UAE.',NULL,NULL,NULL,'info@royallightingrental.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(299,'City Lighting Rental',170,NULL,'Quality lighting rental in Abu Dhabi.','bizcat-170.svg',4.7,NULL,'Corniche, Abu Dhabi','+971510010397','971510010397',1,'approved','2026-07-24 16:07:37','bizcat-170.svg','Trusted Lighting Rental in Abu Dhabi','City Lighting Rental offers quality lighting rental services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@citylightingrental.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(300,'Elite Radio Jockeys',171,NULL,'Quality radio jockeys in Abu Dhabi.','bizcat-171.svg',4.7,NULL,'Corniche, Abu Dhabi','+971510010434','971510010434',1,'approved','2026-07-24 16:07:37','bizcat-171.svg','Trusted Radio Jockeys in Abu Dhabi','Elite Radio Jockeys offers quality radio jockeys services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@eliteradiojockeys.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(301,'Oasis Radio Jockeys',171,NULL,'Quality radio jockeys in Sharjah.','bizcat-171.svg',4.8,NULL,'Al Nahda, Sharjah','+971510010471','971510010471',1,'approved','2026-07-24 16:07:37','bizcat-171.svg','Trusted Radio Jockeys in Sharjah','Oasis Radio Jockeys offers quality radio jockeys services in Sharjah, UAE.',NULL,NULL,NULL,'info@oasisradiojockeys.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(302,'Pearl Video Jockeys',172,NULL,'Quality video jockeys in Sharjah.','bizcat-172.svg',4.8,NULL,'Al Nahda, Sharjah','+971510010508','971510010508',1,'approved','2026-07-24 16:07:37','bizcat-172.svg','Trusted Video Jockeys in Sharjah','Pearl Video Jockeys offers quality video jockeys services in Sharjah, UAE.',NULL,NULL,NULL,'info@pearlvideojockeys.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(303,'Crown Video Jockeys',172,NULL,'Quality video jockeys in Ajman.','bizcat-172.svg',4.9,NULL,'Al Rashidiya, Ajman','+971510010545','971510010545',1,'approved','2026-07-24 16:07:37','bizcat-172.svg','Trusted Video Jockeys in Ajman','Crown Video Jockeys offers quality video jockeys services in Ajman, UAE.',NULL,NULL,NULL,'info@crownvideojockeys.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(304,'Golden TV Presenters',173,NULL,'Quality tv presenters in Ajman.','bizcat-173.svg',4.9,NULL,'Al Rashidiya, Ajman','+971510010582','971510010582',1,'approved','2026-07-24 16:07:37','bizcat-173.svg','Trusted TV Presenters in Ajman','Golden TV Presenters offers quality tv presenters services in Ajman, UAE.',NULL,NULL,NULL,'info@goldentvpresenters.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(305,'Star TV Presenters',173,NULL,'Quality tv presenters in Fujairah.','bizcat-173.svg',4.2,NULL,'City Centre, Fujairah','+971510010619','971510010619',1,'approved','2026-07-24 16:07:37','bizcat-173.svg','Trusted TV Presenters in Fujairah','Star TV Presenters offers quality tv presenters services in Fujairah, UAE.',NULL,NULL,NULL,'info@startvpresenters.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(306,'Al Noor News Anchors',174,NULL,'Quality news anchors in Fujairah.','bizcat-174.svg',4.2,NULL,'City Centre, Fujairah','+971510010656','971510010656',1,'approved','2026-07-24 16:07:37','bizcat-174.svg','Trusted News Anchors in Fujairah','Al Noor News Anchors offers quality news anchors services in Fujairah, UAE.',NULL,NULL,NULL,'info@alnoornewsanchors.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(307,'Prime News Anchors',174,NULL,'Quality news anchors in Ras Al Khaimah.','bizcat-174.svg',4.3,NULL,'Al Nakheel, Ras Al Khaimah','+971510010693','971510010693',1,'approved','2026-07-24 16:07:37','bizcat-174.svg','Trusted News Anchors in Ras Al Khaimah','Prime News Anchors offers quality news anchors services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@primenewsanchors.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(308,'Gulf Actors',175,NULL,'Quality actors in Ras Al Khaimah.','bizcat-175.svg',4.3,NULL,'Al Nakheel, Ras Al Khaimah','+971510010730','971510010730',1,'approved','2026-07-24 16:07:37','bizcat-175.svg','Trusted Actors in Ras Al Khaimah','Gulf Actors offers quality actors services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@gulfactors.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(309,'Emirates Actors',175,NULL,'Quality actors in Umm Al Quwain.','bizcat-175.svg',4.4,NULL,'King Faisal Rd, Umm Al Quwain','+971510010767','971510010767',1,'approved','2026-07-24 16:07:37','bizcat-175.svg','Trusted Actors in Umm Al Quwain','Emirates Actors offers quality actors services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@emiratesactors.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(310,'Royal Models',176,NULL,'Quality models in Umm Al Quwain.','bizcat-176.svg',4.4,NULL,'King Faisal Rd, Umm Al Quwain','+971510010804','971510010804',1,'approved','2026-07-24 16:07:37','bizcat-176.svg','Trusted Models in Umm Al Quwain','Royal Models offers quality models services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@royalmodels.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(311,'City Models',176,NULL,'Quality models in Dubai.','bizcat-176.svg',4.5,NULL,'Business Bay, Dubai','+971510010841','971510010841',1,'approved','2026-07-24 16:07:37','bizcat-176.svg','Trusted Models in Dubai','City Models offers quality models services in Dubai, UAE.',NULL,NULL,NULL,'info@citymodels.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(312,'Elite Singers',177,NULL,'Quality singers in Dubai.','bizcat-177.svg',4.5,NULL,'Business Bay, Dubai','+971510010878','971510010878',1,'approved','2026-07-24 16:07:37','bizcat-177.svg','Trusted Singers in Dubai','Elite Singers offers quality singers services in Dubai, UAE.',NULL,NULL,NULL,'info@elitesingers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(313,'Oasis Singers',177,NULL,'Quality singers in Abu Dhabi.','bizcat-177.svg',4.6,NULL,'Corniche, Abu Dhabi','+971510010915','971510010915',1,'approved','2026-07-24 16:07:37','bizcat-177.svg','Trusted Singers in Abu Dhabi','Oasis Singers offers quality singers services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@oasissingers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(314,'Pearl Musicians',178,NULL,'Quality musicians in Abu Dhabi.','bizcat-178.svg',4.6,NULL,'Corniche, Abu Dhabi','+971510010952','971510010952',1,'approved','2026-07-24 16:07:37','bizcat-178.svg','Trusted Musicians in Abu Dhabi','Pearl Musicians offers quality musicians services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@pearlmusicians.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(315,'Crown Musicians',178,NULL,'Quality musicians in Sharjah.','bizcat-178.svg',4.7,NULL,'Al Nahda, Sharjah','+971510010989','971510010989',1,'approved','2026-07-24 16:07:37','bizcat-178.svg','Trusted Musicians in Sharjah','Crown Musicians offers quality musicians services in Sharjah, UAE.',NULL,NULL,NULL,'info@crownmusicians.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(316,'Golden Comedians',179,NULL,'Quality comedians in Sharjah.','bizcat-179.svg',4.7,NULL,'Al Nahda, Sharjah','+971510011026','971510011026',1,'approved','2026-07-24 16:07:37','bizcat-179.svg','Trusted Comedians in Sharjah','Golden Comedians offers quality comedians services in Sharjah, UAE.',NULL,NULL,NULL,'info@goldencomedians.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(317,'Star Comedians',179,NULL,'Quality comedians in Ajman.','bizcat-179.svg',4.8,NULL,'Al Rashidiya, Ajman','+971510011063','971510011063',1,'approved','2026-07-24 16:07:37','bizcat-179.svg','Trusted Comedians in Ajman','Star Comedians offers quality comedians services in Ajman, UAE.',NULL,NULL,NULL,'info@starcomedians.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(318,'Al Noor Production Houses',180,NULL,'Quality production houses in Ajman.','bizcat-180.svg',4.8,NULL,'Al Rashidiya, Ajman','+971510011100','971510011100',1,'approved','2026-07-24 16:07:37','bizcat-180.svg','Trusted Production Houses in Ajman','Al Noor Production Houses offers quality production houses services in Ajman, UAE.',NULL,NULL,NULL,'info@alnoorproductionhouses.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(319,'Prime Production Houses',180,NULL,'Quality production houses in Fujairah.','bizcat-180.svg',4.9,NULL,'City Centre, Fujairah','+971510011137','971510011137',1,'approved','2026-07-24 16:07:37','bizcat-180.svg','Trusted Production Houses in Fujairah','Prime Production Houses offers quality production houses services in Fujairah, UAE.',NULL,NULL,NULL,'info@primeproductionhouses.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(320,'Gulf Bloggers',182,NULL,'Quality bloggers in Fujairah.','bizcat-182.svg',4.9,NULL,'City Centre, Fujairah','+971510011174','971510011174',1,'approved','2026-07-24 16:07:37','bizcat-182.svg','Trusted Bloggers in Fujairah','Gulf Bloggers offers quality bloggers services in Fujairah, UAE.',NULL,NULL,NULL,'info@gulfbloggers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(321,'Emirates Bloggers',182,NULL,'Quality bloggers in Ras Al Khaimah.','bizcat-182.svg',4.2,NULL,'Al Nakheel, Ras Al Khaimah','+971510011211','971510011211',1,'approved','2026-07-24 16:07:37','bizcat-182.svg','Trusted Bloggers in Ras Al Khaimah','Emirates Bloggers offers quality bloggers services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@emiratesbloggers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(322,'Royal Podcasters',183,NULL,'Quality podcasters in Ras Al Khaimah.','bizcat-183.svg',4.2,NULL,'Al Nakheel, Ras Al Khaimah','+971510011248','971510011248',1,'approved','2026-07-24 16:07:37','bizcat-183.svg','Trusted Podcasters in Ras Al Khaimah','Royal Podcasters offers quality podcasters services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@royalpodcasters.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL),(323,'City Podcasters',183,NULL,'Quality podcasters in Umm Al Quwain.','bizcat-183.svg',4.3,NULL,'King Faisal Rd, Umm Al Quwain','+971510011285','971510011285',1,'approved','2026-07-24 16:07:37','bizcat-183.svg','Trusted Podcasters in Umm Al Quwain','City Podcasters offers quality podcasters services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@citypodcasters.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(324,'Elite Social-Media Influencers',184,NULL,'Quality social-media influencers in Umm Al Quwain.','bizcat-184.svg',4.3,NULL,'King Faisal Rd, Umm Al Quwain','+971510011322','971510011322',1,'approved','2026-07-24 16:07:37','bizcat-184.svg','Trusted Social-Media Influencers in Umm Al Quwain','Elite Social-Media Influencers offers quality social-media influencers services in Umm Al Quwain, UAE.',NULL,NULL,NULL,'info@elitesocialmediainfluencers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umm Al Quwain',NULL,NULL,NULL,NULL,NULL),(325,'Oasis Social-Media Influencers',184,NULL,'Quality social-media influencers in Dubai.','bizcat-184.svg',4.4,NULL,'Business Bay, Dubai','+971510011359','971510011359',1,'approved','2026-07-24 16:07:37','bizcat-184.svg','Trusted Social-Media Influencers in Dubai','Oasis Social-Media Influencers offers quality social-media influencers services in Dubai, UAE.',NULL,NULL,NULL,'info@oasissocialmediainfluencers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(326,'Pearl Food Creators',185,NULL,'Quality food creators in Dubai.','bizcat-185.svg',4.4,NULL,'Business Bay, Dubai','+971510011396','971510011396',1,'approved','2026-07-24 16:07:37','bizcat-185.svg','Trusted Food Creators in Dubai','Pearl Food Creators offers quality food creators services in Dubai, UAE.',NULL,NULL,NULL,'info@pearlfoodcreators.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dubai',NULL,NULL,NULL,NULL,NULL),(327,'Crown Food Creators',185,NULL,'Quality food creators in Abu Dhabi.','bizcat-185.svg',4.5,NULL,'Corniche, Abu Dhabi','+971510011433','971510011433',1,'approved','2026-07-24 16:07:37','bizcat-185.svg','Trusted Food Creators in Abu Dhabi','Crown Food Creators offers quality food creators services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@crownfoodcreators.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(328,'Golden Travel Creators',186,NULL,'Quality travel creators in Abu Dhabi.','bizcat-186.svg',4.5,NULL,'Corniche, Abu Dhabi','+971510011470','971510011470',1,'approved','2026-07-24 16:07:37','bizcat-186.svg','Trusted Travel Creators in Abu Dhabi','Golden Travel Creators offers quality travel creators services in Abu Dhabi, UAE.',NULL,NULL,NULL,'info@goldentravelcreators.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abu Dhabi',NULL,NULL,NULL,NULL,NULL),(329,'Star Travel Creators',186,NULL,'Quality travel creators in Sharjah.','bizcat-186.svg',4.6,NULL,'Al Nahda, Sharjah','+971510011507','971510011507',1,'approved','2026-07-24 16:07:37','bizcat-186.svg','Trusted Travel Creators in Sharjah','Star Travel Creators offers quality travel creators services in Sharjah, UAE.',NULL,NULL,NULL,'info@startravelcreators.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(330,'Al Noor Lifestyle Creators',187,NULL,'Quality lifestyle creators in Sharjah.','bizcat-187.svg',4.6,NULL,'Al Nahda, Sharjah','+971510011544','971510011544',1,'approved','2026-07-24 16:07:37','bizcat-187.svg','Trusted Lifestyle Creators in Sharjah','Al Noor Lifestyle Creators offers quality lifestyle creators services in Sharjah, UAE.',NULL,NULL,NULL,'info@alnoorlifestylecreators.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sharjah',NULL,NULL,NULL,NULL,NULL),(331,'Prime Lifestyle Creators',187,NULL,'Quality lifestyle creators in Ajman.','bizcat-187.svg',4.7,NULL,'Al Rashidiya, Ajman','+971510011581','971510011581',1,'approved','2026-07-24 16:07:37','bizcat-187.svg','Trusted Lifestyle Creators in Ajman','Prime Lifestyle Creators offers quality lifestyle creators services in Ajman, UAE.',NULL,NULL,NULL,'info@primelifestylecreators.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(332,'Gulf Tech Reviewers',188,NULL,'Quality tech reviewers in Ajman.','bizcat-188.svg',4.7,NULL,'Al Rashidiya, Ajman','+971510011618','971510011618',1,'approved','2026-07-24 16:07:37','bizcat-188.svg','Trusted Tech Reviewers in Ajman','Gulf Tech Reviewers offers quality tech reviewers services in Ajman, UAE.',NULL,NULL,NULL,'info@gulftechreviewers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ajman',NULL,NULL,NULL,NULL,NULL),(333,'Emirates Tech Reviewers',188,NULL,'Quality tech reviewers in Fujairah.','bizcat-188.svg',4.8,NULL,'City Centre, Fujairah','+971510011655','971510011655',1,'approved','2026-07-24 16:07:37','bizcat-188.svg','Trusted Tech Reviewers in Fujairah','Emirates Tech Reviewers offers quality tech reviewers services in Fujairah, UAE.',NULL,NULL,NULL,'info@emiratestechreviewers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(334,'Royal Gaming Streamers',189,NULL,'Quality gaming streamers in Fujairah.','bizcat-189.svg',4.8,NULL,'City Centre, Fujairah','+971510011692','971510011692',1,'approved','2026-07-24 16:07:37','bizcat-189.svg','Trusted Gaming Streamers in Fujairah','Royal Gaming Streamers offers quality gaming streamers services in Fujairah, UAE.',NULL,NULL,NULL,'info@royalgamingstreamers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Fujairah',NULL,NULL,NULL,NULL,NULL),(335,'City Gaming Streamers',189,NULL,'Quality gaming streamers in Ras Al Khaimah.','bizcat-189.svg',4.9,NULL,'Al Nakheel, Ras Al Khaimah','+971510011729','971510011729',1,'approved','2026-07-24 16:07:37','bizcat-189.svg','Trusted Gaming Streamers in Ras Al Khaimah','City Gaming Streamers offers quality gaming streamers services in Ras Al Khaimah, UAE.',NULL,NULL,NULL,'info@citygamingstreamers.ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ras Al Khaimah',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `businesses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_clicks`
--

DROP TABLE IF EXISTS `category_clicks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category_clicks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `count` int(11) DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cat` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_clicks`
--

LOCK TABLES `category_clicks` WRITE;
/*!40000 ALTER TABLE `category_clicks` DISABLE KEYS */;
INSERT INTO `category_clicks` VALUES (1,7,1,'2026-05-20 02:55:05'),(2,22,1,'2026-05-20 03:00:05'),(3,1,23,'2026-07-20 13:24:30'),(4,5,75,'2026-07-20 13:24:30'),(5,25,65,'2026-07-20 13:24:30'),(6,26,78,'2026-07-20 13:24:30'),(7,27,91,'2026-07-20 13:24:30'),(8,28,14,'2026-07-20 13:24:30'),(9,29,27,'2026-07-20 13:24:30'),(10,30,40,'2026-07-20 13:24:30'),(11,31,53,'2026-07-20 13:24:30'),(12,32,66,'2026-07-20 13:24:30'),(13,33,79,'2026-07-20 13:24:30'),(14,34,92,'2026-07-20 13:24:30');
/*!40000 ALTER TABLE `category_clicks` ENABLE KEYS */;
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
-- Table structure for table `classified_images`
--

DROP TABLE IF EXISTS `classified_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `classified_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classified_id` int(11) NOT NULL,
  `filename` varchar(500) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `classified_id` (`classified_id`),
  CONSTRAINT `classified_images_ibfk_1` FOREIGN KEY (`classified_id`) REFERENCES `classifieds` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classified_images`
--

LOCK TABLES `classified_images` WRITE;
/*!40000 ALTER TABLE `classified_images` DISABLE KEYS */;
INSERT INTO `classified_images` VALUES (1,7,'mobile-1-a.svg',0,'2026-06-05 14:26:54'),(2,7,'mobile-1-b.svg',1,'2026-06-05 14:26:54'),(3,7,'mobile-1-c.svg',2,'2026-06-05 14:26:54'),(4,8,'mobile-2-a.svg',0,'2026-06-05 14:26:54'),(5,8,'mobile-2-b.svg',1,'2026-06-05 14:26:54'),(6,8,'mobile-2-c.svg',2,'2026-06-05 14:26:54'),(7,9,'mobile-3-a.svg',0,'2026-06-05 14:26:54'),(8,9,'mobile-3-b.svg',1,'2026-06-05 14:26:54'),(9,9,'mobile-3-c.svg',2,'2026-06-05 14:26:54'),(10,10,'mobile-4-a.svg',0,'2026-06-05 14:26:54'),(11,10,'mobile-4-b.svg',1,'2026-06-05 14:26:54'),(12,10,'mobile-4-c.svg',2,'2026-06-05 14:26:54'),(13,11,'car-1-a.svg',0,'2026-06-05 14:26:54'),(14,11,'car-1-b.svg',1,'2026-06-05 14:26:54'),(15,11,'car-1-c.svg',2,'2026-06-05 14:26:54'),(16,12,'car-2-a.svg',0,'2026-06-05 14:26:54'),(17,12,'car-2-b.svg',1,'2026-06-05 14:26:54'),(18,12,'car-2-c.svg',2,'2026-06-05 14:26:54'),(19,13,'car-3-a.svg',0,'2026-06-05 14:26:54'),(20,13,'car-3-b.svg',1,'2026-06-05 14:26:54'),(21,13,'car-3-c.svg',2,'2026-06-05 14:26:54'),(22,14,'car-4-a.svg',0,'2026-06-05 14:26:54'),(23,14,'car-4-b.svg',1,'2026-06-05 14:26:54'),(24,14,'car-4-c.svg',2,'2026-06-05 14:26:54'),(25,15,'furniture-1-a.svg',0,'2026-06-05 14:26:54'),(26,15,'furniture-1-b.svg',1,'2026-06-05 14:26:54'),(27,15,'furniture-1-c.svg',2,'2026-06-05 14:26:54'),(28,16,'furniture-2-a.svg',0,'2026-06-05 14:26:54'),(29,16,'furniture-2-b.svg',1,'2026-06-05 14:26:54'),(30,16,'furniture-2-c.svg',2,'2026-06-05 14:26:54'),(31,17,'furniture-3-a.svg',0,'2026-06-05 14:26:54'),(32,17,'furniture-3-b.svg',1,'2026-06-05 14:26:54'),(33,17,'furniture-3-c.svg',2,'2026-06-05 14:26:54'),(34,18,'furniture-4-a.svg',0,'2026-06-05 14:26:54'),(35,18,'furniture-4-b.svg',1,'2026-06-05 14:26:54'),(36,18,'furniture-4-c.svg',2,'2026-06-05 14:26:54');
/*!40000 ALTER TABLE `classified_images` ENABLE KEYS */;
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
  `user_id` int(11) DEFAULT NULL,
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
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `year` varchar(20) DEFAULT NULL,
  `mileage` varchar(30) DEFAULT NULL,
  `transmission` varchar(30) DEFAULT NULL,
  `fuel_type` varchar(30) DEFAULT NULL,
  `material` varchar(60) DEFAULT NULL,
  `dimensions` varchar(60) DEFAULT NULL,
  `furniture_type` varchar(60) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `classifieds_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `classified_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `classifieds_ibfk_2` FOREIGN KEY (`section_id`) REFERENCES `classified_sections` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classifieds`
--

LOCK TABLES `classifieds` WRITE;
/*!40000 ALTER TABLE `classifieds` DISABLE KEYS */;
INSERT INTO `classifieds` VALUES (1,NULL,'Samsung s25 Ultra','Thinner design, greater choice. Galaxy S25 and S25+ both feature our most powerful, custom-made processor, optimized battery life and our most innovative AI.',2000.00,'AED',1,3,'samsung_s25.jpg','Al Nahda, Dubai','1 Year','s25','Yes','Grey','Samsung','New',NULL,'128 GB','8 GB and more','Above 85%','Box, Charger','No',1,'approved','2026-04-13 21:02:17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-05 18:26:54'),(2,NULL,'iPhone 15 Pro Max','Latest Apple flagship with A17 Pro chip.',3500.00,'AED',1,3,'iphone15.jpg','Al Nahda, Dubai','6 Months','15 Pro Max','Yes','Blue','Apple','New',NULL,'256 GB','8 GB','Above 90%','Box, Charger, Cable','No',1,'approved','2026-04-13 21:02:17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-05 18:26:54'),(3,NULL,'Luxury Villa','Beautiful 4-bedroom villa in prime location.',36000.00,'AED',NULL,1,'villa1.jpg','Dubai Marina',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'approved','2026-04-13 21:02:17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-05 18:26:54'),(4,NULL,'Modern Apartment','Fully furnished 2-bedroom apartment.',36000.00,'AED',NULL,1,'apartment1.jpg','Downtown Dubai',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'approved','2026-04-13 21:02:17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-05 18:26:54'),(5,NULL,'Leather Sofa Set','Premium leather sofa set, 3+2 seater.',36000.00,'AED',3,2,'sofa1.jpg','Deira, Dubai',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'approved','2026-04-13 21:02:17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-05 18:26:54'),(6,NULL,'Office Chair','Ergonomic office chair with lumbar support.',36000.00,'AED',3,2,'chair1.jpg','Deira, Dubai',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'approved','2026-04-13 21:02:17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-05 18:26:54'),(7,2,'iPhone 14 Pro Max 256GB','Immaculate condition, no scratches, with original box and charger.',3200.00,'AED',1,NULL,'mobile-1-a.svg','Dubai Marina, Dubai',NULL,'iPhone 14 Pro Max',NULL,'Deep Purple','Apple','Like New',NULL,'256GB','6GB','94%',NULL,'Unlocked',1,'approved','2026-06-05 14:26:54',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-05 18:26:54'),(8,2,'Samsung Galaxy S23 Ultra','Snapdragon 8 Gen 2, S-Pen included. Light use.',2750.00,'AED',1,NULL,'mobile-2-a.svg','Al Barsha, Dubai',NULL,'Galaxy S23 Ultra',NULL,'Phantom Black','Samsung','Good',NULL,'512GB','12GB','89%',NULL,'Unlocked',1,'approved','2026-06-05 14:26:54',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-05 18:26:54'),(9,2,'Google Pixel 8 Pro','Stock Android, amazing camera. Minor wear on edges.',1900.00,'AED',1,NULL,'mobile-3-a.svg','Sharjah',NULL,'Pixel 8 Pro',NULL,'Obsidian','Google','Good',NULL,'128GB','12GB','92%',NULL,'Unlocked',1,'approved','2026-06-05 14:26:54',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-05 18:26:54'),(10,2,'iPhone 13 128GB','Battery service done. Great everyday phone.',1500.00,'AED',1,NULL,'mobile-4-a.svg','Abu Dhabi',NULL,'iPhone 13',NULL,'Midnight','Apple','Fair',NULL,'128GB','4GB','100%',NULL,'Unlocked',1,'approved','2026-06-05 14:26:54',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-05 18:26:54'),(11,2,'Toyota Land Cruiser GXR 2019','GCC specs, full service history, single owner.',185000.00,'AED',5,NULL,'car-1-a.svg','Dubai',NULL,'Land Cruiser GXR',NULL,'Pearl White','Toyota','Good',NULL,NULL,NULL,NULL,NULL,NULL,1,'approved','2026-06-05 14:26:54','2019','98,000 km','Automatic','Petrol',NULL,NULL,NULL,'2026-07-05 18:26:54'),(12,2,'Nissan Patrol Platinum 2021','Top of the line, warranty until 2026.',245000.00,'AED',5,NULL,'car-2-a.svg','Abu Dhabi',NULL,'Patrol Platinum',NULL,'Black','Nissan','Like New',NULL,NULL,NULL,NULL,NULL,NULL,1,'approved','2026-06-05 14:26:54','2021','45,000 km','Automatic','Petrol',NULL,NULL,NULL,'2026-07-05 18:26:54'),(13,2,'Honda Civic 2020','Economical, well maintained, accident free.',62000.00,'AED',5,NULL,'car-3-a.svg','Sharjah',NULL,'Civic',NULL,'Silver','Honda','Good',NULL,NULL,NULL,NULL,NULL,NULL,1,'approved','2026-06-05 14:26:54','2020','72,000 km','Automatic','Petrol',NULL,NULL,NULL,'2026-07-05 18:26:54'),(14,2,'Tesla Model 3 2022','Long Range, autopilot, free supercharging.',155000.00,'AED',5,NULL,'car-4-a.svg','Dubai',NULL,'Model 3',NULL,'Red','Tesla','Like New',NULL,NULL,NULL,NULL,NULL,NULL,1,'approved','2026-06-05 14:26:54','2022','30,000 km','Automatic','Electric',NULL,NULL,NULL,'2026-07-05 18:26:54'),(15,2,'L-Shaped Fabric Sofa','Comfortable 5-seater, smoke-free home.',1800.00,'AED',3,NULL,'furniture-1-a.svg','Jumeirah, Dubai',NULL,NULL,NULL,'Grey',NULL,'Good',NULL,NULL,NULL,NULL,NULL,NULL,1,'approved','2026-06-05 14:26:54',NULL,NULL,NULL,NULL,'Fabric & Wood','280 x 200 cm','Sofa','2026-07-05 18:26:54'),(16,2,'Solid Oak Dining Table + 6 Chairs','Sturdy and elegant, minor surface marks.',2400.00,'AED',3,NULL,'furniture-2-a.svg','Al Reem, Abu Dhabi',NULL,NULL,NULL,'Brown',NULL,'Good',NULL,NULL,NULL,NULL,NULL,NULL,1,'approved','2026-06-05 14:26:54',NULL,NULL,NULL,NULL,'Solid Oak','180 x 90 cm','Dining Set','2026-07-05 18:26:54'),(17,2,'King Size Bed with Mattress','Upholstered headboard, medium-firm mattress included.',1600.00,'AED',3,NULL,'furniture-3-a.svg','Sharjah',NULL,NULL,NULL,'Beige',NULL,'Like New',NULL,NULL,NULL,NULL,NULL,NULL,1,'approved','2026-06-05 14:26:54',NULL,NULL,NULL,NULL,'Wood & Foam','200 x 180 cm','Bed','2026-07-05 18:26:54'),(18,2,'5-Door Wardrobe','Spacious with mirror, easy to dismantle for moving.',950.00,'AED',3,NULL,'furniture-4-a.svg','Deira, Dubai',NULL,NULL,NULL,'White',NULL,'Fair',NULL,NULL,NULL,NULL,NULL,NULL,1,'approved','2026-06-05 14:26:54',NULL,NULL,NULL,NULL,'MDF','250 x 60 cm','Wardrobe','2026-07-05 18:26:54');
/*!40000 ALTER TABLE `classifieds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_categories`
--

DROP TABLE IF EXISTS `course_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_course_category` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_categories`
--

LOCK TABLES `course_categories` WRITE;
/*!40000 ALTER TABLE `course_categories` DISABLE KEYS */;
INSERT INTO `course_categories` VALUES (1,'Business & Management','💼',1,1),(2,'Computer Science & IT','💻',2,1),(3,'Artificial Intelligence & Data Science','🤖',3,1),(4,'Engineering','⚙️',4,1),(5,'Architecture & Interior Design','🏗️',5,1),(6,'Medicine & Healthcare','🩺',6,1),(7,'Law','⚖️',7,1),(8,'Accounting & Finance','📊',8,1),(9,'Marketing & Communication','📣',9,1),(10,'Arts, Design & Multimedia','🎨',10,1),(11,'Psychology','🧠',11,1),(12,'Education & Teaching','🧑‍🏫',12,1),(13,'Aviation & Aerospace','✈️',13,1),(14,'Hospitality & Tourism','🏨',14,1),(15,'Environmental Science','🌱',15,1),(16,'Science & Research','🔬',16,1);
/*!40000 ALTER TABLE `course_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_category_id` int(11) DEFAULT NULL,
  `study_level_id` int(11) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `specialisation` varchar(150) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `description` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_category_id` (`course_category_id`),
  KEY `study_level_id` (`study_level_id`),
  CONSTRAINT `courses_ibfk_2` FOREIGN KEY (`course_category_id`) REFERENCES `course_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `courses_ibfk_3` FOREIGN KEY (`study_level_id`) REFERENCES `study_levels` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,1,1,'Diploma in Business Administration','Management','1–2 years',1,'2026-07-20 14:42:47',NULL,'course-business.svg'),(2,2,1,'Diploma in Information Technology','Networking','1–2 years',1,'2026-07-20 14:42:47',NULL,'course-cs.svg'),(3,10,1,'Diploma in Graphic Design','Digital Media','1 year',1,'2026-07-20 14:42:47',NULL,'course-arts.svg'),(4,14,1,'Diploma in Hospitality Management','Hotel Operations','2 years',1,'2026-07-20 14:42:47',NULL,NULL),(5,1,2,'Bachelor of Business Administration','Marketing','3–4 years',1,'2026-07-20 14:42:47',NULL,'course-business.svg'),(6,2,2,'BSc Computer Science','Software Engineering','4 years',1,'2026-07-20 14:42:47',NULL,'course-cs.svg'),(7,3,2,'BSc Artificial Intelligence','Machine Learning','4 years',1,'2026-07-20 14:42:47',NULL,'course-ai.svg'),(8,4,2,'BEng Civil Engineering','Structural','4 years',1,'2026-07-20 14:42:47',NULL,'course-engineering.svg'),(9,5,2,'Bachelor of Architecture','Sustainable Design','5 years',1,'2026-07-20 14:42:47',NULL,'course-architecture.svg'),(10,6,2,'BSc Nursing','Clinical Practice','4 years',1,'2026-07-20 14:42:47',NULL,'course-medicine.svg'),(11,1,3,'Master of Business Administration (MBA)','Strategy & Leadership','1–2 years',1,'2026-07-20 14:42:47',NULL,'course-business.svg'),(12,3,3,'MSc Data Science','Big Data Analytics','1–2 years',1,'2026-07-20 14:42:47',NULL,'course-ai.svg'),(13,2,3,'MSc Cybersecurity','Network Security','1–2 years',1,'2026-07-20 14:42:47',NULL,NULL),(14,1,4,'PhD in Business Management','Organisational Behaviour','3–5 years',1,'2026-07-20 14:42:47',NULL,NULL),(15,2,4,'PhD in Computer Science','Applied AI','3–5 years',1,'2026-07-20 14:42:47',NULL,'course-cs.svg');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `specialty_id` int(11) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `photo` varchar(500) DEFAULT NULL,
  `qualification` varchar(150) DEFAULT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `languages` varchar(200) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `review_count` int(11) DEFAULT 0,
  `consultation_fee` decimal(10,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'AED',
  `availability` varchar(60) DEFAULT NULL,
  `distance` varchar(30) DEFAULT NULL,
  `about` text DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  KEY `specialty_id` (`specialty_id`),
  CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `doctors_ibfk_2` FOREIGN KEY (`specialty_id`) REFERENCES `business_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (1,12,190,'Dr. Sarah Ahmed','doctor-2.svg','MBBS, MD (Internal Medicine)',3,'English, Arabic','Female',4.3,42,100.00,'AED','Available Today','1.0 km','Dr. Sarah Ahmed is a general physician with 3 years of experience, focused on patient-centred care.',1,1,'2026-07-23 19:44:54'),(2,13,190,'Dr. Ahmed Khan','doctor-3.svg','MBBS, MD (Internal Medicine)',4,'English, Hindi, Urdu','Male',4.4,49,150.00,'AED','Available Tomorrow','1.3 km','Dr. Ahmed Khan is a general physician with 4 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(3,14,190,'Dr. Aisha Al Rashid','doctor-6.svg','MBBS, MD (Internal Medicine)',5,'English, Arabic, Hindi','Female',4.5,56,200.00,'AED','Next 4:30 PM','1.6 km','Dr. Aisha Al Rashid is a general physician with 5 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(4,15,190,'Dr. Omar Patel','doctor-7.svg','MBBS, MD (Internal Medicine)',6,'English, Malayalam, Hindi','Male',4.6,63,250.00,'AED','Next 6:00 PM','1.9 km','Dr. Omar Patel is a general physician with 6 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(5,16,190,'Dr. Maria Abdullah','doctor-2.svg','MBBS, MD (Internal Medicine)',7,'English, Tagalog','Female',4.7,70,300.00,'AED','Available Today','2.2 km','Dr. Maria Abdullah is a general physician with 7 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(6,17,191,'Dr. Omar Sharma','doctor-1.svg','MBBS, MD (Pediatrics)',8,'English, Arabic, French','Male',4.4,77,150.00,'AED','Available Tomorrow','2.5 km','Dr. Omar Sharma is a pediatrician with 8 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(7,12,191,'Dr. Ananya Hussain','doctor-4.svg','MBBS, MD (Pediatrics)',9,'English, Arabic','Female',4.5,84,200.00,'AED','Next 4:30 PM','2.8 km','Dr. Ananya Hussain is a pediatrician with 9 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(8,13,191,'Dr. Vikram Reddy','doctor-5.svg','MBBS, MD (Pediatrics)',10,'English, Hindi, Urdu','Male',4.6,91,250.00,'AED','Next 6:00 PM','3.1 km','Dr. Vikram Reddy is a pediatrician with 10 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(9,14,191,'Dr. Reem Siddiqui','doctor-8.svg','MBBS, MD (Pediatrics)',11,'English, Arabic, Hindi','Female',4.7,98,300.00,'AED','Available Today','3.4 km','Dr. Reem Siddiqui is a pediatrician with 11 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(10,15,191,'Dr. Arjun Salem','doctor-1.svg','MBBS, MD (Pediatrics)',12,'English, Malayalam, Hindi','Male',4.8,105,350.00,'AED','Next 2:00 PM','1.0 km','Dr. Arjun Salem is a pediatrician with 12 years of experience, focused on patient-centred care.',1,1,'2026-07-23 19:44:54'),(11,16,192,'Dr. Sana Farooqi','doctor-2.svg','MD, DM (Cardiology)',13,'English, Tagalog','Female',4.5,112,200.00,'AED','Next 4:30 PM','1.3 km','Dr. Sana Farooqi is a cardiologist with 13 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(12,17,192,'Dr. Arjun Iyer','doctor-3.svg','MD, DM (Cardiology)',14,'English, Arabic, French','Male',4.6,119,250.00,'AED','Next 6:00 PM','1.6 km','Dr. Arjun Iyer is a cardiologist with 14 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(13,12,192,'Dr. Mariam Kapoor','doctor-6.svg','MD, DM (Cardiology)',15,'English, Arabic','Female',4.7,126,300.00,'AED','Available Today','1.9 km','Dr. Mariam Kapoor is a cardiologist with 15 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(14,13,192,'Dr. Bilal Qureshi','doctor-7.svg','MD, DM (Cardiology)',16,'English, Hindi, Urdu','Male',4.8,133,350.00,'AED','Next 2:00 PM','2.2 km','Dr. Bilal Qureshi is a cardiologist with 16 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(15,14,192,'Dr. Hana Nair','doctor-2.svg','MD, DM (Cardiology)',17,'English, Arabic, Hindi','Female',4.9,140,400.00,'AED','Available Today','2.5 km','Dr. Hana Nair is a cardiologist with 17 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(16,15,193,'Dr. Bilal Mansoor','doctor-1.svg','MBBS, MS (Ortho)',18,'English, Malayalam, Hindi','Male',4.6,147,250.00,'AED','Next 6:00 PM','2.8 km','Dr. Bilal Mansoor is a orthopaedic surgeon with 18 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(17,16,193,'Dr. Priya Thomas','doctor-4.svg','MBBS, MS (Ortho)',19,'English, Tagalog','Female',4.7,154,300.00,'AED','Available Today','3.1 km','Dr. Priya Thomas is a orthopaedic surgeon with 19 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(18,17,193,'Dr. Rajesh Ali','doctor-5.svg','MBBS, MS (Ortho)',20,'English, Arabic, French','Male',4.8,161,350.00,'AED','Next 2:00 PM','3.4 km','Dr. Rajesh Ali is a orthopaedic surgeon with 20 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(19,12,193,'Dr. Fatima Rahman','doctor-8.svg','MBBS, MS (Ortho)',21,'English, Arabic','Female',4.9,168,400.00,'AED','Available Today','1.0 km','Dr. Fatima Rahman is a orthopaedic surgeon with 21 years of experience, focused on patient-centred care.',1,1,'2026-07-23 19:44:54'),(20,13,193,'Dr. Anil Menon','doctor-1.svg','MBBS, MS (Ortho)',22,'English, Hindi, Urdu','Male',4.3,175,100.00,'AED','Available Tomorrow','1.3 km','Dr. Anil Menon is a orthopaedic surgeon with 22 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(21,14,194,'Dr. Layla Ahmed','doctor-2.svg','MD, DM (Neurology)',23,'English, Arabic, Hindi','Female',4.7,182,300.00,'AED','Available Today','1.6 km','Dr. Layla Ahmed is a neurologist with 23 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(22,15,194,'Dr. Anil Khan','doctor-3.svg','MD, DM (Neurology)',24,'English, Malayalam, Hindi','Male',4.8,189,350.00,'AED','Next 2:00 PM','1.9 km','Dr. Anil Khan is a neurologist with 24 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(23,16,194,'Dr. Huda Al Rashid','doctor-6.svg','MD, DM (Neurology)',25,'English, Tagalog','Female',4.9,196,400.00,'AED','Available Today','2.2 km','Dr. Huda Al Rashid is a neurologist with 25 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(24,17,194,'Dr. Mohammed Patel','doctor-7.svg','MD, DM (Neurology)',3,'English, Arabic, French','Male',4.3,203,100.00,'AED','Available Tomorrow','2.5 km','Dr. Mohammed Patel is a neurologist with 3 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(25,12,194,'Dr. Noor Abdullah','doctor-2.svg','MD, DM (Neurology)',4,'English, Arabic','Female',4.4,210,150.00,'AED','Next 4:30 PM','2.8 km','Dr. Noor Abdullah is a neurologist with 4 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(26,13,195,'Dr. Mohammed Sharma','doctor-1.svg','MBBS, MS (Ophthalmology)',5,'English, Hindi, Urdu','Male',4.8,217,350.00,'AED','Next 2:00 PM','3.1 km','Dr. Mohammed Sharma is a ophthalmologist with 5 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(27,14,195,'Dr. Zara Hussain','doctor-4.svg','MBBS, MS (Ophthalmology)',6,'English, Arabic, Hindi','Female',4.9,44,400.00,'AED','Available Today','3.4 km','Dr. Zara Hussain is a ophthalmologist with 6 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(28,15,195,'Dr. Rahul Reddy','doctor-5.svg','MBBS, MS (Ophthalmology)',7,'English, Malayalam, Hindi','Male',4.3,51,100.00,'AED','Available Tomorrow','1.0 km','Dr. Rahul Reddy is a ophthalmologist with 7 years of experience, focused on patient-centred care.',1,1,'2026-07-23 19:44:54'),(29,16,195,'Dr. Deepa Siddiqui','doctor-8.svg','MBBS, MS (Ophthalmology)',8,'English, Tagalog','Female',4.4,58,150.00,'AED','Next 4:30 PM','1.3 km','Dr. Deepa Siddiqui is a ophthalmologist with 8 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(30,17,195,'Dr. Karim Salem','doctor-1.svg','MBBS, MS (Ophthalmology)',9,'English, Arabic, French','Male',4.5,65,200.00,'AED','Next 6:00 PM','1.6 km','Dr. Karim Salem is a ophthalmologist with 9 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(31,12,196,'Dr. Sarah Farooqi','doctor-2.svg','MBBS, MS (ENT)',10,'English, Arabic','Female',4.9,72,400.00,'AED','Available Today','1.9 km','Dr. Sarah Farooqi is a ent specialist with 10 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(32,13,196,'Dr. Karim Iyer','doctor-3.svg','MBBS, MS (ENT)',11,'English, Hindi, Urdu','Male',4.3,79,100.00,'AED','Available Tomorrow','2.2 km','Dr. Karim Iyer is a ent specialist with 11 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(33,14,196,'Dr. Aisha Kapoor','doctor-6.svg','MBBS, MS (ENT)',12,'English, Arabic, Hindi','Female',4.4,86,150.00,'AED','Next 4:30 PM','2.5 km','Dr. Aisha Kapoor is a ent specialist with 12 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(34,15,196,'Dr. Yousef Qureshi','doctor-7.svg','MBBS, MS (ENT)',13,'English, Malayalam, Hindi','Male',4.5,93,200.00,'AED','Next 6:00 PM','2.8 km','Dr. Yousef Qureshi is a ent specialist with 13 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(35,16,196,'Dr. Maria Nair','doctor-2.svg','MBBS, MS (ENT)',14,'English, Tagalog','Female',4.6,100,250.00,'AED','Available Today','3.1 km','Dr. Maria Nair is a ent specialist with 14 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(36,17,197,'Dr. Yousef Mansoor','doctor-1.svg','BDS, MDS',15,'English, Arabic, French','Male',4.3,107,100.00,'AED','Available Tomorrow','3.4 km','Dr. Yousef Mansoor is a dentist with 15 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(37,12,197,'Dr. Ananya Thomas','doctor-4.svg','BDS, MDS',16,'English, Arabic','Female',4.4,114,150.00,'AED','Next 4:30 PM','1.0 km','Dr. Ananya Thomas is a dentist with 16 years of experience, focused on patient-centred care.',1,1,'2026-07-23 19:44:54'),(38,13,197,'Dr. Sami Ali','doctor-5.svg','BDS, MDS',17,'English, Hindi, Urdu','Male',4.5,121,200.00,'AED','Next 6:00 PM','1.3 km','Dr. Sami Ali is a dentist with 17 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(39,14,197,'Dr. Reem Rahman','doctor-8.svg','BDS, MDS',18,'English, Arabic, Hindi','Female',4.6,128,250.00,'AED','Available Today','1.6 km','Dr. Reem Rahman is a dentist with 18 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(40,15,197,'Dr. Hassan Menon','doctor-1.svg','BDS, MDS',19,'English, Malayalam, Hindi','Male',4.7,135,300.00,'AED','Next 2:00 PM','1.9 km','Dr. Hassan Menon is a dentist with 19 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(41,16,198,'Dr. Sana Ahmed','doctor-2.svg','MBBS, MD (Dermatology)',20,'English, Tagalog','Female',4.4,142,150.00,'AED','Next 4:30 PM','2.2 km','Dr. Sana Ahmed is a dermatologist with 20 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(42,17,198,'Dr. Hassan Khan','doctor-3.svg','MBBS, MD (Dermatology)',21,'English, Arabic, French','Male',4.5,149,200.00,'AED','Next 6:00 PM','2.5 km','Dr. Hassan Khan is a dermatologist with 21 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(43,12,198,'Dr. Mariam Al Rashid','doctor-6.svg','MBBS, MD (Dermatology)',22,'English, Arabic','Female',4.6,156,250.00,'AED','Available Today','2.8 km','Dr. Mariam Al Rashid is a dermatologist with 22 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(44,13,198,'Dr. Faisal Patel','doctor-7.svg','MBBS, MD (Dermatology)',23,'English, Hindi, Urdu','Male',4.7,163,300.00,'AED','Next 2:00 PM','3.1 km','Dr. Faisal Patel is a dermatologist with 23 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(45,14,198,'Dr. Hana Abdullah','doctor-2.svg','MBBS, MD (Dermatology)',24,'English, Arabic, Hindi','Female',4.8,170,350.00,'AED','Available Today','3.4 km','Dr. Hana Abdullah is a dermatologist with 24 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(46,15,199,'Dr. Faisal Sharma','doctor-1.svg','MBBS, MD (OB-GYN)',25,'English, Malayalam, Hindi','Male',4.5,177,200.00,'AED','Next 6:00 PM','1.0 km','Dr. Faisal Sharma is a gynaecologist with 25 years of experience, focused on patient-centred care.',1,1,'2026-07-23 19:44:54'),(47,16,199,'Dr. Priya Hussain','doctor-4.svg','MBBS, MD (OB-GYN)',3,'English, Tagalog','Female',4.6,184,250.00,'AED','Available Today','1.3 km','Dr. Priya Hussain is a gynaecologist with 3 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(48,17,199,'Dr. Tariq Reddy','doctor-5.svg','MBBS, MD (OB-GYN)',4,'English, Arabic, French','Male',4.7,191,300.00,'AED','Next 2:00 PM','1.6 km','Dr. Tariq Reddy is a gynaecologist with 4 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(49,12,199,'Dr. Fatima Siddiqui','doctor-8.svg','MBBS, MD (OB-GYN)',5,'English, Arabic','Female',4.8,198,350.00,'AED','Available Today','1.9 km','Dr. Fatima Siddiqui is a gynaecologist with 5 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(50,13,199,'Dr. Ahmed Salem','doctor-1.svg','MBBS, MD (OB-GYN)',6,'English, Hindi, Urdu','Male',4.9,205,400.00,'AED','Available Tomorrow','2.2 km','Dr. Ahmed Salem is a gynaecologist with 6 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(51,14,200,'Dr. Layla Farooqi','doctor-2.svg','MD, DM (Pulmonology)',7,'English, Arabic, Hindi','Female',4.6,212,250.00,'AED','Available Today','2.5 km','Dr. Layla Farooqi is a pulmonologist with 7 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(52,15,200,'Dr. Ahmed Iyer','doctor-3.svg','MD, DM (Pulmonology)',8,'English, Malayalam, Hindi','Male',4.7,219,300.00,'AED','Next 2:00 PM','2.8 km','Dr. Ahmed Iyer is a pulmonologist with 8 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(53,16,200,'Dr. Huda Kapoor','doctor-6.svg','MD, DM (Pulmonology)',9,'English, Tagalog','Female',4.8,46,350.00,'AED','Available Today','3.1 km','Dr. Huda Kapoor is a pulmonologist with 9 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(54,17,200,'Dr. Omar Qureshi','doctor-7.svg','MD, DM (Pulmonology)',10,'English, Arabic, French','Male',4.9,53,400.00,'AED','Available Tomorrow','3.4 km','Dr. Omar Qureshi is a pulmonologist with 10 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(55,12,200,'Dr. Noor Nair','doctor-2.svg','MD, DM (Pulmonology)',11,'English, Arabic','Female',4.3,60,100.00,'AED','Next 4:30 PM','1.0 km','Dr. Noor Nair is a pulmonologist with 11 years of experience, focused on patient-centred care.',1,1,'2026-07-23 19:44:54'),(56,13,201,'Dr. Omar Mansoor','doctor-1.svg','MD, DM (Gastroenterology)',12,'English, Hindi, Urdu','Male',4.7,67,300.00,'AED','Next 2:00 PM','1.3 km','Dr. Omar Mansoor is a gastroenterologist with 12 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(57,14,201,'Dr. Zara Thomas','doctor-4.svg','MD, DM (Gastroenterology)',13,'English, Arabic, Hindi','Female',4.8,74,350.00,'AED','Available Today','1.6 km','Dr. Zara Thomas is a gastroenterologist with 13 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(58,15,201,'Dr. Vikram Ali','doctor-5.svg','MD, DM (Gastroenterology)',14,'English, Malayalam, Hindi','Male',4.9,81,400.00,'AED','Available Tomorrow','1.9 km','Dr. Vikram Ali is a gastroenterologist with 14 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(59,16,201,'Dr. Deepa Rahman','doctor-8.svg','MD, DM (Gastroenterology)',15,'English, Tagalog','Female',4.3,88,100.00,'AED','Next 4:30 PM','2.2 km','Dr. Deepa Rahman is a gastroenterologist with 15 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(60,17,201,'Dr. Arjun Menon','doctor-1.svg','MD, DM (Gastroenterology)',16,'English, Arabic, French','Male',4.4,95,150.00,'AED','Next 6:00 PM','2.5 km','Dr. Arjun Menon is a gastroenterologist with 16 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(61,12,202,'Dr. Sarah Ahmed','doctor-2.svg','MD, DM (Endocrinology)',17,'English, Arabic','Female',4.8,102,350.00,'AED','Available Today','2.8 km','Dr. Sarah Ahmed is a endocrinologist with 17 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(62,13,202,'Dr. Arjun Khan','doctor-3.svg','MD, DM (Endocrinology)',18,'English, Hindi, Urdu','Male',4.9,109,400.00,'AED','Available Tomorrow','3.1 km','Dr. Arjun Khan is a endocrinologist with 18 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(63,14,202,'Dr. Aisha Al Rashid','doctor-6.svg','MD, DM (Endocrinology)',19,'English, Arabic, Hindi','Female',4.3,116,100.00,'AED','Next 4:30 PM','3.4 km','Dr. Aisha Al Rashid is a endocrinologist with 19 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(64,15,202,'Dr. Bilal Patel','doctor-7.svg','MD, DM (Endocrinology)',20,'English, Malayalam, Hindi','Male',4.4,123,150.00,'AED','Next 6:00 PM','1.0 km','Dr. Bilal Patel is a endocrinologist with 20 years of experience, focused on patient-centred care.',1,1,'2026-07-23 19:44:54'),(65,16,202,'Dr. Maria Abdullah','doctor-2.svg','MD, DM (Endocrinology)',21,'English, Tagalog','Female',4.5,130,200.00,'AED','Available Today','1.3 km','Dr. Maria Abdullah is a endocrinologist with 21 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(66,17,203,'Dr. Bilal Sharma','doctor-1.svg','MBBS, MD (Psychiatry)',22,'English, Arabic, French','Male',4.9,137,400.00,'AED','Available Tomorrow','1.6 km','Dr. Bilal Sharma is a psychiatrist with 22 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(67,12,203,'Dr. Ananya Hussain','doctor-4.svg','MBBS, MD (Psychiatry)',23,'English, Arabic','Female',4.3,144,100.00,'AED','Next 4:30 PM','1.9 km','Dr. Ananya Hussain is a psychiatrist with 23 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(68,13,203,'Dr. Rajesh Reddy','doctor-5.svg','MBBS, MD (Psychiatry)',24,'English, Hindi, Urdu','Male',4.4,151,150.00,'AED','Next 6:00 PM','2.2 km','Dr. Rajesh Reddy is a psychiatrist with 24 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(69,14,203,'Dr. Reem Siddiqui','doctor-8.svg','MBBS, MD (Psychiatry)',25,'English, Arabic, Hindi','Female',4.5,158,200.00,'AED','Available Today','2.5 km','Dr. Reem Siddiqui is a psychiatrist with 25 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(70,15,203,'Dr. Anil Salem','doctor-1.svg','MBBS, MD (Psychiatry)',3,'English, Malayalam, Hindi','Male',4.6,165,250.00,'AED','Next 2:00 PM','2.8 km','Dr. Anil Salem is a psychiatrist with 3 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(71,16,204,'Dr. Sana Farooqi','doctor-2.svg','MSc, PhD (Clinical Psychology)',4,'English, Tagalog','Female',4.3,172,100.00,'AED','Next 4:30 PM','3.1 km','Dr. Sana Farooqi is a psychologist with 4 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(72,17,204,'Dr. Anil Iyer','doctor-3.svg','MSc, PhD (Clinical Psychology)',5,'English, Arabic, French','Male',4.4,179,150.00,'AED','Next 6:00 PM','3.4 km','Dr. Anil Iyer is a psychologist with 5 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(73,12,204,'Dr. Mariam Kapoor','doctor-6.svg','MSc, PhD (Clinical Psychology)',6,'English, Arabic','Female',4.5,186,200.00,'AED','Available Today','1.0 km','Dr. Mariam Kapoor is a psychologist with 6 years of experience, focused on patient-centred care.',1,1,'2026-07-23 19:44:54'),(74,13,204,'Dr. Mohammed Qureshi','doctor-7.svg','MSc, PhD (Clinical Psychology)',7,'English, Hindi, Urdu','Male',4.6,193,250.00,'AED','Next 2:00 PM','1.3 km','Dr. Mohammed Qureshi is a psychologist with 7 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(75,14,204,'Dr. Hana Nair','doctor-2.svg','MSc, PhD (Clinical Psychology)',8,'English, Arabic, Hindi','Female',4.7,200,300.00,'AED','Available Today','1.6 km','Dr. Hana Nair is a psychologist with 8 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(76,15,205,'Dr. Mohammed Mansoor','doctor-1.svg','MBBS, MD (Radiology)',9,'English, Malayalam, Hindi','Male',4.4,207,150.00,'AED','Next 6:00 PM','1.9 km','Dr. Mohammed Mansoor is a radiologist with 9 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(77,16,205,'Dr. Priya Thomas','doctor-4.svg','MBBS, MD (Radiology)',10,'English, Tagalog','Female',4.5,214,200.00,'AED','Available Today','2.2 km','Dr. Priya Thomas is a radiologist with 10 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(78,17,205,'Dr. Rahul Ali','doctor-5.svg','MBBS, MD (Radiology)',11,'English, Arabic, French','Male',4.6,221,250.00,'AED','Next 2:00 PM','2.5 km','Dr. Rahul Ali is a radiologist with 11 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(79,12,205,'Dr. Fatima Rahman','doctor-8.svg','MBBS, MD (Radiology)',12,'English, Arabic','Female',4.7,48,300.00,'AED','Available Today','2.8 km','Dr. Fatima Rahman is a radiologist with 12 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(80,13,205,'Dr. Karim Menon','doctor-1.svg','MBBS, MD (Radiology)',13,'English, Hindi, Urdu','Male',4.8,55,350.00,'AED','Available Tomorrow','3.1 km','Dr. Karim Menon is a radiologist with 13 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(81,14,206,'Dr. Layla Ahmed','doctor-2.svg','MBBS, MD (Pathology)',14,'English, Arabic, Hindi','Female',4.5,62,200.00,'AED','Available Today','3.4 km','Dr. Layla Ahmed is a pathologist with 14 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(82,15,206,'Dr. Karim Khan','doctor-3.svg','MBBS, MD (Pathology)',15,'English, Malayalam, Hindi','Male',4.6,69,250.00,'AED','Next 2:00 PM','1.0 km','Dr. Karim Khan is a pathologist with 15 years of experience, focused on patient-centred care.',1,1,'2026-07-23 19:44:54'),(83,16,206,'Dr. Huda Al Rashid','doctor-6.svg','MBBS, MD (Pathology)',16,'English, Tagalog','Female',4.7,76,300.00,'AED','Available Today','1.3 km','Dr. Huda Al Rashid is a pathologist with 16 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(84,17,206,'Dr. Yousef Patel','doctor-7.svg','MBBS, MD (Pathology)',17,'English, Arabic, French','Male',4.8,83,350.00,'AED','Available Tomorrow','1.6 km','Dr. Yousef Patel is a pathologist with 17 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(85,12,206,'Dr. Noor Abdullah','doctor-2.svg','MBBS, MD (Pathology)',18,'English, Arabic','Female',4.9,90,400.00,'AED','Next 4:30 PM','1.9 km','Dr. Noor Abdullah is a pathologist with 18 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(86,13,207,'Dr. Yousef Sharma','doctor-1.svg','BSc, MSc (Nutrition)',19,'English, Hindi, Urdu','Male',4.6,97,250.00,'AED','Next 2:00 PM','2.2 km','Dr. Yousef Sharma is a dietitian & nutritionist with 19 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(87,14,207,'Dr. Zara Hussain','doctor-4.svg','BSc, MSc (Nutrition)',20,'English, Arabic, Hindi','Female',4.7,104,300.00,'AED','Available Today','2.5 km','Dr. Zara Hussain is a dietitian & nutritionist with 20 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(88,15,207,'Dr. Sami Reddy','doctor-5.svg','BSc, MSc (Nutrition)',21,'English, Malayalam, Hindi','Male',4.8,111,350.00,'AED','Available Tomorrow','2.8 km','Dr. Sami Reddy is a dietitian & nutritionist with 21 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(89,16,207,'Dr. Deepa Siddiqui','doctor-8.svg','BSc, MSc (Nutrition)',22,'English, Tagalog','Female',4.9,118,400.00,'AED','Next 4:30 PM','3.1 km','Dr. Deepa Siddiqui is a dietitian & nutritionist with 22 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(90,17,207,'Dr. Hassan Salem','doctor-1.svg','BSc, MSc (Nutrition)',23,'English, Arabic, French','Male',4.3,125,100.00,'AED','Next 6:00 PM','3.4 km','Dr. Hassan Salem is a dietitian & nutritionist with 23 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(91,12,208,'Dr. Sarah Farooqi','doctor-2.svg','BPT, MPT',24,'English, Arabic','Female',4.7,132,300.00,'AED','Available Today','1.0 km','Dr. Sarah Farooqi is a physiotherapist with 24 years of experience, focused on patient-centred care.',1,1,'2026-07-23 19:44:54'),(92,13,208,'Dr. Hassan Iyer','doctor-3.svg','BPT, MPT',25,'English, Hindi, Urdu','Male',4.8,139,350.00,'AED','Available Tomorrow','1.3 km','Dr. Hassan Iyer is a physiotherapist with 25 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(93,14,208,'Dr. Aisha Kapoor','doctor-6.svg','BPT, MPT',3,'English, Arabic, Hindi','Female',4.9,146,400.00,'AED','Next 4:30 PM','1.6 km','Dr. Aisha Kapoor is a physiotherapist with 3 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(94,15,208,'Dr. Faisal Qureshi','doctor-7.svg','BPT, MPT',4,'English, Malayalam, Hindi','Male',4.3,153,100.00,'AED','Next 6:00 PM','1.9 km','Dr. Faisal Qureshi is a physiotherapist with 4 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(95,16,208,'Dr. Maria Nair','doctor-2.svg','BPT, MPT',5,'English, Tagalog','Female',4.4,160,150.00,'AED','Available Today','2.2 km','Dr. Maria Nair is a physiotherapist with 5 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(96,17,209,'Dr. Faisal Mansoor','doctor-1.svg','MBBS, MD',6,'English, Arabic, French','Male',4.8,167,350.00,'AED','Available Tomorrow','2.5 km','Dr. Faisal Mansoor is a online doctor with 6 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(97,12,209,'Dr. Ananya Thomas','doctor-4.svg','MBBS, MD',7,'English, Arabic','Female',4.9,174,400.00,'AED','Next 4:30 PM','2.8 km','Dr. Ananya Thomas is a online doctor with 7 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(98,13,209,'Dr. Tariq Ali','doctor-5.svg','MBBS, MD',8,'English, Hindi, Urdu','Male',4.3,181,100.00,'AED','Next 6:00 PM','3.1 km','Dr. Tariq Ali is a online doctor with 8 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(99,14,209,'Dr. Reem Rahman','doctor-8.svg','MBBS, MD',9,'English, Arabic, Hindi','Female',4.4,188,150.00,'AED','Available Today','3.4 km','Dr. Reem Rahman is a online doctor with 9 years of experience, focused on patient-centred care.',0,1,'2026-07-23 19:44:54'),(100,15,209,'Dr. Ahmed Menon','doctor-1.svg','MBBS, MD',10,'English, Malayalam, Hindi','Male',4.5,195,200.00,'AED','Next 2:00 PM','1.0 km','Dr. Ahmed Menon is a online doctor with 10 years of experience, focused on patient-centred care.',1,1,'2026-07-23 19:44:54');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_categories`
--

DROP TABLE IF EXISTS `event_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_categories`
--

LOCK TABLES `event_categories` WRITE;
/*!40000 ALTER TABLE `event_categories` DISABLE KEYS */;
INSERT INTO `event_categories` VALUES (1,'Events','🎉',1,1),(2,'Tech Events','💻',2,1),(3,'Business Meets','💼',3,1),(4,'Weddings & Occasions','💍',4,1),(5,'Movies & Shows','🎬',5,1),(6,'Parks & Recreation','🌳',6,1);
/*!40000 ALTER TABLE `event_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `poster` varchar(500) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `venue` varchar(200) DEFAULT NULL,
  `emirate` varchar(50) DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `start_time` varchar(20) DEFAULT NULL,
  `end_time` varchar(20) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'AED',
  `booking_url` varchar(300) DEFAULT NULL,
  `organizer` varchar(200) DEFAULT NULL,
  `organizer_phone` varchar(40) DEFAULT NULL,
  `organizer_whatsapp` varchar(40) DEFAULT NULL,
  `organizer_email` varchar(150) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `is_active` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `user_id` (`user_id`),
  KEY `event_date` (`event_date`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `event_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,2,1,'Dubai Shopping Festival','The city\'s biggest retail celebration with mega sales, raffles, fireworks and live entertainment across Dubai.','event-1.svg','Downtown Dubai','Multiple Locations','Dubai','2026-08-06','2026-09-05','10:00 AM','11:00 PM',0.00,'AED','https://www.mydsf.ae','Dubai Festivals','+97145551000','971545551000','info@dsf.ae',1,'approved',1,'2026-07-17 14:10:43'),(2,2,1,'UAE National Day Celebration','Family-friendly national day festivities with parades, drone shows and traditional performances.','event-2.svg','Corniche','Abu Dhabi Corniche','Abu Dhabi','2026-08-21','2026-08-22','04:00 PM','10:00 PM',0.00,'AED',NULL,'Abu Dhabi Events','+97124441000','971544441000','events@abudhabi.ae',0,'approved',1,'2026-07-17 14:10:43'),(3,2,2,'GITEX Global 2026','The largest tech and startup show in the Middle East — AI, cloud, fintech and Web3 across 20+ halls.','event-3.svg','Dubai World Trade Centre','DWTC Halls 1-20','Dubai','2026-08-31','2026-09-04','10:00 AM','06:00 PM',250.00,'AED','https://www.gitex.com','Dubai World Trade Centre','+97143321000','971543321000','info@gitex.com',1,'approved',1,'2026-07-17 14:10:43'),(4,2,2,'AI & Web3 Summit Dubai','A one-day summit on applied AI, LLMs and blockchain with hands-on workshops and startup pitches.','event-4.svg','Business Bay','Grand Millennium Hotel','Dubai','2026-07-29',NULL,'09:00 AM','05:00 PM',150.00,'AED','https://aisummit.ae','TechTalks UAE','+97144442000','971544442000','hello@aisummit.ae',0,'approved',1,'2026-07-17 14:10:43'),(5,2,3,'Dubai Startup Founders Meetup','Monthly informal meetup for founders and investors — pitch practice, intros and networking.','event-5.svg','DIFC','Emirates Financial Towers','Dubai','2026-07-24',NULL,'06:30 PM','09:00 PM',0.00,'AED','https://meetup.com/dubai-founders','Dubai Founders Club','+97145553000','971545553000','team@founders.ae',0,'approved',1,'2026-07-17 14:10:43'),(6,2,3,'UAE SME Business Networking Night','Connect with SME owners, suppliers and service providers over dinner. Includes a short panel on funding.','event-6.svg','Sharjah','Sheraton Sharjah Beach Resort','Sharjah','2026-08-04',NULL,'07:00 PM','10:30 PM',120.00,'AED',NULL,'SME Council UAE','+97165554000','971565554000','connect@smeuae.ae',0,'approved',1,'2026-07-17 14:10:43'),(7,2,4,'Luxury Wedding Expo Dubai','Meet 100+ vendors — planners, venues, photographers and designers — all under one roof.','event-7.svg','Jumeirah','Madinat Jumeirah','Dubai','2026-08-11','2026-08-13','11:00 AM','09:00 PM',75.00,'AED','https://weddingexpo.ae','Bridal Events UAE','+97144445000','971544445000','info@weddingexpo.ae',1,'approved',1,'2026-07-17 14:10:43'),(8,2,4,'Bridal Fashion Showcase','An evening runway show featuring regional couture houses and bespoke bridal collections.','event-8.svg','Al Barsha','Grand Hyatt Ballroom','Dubai','2026-08-26',NULL,'07:30 PM','10:00 PM',200.00,'AED','https://bridalshow.ae','Couture Collective','+97144446000','971544446000','rsvp@bridalshow.ae',0,'approved',1,'2026-07-17 14:10:43'),(9,2,5,'Dubai International Film Festival','Ten days of regional and world cinema — premieres, Q&As and an outdoor screening series.','event-9.svg','Madinat Jumeirah','Madinat Arena','Dubai','2026-09-15','2026-09-24','02:00 PM','11:30 PM',90.00,'AED','https://diff.ae','DIFF Organisers','+97144447000','971544447000','box@diff.ae',1,'approved',1,'2026-07-17 14:10:43'),(10,2,5,'Cirque Live — Coca-Cola Arena','A world-touring acrobatic spectacle making its Middle East debut for six nights only.','event-10.svg','City Walk','Coca-Cola Arena','Dubai','2026-08-01','2026-08-06','08:00 PM','10:30 PM',195.00,'AED','https://coca-cola-arena.com','Live Nation ME','+97144448000','971544448000','tickets@arena.ae',0,'approved',1,'2026-07-17 14:10:43'),(11,2,6,'Global Village Season Opening','The new season opens with pavilions from 90 cultures, street food, rides and nightly fireworks.','event-11.svg','Sheikh Mohammed Bin Zayed Rd','Global Village','Dubai','2026-08-16','2026-12-14','04:00 PM','12:00 AM',25.00,'AED','https://www.globalvillage.ae','Global Village','+97144449000','971544449000','info@globalvillage.ae',1,'approved',1,'2026-07-17 14:10:43'),(12,2,6,'Miracle Garden Family Day','A family morning at the world\'s largest natural flower garden, with kids\' activities and photo trails.','event-12.svg','Dubailand','Dubai Miracle Garden','Dubai','2026-07-27',NULL,'09:00 AM','01:00 PM',55.00,'AED','https://www.dubaimiraclegarden.com','Miracle Garden','+97144450000','971544450000','visit@miraclegarden.ae',0,'approved',1,'2026-07-17 14:10:43');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `home_categories`
--

DROP TABLE IF EXISTS `home_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `home_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `home_categories`
--

LOCK TABLES `home_categories` WRITE;
/*!40000 ALTER TABLE `home_categories` DISABLE KEYS */;
INSERT INTO `home_categories` VALUES (8,54,'Mobile Shops','📱',NULL,1),(9,26,'Cafés','☕',NULL,1),(10,97,'Universities','🎓',NULL,1),(11,34,'Shopping Malls','🏬',NULL,1),(12,85,'Hospitals','🏥',NULL,1),(13,181,'Vloggers','📹',NULL,1),(17,209,'Online Doctor Consultations','💻',NULL,1);
/*!40000 ALTER TABLE `home_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institution_types`
--

DROP TABLE IF EXISTS `institution_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `institution_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_institution_type` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institution_types`
--

LOCK TABLES `institution_types` WRITE;
/*!40000 ALTER TABLE `institution_types` DISABLE KEYS */;
INSERT INTO `institution_types` VALUES (1,'Universities','🎓',1,1),(2,'Colleges','🏛️',2,1),(3,'International University Campuses','🌍',3,1),(4,'Online Universities','💻',4,1),(5,'Research Institutions','🔬',5,1),(6,'Vocational Colleges','🛠️',6,1);
/*!40000 ALTER TABLE `institution_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_applications`
--

DROP TABLE IF EXISTS `job_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_applications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cover_letter` text DEFAULT NULL,
  `status` enum('pending','shortlisted','rejected') NOT NULL DEFAULT 'pending',
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_job_user` (`job_id`,`user_id`),
  KEY `idx_job` (`job_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_applications`
--

LOCK TABLES `job_applications` WRITE;
/*!40000 ALTER TABLE `job_applications` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `company` varchar(200) DEFAULT NULL,
  `business_id` int(11) DEFAULT NULL,
  `company_logo` varchar(500) DEFAULT NULL,
  `salary_min` decimal(10,2) DEFAULT NULL,
  `salary_max` decimal(10,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'AED',
  `location` varchar(200) DEFAULT NULL,
  `emirate` varchar(50) DEFAULT NULL,
  `job_type` enum('Fulltime','Part Time','Contract','Freelance') DEFAULT 'Fulltime',
  `work_model` enum('Remote','Hybrid','On-site') DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `benefits` text DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `status` enum('pending','approved','rejected') DEFAULT 'approved',
  `posted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,NULL,'Arabic Teacher','Blems Education',NULL,NULL,1000.00,3000.00,'AED','Dubai, UAE',NULL,'Fulltime',NULL,'We\'re looking for a skilled DevOps Engineer to help streamline our deployment processes and maintain our cloud infrastructure.','3+ years of DevOps or infrastructure experience\nExperience with AWS, Azure, or Google Cloud\nProficiency in Docker and Kubernetes\nKnowledge of CI/CD tools (Jenkins, GitLab CI)\nExperience with infrastructure as Code (Terraform)\nUnderstanding of monitoring and logging tools\nScripting skills in Python or Bash','Competitive salary rates\nOpportunity for full-time conversion\nRemote work flexibility\nAccess to cutting-edge technologies\nCollaborative team environment\nProfessional development support\nFlexible schedule',1,1,'approved','2026-04-13 21:02:17'),(2,NULL,'Web Developer','Smart Technologies',NULL,NULL,2000.00,5000.00,'AED','Dubai, UAE',NULL,'Part Time',NULL,'Looking for an experienced web developer to join our team.','3+ years of web development experience\nProficiency in PHP, JavaScript\nExperience with MySQL\nKnowledge of modern frameworks','Competitive salary\nFlexible hours\nRemote work options',1,1,'approved','2026-04-13 21:02:17'),(3,2,'Marketing Manager','Digital Corp',NULL,NULL,3000.00,6000.00,'AED','Abu Dhabi, UAE',NULL,'Contract',NULL,'We need a marketing manager to lead our digital campaigns.','5+ years of marketing experience\nDigital marketing expertise\nTeam leadership skills','Great benefits package\nProfessional growth\nTeam events',1,1,'approved','2026-04-13 21:02:17');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `languages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `usage_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_language_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` VALUES (1,'English',0,'2026-06-02 04:09:45'),(2,'Arabic',0,'2026-06-02 04:09:45'),(3,'Hindi',0,'2026-06-02 04:09:45'),(4,'Urdu',0,'2026-06-02 04:09:45'),(5,'Malayalam',0,'2026-06-02 04:09:45'),(6,'Tamil',0,'2026-06-02 04:09:45'),(7,'Telugu',0,'2026-06-02 04:09:45'),(8,'Bengali',0,'2026-06-02 04:09:45'),(9,'Punjabi',0,'2026-06-02 04:09:45'),(10,'Tagalog',0,'2026-06-02 04:09:45'),(11,'French',0,'2026-06-02 04:09:45'),(12,'Spanish',0,'2026-06-02 04:09:45'),(13,'German',0,'2026-06-02 04:09:45'),(14,'Italian',0,'2026-06-02 04:09:45'),(15,'Russian',0,'2026-06-02 04:09:45'),(16,'Mandarin',0,'2026-06-02 04:09:45'),(17,'Cantonese',0,'2026-06-02 04:09:45'),(18,'Japanese',0,'2026-06-02 04:09:45'),(19,'Korean',0,'2026-06-02 04:09:45'),(20,'Portuguese',0,'2026-06-02 04:09:45'),(21,'Dutch',0,'2026-06-02 04:09:45'),(22,'Turkish',0,'2026-06-02 04:09:45'),(23,'Persian (Farsi)',0,'2026-06-02 04:09:45'),(24,'Pashto',0,'2026-06-02 04:09:45'),(25,'Sinhala',0,'2026-06-02 04:09:45'),(26,'Nepali',0,'2026-06-02 04:09:45'),(27,'Indonesian',0,'2026-06-02 04:09:45'),(28,'Malay',0,'2026-06-02 04:09:45'),(29,'Swahili',0,'2026-06-02 04:09:45'),(30,'Amharic',0,'2026-06-02 04:09:45'),(31,'Somali',0,'2026-06-02 04:09:45'),(32,'Greek',0,'2026-06-02 04:09:45'),(33,'Polish',0,'2026-06-02 04:09:45'),(34,'Romanian',0,'2026-06-02 04:09:45'),(35,'Ukrainian',0,'2026-06-02 04:09:45'),(36,'Marathi',0,'2026-06-02 04:09:45'),(37,'Gujarati',0,'2026-06-02 04:09:45'),(38,'Kannada',0,'2026-06-02 04:09:45'),(39,'Sindhi',0,'2026-06-02 04:09:45');
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `main_categories`
--

LOCK TABLES `main_categories` WRITE;
/*!40000 ALTER TABLE `main_categories` DISABLE KEYS */;
INSERT INTO `main_categories` VALUES (9,'Food & Dining','🍽️',NULL,1,1),(10,'Malls & Shopping Centres','🏬',NULL,2,1),(11,'Hypermarkets & Supermarkets','🛒',NULL,3,1),(12,'Discount & Department Stores','🏷️',NULL,4,1),(13,'Wholesale & Retail Stores','🛍️',NULL,5,1),(14,'Property & Real Estate','🏠',NULL,6,1),(15,'Maintenance & Home Services','🛠️',NULL,7,1),(16,'Automotive','🚗',NULL,8,1),(17,'Health, Beauty & Wellness','🏥',NULL,9,1),(18,'Education & Training','🎓',NULL,10,1),(19,'Technology & Digital Services','💻',NULL,11,1),(20,'Travel, Tourism & Accommodation','✈️',NULL,12,1),(21,'Professional & Business Services','💼',NULL,13,1),(22,'Finance, Legal & Insurance','💰',NULL,14,1),(23,'Construction & Contracting','🏗️',NULL,15,1),(24,'Logistics & Transportation','🚚',NULL,16,1),(25,'Security, Safety & Fire Protection','🛡️',NULL,17,1),(26,'Events & Celebrations','🎉',NULL,18,1),(27,'Media & Entertainment','🎭',NULL,19,1),(28,'Content Creators & Influencers','📹',NULL,20,1),(29,'Doctors & Specialists','👨‍⚕️',NULL,21,1);
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
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `link` varchar(500) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `popular_categories`
--

LOCK TABLES `popular_categories` WRITE;
/*!40000 ALTER TABLE `popular_categories` DISABLE KEYS */;
INSERT INTO `popular_categories` VALUES (1,NULL,'Car Rental','1779104221999.jpg','',1,1),(2,NULL,'Tours & Travels','1779104208873.png','',2,1),(3,23,'Restaurant','1779104169529.jpg','',1,0);
/*!40000 ALTER TABLE `popular_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_images`
--

DROP TABLE IF EXISTS `project_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `filename` varchar(500) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_images_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `real_estate_projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_images`
--

LOCK TABLES `project_images` WRITE;
/*!40000 ALTER TABLE `project_images` DISABLE KEYS */;
INSERT INTO `project_images` VALUES (1,1,'proj-1-a.svg',0,'2026-06-05 19:58:45'),(2,1,'proj-1-b.svg',1,'2026-06-05 19:58:45'),(3,2,'proj-2-a.svg',0,'2026-06-05 19:58:45'),(4,2,'proj-2-b.svg',1,'2026-06-05 19:58:45'),(5,3,'proj-3-a.svg',0,'2026-06-05 19:58:45'),(6,3,'proj-3-b.svg',1,'2026-06-05 19:58:45'),(7,4,'proj-4-a.svg',0,'2026-06-05 19:58:45'),(8,4,'proj-4-b.svg',1,'2026-06-05 19:58:45');
/*!40000 ALTER TABLE `project_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `properties` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `purpose` varchar(10) DEFAULT NULL,
  `price` decimal(14,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'AED',
  `rent_period` varchar(20) DEFAULT NULL,
  `bedrooms` varchar(20) DEFAULT NULL,
  `bathrooms` varchar(20) DEFAULT NULL,
  `area_sqft` varchar(30) DEFAULT NULL,
  `furnished` varchar(30) DEFAULT NULL,
  `parking` varchar(30) DEFAULT NULL,
  `amenities` text DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `emirate` varchar(50) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `is_active` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `company_id` (`company_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (1,2,NULL,1,'Bedspace in Bur Dubai','Clean, well-maintained bed space for executive bachelors. Includes WiFi, DEWA and weekly cleaning.','Rent',1200.00,'AED','Monthly','Shared','Shared','Shared','Furnished','No','WiFi, A/C, Cleaning','Bur Dubai','Dubai','prop-1-a.svg','approved',1,'2026-06-05 19:58:45'),(2,2,NULL,1,'Ladies Bedspace in Deira','Female-only bed space close to metro. All bills included, fully furnished.','Rent',1000.00,'AED','Monthly','Shared','Shared','Shared','Furnished','No','WiFi, Metro nearby','Deira','Dubai','prop-2-a.svg','approved',1,'2026-06-05 19:58:45'),(3,2,NULL,2,'Private Room in Al Nahda','Spacious private room with attached bathroom in a family apartment.','Rent',2500.00,'AED','Monthly','1','1','220 sqft','Furnished','Yes','Attached bath, Balcony','Al Nahda','Sharjah','prop-3-a.svg','approved',1,'2026-06-05 19:58:45'),(4,2,NULL,2,'Sharing Room in JLT','Partition room available in a clean sharing apartment, lake view tower.','Rent',1800.00,'AED','Monthly','Shared','1','180 sqft','Partly Furnished','No','Pool, Gym, Lake view','Jumeirah Lake Towers','Dubai','prop-4-a.svg','approved',1,'2026-06-05 19:58:45'),(5,2,1,3,'1BR Apartment in Dubai Marina','Bright one-bedroom with full marina view, chiller free, walking distance to the beach.','Rent',75000.00,'AED','Yearly','1','2','780 sqft','Unfurnished','Yes','Pool, Gym, Marina view, Security','Dubai Marina','Dubai','prop-5-a.svg','approved',1,'2026-06-05 19:58:45'),(6,2,2,3,'2BR Apartment in JVC','Modern two-bedroom in a quiet community, close to schools and Circle Mall.','Rent',95000.00,'AED','Yearly','2','3','1250 sqft','Furnished','Yes','Pool, Gym, Kids play area','Jumeirah Village Circle','Dubai','prop-6-a.svg','approved',1,'2026-06-05 19:58:45'),(7,2,1,4,'4BR Villa in Arabian Ranches','Type 14 villa with private garden and maid room in a sought-after community.','Rent',220000.00,'AED','Yearly','4','5','3500 sqft','Unfurnished','Yes','Private garden, Maid room, Community pool','Arabian Ranches','Dubai','prop-7-a.svg','approved',1,'2026-06-05 19:58:45'),(8,2,4,4,'5BR Luxury Villa in Al Barari','Ultra-luxury villa surrounded by greenery with a private pool and home cinema.','Rent',350000.00,'AED','Yearly','5','6','6000 sqft','Furnished','Yes','Private pool, Home cinema, Smart home','Al Barari','Dubai','prop-8-a.svg','approved',1,'2026-06-05 19:58:45'),(9,2,1,5,'2BR for Sale in Downtown','Burj Khalifa view apartment, high floor, ready to move in, strong rental yield.','Sale',2100000.00,'AED',NULL,'2','3','1300 sqft','Furnished','Yes','Burj view, Pool, Gym, Concierge','Downtown Dubai','Dubai','prop-9-a.svg','approved',1,'2026-06-05 19:58:45'),(10,2,2,5,'Studio for Sale in Business Bay','Smart studio with canal view, ideal investment, handover-ready.','Sale',850000.00,'AED',NULL,'Studio','1','480 sqft','Furnished','Yes','Canal view, Pool, Gym','Business Bay','Dubai','prop-10-a.svg','approved',1,'2026-06-05 19:58:45'),(11,2,3,6,'Signature Villa on Palm Jumeirah','Beachfront signature villa with private beach access and infinity pool.','Sale',12000000.00,'AED',NULL,'5','6','7200 sqft','Furnished','Yes','Private beach, Infinity pool, Sea view','Palm Jumeirah','Dubai','prop-11-a.svg','approved',1,'2026-06-05 19:58:45'),(12,2,4,6,'4BR Villa in Saadiyat Island','Contemporary villa steps from the beach in a premium Abu Dhabi community.','Sale',8500000.00,'AED',NULL,'4','5','5200 sqft','Unfurnished','Yes','Beach access, Garden, Smart home','Saadiyat Island','Abu Dhabi','prop-12-a.svg','approved',1,'2026-06-05 19:58:45');
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property_categories`
--

DROP TABLE IF EXISTS `property_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `property_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_categories`
--

LOCK TABLES `property_categories` WRITE;
/*!40000 ALTER TABLE `property_categories` DISABLE KEYS */;
INSERT INTO `property_categories` VALUES (1,'Bedspace','🛏️',1,1),(2,'Private/Sharing Rooms','🚪',2,1),(3,'Flat for Rent','🏢',3,1),(4,'Villa for Rent','🏡',4,1),(5,'Flat for Sale','🏬',5,1),(6,'Villa for Sale','🏠',6,1);
/*!40000 ALTER TABLE `property_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property_images`
--

DROP TABLE IF EXISTS `property_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `property_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(11) NOT NULL,
  `filename` varchar(500) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `property_images_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_images`
--

LOCK TABLES `property_images` WRITE;
/*!40000 ALTER TABLE `property_images` DISABLE KEYS */;
INSERT INTO `property_images` VALUES (1,1,'prop-1-a.svg',0,'2026-06-05 19:58:45'),(2,1,'prop-1-b.svg',1,'2026-06-05 19:58:45'),(3,1,'prop-1-c.svg',2,'2026-06-05 19:58:45'),(4,2,'prop-2-a.svg',0,'2026-06-05 19:58:45'),(5,2,'prop-2-b.svg',1,'2026-06-05 19:58:45'),(6,2,'prop-2-c.svg',2,'2026-06-05 19:58:45'),(7,3,'prop-3-a.svg',0,'2026-06-05 19:58:45'),(8,3,'prop-3-b.svg',1,'2026-06-05 19:58:45'),(9,3,'prop-3-c.svg',2,'2026-06-05 19:58:45'),(10,4,'prop-4-a.svg',0,'2026-06-05 19:58:45'),(11,4,'prop-4-b.svg',1,'2026-06-05 19:58:45'),(12,4,'prop-4-c.svg',2,'2026-06-05 19:58:45'),(13,5,'prop-5-a.svg',0,'2026-06-05 19:58:45'),(14,5,'prop-5-b.svg',1,'2026-06-05 19:58:45'),(15,5,'prop-5-c.svg',2,'2026-06-05 19:58:45'),(16,6,'prop-6-a.svg',0,'2026-06-05 19:58:45'),(17,6,'prop-6-b.svg',1,'2026-06-05 19:58:45'),(18,6,'prop-6-c.svg',2,'2026-06-05 19:58:45'),(19,7,'prop-7-a.svg',0,'2026-06-05 19:58:45'),(20,7,'prop-7-b.svg',1,'2026-06-05 19:58:45'),(21,7,'prop-7-c.svg',2,'2026-06-05 19:58:45'),(22,8,'prop-8-a.svg',0,'2026-06-05 19:58:45'),(23,8,'prop-8-b.svg',1,'2026-06-05 19:58:45'),(24,8,'prop-8-c.svg',2,'2026-06-05 19:58:45'),(25,9,'prop-9-a.svg',0,'2026-06-05 19:58:45'),(26,9,'prop-9-b.svg',1,'2026-06-05 19:58:45'),(27,9,'prop-9-c.svg',2,'2026-06-05 19:58:45'),(28,10,'prop-10-a.svg',0,'2026-06-05 19:58:45'),(29,10,'prop-10-b.svg',1,'2026-06-05 19:58:45'),(30,10,'prop-10-c.svg',2,'2026-06-05 19:58:45'),(31,11,'prop-11-a.svg',0,'2026-06-05 19:58:45'),(32,11,'prop-11-b.svg',1,'2026-06-05 19:58:45'),(33,11,'prop-11-c.svg',2,'2026-06-05 19:58:45'),(34,12,'prop-12-a.svg',0,'2026-06-05 19:58:45'),(35,12,'prop-12-b.svg',1,'2026-06-05 19:58:45'),(36,12,'prop-12-c.svg',2,'2026-06-05 19:58:45');
/*!40000 ALTER TABLE `property_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `real_estate_companies`
--

DROP TABLE IF EXISTS `real_estate_companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `real_estate_companies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `logo` varchar(500) DEFAULT NULL,
  `banner` varchar(500) DEFAULT NULL,
  `about` text DEFAULT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `whatsapp` varchar(40) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `website` varchar(200) DEFAULT NULL,
  `emirate` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `is_active` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `real_estate_companies`
--

LOCK TABLES `real_estate_companies` WRITE;
/*!40000 ALTER TABLE `real_estate_companies` DISABLE KEYS */;
INSERT INTO `real_estate_companies` VALUES (1,2,'Emaar Properties','emaar-logo.svg','emaar-banner.svg','Emaar is one of the most valuable real estate development companies in the world, the master developer behind Downtown Dubai, Dubai Marina and Burj Khalifa.','+97144661688','971544661688','sales@emaar.ae','https://www.emaar.com','Dubai','Downtown Dubai, Emaar Square',1,1,'approved',1,'2026-06-05 19:58:45'),(2,2,'DAMAC Properties','damac-logo.svg','damac-banner.svg','DAMAC Properties is a luxury real estate developer delivering iconic residential, commercial and leisure properties across the region.','+97144209999','971544209999','info@damacproperties.com','https://www.damacproperties.com','Dubai','DAMAC Park Towers, DIFC',1,2,'approved',1,'2026-06-05 19:58:45'),(3,2,'Nakheel','nakheel-logo.svg','nakheel-banner.svg','Nakheel is a world-leading master developer whose landmark projects include Palm Jumeirah, The World and Deira Islands.','+97148908000','971544908000','customercare@nakheel.com','https://www.nakheel.com','Dubai','Palm Jumeirah, Al Sufouh',1,3,'approved',1,'2026-06-05 19:58:45'),(4,2,'Aldar Properties','aldar-logo.svg','aldar-banner.svg','Aldar is the leading real estate developer in Abu Dhabi, creating integrated communities on Yas Island, Saadiyat Island and beyond.','+97120181111','971544181111','customercare@aldar.com','https://www.aldar.com','Abu Dhabi','Yas Island, HQ Building',1,4,'approved',1,'2026-06-05 19:58:45');
/*!40000 ALTER TABLE `real_estate_companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `real_estate_projects`
--

DROP TABLE IF EXISTS `real_estate_projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `real_estate_projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `developer` varchar(200) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `emirate` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `starting_price` decimal(14,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'AED',
  `handover` varchar(50) DEFAULT NULL,
  `payment_plan` varchar(200) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `is_active` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `real_estate_projects`
--

LOCK TABLES `real_estate_projects` WRITE;
/*!40000 ALTER TABLE `real_estate_projects` DISABLE KEYS */;
INSERT INTO `real_estate_projects` VALUES (1,2,1,'Emaar Beachfront','Emaar Properties','Dubai Harbour','Dubai','An exclusive island destination between Palm Jumeirah and JBR with private beach living.',1500000.00,'AED','Q4 2026','80/20 Payment Plan','proj-1-a.svg',1,'approved',1,'2026-06-05 19:58:45'),(2,2,2,'DAMAC Lagoons','DAMAC Properties','Dubailand','Dubai','Mediterranean-inspired waterfront community of villas and townhouses around crystal lagoons.',1800000.00,'AED','Q2 2027','70/30 Payment Plan','proj-2-a.svg',1,'approved',1,'2026-06-05 19:58:45'),(3,2,3,'Palm Beach Towers','Nakheel','Palm Jumeirah','Dubai','Three iconic towers at the gateway of Palm Jumeirah with resort-style amenities.',2600000.00,'AED','Q1 2027','60/40 Payment Plan','proj-3-a.svg',1,'approved',1,'2026-06-05 19:58:45'),(4,2,4,'Saadiyat Lagoons','Aldar Properties','Saadiyat Island','Abu Dhabi','A nature-inspired community of standalone villas surrounded by mangroves and wildlife.',2200000.00,'AED','Q3 2026','75/25 Payment Plan','proj-4-a.svg',1,'approved',1,'2026-06-05 19:58:45');
/*!40000 ALTER TABLE `real_estate_projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `search_keywords`
--

DROP TABLE IF EXISTS `search_keywords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_keywords` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword` varchar(255) NOT NULL,
  `count` int(11) DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_keyword` (`keyword`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `search_keywords`
--

LOCK TABLES `search_keywords` WRITE;
/*!40000 ALTER TABLE `search_keywords` DISABLE KEYS */;
INSERT INTO `search_keywords` VALUES (1,'cater',2,'2026-05-20 02:55:23'),(3,'smart',2,'2026-07-20 13:13:25'),(4,'smartflix',1,'2026-07-20 13:07:22'),(6,'restaurants',48,'2026-07-20 13:24:30'),(7,'car rental',37,'2026-07-20 13:24:30'),(8,'plumber',29,'2026-07-20 13:24:30'),(9,'salon',26,'2026-07-20 13:24:30'),(10,'hospital',22,'2026-07-20 13:24:30'),(11,'gym',19,'2026-07-20 13:24:30'),(12,'real estate',31,'2026-07-20 13:24:30'),(13,'electronics',17,'2026-07-20 13:24:30'),(14,'bakery',14,'2026-07-20 13:24:30'),(15,'cleaning',12,'2026-07-20 13:24:30');
/*!40000 ALTER TABLE `search_keywords` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES (1,'site_name','SMARTUAE','2026-04-13 21:02:17'),(2,'site_tagline','Your Smart Business Directory','2026-04-13 21:02:17'),(3,'contact_phone','+971559164496','2026-05-20 07:38:46'),(4,'contact_email','mail@smartflix.ae','2026-05-20 07:38:46'),(5,'whatsapp','971559164496','2026-05-20 07:38:46'),(6,'smtp_host','smtp.hostinger.com','2026-05-20 07:38:07'),(7,'smtp_port','465','2026-05-20 07:38:07'),(8,'smtp_user','mail@smartflix.ae','2026-05-20 07:38:07'),(9,'smtp_pass','Jabs@2254','2026-05-20 07:38:07');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `skills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `usage_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_skill_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (1,'JavaScript',0,'2026-06-02 04:09:45'),(2,'TypeScript',0,'2026-06-02 04:09:45'),(3,'React',0,'2026-06-02 04:09:45'),(4,'Angular',0,'2026-06-02 04:09:45'),(5,'Vue.js',0,'2026-06-02 04:09:45'),(6,'Node.js',0,'2026-06-02 04:09:45'),(7,'Express.js',0,'2026-06-02 04:09:45'),(8,'Python',0,'2026-06-02 04:09:45'),(9,'Django',0,'2026-06-02 04:09:45'),(10,'Flask',0,'2026-06-02 04:09:45'),(11,'Java',0,'2026-06-02 04:09:45'),(12,'Spring Boot',0,'2026-06-02 04:09:45'),(13,'C#',0,'2026-06-02 04:09:45'),(14,'.NET',0,'2026-06-02 04:09:45'),(15,'PHP',0,'2026-06-02 04:09:45'),(16,'Laravel',0,'2026-06-02 04:09:45'),(17,'Ruby',0,'2026-06-02 04:09:45'),(18,'Ruby on Rails',0,'2026-06-02 04:09:45'),(19,'Go',0,'2026-06-02 04:09:45'),(20,'Rust',0,'2026-06-02 04:09:45'),(21,'Kotlin',0,'2026-06-02 04:09:45'),(22,'Swift',0,'2026-06-02 04:09:45'),(23,'Objective-C',0,'2026-06-02 04:09:45'),(24,'Flutter',0,'2026-06-02 04:09:45'),(25,'React Native',0,'2026-06-02 04:09:45'),(26,'HTML',0,'2026-06-02 04:09:45'),(27,'CSS',0,'2026-06-02 04:09:45'),(28,'Sass',0,'2026-06-02 04:09:45'),(29,'Tailwind CSS',0,'2026-06-02 04:09:45'),(30,'Bootstrap',0,'2026-06-02 04:09:45'),(31,'jQuery',0,'2026-06-02 04:09:45'),(32,'SQL',0,'2026-06-02 04:09:45'),(33,'MySQL',0,'2026-06-02 04:09:45'),(34,'PostgreSQL',0,'2026-06-02 04:09:45'),(35,'MongoDB',0,'2026-06-02 04:09:45'),(36,'Redis',0,'2026-06-02 04:09:45'),(37,'Oracle',0,'2026-06-02 04:09:45'),(38,'SQL Server',0,'2026-06-02 04:09:45'),(39,'Firebase',0,'2026-06-02 04:09:45'),(40,'AWS',0,'2026-06-02 04:09:45'),(41,'Azure',0,'2026-06-02 04:09:45'),(42,'Google Cloud',0,'2026-06-02 04:09:45'),(43,'Docker',0,'2026-06-02 04:09:45'),(44,'Kubernetes',0,'2026-06-02 04:09:45'),(45,'Terraform',0,'2026-06-02 04:09:45'),(46,'Jenkins',0,'2026-06-02 04:09:45'),(47,'CI/CD',0,'2026-06-02 04:09:45'),(48,'Git',0,'2026-06-02 04:09:45'),(49,'Linux',0,'2026-06-02 04:09:45'),(50,'Bash',0,'2026-06-02 04:09:45'),(51,'GraphQL',0,'2026-06-02 04:09:45'),(52,'REST API',0,'2026-06-02 04:09:45'),(53,'Microservices',0,'2026-06-02 04:09:45'),(54,'RabbitMQ',0,'2026-06-02 04:09:45'),(55,'Kafka',0,'2026-06-02 04:09:45'),(56,'Machine Learning',0,'2026-06-02 04:09:45'),(57,'Deep Learning',0,'2026-06-02 04:09:45'),(58,'Data Science',0,'2026-06-02 04:09:45'),(59,'Data Analysis',0,'2026-06-02 04:09:45'),(60,'TensorFlow',0,'2026-06-02 04:09:45'),(61,'PyTorch',0,'2026-06-02 04:09:45'),(62,'Power BI',0,'2026-06-02 04:09:45'),(63,'Tableau',0,'2026-06-02 04:09:45'),(64,'Excel',0,'2026-06-02 04:09:45'),(65,'Figma',0,'2026-06-02 04:09:45'),(66,'Adobe Photoshop',0,'2026-06-02 04:09:45'),(67,'Adobe Illustrator',0,'2026-06-02 04:09:45'),(68,'Adobe XD',0,'2026-06-02 04:09:45'),(69,'UI/UX Design',0,'2026-06-02 04:09:45'),(70,'Graphic Design',0,'2026-06-02 04:09:45'),(71,'Video Editing',0,'2026-06-02 04:09:45'),(72,'Premiere Pro',0,'2026-06-02 04:09:45'),(73,'After Effects',0,'2026-06-02 04:09:45'),(74,'Digital Marketing',0,'2026-06-02 04:09:45'),(75,'SEO',0,'2026-06-02 04:09:45'),(76,'SEM',0,'2026-06-02 04:09:45'),(77,'Google Ads',0,'2026-06-02 04:09:45'),(78,'Social Media Marketing',0,'2026-06-02 04:09:45'),(79,'Content Writing',0,'2026-06-02 04:09:45'),(80,'Copywriting',0,'2026-06-02 04:09:45'),(81,'Email Marketing',0,'2026-06-02 04:09:45'),(82,'Brand Management',0,'2026-06-02 04:09:45'),(83,'Market Research',0,'2026-06-02 04:09:45'),(84,'Project Management',0,'2026-06-02 04:09:45'),(85,'Agile',0,'2026-06-02 04:09:45'),(86,'Scrum',0,'2026-06-02 04:09:45'),(87,'Jira',0,'2026-06-02 04:09:45'),(88,'Product Management',0,'2026-06-02 04:09:45'),(89,'Business Analysis',0,'2026-06-02 04:09:45'),(90,'Accounting',0,'2026-06-02 04:09:45'),(91,'Bookkeeping',0,'2026-06-02 04:09:45'),(92,'Financial Analysis',0,'2026-06-02 04:09:45'),(93,'Audit',0,'2026-06-02 04:09:45'),(94,'Taxation',0,'2026-06-02 04:09:45'),(95,'QuickBooks',0,'2026-06-02 04:09:45'),(96,'SAP',0,'2026-06-02 04:09:45'),(97,'Sales',0,'2026-06-02 04:09:45'),(98,'Business Development',0,'2026-06-02 04:09:45'),(99,'Negotiation',0,'2026-06-02 04:09:45'),(100,'Customer Service',0,'2026-06-02 04:09:45'),(101,'CRM',0,'2026-06-02 04:09:45'),(102,'Salesforce',0,'2026-06-02 04:09:45'),(103,'Human Resources',0,'2026-06-02 04:09:45'),(104,'Recruitment',0,'2026-06-02 04:09:45'),(105,'Payroll',0,'2026-06-02 04:09:45'),(106,'Training & Development',0,'2026-06-02 04:09:45'),(107,'Supply Chain',0,'2026-06-02 04:09:45'),(108,'Logistics',0,'2026-06-02 04:09:45'),(109,'Procurement',0,'2026-06-02 04:09:45'),(110,'Inventory Management',0,'2026-06-02 04:09:45'),(111,'Operations Management',0,'2026-06-02 04:09:45'),(112,'Civil Engineering',0,'2026-06-02 04:09:45'),(113,'Mechanical Engineering',0,'2026-06-02 04:09:45'),(114,'Electrical Engineering',0,'2026-06-02 04:09:45'),(115,'AutoCAD',0,'2026-06-02 04:09:45'),(116,'Revit',0,'2026-06-02 04:09:45'),(117,'Construction Management',0,'2026-06-02 04:09:45'),(118,'Quantity Surveying',0,'2026-06-02 04:09:45'),(119,'Health & Safety',0,'2026-06-02 04:09:45'),(120,'HSE',0,'2026-06-02 04:09:45'),(121,'Nursing',0,'2026-06-02 04:09:45'),(122,'Pharmacy',0,'2026-06-02 04:09:45'),(123,'Medical Coding',0,'2026-06-02 04:09:45'),(124,'Patient Care',0,'2026-06-02 04:09:45'),(125,'Teaching',0,'2026-06-02 04:09:45'),(126,'Curriculum Development',0,'2026-06-02 04:09:45'),(127,'Translation',0,'2026-06-02 04:09:45'),(128,'Legal Research',0,'2026-06-02 04:09:45'),(129,'Contract Management',0,'2026-06-02 04:09:45'),(130,'Hospitality',0,'2026-06-02 04:09:45'),(131,'Food & Beverage',0,'2026-06-02 04:09:45'),(132,'Housekeeping',0,'2026-06-02 04:09:45'),(133,'Front Office',0,'2026-06-02 04:09:45'),(134,'Event Management',0,'2026-06-02 04:09:45'),(135,'Real Estate',0,'2026-06-02 04:09:45'),(136,'Property Management',0,'2026-06-02 04:09:45'),(137,'Leasing',0,'2026-06-02 04:09:45'),(138,'Communication',0,'2026-06-02 04:09:45'),(139,'Leadership',0,'2026-06-02 04:09:45'),(140,'Teamwork',0,'2026-06-02 04:09:45'),(141,'Problem Solving',0,'2026-06-02 04:09:45'),(142,'Time Management',0,'2026-06-02 04:09:45'),(143,'Microsoft Office',0,'2026-06-02 04:09:45'),(144,'Data Entry',0,'2026-06-02 04:09:45'),(145,'Administration',0,'2026-06-02 04:09:45'),(146,'Customer Support',0,'2026-06-02 04:09:45');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
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
INSERT INTO `sliders` VALUES (3,'','','','','69e74a1c96a04.jpg',0,1,'2026-04-13 21:10:11',NULL),(4,'','','','','69e74a135657c.jpg',0,1,'2026-04-13 21:28:33',2),(5,'','','','','69e74a3d4c525.png',0,1,'2026-04-21 09:58:21',0),(6,'','','','','69e74a5b56655.png',0,1,'2026-04-21 09:58:51',3);
/*!40000 ALTER TABLE `sliders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_permissions`
--

DROP TABLE IF EXISTS `staff_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `staff_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_permissions`
--

LOCK TABLES `staff_permissions` WRITE;
/*!40000 ALTER TABLE `staff_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_levels`
--

DROP TABLE IF EXISTS `study_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_levels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_study_level` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_levels`
--

LOCK TABLES `study_levels` WRITE;
/*!40000 ALTER TABLE `study_levels` DISABLE KEYS */;
INSERT INTO `study_levels` VALUES (1,'Diploma','📜',1,1),(2,'Bachelor\'s Degree','🎓',2,1),(3,'Master\'s Degree','🎓',3,1),(4,'Doctorate/PhD','🏅',4,1),(5,'Professional Certification','📄',5,1),(6,'Short Courses','⏱️',6,1),(7,'Online and Distance Learning','💻',7,1);
/*!40000 ALTER TABLE `study_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `university_courses`
--

DROP TABLE IF EXISTS `university_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `university_courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `total_fee` decimal(12,2) DEFAULT NULL,
  `fee_per_year` decimal(12,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'AED',
  `study_mode` varchar(30) DEFAULT NULL,
  `delivery` varchar(30) DEFAULT NULL,
  `location` varchar(120) DEFAULT NULL,
  `emirate` varchar(50) DEFAULT NULL,
  `intake` varchar(100) DEFAULT NULL,
  `eligibility` varchar(255) DEFAULT NULL,
  `application_deadline` date DEFAULT NULL,
  `accreditation` varchar(150) DEFAULT NULL,
  `scholarships` varchar(30) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `university_courses_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `university_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `university_courses`
--

LOCK TABLES `university_courses` WRITE;
/*!40000 ALTER TABLE `university_courses` DISABLE KEYS */;
INSERT INTO `university_courses` VALUES (1,5,1,45000.00,22500.00,'AED','Full-time','On campus','Academic City','Dubai','September 2026','Grade 12 or equivalent','2026-08-15','Ministry of Education, UAE','Available',1,1,'2026-07-23 13:40:39'),(2,6,2,48000.00,24000.00,'AED','Full-time','On campus','Masdar City','Abu Dhabi','September 2026','Grade 12 or equivalent','2026-08-15','Ministry of Education, UAE','Not Available',0,1,'2026-07-23 13:40:39'),(3,5,3,38000.00,38000.00,'AED','Full-time','On campus','Academic City','Dubai','January 2027','Grade 12 or equivalent','2026-11-30','Ministry of Education, UAE','Available',0,1,'2026-07-23 13:40:39'),(4,6,4,52000.00,26000.00,'AED','Full-time','On campus','Masdar City','Abu Dhabi','September 2026','Grade 12 or equivalent','2026-08-15','Ministry of Education, UAE','Available',0,1,'2026-07-23 13:40:39'),(5,5,5,120000.00,30000.00,'AED','Full-time','On campus','Academic City','Dubai','September 2026','Grade 12 or equivalent','2026-06-30','Ministry of Education, UAE','Available',1,1,'2026-07-23 13:40:39'),(6,6,6,140000.00,35000.00,'AED','Full-time','On campus','Masdar City','Abu Dhabi','September 2026','Grade 12 (Science) or equivalent','2026-06-30','Ministry of Education, UAE','Available',1,1,'2026-07-23 13:40:39'),(7,6,7,150000.00,37500.00,'AED','Full-time','On campus','Masdar City','Abu Dhabi','September 2026','Grade 12 (Science) or equivalent','2026-06-30','Ministry of Education, UAE','Available',1,1,'2026-07-23 13:40:39'),(8,5,8,145000.00,36250.00,'AED','Full-time','On campus','Academic City','Dubai','September 2026','Grade 12 (Science) or equivalent','2026-06-30','Ministry of Education, UAE','Not Available',0,1,'2026-07-23 13:40:39'),(9,5,9,175000.00,35000.00,'AED','Full-time','On campus','Academic City','Dubai','September 2026','Grade 12 or equivalent','2026-06-30','Ministry of Education, UAE','Available',0,1,'2026-07-23 13:40:39'),(10,6,10,130000.00,32500.00,'AED','Full-time','On campus','Masdar City','Abu Dhabi','September 2026','Grade 12 (Science) or equivalent','2026-06-30','Ministry of Education, UAE','Available',0,1,'2026-07-23 13:40:39'),(11,5,11,85000.00,42500.00,'AED','Part-time','Hybrid','Academic City','Dubai','September 2026 / January 2027','Bachelor\'s degree with 2:2 or above','2026-07-31','Ministry of Education, UAE','Available',1,1,'2026-07-23 13:40:39'),(12,6,12,90000.00,45000.00,'AED','Full-time','On campus','Masdar City','Abu Dhabi','September 2026','Bachelor\'s in a numerate discipline','2026-07-31','Ministry of Education, UAE','Available',1,1,'2026-07-23 13:40:39'),(13,6,13,92000.00,46000.00,'AED','Full-time','On campus','Masdar City','Abu Dhabi','January 2027','Bachelor\'s in Computer Science or related','2026-11-30','Ministry of Education, UAE','Not Available',0,1,'2026-07-23 13:40:39'),(14,5,14,150000.00,30000.00,'AED','Full-time','On campus','Academic City','Dubai','September 2026','Master\'s degree with research proposal','2026-05-31','Ministry of Education, UAE','Available',0,1,'2026-07-23 13:40:39'),(15,5,15,16044000.00,32000.00,'AED','Full-time','On campus','Masdar City','Abu Dhabi','September 2026','Master\'s degree with research proposal','2026-05-30','Ministry of Education, UAE','Available',0,1,'2026-07-23 13:40:39');
/*!40000 ALTER TABLE `university_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `university_profiles`
--

DROP TABLE IF EXISTS `university_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `university_profiles` (
  `business_id` int(11) NOT NULL,
  `institution_type_id` int(11) DEFAULT NULL,
  `ranking` varchar(120) DEFAULT NULL,
  `campus_size` varchar(60) DEFAULT NULL,
  `established_year` int(11) DEFAULT NULL,
  PRIMARY KEY (`business_id`),
  KEY `institution_type_id` (`institution_type_id`),
  CONSTRAINT `university_profiles_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `university_profiles`
--

LOCK TABLES `university_profiles` WRITE;
/*!40000 ALTER TABLE `university_profiles` DISABLE KEYS */;
INSERT INTO `university_profiles` VALUES (5,1,'Top 50 in the GCC','120 acres',1998),(6,5,'Top 10 for Research in UAE','85 acres',2006);
/*!40000 ALTER TABLE `university_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_otps`
--

DROP TABLE IF EXISTS `user_otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_otps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(255) NOT NULL,
  `otp_code` varchar(10) NOT NULL,
  `otp_type` enum('signup','login','forgot') NOT NULL,
  `channel` enum('email','sms') DEFAULT 'email',
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_identifier_type` (`identifier`,`otp_type`),
  KEY `idx_identifier` (`identifier`),
  KEY `idx_expires` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_otps`
--

LOCK TABLES `user_otps` WRITE;
/*!40000 ALTER TABLE `user_otps` DISABLE KEYS */;
INSERT INTO `user_otps` VALUES (3,'jabbarmk@gmail.com','967744','login','email','2026-07-04 18:36:29',1,'2026-05-20 07:39:13'),(4,'jabbarmk@gmail.com','364514','signup','email','2026-05-20 11:58:39',1,'2026-05-20 07:40:10'),(10,'otptest_1780625589@example.com','313820','signup','email','2026-06-05 06:23:09',0,'2026-06-05 02:13:09'),(11,'otptest_1780625589@example.com','302056','login','email','2026-06-05 06:23:12',0,'2026-06-05 02:13:12'),(15,'jabbarmk@','907977','login','email','2026-07-04 18:36:21',0,'2026-07-04 14:26:21');
/*!40000 ALTER TABLE `user_otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_profiles`
--

DROP TABLE IF EXISTS `user_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_profiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `full_name` varchar(200) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `photo` varchar(500) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `whatsapp` varchar(50) DEFAULT NULL,
  `linkedin` varchar(500) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `visa_status` varchar(50) DEFAULT NULL,
  `notice_period` varchar(30) DEFAULT NULL,
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
INSERT INTO `user_profiles` VALUES (1,2,'Abdul Jabbar','Experts in Digital Marketing, Web Design, App Design','1779100582384.jpg','jabbarmk@gmail.com','+919516717777','+919516717777','https://www.linkedin.com/in/jabbarmk/','Dubai, UAE',NULL,NULL,5,'Bed @ Kerala University','Smartflix Technologies',NULL,'HTML, CSS, Microsoft Office','Google Ads, Adilab Institute, 2022','Btech @ Kerala University, Kerala, India | 2001-2004\r\nPUC @ Kerala University, Kerala, India | 2001-2004','','English, Hindi, Malayalam, Arabic',1,'2026-04-13 21:02:17');
/*!40000 ALTER TABLE `user_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_work_experience`
--

DROP TABLE IF EXISTS `user_work_experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_work_experience` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `start_month` tinyint(4) DEFAULT NULL,
  `start_year` smallint(6) DEFAULT NULL,
  `end_month` tinyint(4) DEFAULT NULL,
  `end_year` smallint(6) DEFAULT NULL,
  `is_current` tinyint(1) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_work_experience`
--

LOCK TABLES `user_work_experience` WRITE;
/*!40000 ALTER TABLE `user_work_experience` DISABLE KEYS */;
INSERT INTO `user_work_experience` VALUES (1,2,'Software Engineer','CG Group','Dubai',12,2024,12,2025,1,'Gulf Sathyadhara is a digital magazine app featuring a rich collection of stories, news, articles, and cultural content for readers around the world. The app delivers engaging Malayalam content covering current affairs, community news, literature, inspiration, entertainment, and lifestyle topics in an easy-to-read format.','2026-05-21 19:21:35'),(2,2,'Graphic Designer','Google.com','Dubai, UAE',1,2021,1,2024,0,'Graphic Designer Graphic Designer Graphic Designer','2026-06-02 02:19:17'),(3,2,'Software Engineer','Microsoft','Dubai',11,2023,10,2027,0,NULL,'2026-06-02 02:20:01');
/*!40000 ALTER TABLE `user_work_experience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vlogger_profiles`
--

DROP TABLE IF EXISTS `vlogger_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vlogger_profiles` (
  `business_id` int(11) NOT NULL,
  `youtube_subscribers` int(11) DEFAULT 0,
  `instagram_followers` int(11) DEFAULT 0,
  `tiktok_followers` int(11) DEFAULT 0,
  `total_views` bigint(20) DEFAULT 0,
  `content_niche` varchar(80) DEFAULT NULL,
  `tier` varchar(30) DEFAULT NULL,
  `awards` varchar(300) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`business_id`),
  CONSTRAINT `vlogger_profiles_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vlogger_profiles`
--

LOCK TABLES `vlogger_profiles` WRITE;
/*!40000 ALTER TABLE `vlogger_profiles` DISABLE KEYS */;
INSERT INTO `vlogger_profiles` VALUES (7,850000,1200000,600000,45000000,'Lifestyle','Gold','YouTube Gold Play Button, Best Lifestyle Creator 2024',1),(8,1400000,2100000,1100000,120000000,'Travel','Platinum','YouTube Diamond Nominee, Top Travel Creator 2023',1),(9,420000,680000,900000,38000000,'Food','Gold','Best Food Reviewer 2024',1),(10,310000,540000,250000,22000000,'Fitness','Silver','Fitness Influencer of the Year 2022',0),(11,980000,430000,700000,75000000,'Gaming','Gold','YouTube Gold Play Button, Top MENA Gaming Creator',1);
/*!40000 ALTER TABLE `vlogger_profiles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-24 23:45:39
