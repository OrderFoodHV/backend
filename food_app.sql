-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: food_app
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1 CHECK (`quantity` > 0),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_id` (`cart_id`,`product_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_cart_items_cart` (`cart_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (3,1,3,1,'2026-05-21 10:05:34','2026-05-21 10:05:34'),(4,2,10,1,'2026-05-21 10:34:47','2026-05-21 10:34:47');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,2,'2026-05-21 08:27:24'),(2,1,'2026-05-21 10:34:47');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `parent_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Snacks',NULL,NULL,'active',NULL,'2026-05-21 08:25:22'),(2,'Fast Food',NULL,NULL,'active',NULL,'2026-05-21 08:25:22'),(3,'Drinks',NULL,NULL,'active',NULL,'2026-05-21 08:25:22');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;

--
-- Table structure for table `disputes`
--

DROP TABLE IF EXISTS `disputes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disputes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `partner_id` int(11) DEFAULT NULL,
  `reason` text NOT NULL,
  `status` enum('pending','investigating','resolved','rejected','refunded') DEFAULT 'pending',
  `resolution` text DEFAULT NULL,
  `refund_amount` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `resolved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `partner_id` (`partner_id`),
  CONSTRAINT `disputes_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `disputes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `disputes_ibfk_3` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disputes`
--

/*!40000 ALTER TABLE `disputes` DISABLE KEYS */;
/*!40000 ALTER TABLE `disputes` ENABLE KEYS */;

--
-- Table structure for table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `favorite_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorite_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite`
--

/*!40000 ALTER TABLE `favorite` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorite` ENABLE KEYS */;

--
-- Table structure for table `fee_settings`
--

DROP TABLE IF EXISTS `fee_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fee_type` enum('service_fee','shipping_fee','platform_fee','other') NOT NULL,
  `fee_value` decimal(10,2) NOT NULL,
  `fee_description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_settings`
--

