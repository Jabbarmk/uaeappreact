
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

LOCK TABLES `home_sections` WRITE;
/*!40000 ALTER TABLE `home_sections` DISABLE KEYS */;
REPLACE INTO `home_sections` (`id`, `section_key`, `title`, `is_visible`, `sort_order`, `settings`, `updated_at`) VALUES (1,'slider',NULL,1,1,'{}','2026-08-15 14:22:43'),(2,'featured','Featured Categories',1,2,'{\"style\":\"scroll\",\"auto\":0,\"speed\":3,\"visCols\":3,\"columns\":3,\"maxRows\":2,\"radius\":33,\"textPos\":\"outside\",\"textSize\":14}','2026-08-15 16:34:19'),(3,'hero','Find anything in UAE',0,3,'{\"placeholder\":\"Businesses, offers, jobs, propertiesÔÇª\"}','2026-08-15 14:33:44'),(4,'explore','Explore SmartUAE',1,4,'{\"style\":\"images\",\"auto\":0,\"timer\":4}','2026-08-15 16:12:28'),(5,'popular','Popular Right Now',1,5,'{\"size\":\"m\",\"rows\":1,\"auto\":0,\"timer\":4}','2026-08-15 16:34:00'),(6,'stats',NULL,1,6,'{\"label1\":\"Businesses\",\"label2\":\"Active Jobs\",\"label3\":\"Listings\"}','2026-08-15 14:22:43'),(7,'collections','Explore the best in UAE',1,7,'{}','2026-08-15 14:42:19');
/*!40000 ALTER TABLE `home_sections` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `home_menu_items` WRITE;
/*!40000 ALTER TABLE `home_menu_items` DISABLE KEYS */;
REPLACE INTO `home_menu_items` (`id`, `label`, `link`, `icon`, `image`, `tone`, `is_active`, `sort_order`) VALUES (1,'Businesses','/categories','fa-store',NULL,'purple',1,1),(2,'Offers','/offers','fa-percent',NULL,'amber',1,2),(3,'Events','/events','fa-calendar-day',NULL,'pink',1,3),(4,'Jobs','/jobs','fa-briefcase',NULL,'teal',1,4),(5,'Real Estate','/realestate','fa-building',NULL,'teal',1,5),(6,'Doctors','/doctors','fa-user-md',NULL,'pink',1,6),(7,'Classifieds','/classifieds','fa-tags',NULL,'amber',1,7),(8,'Universities','/universities','fa-graduation-cap',NULL,'purple',1,8),(9,'Smart CV','/profile','fa-file-alt',NULL,'purple',1,9),(10,'Search','/search','fa-search',NULL,'teal',1,10);
/*!40000 ALTER TABLE `home_menu_items` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `home_collections` WRITE;
/*!40000 ALTER TABLE `home_collections` DISABLE KEYS */;
REPLACE INTO `home_collections` (`id`, `title`, `is_active`, `sort_order`, `created_at`) VALUES (1,'Top 10 Tourist Places',1,1,'2026-08-15 14:28:39'),(2,'Top 10 Biriyani',1,2,'2026-08-15 14:40:20'),(3,'Top 10 Mandi',1,3,'2026-08-15 16:27:56');
/*!40000 ALTER TABLE `home_collections` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `home_collection_items` WRITE;
/*!40000 ALTER TABLE `home_collection_items` DISABLE KEYS */;
REPLACE INTO `home_collection_items` (`id`, `collection_id`, `title`, `description`, `image`, `business_id`, `emirate`, `latitude`, `longitude`, `is_active`, `sort_order`, `created_at`) VALUES (1,1,'Burj Khalifa','The world\'s tallest building at 828m. Visit the observation decks on floors 124-148 for breathtaking views of Dubai.','1786804470284.jpg',NULL,'Dubai',25.1971970,55.2743760,1,1,'2026-08-15 14:28:40'),(2,1,'Dubai Marina','A stunning waterfront district with yachts, dining and the famous Marina Walk.','1786804504570.png',NULL,'Sharjah',NULL,NULL,1,2,'2026-08-15 14:28:40'),(3,1,'Palm Jumeirah','The iconic man-made island shaped like a palm tree, home to luxury resorts.','1786804522814.png',1,NULL,NULL,NULL,1,3,'2026-08-15 14:28:40'),(4,2,'Calicut Notebook','A stunning waterfront district with yachts, dining and the famous Marina Walk.','1786811248383.png',NULL,NULL,NULL,NULL,1,1,'2026-08-15 14:40:56'),(5,3,'Zamzam Mandi','A stunning waterfront district with yachts, dining and the famous Marina Walk.','1786811290879.png',NULL,NULL,NULL,NULL,1,1,'2026-08-15 16:28:30');
/*!40000 ALTER TABLE `home_collection_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