/*!40000 ALTER TABLE `fee_settings` DISABLE KEYS */;
INSERT INTO `fee_settings` VALUES (1,'service_fee',10.00,'Phí dịch vụ platform (10%)','active','2026-05-21 08:25:22','2026-05-21 08:25:22'),(2,'shipping_fee',15.00,'Phí vận chuyển mặc định','active','2026-05-21 08:25:22','2026-05-21 08:25:22');
/*!40000 ALTER TABLE `fee_settings` ENABLE KEYS */;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `type` enum('order','promotion','reward','general') DEFAULT 'general',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_notification_user` (`user_id`),
  KEY `idx_notification_read` (`user_id`,`is_read`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,9,1,45000.00),(2,2,1,1,20000.00),(3,29,1,1,20000.00),(4,30,4,1,15000.00),(5,31,1,1,20000.00),(6,32,4,1,15000.00),(7,33,2,1,25000.00),(8,34,14,1,55000.00),(9,35,20,1,30000.00),(10,36,2,1,25000.00),(11,37,1,1,20000.00),(12,38,21,1,30000.00),(13,39,4,1,15000.00),(14,40,16,1,40000.00),(15,41,22,1,30000.00),(16,42,6,1,40000.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;

--
-- Table structure for table `order_tracking`
--

DROP TABLE IF EXISTS `order_tracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_tracking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `status` enum('pending','confirmed','delivering','completed','cancelled') DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_tracking_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_tracking`
--

/*!40000 ALTER TABLE `order_tracking` DISABLE KEYS */;
INSERT INTO `order_tracking` VALUES (1,2,'cancelled','Hệ thống cập nhật trạng thái đơn thành: cancelled','2026-05-21 09:20:00'),(6,32,'confirmed','Cửa hàng xử lý','2026-05-25 10:01:40'),(7,32,'delivering','Cửa hàng xử lý','2026-05-25 10:02:39'),(8,29,'cancelled','Cửa hàng xử lý','2026-05-25 10:27:48'),(9,33,'confirmed','Cửa hàng xử lý','2026-05-25 10:44:19'),(10,30,'confirmed','Cửa hàng xử lý','2026-05-25 10:51:19'),(11,34,'confirmed','Cửa hàng xử lý','2026-05-25 10:52:12'),(12,36,'','Cửa hàng xử lý','2026-05-25 11:16:50'),(13,37,'','Cửa hàng xử lý','2026-05-25 11:40:20'),(14,38,'cancelled','Hệ thống cập nhật trạng thái đơn thành: cancelled','2026-05-25 11:45:07'),(15,40,'','Cửa hàng xử lý','2026-05-25 11:55:13'),(16,39,'','Cửa hàng xử lý','2026-05-25 11:55:30'),(17,31,'','Cửa hàng xử lý','2026-05-25 11:56:02'),(18,35,'','Cửa hàng xử lý','2026-05-25 11:56:03'),(19,41,'','Cửa hàng xử lý','2026-05-25 12:07:25'),(20,42,'','Cửa hàng xử lý','2026-05-25 12:14:57');
/*!40000 ALTER TABLE `order_tracking` ENABLE KEYS */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `shipper_id` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','delivering','completed','cancelled') DEFAULT 'pending',
  `payment_status` enum('unpaid','paid') DEFAULT 'unpaid',
  `address` text DEFAULT NULL,
  `voucher_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `voucher_id` (`voucher_id`),
  KEY `shipper_id` (`shipper_id`),
  KEY `idx_orders_user` (`user_id`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_store` (`store_id`,`status`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`),
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`shipper_id`) REFERENCES `shippers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,2,NULL,NULL,50000.00,'pending','unpaid','1/2',NULL,'2026-05-21 08:27:35'),(2,2,NULL,NULL,25000.00,'cancelled','unpaid','jdhf',NULL,'2026-05-21 09:05:21'),(29,2,1,NULL,15000.00,'cancelled','unpaid','33',NULL,'2026-05-24 12:03:57'),(30,2,1,NULL,20000.00,'confirmed','unpaid','33 đại la',NULL,'2026-05-25 02:10:57'),(31,2,1,NULL,15000.00,'','unpaid','36 đại la',NULL,'2026-05-25 09:16:44'),(32,2,1,NULL,30000.00,'delivering','unpaid','22 bạch mai',NULL,'2026-05-25 09:35:44'),(33,2,1,NULL,40000.00,'confirmed','unpaid','1 giải phóng',NULL,'2026-05-25 10:29:27'),(34,2,1,NULL,60000.00,'confirmed','unpaid','45 giải phóng',NULL,'2026-05-25 10:52:02'),(35,2,1,NULL,45000.00,'','unpaid','33 haha',NULL,'2026-05-25 10:56:49'),(36,2,1,NULL,40000.00,'','unpaid','44 đại la',NULL,'2026-05-25 11:16:14'),(37,2,1,NULL,35000.00,'','unpaid','3344',NULL,'2026-05-25 11:20:53'),(38,2,1,NULL,45000.00,'cancelled','unpaid','354 tc',NULL,'2026-05-25 11:40:40'),(39,2,1,NULL,10000.00,'','unpaid','3₫3!!4',NULL,'2026-05-25 11:45:20'),(40,2,1,NULL,45000.00,'','unpaid','867369',NULL,'2026-05-25 11:55:02'),(41,2,1,NULL,35000.00,'','unpaid','sjndbd',NULL,'2026-05-25 12:07:19'),(42,1,1,NULL,35000.00,'','unpaid','678',NULL,'2026-05-25 12:14:44');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

--
-- Table structure for table `partners`
--

DROP TABLE IF EXISTS `partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` enum('pending','active','inactive','blocked') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partners`
--

/*!40000 ALTER TABLE `partners` DISABLE KEYS */;
/*!40000 ALTER TABLE `partners` ENABLE KEYS */;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `method` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `paid_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `idx_products_store` (`store_id`,`available`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Khoai lang kén',1,'https://cdn.tgdd.vn/Files/2020/08/26/1284970/cach-lam-khoai-lang-ken-202008261116040688.jpg',20000.00,'Khoai lang chiên giòn, ngọt nhẹ.',1,'2026-05-21 08:25:22'),(2,1,'Bánh tráng nướng',1,'https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/banh-trang-nuong-thumbnail.jpg',25000.00,'Bánh tráng nướng giòn, topping đầy đủ.',1,'2026-05-21 08:25:22'),(3,1,'Chả cá viên chiên',1,'https://cdn.tgdd.vn/Files/2020/09/21/1295317/cach-lam-ca-vien-chien.jpg',22000.00,'Cá viên dai ngon, chiên vàng giòn.',1,'2026-05-21 08:25:22'),(4,1,'Đậu phộng rang muối',1,'https://cdn.tgdd.vn/Files/2021/06/23/1363475/cach-rang-dau-phong.jpg',15000.00,'Đậu phộng rang giòn, mặn nhẹ.',1,'2026-05-21 08:25:22'),(5,1,'Bắp xào bơ',1,'https://cdn.tgdd.vn/2020/07/CookRecipe/Avatar/bap-xao-thumbnail.jpg',25000.00,'Bắp xào bơ thơm béo, thêm hành phi.',1,'2026-05-21 08:25:22'),(6,1,'Khô bò miếng',1,'https://cdn.tgdd.vn/Files/2021/12/02/1402570/kho-bo-mieng.jpg',40000.00,'Khô bò cay nhẹ, dai ngon.',1,'2026-05-21 08:25:22'),(7,1,'Bánh flan',1,'https://cdn.tgdd.vn/2021/05/CookProductThumb/banh-flan.jpg',15000.00,'Flan mềm mịn, béo ngậy caramel.',1,'2026-05-21 08:25:22'),(8,1,'Rong biển sấy',1,'https://cdn.tgdd.vn/Files/2021/07/12/1368428/rong-bien-say.jpg',20000.00,'Rong biển giòn tan, vị mặn nhẹ.',1,'2026-05-21 08:25:22'),(9,1,'Cơm chiên dương châu',2,'https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/com-chien-duong-chau.jpg',45000.00,'Cơm chiên đầy đủ topping, đậm đà.',1,'2026-05-21 08:25:22'),(10,1,'Hủ tiếu Nam Vang',2,'https://cdn.tgdd.vn/2021/08/CookRecipe/Avatar/hu-tieu-nam-vang.jpg',50000.00,'Hủ tiếu nước trong, topping phong phú.',1,'2026-05-21 08:25:22'),(11,1,'Bánh mì thịt nướng',2,'https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/banh-mi-thit-nuong.jpg',30000.00,'Bánh mì giòn, thịt nướng thơm lừng.',1,'2026-05-21 08:25:22'),(12,1,'Bún thịt nướng',2,'https://cdn.tgdd.vn/2021/07/CookRecipe/Avatar/bun-thit-nuong.jpg',45000.00,'Bún tươi ăn kèm thịt nướng và rau.',1,'2026-05-21 08:25:22'),(13,1,'Cơm bò lúc lắc',2,'https://cdn.tgdd.vn/2021/10/CookRecipe/Avatar/com-bo-luc-lac.jpg',65000.00,'Bò mềm, xào đậm vị, ăn với cơm nóng.',1,'2026-05-21 08:25:22'),(14,1,'Mì cay Hàn Quốc',2,'https://cdn.tgdd.vn/2021/07/CookRecipe/Avatar/mi-cay.jpg',55000.00,'Mì cay cấp độ, topping đa dạng.',1,'2026-05-21 08:25:22'),(15,1,'Cơm gà nướng',2,'https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/com-ga-nuong.jpg',55000.00,'Gà nướng thơm, da giòn, cơm nóng.',1,'2026-05-21 08:25:22'),(16,1,'Bún riêu cua',2,'https://cdn.tgdd.vn/2021/08/CookRecipe/Avatar/bun-rieu.jpg',40000.00,'Bún riêu chua nhẹ, đậm đà.',1,'2026-05-21 08:25:22'),(17,1,'Trà tắc',3,'https://cdn.tgdd.vn/2020/07/CookProductThumb/tra-tac.jpg',15000.00,'Trà tắc chua ngọt, giải khát.',1,'2026-05-21 08:25:22'),(18,1,'Sữa chua đá',3,'https://cdn.tgdd.vn/2021/05/CookProductThumb/sua-chua-da.jpg',20000.00,'Sữa chua mát lạnh, tốt cho tiêu hóa.',1,'2026-05-21 08:25:22'),(19,1,'Sinh tố dâu',3,'https://cdn.tgdd.vn/2020/07/CookProductThumb/sinh-to-dau.jpg',30000.00,'Sinh tố dâu chua ngọt, thơm ngon.',1,'2026-05-21 08:25:22'),(20,1,'Nước ép táo',3,'https://cdn.tgdd.vn/2020/07/CookProductThumb/nuoc-ep-tao.jpg',30000.00,'Nước ép táo tươi, giàu vitamin.',1,'2026-05-21 08:25:22'),(21,1,'Cacao đá',3,'https://cdn.tgdd.vn/2021/05/CookProductThumb/cacao-da.jpg',30000.00,'Cacao đá béo, đậm vị socola.',1,'2026-05-21 08:25:22'),(22,1,'Trà vải',3,'https://cdn.tgdd.vn/2020/07/CookProductThumb/tra-vai.jpg',30000.00,'Trà vải thơm, ngọt nhẹ.',1,'2026-05-21 08:25:22'),(23,1,'Soda chanh',3,'https://cdn.tgdd.vn/2020/07/CookProductThumb/soda-chanh.jpg',25000.00,'Soda chanh mát lạnh, sảng khoái.',1,'2026-05-21 08:25:22'),(24,1,'Nước ép dứa',3,'https://cdn.tgdd.vn/2020/07/CookProductThumb/nuoc-ep-dua.jpg',30000.00,'Nước ép dứa chua ngọt tự nhiên.',1,'2026-05-21 08:25:22');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;

--
-- Table structure for table `refund_requests`
--

DROP TABLE IF EXISTS `refund_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refund_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('pending','approved','rejected','processed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `processed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `refund_requests_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `refund_requests_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refund_requests`
--

/*!40000 ALTER TABLE `refund_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `refund_requests` ENABLE KEYS */;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;

--
-- Table structure for table `reward_history`
--

DROP TABLE IF EXISTS `reward_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reward_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `points` int(11) NOT NULL,
  `type` enum('earn','redeem') NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reward_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reward_history`
--

/*!40000 ALTER TABLE `reward_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `reward_history` ENABLE KEYS */;

--
-- Table structure for table `rewards`
--

DROP TABLE IF EXISTS `rewards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rewards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `points` int(11) DEFAULT 0,
  `total_points` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `idx_reward_user` (`user_id`),
  CONSTRAINT `rewards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rewards`
--

/*!40000 ALTER TABLE `rewards` DISABLE KEYS */;
/*!40000 ALTER TABLE `rewards` ENABLE KEYS */;

--
-- Table structure for table `shipper_wallets`
--

DROP TABLE IF EXISTS `shipper_wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipper_wallets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shipper_id` int(11) NOT NULL,
  `balance` decimal(15,2) DEFAULT 0.00,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `shipper_id` (`shipper_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipper_wallets`
--

/*!40000 ALTER TABLE `shipper_wallets` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipper_wallets` ENABLE KEYS */;

--
-- Table structure for table `shippers`
--

DROP TABLE IF EXISTS `shippers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shippers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `vehicle` varchar(100) DEFAULT NULL,
  `status` enum('idle','delivering','offline') DEFAULT 'idle',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `shippers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shippers`
--

/*!40000 ALTER TABLE `shippers` DISABLE KEYS */;
INSERT INTO `shippers` VALUES (1,1,'0567894326','honda wave, 29h5 - 298.48','idle','2026-05-24 15:03:19','2026-05-25 00:42:49');
/*!40000 ALTER TABLE `shippers` ENABLE KEYS */;

--
-- Table structure for table `store_vouchers`
--

DROP TABLE IF EXISTS `store_vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_vouchers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('percent','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT 0.00,
  `max_discount` decimal(10,2) DEFAULT 0.00,
  `quantity` int(11) NOT NULL DEFAULT 100,
  `used_count` int(11) DEFAULT 0,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime NOT NULL,
  `status` enum('active','inactive','expired') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `store_id` (`store_id`,`code`),
  KEY `idx_store_vouchers_store` (`store_id`,`status`),
  CONSTRAINT `store_vouchers_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_vouchers`
--

/*!40000 ALTER TABLE `store_vouchers` DISABLE KEYS */;
/*!40000 ALTER TABLE `store_vouchers` ENABLE KEYS */;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `owner_id` int(11) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','active','blocked') DEFAULT 'pending',
  `is_open` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_stores_owner` (`owner_id`),
  CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (1,'co ba','35 dai la',2,NULL,NULL,'pending',0,'2026-05-21 08:25:22','2026-05-25 12:05:00');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;

--
-- Table structure for table `support_tickets`
--

DROP TABLE IF EXISTS `support_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `status` enum('open','processing','resolved') DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `support_tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `support_tickets_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_tickets`
--

/*!40000 ALTER TABLE `support_tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `support_tickets` ENABLE KEYS */;

--
-- Table structure for table `system_logs`
--

DROP TABLE IF EXISTS `system_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_logs`
--

/*!40000 ALTER TABLE `system_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `system_logs` ENABLE KEYS */;

--
-- Table structure for table `system_vouchers`
--

DROP TABLE IF EXISTS `system_vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_vouchers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('percent','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT 0.00,
  `max_discount` decimal(10,2) DEFAULT 0.00,
  `quantity` int(11) NOT NULL,
  `used_count` int(11) DEFAULT 0,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `status` enum('active','inactive','expired') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_vouchers`
--

/*!40000 ALTER TABLE `system_vouchers` DISABLE KEYS */;
INSERT INTO `system_vouchers` VALUES (1,'WELCOME10','percent',10.00,50000.00,20000.00,100,0,'2026-05-21 15:25:22','2026-06-20 15:25:22','active','2026-05-21 08:25:22','2026-05-21 08:25:22'),(2,'FREESHIP','fixed',15000.00,100000.00,15000.00,50,0,'2026-05-21 15:25:22','2026-05-28 15:25:22','active','2026-05-21 08:25:22','2026-05-21 08:25:22');
/*!40000 ALTER TABLE `system_vouchers` ENABLE KEYS */;

--
-- Table structure for table `user_address`
--

DROP TABLE IF EXISTS `user_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `address` text DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_address` ENABLE KEYS */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin','shipper') DEFAULT 'user',
  `is_seller` tinyint(1) DEFAULT 0,
  `is_shipper` tinyint(1) DEFAULT 0,
  `status` enum('active','inactive','banned') DEFAULT 'active',
  `reward_points` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin',NULL,NULL,'admin@example.com','hashed_password','user',1,1,'active',0,'2026-05-21 08:25:22'),(2,'hoai',NULL,'0123456789','hoai@gmail.com','$2b$10$C0a8FGROkaxC8VETzOaIhuqfNE9RaDMUv/ll0CpiOsGHHJHC4qq9y','user',1,1,'active',0,'2026-05-21 08:26:13');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

--
-- Table structure for table `voucher_usages`
--

DROP TABLE IF EXISTS `voucher_usages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voucher_usages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `voucher_id` int(11) DEFAULT NULL,
  `used_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `voucher_id` (`voucher_id`),
  CONSTRAINT `voucher_usages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `voucher_usages_ibfk_2` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voucher_usages`
--

/*!40000 ALTER TABLE `voucher_usages` DISABLE KEYS */;
/*!40000 ALTER TABLE `voucher_usages` ENABLE KEYS */;

--
-- Table structure for table `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `discount_percent` int(11) DEFAULT 0,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `min_order_amount` decimal(10,2) DEFAULT 0.00,
  `max_uses` int(11) DEFAULT 1,
  `used_count` int(11) DEFAULT 0,
  `expired_at` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_voucher_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vouchers`
--

/*!40000 ALTER TABLE `vouchers` DISABLE KEYS */;
INSERT INTO `vouchers` VALUES (1,'WELCOME10',10,0.00,100000.00,100,0,'2025-12-31 23:59:59',1,'2026-05-21 08:25:22'),(2,'FOODIE20',20,0.00,200000.00,50,0,'2025-12-31 23:59:59',1,'2026-05-21 08:25:22'),(3,'SAVE50K',0,50000.00,300000.00,30,0,'2025-12-31 23:59:59',1,'2026-05-21 08:25:22'),(4,'FREESHIP',0,30000.00,150000.00,200,0,'2025-12-31 23:59:59',1,'2026-05-21 08:25:22');
/*!40000 ALTER TABLE `vouchers` ENABLE KEYS */;

--
-- Table structure for table `wallet_transactions`
--

DROP TABLE IF EXISTS `wallet_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallet_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shipper_id` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `type` enum('deposit','withdraw','order_revenue') NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallet_transactions`
--

/*!40000 ALTER TABLE `wallet_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `wallet_transactions` ENABLE KEYS */;

--
-- Dumping routines for database 'food_app'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-25 20:36:23
