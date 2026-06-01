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
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_id` (`cart_id`,`product_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_cart_items_cart` (`cart_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_chk_1` CHECK (`quantity` > 0)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (26,7,38,1,'2026-05-29 13:42:09','2026-05-29 13:42:09'),(27,8,38,1,'2026-05-30 15:20:38','2026-05-30 15:20:38');
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,2,'2026-05-21 08:27:24'),(2,1,'2026-05-21 10:34:47'),(3,5,'2026-05-25 15:29:47'),(4,10,'2026-05-26 02:51:02'),(5,17,'2026-05-28 09:05:58'),(6,14,'2026-05-28 09:14:58'),(7,13,'2026-05-29 00:06:26'),(8,22,'2026-05-30 15:20:38'),(9,24,'2026-05-31 07:29:44'),(10,26,'2026-05-31 08:14:03');
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Snacks',NULL,NULL,'active',NULL,'2026-05-21 08:25:22'),(2,'Fast Food',NULL,NULL,'active',NULL,'2026-05-21 08:25:22'),(3,'Drinks',NULL,NULL,'active',NULL,'2026-05-21 08:25:22'),(4,'Cơm',NULL,NULL,'active',NULL,'2026-05-26 00:55:36'),(9,'Mì','','http://localhost:3000/uploads/1780016620986-131670897.jpg','active',NULL,'2026-05-28 08:20:33'),(11,'Xôi',NULL,'http://localhost:3000/uploads/1779956718951-574103569.jpg','active',NULL,'2026-05-28 08:28:16'),(12,'Ăn vặt',NULL,NULL,'active',NULL,'2026-05-29 01:36:17'),(13,'đồ chiên',NULL,NULL,'active',NULL,'2026-05-30 15:55:57');
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite`
--

/*!40000 ALTER TABLE `favorite` DISABLE KEYS */;
INSERT INTO `favorite` VALUES (1,13,38);
/*!40000 ALTER TABLE `favorite` ENABLE KEYS */;

--
-- Table structure for table `fee_settings`
--

DROP TABLE IF EXISTS `fee_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fee_type` varchar(50) NOT NULL,
  `fee_value` decimal(10,2) NOT NULL,
  `fee_description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `calculation_type` varchar(20) DEFAULT 'fixed',
  `condition_type` varchar(20) DEFAULT 'none',
  `condition_value` decimal(10,2) DEFAULT NULL,
  `extra_value` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_settings`
--

/*!40000 ALTER TABLE `fee_settings` DISABLE KEYS */;
INSERT INTO `fee_settings` VALUES (1,'service_fee',10.00,'Phí dịch vụ đơn <40k (10%)','active','2026-05-21 08:25:22','2026-05-29 13:34:30','percentage','under_subtotal',40000.00,0.00),(2,'shipping_fee',15000.00,'Phí vận chuyển mặc định','active','2026-05-21 08:25:22','2026-06-01 01:39:21','fixed','none',1.00,4000.00),(3,'shop_commission',20.00,'Hoa hồng Sàn thu từ cửa hàng (%)','active','2026-06-01 01:44:48','2026-06-01 01:44:48','percentage','none',NULL,0.00),(4,'shipper_commission',20.00,'Chiết khấu Sàn thu từ Shipper (%)','active','2026-06-01 01:44:48','2026-06-01 01:44:48','percentage','none',NULL,0.00);
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
  `target_role` varchar(50) DEFAULT 'user',
  PRIMARY KEY (`id`),
  KEY `idx_notification_user` (`user_id`),
  KEY `idx_notification_read` (`user_id`,`is_read`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=207 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,14,'Đặt hàng thành công! 🛒','Đơn hàng #72 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-28 09:49:25','legacy'),(2,13,'Đặt hàng thành công! 🛒','Đơn hàng #73 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-28 09:50:25','legacy'),(3,14,'Đăng ký tài xế thành công! 🎉','Chúc mừng bạn! Yêu cầu đăng ký làm tài xế với xe T, 6 đã được Admin duyệt thành công. Kênh tài xế của bạn đã sẵn sàng hoạt động.','general',0,'2026-05-28 10:13:30','legacy'),(4,13,'Đặt hàng thành công! 🛒','Đơn hàng #74 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-28 23:57:53','legacy'),(5,13,'Đặt hàng thành công! 🛒','Đơn hàng #75 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-28 23:58:02','legacy'),(6,21,'Đăng ký tài xế thành công! 🎉','Chúc mừng bạn! Yêu cầu đăng ký làm tài xế với xe Wave, 29H1-123.45 đã được Admin duyệt thành công. Kênh tài xế của bạn đã sẵn sàng hoạt động.','general',0,'2026-05-29 13:04:59','legacy'),(7,22,'Đặt hàng thành công! 🛒','Đơn hàng #76 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-30 15:22:51','legacy'),(8,22,'Cửa hàng đã được phê duyệt! 🎉','Chúc mừng sếp! Yêu cầu đăng ký mở quán \"mcmxalala\" đã được Admin duyệt thành công. Kênh người bán của sếp đã sẵn sàng hoạt động.','general',0,'2026-05-30 15:24:27','legacy'),(9,13,'Quán đã nhận đơn! 🍳','Đơn hàng #75 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-30 15:25:15','legacy'),(10,13,'Đơn hàng bị từ chối ❌','Cửa hàng đã từ chối đơn hàng #74 của sếp do quá tải hoặc hết món mất rồi.','order',0,'2026-05-30 15:25:17','legacy'),(11,13,'Quán đã nhận đơn! 🍳','Đơn hàng #73 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-30 15:25:19','legacy'),(12,14,'Quán đã nhận đơn! 🍳','Đơn hàng #72 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-30 15:25:23','legacy'),(13,9,'Quán đã nhận đơn! 🍳','Đơn hàng #45 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-30 15:25:47','legacy'),(14,22,'Đăng ký tài xế thành công! 🎉','Chúc mừng bạn! Yêu cầu đăng ký làm tài xế với xe sjsjsjjdhudw, 2929293838 đã được Admin duyệt thành công. Kênh tài xế của bạn đã sẵn sàng hoạt động.','general',0,'2026-05-30 15:28:59','legacy'),(15,14,'Đơn hàng bị từ chối ❌','Cửa hàng đã từ chối đơn hàng #71 của sếp do quá tải hoặc hết món mất rồi.','order',0,'2026-05-30 15:35:00','legacy'),(16,10,'Đơn hàng bị từ chối ❌','Cửa hàng đã từ chối đơn hàng #64 của sếp do quá tải hoặc hết món mất rồi.','order',0,'2026-05-30 15:35:02','legacy'),(17,23,'Cửa hàng đã được phê duyệt! 🎉','Chúc mừng sếp! Yêu cầu đăng ký mở quán \"em hai\" đã được Admin duyệt thành công. Kênh người bán của sếp đã sẵn sàng hoạt động.','general',0,'2026-05-30 15:52:13','legacy'),(18,22,'Cửa hàng đã bị xóa ❌','Kênh người bán của cửa hàng \"mcmxalala\" đã bị xóa bởi Admin. Toàn bộ thực đơn đã được gỡ khỏi hệ thống.','general',0,'2026-05-30 15:53:13','legacy'),(19,22,'Cửa hàng đã được phê duyệt! 🎉','Chúc mừng sếp! Yêu cầu đăng ký mở quán \"Khọt khọt \" đã được Admin duyệt thành công. Kênh người bán của sếp đã sẵn sàng hoạt động.','general',0,'2026-05-30 15:54:52','legacy'),(20,22,'Yêu cầu tài xế bị từ chối ❌','Yêu cầu làm đối tác tài xế của bạn đã bị từ chối hoặc bị gỡ bởi Admin.','general',0,'2026-05-30 15:55:33','legacy'),(21,23,'Đặt hàng thành công! 🛒','Đơn hàng #77 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-30 15:59:45','legacy'),(22,23,'Đặt hàng thành công! 🛒','Đơn hàng #78 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-30 16:00:01','legacy'),(23,23,'Quán đã nhận đơn! 🍳','Đơn hàng #77 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-30 16:03:01','legacy'),(24,23,'Đăng ký tài xế thành công! 🎉','Chúc mừng bạn! Yêu cầu đăng ký làm tài xế với xe honda, 33x2 - 678.45 đã được Admin duyệt thành công. Kênh tài xế của bạn đã sẵn sàng hoạt động.','general',0,'2026-05-30 16:05:37','legacy'),(25,23,'Đặt hàng thành công! 🛒','Đơn hàng #79 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-30 16:09:22','legacy'),(26,23,'Quán đã nhận đơn! 🍳','Đơn hàng #79 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-30 16:10:06','legacy'),(27,22,'Quán đã nhận đơn! 🍳','Đơn hàng #76 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-30 16:10:08','legacy'),(28,23,'Quán đã nhận đơn! 🍳','Đơn hàng #78 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-30 16:10:18','legacy'),(29,24,'Cửa hàng đã được phê duyệt! 🎉','Chúc mừng sếp! Yêu cầu đăng ký mở quán \"Không ngon lắm\" đã được Admin duyệt thành công. Kênh người bán của sếp đã sẵn sàng hoạt động.','general',0,'2026-05-31 06:48:00','legacy'),(30,24,'Cửa hàng đã bị xóa ❌','Kênh người bán của cửa hàng \"Không ngon lắm\" đã bị xóa bởi Admin. Toàn bộ thực đơn đã được gỡ khỏi hệ thống.','general',0,'2026-05-31 06:52:43','legacy'),(31,24,'Cửa hàng đã được phê duyệt! 🎉','Chúc mừng sếp! Yêu cầu đăng ký mở quán \"Koo ngon rồi\" đã được Admin duyệt thành công. Kênh người bán của sếp đã sẵn sàng hoạt động.','general',0,'2026-05-31 06:53:08','legacy'),(32,24,'Cửa hàng đã bị xóa ❌','Kênh người bán của cửa hàng \"Koo ngon rồi\" đã bị xóa bởi Admin. Toàn bộ thực đơn đã được gỡ khỏi hệ thống.','general',0,'2026-05-31 06:53:25','legacy'),(33,24,'Cửa hàng đã được phê duyệt! 🎉','Chúc mừng sếp! Yêu cầu đăng ký mở quán \"Ko ok\" đã được Admin duyệt thành công. Kênh người bán của sếp đã sẵn sàng hoạt động.','general',0,'2026-05-31 06:53:59','legacy'),(34,24,'Cửa hàng đã bị xóa ❌','Kênh người bán của cửa hàng \"Ko ok\" đã bị xóa bởi Admin. Toàn bộ thực đơn đã được gỡ khỏi hệ thống.','general',0,'2026-05-31 06:54:46','legacy'),(35,24,'Cửa hàng đã bị xóa ❌','Kênh người bán của cửa hàng \"Cơm gà hảm nai\" đã bị xóa bởi Admin. Toàn bộ thực đơn đã được gỡ khỏi hệ thống.','general',0,'2026-05-31 07:08:11','legacy'),(36,24,'Cửa hàng đã được phê duyệt! 🎉','Chúc mừng sếp! Yêu cầu đăng ký mở quán \"Ok\" đã được Admin duyệt thành công. Kênh người bán của sếp đã sẵn sàng hoạt động.','general',0,'2026-05-31 07:12:38','legacy'),(37,25,'Cửa hàng đã được phê duyệt! 🎉','Chúc mừng sếp! Yêu cầu đăng ký mở quán \"Cơm Gà Nam Hải\" đã được Admin duyệt thành công. Kênh người bán của sếp đã sẵn sàng hoạt động.','general',0,'2026-05-31 08:12:37','legacy'),(38,26,'Đăng ký tài xế thành công! 🎉','Chúc mừng bạn! Yêu cầu đăng ký làm tài xế với xe Wave, 90AB-169.28 đã được Admin duyệt thành công. Kênh tài xế của bạn đã sẵn sàng hoạt động.','general',0,'2026-05-31 08:12:44','legacy'),(39,24,'Yêu cầu tài xế bị từ chối ❌','Yêu cầu làm đối tác tài xế của bạn đã bị từ chối hoặc bị gỡ bởi Admin.','general',0,'2026-05-31 08:12:47','legacy'),(40,26,'Cửa hàng đã bị xóa ❌','Kênh người bán của cửa hàng \"Cơm gà Hản Noi\" đã bị xóa bởi Admin. Toàn bộ thực đơn đã được gỡ khỏi hệ thống.','general',0,'2026-05-31 08:26:26','legacy'),(41,26,'Đặt hàng thành công! 🛒','Đơn hàng #80 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 08:28:45','legacy'),(42,26,'Quán đã nhận đơn! 🍳','Đơn hàng #80 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 08:29:17','legacy'),(43,26,'Đặt hàng thành công! 🛒','Đơn hàng #81 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 08:32:02','legacy'),(44,26,'Quán đã nhận đơn! 🍳','Đơn hàng #81 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 08:32:18','legacy'),(45,26,'Đặt hàng thành công! 🛒','Đơn hàng #82 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 08:34:13','legacy'),(46,26,'Quán đã nhận đơn! 🍳','Đơn hàng #82 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 08:34:24','legacy'),(47,27,'Đặt hàng thành công! 🛒','Đơn hàng #83 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 08:47:25','legacy'),(48,27,'Quán đã nhận đơn! 🍳','Đơn hàng #83 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 08:47:32','legacy'),(49,27,'Đặt hàng thành công! 🛒','Đơn hàng #84 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 08:49:30','legacy'),(50,27,'Quán đã nhận đơn! 🍳','Đơn hàng #84 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 08:49:34','legacy'),(51,27,'Đặt hàng thành công! 🛒','Đơn hàng #85 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 08:50:51','legacy'),(52,27,'Quán đã nhận đơn! 🍳','Đơn hàng #85 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 08:50:56','legacy'),(53,27,'Đặt hàng thành công! 🛒','Đơn hàng #86 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 08:52:39','legacy'),(54,27,'Quán đã nhận đơn! 🍳','Đơn hàng #86 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 08:52:48','legacy'),(55,27,'Đặt hàng thành công! 🛒','Đơn hàng #87 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 08:53:53','legacy'),(56,27,'Quán đã nhận đơn! 🍳','Đơn hàng #87 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 08:53:56','legacy'),(57,27,'Đặt hàng thành công! 🛒','Đơn hàng #88 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 08:54:07','legacy'),(58,27,'Quán đã nhận đơn! 🍳','Đơn hàng #88 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 08:54:54','legacy'),(59,27,'Đặt hàng thành công! 🛒','Đơn hàng #89 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 08:56:02','legacy'),(60,27,'Quán đã nhận đơn! 🍳','Đơn hàng #89 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 08:56:06','legacy'),(61,27,'Đặt hàng thành công! 🛒','Đơn hàng #90 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 08:57:58','legacy'),(62,27,'Quán đã nhận đơn! 🍳','Đơn hàng #90 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 08:58:05','legacy'),(63,27,'Đặt hàng thành công! 🛒','Đơn hàng #91 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 08:59:20','legacy'),(64,27,'Quán đã nhận đơn! 🍳','Đơn hàng #91 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 08:59:25','legacy'),(65,27,'Đặt hàng thành công! 🛒','Đơn hàng #92 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 09:05:34','legacy'),(66,27,'Quán đã nhận đơn! 🍳','Đơn hàng #92 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 09:05:40','legacy'),(67,27,'Đặt hàng thành công! 🛒','Đơn hàng #93 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 09:07:15','legacy'),(68,27,'Quán đã nhận đơn! 🍳','Đơn hàng #93 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 09:07:23','legacy'),(69,27,'Đặt hàng thành công! 🛒','Đơn hàng #94 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 09:12:45','legacy'),(70,27,'Quán đã nhận đơn! 🍳','Đơn hàng #94 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 09:12:51','legacy'),(71,27,'Đơn hàng đang đến! 🏍️','Túi đồ ăn đơn #94 đã rời quán, tài xế đang phi như bay tới chỗ sếp nhen.','order',0,'2026-05-31 09:14:21','legacy'),(72,25,'Đặt hàng thành công! 🛒','Đơn hàng #95 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 12:07:26','legacy'),(73,25,'Quán đã nhận đơn! 🍳','Đơn hàng #95 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 12:07:43','legacy'),(74,25,'Đơn hàng đang đến! 🏍️','Túi đồ ăn đơn #95 đã rời quán, tài xế đang phi như bay tới chỗ sếp nhen.','order',0,'2026-05-31 12:07:59','legacy'),(75,25,'Đặt hàng thành công! 🛒','Đơn hàng #96 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 12:08:53','legacy'),(76,25,'Quán đã nhận đơn! 🍳','Đơn hàng #96 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 12:09:13','legacy'),(77,25,'Giao hàng thành công! 🎉','Đơn hàng #96 đã được giao tận tay bạn. Chúc bạn ăn ngon miệng!','general',0,'2026-05-31 12:11:55','legacy'),(78,26,'Thu nhập được cộng! 💰','Bạn đã nhận được +15.000đ từ việc hoàn thành đơn hàng #96.','general',0,'2026-05-31 12:11:55','legacy'),(79,25,'Đặt hàng thành công! 🛒','Đơn hàng #97 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 12:12:30','legacy'),(80,25,'Quán đã nhận đơn! 🍳','Đơn hàng #97 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 12:12:52','legacy'),(81,25,'Đặt hàng thành công! 🛒','Đơn hàng #98 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 12:15:06','legacy'),(82,25,'Quán đã nhận đơn! 🍳','Đơn hàng #98 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 12:15:28','legacy'),(83,25,'Đơn hàng đang đến! 🏍️','Túi đồ ăn đơn #98 đã rời quán, tài xế đang phi như bay tới chỗ sếp nhen.','order',0,'2026-05-31 12:15:46','legacy'),(84,25,'Đơn hàng đang đến! 🏍️','Túi đồ ăn đơn #97 đã rời quán, tài xế đang phi như bay tới chỗ sếp nhen.','order',0,'2026-05-31 12:16:16','legacy'),(85,25,'Giao hàng thành công! 🎉','Đơn hàng #98 đã được giao tận tay bạn. Chúc bạn ăn ngon miệng!','general',0,'2026-05-31 12:16:42','legacy'),(86,26,'Thu nhập được cộng! 💰','Bạn đã nhận được +15.000đ từ việc hoàn thành đơn hàng #98.','general',0,'2026-05-31 12:16:42','legacy'),(87,25,'Đặt hàng thành công! 🛒','Đơn hàng #99 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 12:21:37','legacy'),(88,25,'Quán đã nhận đơn! 🍳','Đơn hàng #99 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 12:21:52','legacy'),(89,25,'Đơn hàng đang đến! 🏍️','Túi đồ ăn đơn #99 đã rời quán, tài xế đang phi như bay tới chỗ sếp nhen.','order',0,'2026-05-31 12:22:02','legacy'),(90,25,'Giao hàng thành công! 🎉','Đơn hàng #99 đã được giao tận tay bạn. Chúc bạn ăn ngon miệng!','general',0,'2026-05-31 12:22:10','legacy'),(91,26,'Thu nhập được cộng! 💰','Bạn đã nhận được +15.000đ từ việc hoàn thành đơn hàng #99.','general',0,'2026-05-31 12:22:10','legacy'),(92,25,'Đặt hàng thành công! 🛒','Đơn hàng #100 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 12:24:04','legacy'),(93,25,'Quán đã nhận đơn! 🍳','Đơn hàng #100 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 12:24:16','legacy'),(94,25,'Đơn hàng đang đến! 🏍️','Túi đồ ăn đơn #100 đã rời quán, tài xế đang phi như bay tới chỗ sếp nhen.','order',0,'2026-05-31 12:24:25','legacy'),(95,25,'Giao hàng thành công! 🎉','Đơn hàng #100 đã được giao tận tay bạn. Chúc bạn ăn ngon miệng!','general',0,'2026-05-31 12:24:29','legacy'),(96,26,'Thu nhập được cộng! 💰','Bạn đã nhận được +15.000đ từ việc hoàn thành đơn hàng #100.','general',0,'2026-05-31 12:24:29','legacy'),(97,27,'Cửa hàng đã bị xóa ❌','Kênh người bán của cửa hàng \"Cửa hàng mới\" đã bị xóa bởi Admin. Toàn bộ thực đơn đã được gỡ khỏi hệ thống.','general',0,'2026-05-31 12:45:15','legacy'),(98,24,'Cửa hàng đã bị xóa ❌','Kênh người bán của cửa hàng \"Ok\" đã bị xóa bởi Admin. Toàn bộ thực đơn đã được gỡ khỏi hệ thống.','general',0,'2026-05-31 12:45:26','legacy'),(99,22,'Cửa hàng đã bị xóa ❌','Kênh người bán của cửa hàng \"Khọt khọt \" đã bị xóa bởi Admin. Toàn bộ thực đơn đã được gỡ khỏi hệ thống.','general',0,'2026-05-31 12:45:32','legacy'),(100,23,'Yêu cầu tài xế bị từ chối ❌','Yêu cầu làm đối tác tài xế của bạn đã bị từ chối hoặc bị gỡ bởi Admin.','general',0,'2026-05-31 12:45:54','legacy'),(101,26,'Yêu cầu tài xế bị từ chối ❌','Yêu cầu làm đối tác tài xế của bạn đã bị từ chối hoặc bị gỡ bởi Admin.','general',0,'2026-05-31 12:48:52','legacy'),(102,25,'Cửa hàng đã bị xóa ❌','Kênh người bán của cửa hàng \"Cơm Gà Nam Hải\" đã bị xóa bởi Admin. Toàn bộ thực đơn đã được gỡ khỏi hệ thống.','general',0,'2026-05-31 12:48:56','legacy'),(103,25,'Cửa hàng đã bị xóa ❌','Kênh người bán của cửa hàng \"Lương Sơn Quán\" đã bị xóa bởi Admin. Toàn bộ thực đơn đã được gỡ khỏi hệ thống.','general',0,'2026-05-31 12:55:20','legacy'),(104,25,'Cửa hàng đã bị xóa ❌','Kênh người bán của cửa hàng \"Lương Sơn Quán\" đã bị xóa bởi Admin. Toàn bộ thực đơn đã được gỡ khỏi hệ thống.','general',0,'2026-05-31 12:55:22','legacy'),(105,25,'Cửa hàng đã được phê duyệt! 🎉','Chúc mừng sếp! Yêu cầu đăng ký mở quán \"Cơm Gà Nam Vang\" đã được Admin duyệt thành công. Kênh người bán của sếp đã sẵn sàng hoạt động.','general',0,'2026-05-31 12:56:56','legacy'),(106,25,'Cửa hàng đã bị xóa ❌','Kênh người bán của cửa hàng \"Cơm Gà Nam Vang\" đã bị xóa bởi Admin. Toàn bộ thực đơn đã được gỡ khỏi hệ thống.','general',0,'2026-05-31 13:06:47','legacy'),(107,26,'Cửa hàng đã được phê duyệt! 🎉','Chúc mừng sếp! Yêu cầu đăng ký mở quán \"Lương Sơn Quán\" đã được Admin duyệt thành công. Kênh người bán của sếp đã sẵn sàng hoạt động.','general',0,'2026-05-31 13:07:32','legacy'),(108,25,'Đăng ký tài xế thành công! 🎉','Chúc mừng bạn! Yêu cầu đăng ký làm tài xế với xe Wave, 192929 đã được Admin duyệt thành công. Kênh tài xế của bạn đã sẵn sàng hoạt động.','general',0,'2026-05-31 13:10:04','legacy'),(109,26,'Đặt hàng thành công! 🛒','Đơn hàng #102 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 13:10:09','legacy'),(110,26,'Quán đã nhận đơn! 🍳','Đơn hàng #102 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 13:10:21','legacy'),(111,25,'Yêu cầu tài xế bị từ chối ❌','Yêu cầu làm đối tác tài xế của bạn đã bị từ chối hoặc bị gỡ bởi Admin.','general',0,'2026-05-31 13:35:46','legacy'),(112,26,'Cửa hàng đã bị xóa ❌','Kênh người bán của cửa hàng \"Lương Sơn Quán\" đã bị xóa bởi Admin. Toàn bộ thực đơn đã được gỡ khỏi hệ thống.','general',0,'2026-05-31 13:35:50','legacy'),(113,25,'Cửa hàng đã được phê duyệt! 🎉','Chúc mừng sếp! Yêu cầu đăng ký mở quán \"Cơm gà Lương Sơn\" đã được Admin duyệt thành công. Kênh người bán của sếp đã sẵn sàng hoạt động.','general',0,'2026-05-31 14:01:40','legacy'),(114,25,'Đặt hàng thành công! 🛒','Đơn hàng #103 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 14:04:06','legacy'),(115,26,'Đăng ký tài xế thành công! 🎉','Chúc mừng bạn! Yêu cầu đăng ký làm tài xế với xe Wave, 1288384 đã được Admin duyệt thành công. Kênh tài xế của bạn đã sẵn sàng hoạt động.','general',0,'2026-05-31 14:05:35','legacy'),(116,25,'Quán đã nhận đơn! 🍳','Đơn hàng #103 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 14:05:43','legacy'),(117,25,'Đặt hàng thành công! 🛒','Đơn hàng #104 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 14:08:29','legacy'),(118,25,'Quán đã nhận đơn! 🍳','Đơn hàng #104 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 14:08:49','legacy'),(119,25,'Đặt hàng thành công! 🛒','Đơn hàng #105 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 14:10:01','legacy'),(120,25,'Quán đã nhận đơn! 🍳','Đơn hàng #105 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 14:10:32','legacy'),(121,25,'Quán đã nhận đơn! 🍳','Đơn hàng #105 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 14:10:35','legacy'),(122,25,'Đặt hàng thành công! 🛒','Đơn hàng #106 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 14:15:45','legacy'),(123,25,'Quán đã nhận đơn! 🍳','Đơn hàng #106 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 14:16:24','legacy'),(124,25,'Quán đã nhận đơn! 🍳','Đơn hàng #106 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 14:16:24','legacy'),(125,25,'Cửa hàng đã bị xóa ❌','Kênh người bán của cửa hàng \"Cơm gà Lương Sơn\" đã bị xóa bởi Admin. Toàn bộ thực đơn đã được gỡ khỏi hệ thống.','general',0,'2026-05-31 14:20:23','legacy'),(126,25,'Cửa hàng đã được phê duyệt! 🎉','Chúc mừng sếp! Yêu cầu đăng ký mở quán \"Cơm gà Lương Sơn\" đã được Admin duyệt thành công. Kênh người bán của sếp đã sẵn sàng hoạt động.','general',0,'2026-05-31 14:22:15','legacy'),(127,25,'Đặt hàng thành công! 🛒','Đơn hàng #107 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 14:22:53','legacy'),(128,25,'Quán đã nhận đơn! 🍳','Đơn hàng #107 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 14:23:10','legacy'),(129,25,'Đặt hàng thành công! 🛒','Đơn hàng #108 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 14:23:36','legacy'),(130,25,'Quán đã nhận đơn! 🍳','Đơn hàng #108 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 14:23:56','legacy'),(131,25,'Đơn hàng đang đến! 🏍️','Túi đồ ăn đơn #108 đã rời quán, tài xế đang phi như bay tới chỗ sếp nhen.','order',0,'2026-05-31 14:24:17','legacy'),(132,25,'Giao hàng thành công! 🎉','Đơn hàng #108 đã được giao tận tay bạn. Chúc bạn ăn ngon miệng!','general',0,'2026-05-31 14:24:25','legacy'),(133,26,'Thu nhập được cộng! 💰','Bạn đã nhận được +15.000đ từ việc hoàn thành đơn hàng #108.','general',0,'2026-05-31 14:24:25','legacy'),(134,25,'Giao hàng thành công! 🎉','Đơn hàng #107 đã được giao tận tay bạn. Chúc bạn ăn ngon miệng!','general',0,'2026-05-31 14:27:26','legacy'),(135,26,'Thu nhập được cộng! 💰','Bạn đã nhận được +15.000đ từ việc hoàn thành đơn hàng #107.','general',0,'2026-05-31 14:27:26','legacy'),(136,25,'Đặt hàng thành công! 🛒','Đơn hàng #109 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-05-31 14:27:47','legacy'),(137,25,'Giao hàng thành công! 🎉','Đơn hàng #106 đã được giao tận tay bạn. Chúc bạn ăn ngon miệng!','general',0,'2026-05-31 14:28:02','legacy'),(138,26,'Thu nhập được cộng! 💰','Bạn đã nhận được +40.500đ từ việc hoàn thành đơn hàng #106.','general',0,'2026-05-31 14:28:02','legacy'),(139,25,'Quán đã nhận đơn! 🍳','Đơn hàng #109 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-05-31 14:28:18','legacy'),(140,25,'Đặt hàng thành công! 🛒','Đơn hàng #110 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 01:33:09','legacy'),(141,25,'Quán đã nhận đơn! 🍳','Đơn hàng #110 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 01:33:20','legacy'),(142,25,'Đặt hàng thành công! 🛒','Đơn hàng #111 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 01:39:40','legacy'),(143,25,'Đặt hàng thành công! 🛒','Đơn hàng #112 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 01:40:37','legacy'),(144,25,'Quán đã nhận đơn! 🍳','Đơn hàng #112 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 01:41:09','legacy'),(145,25,'Đặt hàng thành công! 🛒','Đơn hàng #113 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 01:51:04','legacy'),(146,25,'Quán đã nhận đơn! 🍳','Đơn hàng #113 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 01:51:33','legacy'),(147,25,'Đơn hàng đang đến! 🏍️','Túi đồ ăn đơn #113 đã rời quán, tài xế đang phi như bay tới chỗ sếp nhen.','order',0,'2026-06-01 01:52:23','legacy'),(148,25,'Giao hàng thành công! 🎉','Đơn hàng #113 đã được giao tận tay bạn. Chúc bạn ăn ngon miệng!','general',0,'2026-06-01 01:52:32','legacy'),(149,26,'Thu nhập được cộng! 💰','Bạn đã nhận được +15.200đ từ việc hoàn thành đơn hàng #113.','general',0,'2026-06-01 01:52:32','legacy'),(150,25,'Đặt hàng thành công! 🛒','Đơn hàng #114 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 02:05:12','legacy'),(151,25,'Quán đã nhận đơn! 🍳','Đơn hàng #114 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 02:13:08','legacy'),(152,25,'Đơn hàng đang đến! 🏍️','Túi đồ ăn đơn #114 đã rời quán, tài xế đang phi như bay tới chỗ sếp nhen.','order',0,'2026-06-01 02:13:17','legacy'),(153,25,'Giao hàng thành công! 🎉','Đơn hàng #114 đã được giao tận tay bạn. Chúc bạn ăn ngon miệng!','general',0,'2026-06-01 02:13:20','legacy'),(154,26,'Thu nhập được cộng! 💰','Bạn đã nhận được +15.200đ từ việc hoàn thành đơn hàng #114.','general',0,'2026-06-01 02:13:20','legacy'),(155,23,'Đặt hàng thành công! 🛒','Đơn hàng #115 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 05:02:11','legacy'),(156,23,'Đăng ký tài xế thành công! 🎉','Chúc mừng bạn! Yêu cầu đăng ký làm tài xế với xe abc, 35x1 - 123.67 đã được Admin duyệt thành công. Kênh tài xế của bạn đã sẵn sàng hoạt động.','general',0,'2026-06-01 05:04:02','legacy'),(157,23,'Quán đã nhận đơn! 🍳','Đơn hàng #115 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 05:05:32','legacy'),(158,23,'Quán đã nhận đơn! 🍳','Đơn hàng #115 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 05:05:32','legacy'),(159,23,'Quán đã nhận đơn! 🍳','Đơn hàng #115 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 05:05:32','legacy'),(160,23,'Quán đã nhận đơn! 🍳','Đơn hàng #115 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 05:05:32','legacy'),(161,23,'Đặt hàng thành công! 🛒','Đơn hàng #116 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 05:06:44','legacy'),(162,23,'Quán đã nhận đơn! 🍳','Đơn hàng #116 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 05:06:58','legacy'),(163,23,'Đặt hàng thành công! 🛒','Đơn hàng #117 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 05:07:58','legacy'),(164,23,'Quán đã nhận đơn! 🍳','Đơn hàng #117 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 05:08:24','legacy'),(165,23,'Đơn hàng đang đến! 🏍️','Túi đồ ăn đơn #117 đã rời quán, tài xế đang phi như bay tới chỗ sếp nhen.','order',0,'2026-06-01 05:09:06','legacy'),(166,23,'Giao hàng thành công! 🎉','Đơn hàng #117 đã được giao tận tay bạn. Chúc bạn ăn ngon miệng!','general',0,'2026-06-01 05:09:25','legacy'),(167,23,'Thu nhập được cộng! 💰','Bạn đã nhận được +23.200đ từ việc hoàn thành đơn hàng #117.','general',0,'2026-06-01 05:09:25','legacy'),(168,23,'Đặt hàng thành công! 🛒','Đơn hàng #118 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 05:41:15','legacy'),(169,23,'Đơn hàng bị từ chối ❌','Cửa hàng đã từ chối đơn hàng #118 của sếp do quá tải hoặc hết món mất rồi.','order',0,'2026-06-01 05:44:15','legacy'),(170,23,'Đặt hàng thành công! 🛒','Đơn hàng #119 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 06:01:47','legacy'),(171,23,'Quán đã nhận đơn! 🍳','Đơn hàng #119 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 06:13:34','legacy'),(172,23,'Đặt hàng thành công! 🛒','Đơn hàng #120 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 06:31:18','legacy'),(173,23,'Đặt lại đơn hàng thành công! 🛒','Đơn hàng mới #121 (sao chép từ đơn #120) đã được gửi tới cửa hàng.','order',0,'2026-06-01 06:32:03','legacy'),(174,23,'Quán đã nhận đơn! 🍳','Đơn hàng #120 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 06:32:36','legacy'),(175,23,'Quán đã nhận đơn! 🍳','Đơn hàng #121 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 06:32:51','legacy'),(176,23,'Đơn hàng đang đến! 🏍️','Túi đồ ăn đơn #121 đã rời quán, tài xế đang phi như bay tới chỗ sếp nhen.','order',0,'2026-06-01 06:33:15','legacy'),(177,23,'Giao hàng thành công! 🎉','Đơn hàng #121 đã được giao tận tay bạn. Chúc bạn ăn ngon miệng!','general',0,'2026-06-01 06:35:29','legacy'),(178,23,'Thu nhập được cộng! 💰','Bạn đã nhận được +20.640đ từ việc hoàn thành đơn hàng #121.','general',0,'2026-06-01 06:35:29','legacy'),(179,23,'Đặt hàng thành công! 🛒','Đơn hàng #122 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 07:21:13','legacy'),(180,23,'Quán đã nhận đơn! 🍳','Đơn hàng #122 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 07:23:05','legacy'),(181,23,'Đặt lại đơn hàng thành công! 🛒','Đơn hàng mới #123 (sao chép từ đơn #122) đã được gửi tới cửa hàng.','order',0,'2026-06-01 07:23:20','legacy'),(182,23,'Đặt hàng thành công! 🛒','Đơn hàng #124 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 07:33:44','legacy'),(183,23,'Quán đã nhận đơn! 🍳','Đơn hàng #124 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 07:35:04','legacy'),(184,23,'Đơn hàng đang đến! 🏍️','Túi đồ ăn đơn #124 đã rời quán, tài xế đang phi như bay tới chỗ sếp nhen.','order',0,'2026-06-01 07:35:26','legacy'),(185,23,'Giao hàng thành công! 🎉','Đơn hàng #124 đã được giao tận tay bạn. Chúc bạn ăn ngon miệng!','general',0,'2026-06-01 07:35:42','legacy'),(186,23,'Thu nhập được cộng! 💰','Bạn đã nhận được +31.200đ từ việc hoàn thành đơn hàng #124.','general',0,'2026-06-01 07:35:42','legacy'),(187,23,'Đặt lại đơn hàng thành công! 🛒','Đơn hàng mới #125 (sao chép từ đơn #124) đã được gửi tới cửa hàng.','order',0,'2026-06-01 07:35:53','legacy'),(188,23,'Đặt hàng thành công! 🛒','Đơn hàng #126 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 08:04:09','legacy'),(189,23,'Đặt hàng thành công! 🛒','Đơn hàng #127 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 08:04:22','legacy'),(190,23,'Đặt hàng thành công! 🛒','Đơn hàng #128 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 08:07:26','legacy'),(191,23,'Thanh toán thành công 🎉','Đơn hàng #128 của bạn đã được thanh toán thành công số tiền 40,000 đ.','order',0,'2026-06-01 08:07:46','legacy'),(192,23,'Đơn hàng đã thanh toán 💰','Đơn hàng #128 đã được khách thanh toán trực tuyến số tiền 40,000 đ.','order',0,'2026-06-01 08:07:46','legacy'),(193,23,'Đặt lại đơn hàng thành công! 🛒','Đơn hàng mới #129 (sao chép từ đơn #128) đã được gửi tới cửa hàng.','order',0,'2026-06-01 08:23:03','legacy'),(194,23,'Đánh giá mới từ khách hàng ⭐','Đơn hàng #124 vừa nhận được đánh giá 4 sao từ khách hàng.','general',0,'2026-06-01 08:24:47','legacy'),(195,23,'Đặt hàng thành công! 🛒','Đơn hàng #130 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 08:25:59','legacy'),(196,23,'Đặt hàng thành công! 🛒','Đơn hàng #131 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 08:37:16','legacy'),(197,23,'Đặt hàng thành công! 🛒','Đơn hàng #132 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 08:52:31','legacy'),(198,23,'Đặt hàng thành công! 🛒','Đơn hàng #133 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 09:11:05','legacy'),(199,23,'Đặt hàng thành công! 🛒','Đơn hàng #134 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 09:25:16','user'),(200,23,'Quán đã nhận đơn! 🍳','Đơn hàng #134 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 09:25:40','user'),(201,23,'Đặt hàng thành công! 🛒','Đơn hàng #135 của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!','order',0,'2026-06-01 09:27:12','user'),(202,23,'Quán đã nhận đơn! 🍳','Đơn hàng #135 đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.','order',0,'2026-06-01 09:27:29','user'),(203,23,'Đơn hàng đang đến! 🏍️','Túi đồ ăn đơn #135 đã rời quán, tài xế đang phi như bay tới chỗ sếp nhen.','order',0,'2026-06-01 09:27:42','user'),(204,23,'Giao hàng thành công! 🎉','Đơn hàng #135 đã được giao tận tay bạn. Chúc bạn ăn ngon miệng!','general',0,'2026-06-01 09:28:14','user'),(205,23,'Thu nhập được cộng! 💰','Bạn đã nhận được +16.480đ từ việc hoàn thành đơn hàng #135.','general',0,'2026-06-01 09:28:14','shipper'),(206,23,'Đánh giá mới từ khách hàng ⭐','Đơn hàng #135 vừa nhận được đánh giá 3 sao từ khách hàng.','',0,'2026-06-01 09:29:35','store');
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
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (51,76,38,101,30000.00),(52,77,42,1,45000.00),(53,78,41,1,1000.00),(54,79,38,1,30000.00),(55,80,NULL,1,25000.00),(56,81,NULL,1,25000.00),(57,82,NULL,1,25000.00),(58,83,NULL,1,25000.00),(59,84,NULL,1,25000.00),(60,85,NULL,1,25000.00),(61,86,NULL,1,25000.00),(62,87,NULL,1,25000.00),(63,88,NULL,1,25000.00),(64,89,NULL,1,25000.00),(65,90,NULL,1,25000.00),(66,91,NULL,1,25000.00),(67,92,NULL,1,25000.00),(68,93,NULL,1,25000.00),(69,94,NULL,1,25000.00),(70,95,NULL,1,25000.00),(71,96,NULL,1,25000.00),(72,97,NULL,1,25000.00),(73,98,NULL,1,25000.00),(74,99,NULL,1,25000.00),(75,100,NULL,1,25000.00),(76,102,NULL,1,1323730.00),(77,103,NULL,1,20060.00),(78,104,NULL,1,20060.00),(79,105,NULL,1,20060.00),(80,106,NULL,1,20060.00),(81,107,46,1,22222.00),(82,108,46,1,22222.00),(83,109,46,1,22222.00),(84,110,46,1,22222.00),(85,111,46,1,22222.00),(86,112,46,1,22222.00),(87,113,46,1,22222.00),(88,114,46,1,22222.00),(89,115,42,1,45000.00),(90,116,42,1,45000.00),(91,117,42,1,45000.00),(92,118,42,1,45000.00),(93,119,42,1,45000.00),(94,120,42,1,45000.00),(95,121,42,1,45000.00),(96,122,42,1,45000.00),(97,123,42,1,45000.00),(98,124,42,1,45000.00),(99,125,42,1,45000.00),(100,126,42,1,45000.00),(101,127,42,1,45000.00),(102,128,42,1,45000.00),(103,129,42,1,45000.00),(104,130,42,1,45000.00),(105,131,42,1,45000.00),(106,132,42,1,45000.00),(107,133,42,1,45000.00),(108,134,42,1,45000.00),(109,135,42,1,45000.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;

--
-- Table structure for table `order_reviews`
--

DROP TABLE IF EXISTS `order_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `shipper_id` int(11) DEFAULT NULL,
  `store_rating` int(11) NOT NULL CHECK (`store_rating` >= 1 and `store_rating` <= 5),
  `store_comment` text DEFAULT NULL,
  `shipper_rating` int(11) DEFAULT NULL CHECK (`shipper_rating` >= 1 and `shipper_rating` <= 5),
  `shipper_comment` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id_unique` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_reviews`
--

/*!40000 ALTER TABLE `order_reviews` DISABLE KEYS */;
INSERT INTO `order_reviews` VALUES (1,124,23,21,25,4,'k ngon',4,'chậm',NULL,'2026-06-01 08:24:47'),(2,135,23,21,25,3,NULL,4,NULL,NULL,'2026-06-01 09:29:35');
/*!40000 ALTER TABLE `order_reviews` ENABLE KEYS */;

--
-- Table structure for table `order_tracking`
--

DROP TABLE IF EXISTS `order_tracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_tracking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_tracking_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_tracking`
--

/*!40000 ALTER TABLE `order_tracking` DISABLE KEYS */;
INSERT INTO `order_tracking` VALUES (1,2,'cancelled','Hệ thống cập nhật trạng thái đơn thành: cancelled','2026-05-21 09:20:00'),(6,32,'confirmed','Cửa hàng xử lý','2026-05-25 10:01:40'),(7,32,'delivering','Cửa hàng xử lý','2026-05-25 10:02:39'),(8,29,'cancelled','Cửa hàng xử lý','2026-05-25 10:27:48'),(9,33,'confirmed','Cửa hàng xử lý','2026-05-25 10:44:19'),(10,30,'confirmed','Cửa hàng xử lý','2026-05-25 10:51:19'),(11,34,'confirmed','Cửa hàng xử lý','2026-05-25 10:52:12'),(12,36,'','Cửa hàng xử lý','2026-05-25 11:16:50'),(13,37,'','Cửa hàng xử lý','2026-05-25 11:40:20'),(14,38,'cancelled','Hệ thống cập nhật trạng thái đơn thành: cancelled','2026-05-25 11:45:07'),(15,40,'','Cửa hàng xử lý','2026-05-25 11:55:13'),(16,39,'','Cửa hàng xử lý','2026-05-25 11:55:30'),(17,31,'','Cửa hàng xử lý','2026-05-25 11:56:02'),(18,35,'','Cửa hàng xử lý','2026-05-25 11:56:03'),(19,41,'','Cửa hàng xử lý','2026-05-25 12:07:25'),(20,42,'','Cửa hàng xử lý','2026-05-25 12:14:57'),(21,43,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 15:56:47'),(22,44,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 17:16:18'),(23,46,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 17:18:27'),(24,48,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 17:30:10'),(25,47,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 17:30:11'),(26,49,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 17:31:11'),(27,50,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 17:32:51'),(28,51,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 17:33:16'),(29,53,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 17:34:54'),(30,52,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 17:34:56'),(31,57,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 17:39:52'),(32,56,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 17:39:55'),(33,58,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 17:49:10'),(34,60,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 17:55:00'),(35,59,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 17:55:07'),(36,62,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 17:56:51'),(37,61,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-25 17:57:01'),(38,55,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-26 00:34:05'),(39,63,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-26 00:39:19'),(40,54,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-26 00:39:22'),(41,65,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-26 02:51:58'),(42,66,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-26 02:57:33'),(43,67,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-26 02:58:29'),(44,68,'cancelled','Hệ thống cập nhật trạng thái đơn thành: cancelled','2026-05-27 09:32:33'),(45,69,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-27 09:35:45'),(46,70,'cancelled','Hệ thống cập nhật trạng thái đơn thành: cancelled','2026-05-28 07:47:48'),(47,75,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-30 15:25:15'),(48,74,'Đơn đã bị hủy','Cửa hàng xử lý','2026-05-30 15:25:17'),(49,73,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-30 15:25:19'),(50,72,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-30 15:25:23'),(51,45,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-30 15:25:47'),(52,71,'Đơn đã bị hủy','Cửa hàng xử lý','2026-05-30 15:35:00'),(53,64,'Đơn đã bị hủy','Cửa hàng xử lý','2026-05-30 15:35:02'),(54,77,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-30 16:03:01'),(55,79,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-30 16:10:06'),(56,76,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-30 16:10:08'),(57,78,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-30 16:10:18'),(58,80,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 08:29:17'),(59,81,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 08:32:18'),(60,82,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 08:34:24'),(61,83,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 08:47:32'),(62,84,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 08:49:34'),(63,85,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 08:50:56'),(64,86,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 08:52:48'),(65,87,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 08:53:56'),(66,88,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 08:54:54'),(67,89,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 08:56:06'),(68,90,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 08:58:05'),(69,91,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 08:59:25'),(70,92,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 09:05:40'),(71,93,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 09:07:23'),(72,94,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 09:12:51'),(73,94,'Đang giao hàng','Cửa hàng xử lý','2026-05-31 09:14:21'),(74,95,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 12:07:43'),(75,95,'Đang giao hàng','Cửa hàng xử lý','2026-05-31 12:07:59'),(76,96,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 12:09:13'),(77,96,'completed','Đơn hàng đã được giao thành công.','2026-05-31 12:11:55'),(78,97,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 12:12:52'),(79,97,'Tài xế nhận đơn','Tài xế đã nhận đơn và đang di chuyển tới quán.','2026-05-31 12:12:56'),(80,98,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 12:15:28'),(81,98,'Tài xế nhận đơn','Tài xế đã nhận đơn và đang di chuyển tới quán.','2026-05-31 12:15:32'),(82,98,'Đang giao hàng','Cửa hàng xử lý','2026-05-31 12:15:46'),(83,97,'Đang giao hàng','Cửa hàng xử lý','2026-05-31 12:16:16'),(84,98,'completed','Đơn hàng đã được giao thành công.','2026-05-31 12:16:41'),(85,99,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 12:21:52'),(86,99,'Tài xế nhận đơn','Tài xế đã nhận đơn và đang di chuyển tới quán.','2026-05-31 12:21:55'),(87,99,'Đang giao hàng','Cửa hàng xử lý','2026-05-31 12:22:02'),(88,99,'completed','Đơn hàng đã được giao thành công.','2026-05-31 12:22:10'),(89,100,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 12:24:16'),(90,100,'Tài xế nhận đơn','Tài xế đã nhận đơn và đang di chuyển tới quán.','2026-05-31 12:24:20'),(91,100,'Đang giao hàng','Cửa hàng xử lý','2026-05-31 12:24:25'),(92,100,'completed','Đơn hàng đã được giao thành công.','2026-05-31 12:24:29'),(93,102,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 13:10:21'),(94,103,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 14:05:42'),(95,104,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 14:08:49'),(96,105,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 14:10:31'),(97,105,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 14:10:31'),(98,106,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 14:16:23'),(99,106,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 14:16:23'),(100,107,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 14:23:09'),(101,108,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 14:23:55'),(102,108,'Tài xế nhận đơn','Tài xế đã nhận đơn và đang di chuyển tới quán.','2026-05-31 14:24:13'),(103,108,'Đang giao hàng','Cửa hàng xử lý','2026-05-31 14:24:17'),(104,108,'completed','Đơn hàng đã được giao thành công.','2026-05-31 14:24:24'),(105,107,'Tài xế nhận đơn','Tài xế đã nhận đơn và đang di chuyển tới quán.','2026-05-31 14:26:06'),(106,107,'completed','Đơn hàng đã được giao thành công.','2026-05-31 14:27:26'),(107,106,'Tài xế nhận đơn','Tài xế đã nhận đơn và đang di chuyển tới quán.','2026-05-31 14:27:29'),(108,106,'completed','Đơn hàng đã được giao thành công.','2026-05-31 14:28:01'),(109,109,'Quán đã nhận đơn','Cửa hàng xử lý','2026-05-31 14:28:17'),(110,109,'Tài xế nhận đơn','Tài xế đã nhận đơn và đang di chuyển tới quán.','2026-05-31 14:28:23'),(111,110,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 01:33:19'),(112,112,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 01:41:09'),(113,113,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 01:51:33'),(114,113,'Tài xế nhận đơn','Tài xế đã nhận đơn và đang di chuyển tới quán.','2026-06-01 01:52:20'),(115,113,'Đang giao hàng','Cửa hàng xử lý','2026-06-01 01:52:23'),(116,113,'completed','Đơn hàng đã được giao thành công.','2026-06-01 01:52:31'),(117,114,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 02:13:08'),(118,114,'Tài xế nhận đơn','Tài xế đã nhận đơn và đang di chuyển tới quán.','2026-06-01 02:13:12'),(119,114,'Đang giao hàng','Cửa hàng xử lý','2026-06-01 02:13:17'),(120,114,'completed','Đơn hàng đã được giao thành công.','2026-06-01 02:13:19'),(121,115,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 05:05:30'),(122,115,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 05:05:31'),(123,115,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 05:05:31'),(124,115,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 05:05:32'),(125,116,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 05:06:58'),(126,117,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 05:08:24'),(127,117,'Tài xế nhận đơn','Tài xế đã nhận đơn và đang di chuyển tới quán.','2026-06-01 05:08:41'),(128,117,'Đang giao hàng','Cửa hàng xử lý','2026-06-01 05:09:06'),(129,117,'completed','Đơn hàng đã được giao thành công.','2026-06-01 05:09:25'),(130,118,'Đơn đã bị hủy','Cửa hàng xử lý','2026-06-01 05:44:15'),(131,119,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 06:13:32'),(132,120,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 06:32:35'),(133,121,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 06:32:51'),(134,121,'Tài xế nhận đơn','Tài xế đã nhận đơn và đang di chuyển tới quán.','2026-06-01 06:32:55'),(135,121,'Đang giao hàng','Cửa hàng xử lý','2026-06-01 06:33:15'),(136,121,'completed','Đơn hàng đã được giao thành công.','2026-06-01 06:35:29'),(137,122,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 07:23:02'),(138,123,'cancelled','Hệ thống cập nhật trạng thái đơn thành: cancelled','2026-06-01 07:23:24'),(139,124,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 07:35:04'),(140,124,'Tài xế nhận đơn','Tài xế đã nhận đơn và đang di chuyển tới quán.','2026-06-01 07:35:14'),(141,124,'Đang giao hàng','Cửa hàng xử lý','2026-06-01 07:35:26'),(142,124,'completed','Đơn hàng đã được giao thành công.','2026-06-01 07:35:42'),(143,125,'cancelled','Hệ thống cập nhật trạng thái đơn thành: cancelled','2026-06-01 07:35:57'),(144,129,'cancelled','Hệ thống cập nhật trạng thái đơn thành: cancelled','2026-06-01 08:23:06'),(145,132,'cancelled','Hệ thống cập nhật trạng thái đơn thành: cancelled','2026-06-01 08:52:45'),(146,134,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 09:25:38'),(147,135,'Quán đã nhận đơn','Cửa hàng xử lý','2026-06-01 09:27:28'),(148,135,'Tài xế nhận đơn','Tài xế đã nhận đơn và đang di chuyển tới quán.','2026-06-01 09:27:37'),(149,135,'Đang giao hàng','Cửa hàng xử lý','2026-06-01 09:27:42'),(150,135,'completed','Đơn hàng đã được giao thành công.','2026-06-01 09:28:14');
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
  `status` varchar(255) DEFAULT 'pending',
  `payment_status` enum('unpaid','paid') DEFAULT 'unpaid',
  `address` text DEFAULT NULL,
  `voucher_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `shipping_fee` int(11) DEFAULT NULL,
  `distance` decimal(10,2) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `service_fee` decimal(10,2) DEFAULT 0.00,
  `tip_amount` decimal(10,2) DEFAULT 0.00,
  `delivery_photo` varchar(255) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT 'COD',
  `store_voucher_id` int(10) unsigned DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,2,NULL,NULL,50000.00,'pending','unpaid','1/2',NULL,'2026-05-21 08:27:35',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(2,2,NULL,NULL,25000.00,'cancelled','unpaid','jdhf',NULL,'2026-05-21 09:05:21',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(29,2,1,NULL,15000.00,'cancelled','unpaid','33',NULL,'2026-05-24 12:03:57',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(30,2,1,NULL,20000.00,'confirmed','unpaid','33 đại la',NULL,'2026-05-25 02:10:57',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(31,2,1,NULL,15000.00,'','unpaid','36 đại la',NULL,'2026-05-25 09:16:44',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(32,2,1,NULL,30000.00,'delivering','unpaid','22 bạch mai',NULL,'2026-05-25 09:35:44',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(33,2,1,NULL,40000.00,'confirmed','unpaid','1 giải phóng',NULL,'2026-05-25 10:29:27',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(34,2,1,NULL,60000.00,'confirmed','unpaid','45 giải phóng',NULL,'2026-05-25 10:52:02',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(35,2,1,NULL,45000.00,'','unpaid','33 haha',NULL,'2026-05-25 10:56:49',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(36,2,1,NULL,40000.00,'','unpaid','44 đại la',NULL,'2026-05-25 11:16:14',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(37,2,1,NULL,35000.00,'','unpaid','3344',NULL,'2026-05-25 11:20:53',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(38,2,1,NULL,45000.00,'cancelled','unpaid','354 tc',NULL,'2026-05-25 11:40:40',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(39,2,1,NULL,10000.00,'','unpaid','3₫3!!4',NULL,'2026-05-25 11:45:20',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(40,2,1,NULL,45000.00,'','unpaid','867369',NULL,'2026-05-25 11:55:02',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(41,2,1,NULL,35000.00,'','unpaid','sjndbd',NULL,'2026-05-25 12:07:19',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(42,1,1,NULL,35000.00,'','unpaid','678',NULL,'2026-05-25 12:14:44',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(43,5,1,NULL,35000.00,'Quán đã nhận đơn','unpaid','Lò sát sinh 55 giải phóng',NULL,'2026-05-25 15:30:36',19500,2.90,NULL,0.00,0.00,NULL,'COD',NULL),(44,9,7,NULL,35000.00,'Quán đã nhận đơn','unpaid','1',NULL,'2026-05-25 17:16:03',42000,7.40,NULL,0.00,0.00,NULL,'COD',NULL),(45,9,1,NULL,35000.00,'Quán đã nhận đơn','unpaid','2',NULL,'2026-05-25 17:17:00',38500,6.70,NULL,0.00,0.00,NULL,'COD',NULL),(46,9,7,NULL,35000.00,'Quán đã nhận đơn','unpaid','3',NULL,'2026-05-25 17:17:25',19000,2.80,NULL,0.00,0.00,NULL,'COD',NULL),(47,9,6,NULL,35000.00,'Quán đã nhận đơn','unpaid','1',NULL,'2026-05-25 17:21:35',16500,2.30,NULL,0.00,0.00,NULL,'COD',NULL),(48,9,6,NULL,35000.00,'Quán đã nhận đơn','unpaid','1',NULL,'2026-05-25 17:29:23',32000,5.40,NULL,0.00,0.00,NULL,'COD',NULL),(49,9,6,NULL,35000.00,'Quán đã nhận đơn','unpaid','3',NULL,'2026-05-25 17:31:04',33000,5.60,NULL,0.00,0.00,NULL,'COD',NULL),(50,9,7,NULL,35000.00,'Quán đã nhận đơn','unpaid','1',NULL,'2026-05-25 17:32:36',38000,6.60,NULL,0.00,0.00,NULL,'COD',NULL),(51,9,6,NULL,35000.00,'Quán đã nhận đơn','unpaid','1',NULL,'2026-05-25 17:33:04',26000,4.20,NULL,0.00,0.00,NULL,'COD',NULL),(52,9,7,NULL,35000.00,'Quán đã nhận đơn','unpaid','4',NULL,'2026-05-25 17:34:24',26500,4.30,NULL,0.00,0.00,NULL,'COD',NULL),(53,9,7,NULL,35000.00,'Quán đã nhận đơn','unpaid','4',NULL,'2026-05-25 17:34:35',38500,6.70,NULL,0.00,0.00,NULL,'COD',NULL),(54,9,6,NULL,35000.00,'Quán đã nhận đơn','unpaid','555',NULL,'2026-05-25 17:39:04',28500,4.70,NULL,0.00,0.00,NULL,'COD',NULL),(55,9,6,NULL,35000.00,'Quán đã nhận đơn','unpaid','555',NULL,'2026-05-25 17:39:05',29000,4.80,NULL,0.00,0.00,NULL,'COD',NULL),(56,9,7,NULL,35000.00,'Quán đã nhận đơn','unpaid','5',NULL,'2026-05-25 17:39:29',32500,5.50,NULL,0.00,0.00,NULL,'COD',NULL),(57,9,7,NULL,35000.00,'Quán đã nhận đơn','unpaid','6',NULL,'2026-05-25 17:39:39',31500,5.30,NULL,0.00,0.00,NULL,'COD',NULL),(58,9,7,NULL,35000.00,'Quán đã nhận đơn','unpaid','5555',NULL,'2026-05-25 17:48:48',32500,5.50,NULL,0.00,0.00,NULL,'COD',NULL),(59,1,7,NULL,35000.00,'Quán đã nhận đơn','unpaid','8',NULL,'2026-05-25 17:54:30',15000,1.50,NULL,0.00,0.00,NULL,'COD',NULL),(60,1,7,NULL,35000.00,'Quán đã nhận đơn','unpaid','9',NULL,'2026-05-25 17:54:40',26500,4.30,NULL,0.00,0.00,NULL,'COD',NULL),(61,9,7,NULL,35000.00,'Quán đã nhận đơn','unpaid','999',NULL,'2026-05-25 17:56:17',16000,2.20,NULL,0.00,0.00,NULL,'COD',NULL),(62,9,7,NULL,35000.00,'Quán đã nhận đơn','unpaid','999',NULL,'2026-05-25 17:56:31',15000,1.50,NULL,0.00,0.00,NULL,'COD',NULL),(63,8,6,NULL,35000.00,'Quán đã nhận đơn','unpaid','5',NULL,'2026-05-26 00:38:57',41000,7.20,NULL,0.00,0.00,NULL,'COD',NULL),(64,10,1,NULL,10015000.00,'Đơn đã bị hủy','unpaid','123',NULL,'2026-05-26 02:51:27',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(65,10,17,NULL,10015000.00,'Quán đã nhận đơn','unpaid','1234',NULL,'2026-05-26 02:51:52',26500,4.30,NULL,0.00,0.00,NULL,'COD',NULL),(66,10,17,NULL,205000.00,'Quán đã nhận đơn','unpaid','33',NULL,'2026-05-26 02:57:16',17500,2.50,NULL,0.00,0.00,NULL,'COD',NULL),(67,10,17,NULL,215000.00,'Quán đã nhận đơn','unpaid','123',NULL,'2026-05-26 02:58:25',26000,4.20,NULL,0.00,0.00,NULL,'COD',NULL),(68,10,1,NULL,35000.00,'cancelled','unpaid','55 giải phóng ',NULL,'2026-05-27 09:32:24',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(69,14,18,NULL,35000.00,'Quán đã nhận đơn','unpaid','Ok',NULL,'2026-05-27 09:35:32',38000,6.60,NULL,0.00,0.00,NULL,'COD',NULL),(70,13,1,NULL,35000.00,'cancelled','unpaid','55555 phỏng dé',NULL,'2026-05-28 07:47:34',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(71,14,1,NULL,57000.00,'Đơn đã bị hủy','unpaid','Ok',NULL,'2026-05-28 09:23:04',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(72,14,1,NULL,35000.00,'Quán đã nhận đơn','unpaid','Ok',NULL,'2026-05-28 09:49:25',22500,3.50,NULL,0.00,0.00,NULL,'COD',NULL),(73,13,1,NULL,35000.00,'Quán đã nhận đơn','unpaid','55555 phỏng dé',NULL,'2026-05-28 09:50:25',36000,6.20,NULL,0.00,0.00,NULL,'COD',NULL),(74,13,1,NULL,35000.00,'Đơn đã bị hủy','unpaid','55555 phỏng dé',NULL,'2026-05-28 23:57:53',NULL,NULL,NULL,0.00,0.00,NULL,'COD',NULL),(75,13,1,NULL,35000.00,'Quán đã nhận đơn','unpaid','55555 phỏng dé',NULL,'2026-05-28 23:58:02',37000,6.40,NULL,0.00,0.00,NULL,'COD',NULL),(76,22,19,NULL,3045000.00,'Quán đã nhận đơn','unpaid','1696, Phường Dịch Vọng, Quận Cầu Giấy, Thành phố Hà Nội',NULL,'2026-05-30 15:22:51',30500,5.10,NULL,0.00,0.00,NULL,'COD',NULL),(77,23,21,NULL,50000.00,'Quán đã nhận đơn','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-05-30 15:59:45',38000,6.60,NULL,0.00,0.00,NULL,'COD',NULL),(78,23,1,NULL,6100.00,'Quán đã nhận đơn','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-05-30 16:00:01',18000,2.60,NULL,100.00,0.00,NULL,'COD',NULL),(79,23,19,NULL,28000.00,'Quán đã nhận đơn','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-05-30 16:09:22',21000,3.20,NULL,3000.00,0.00,NULL,'COD',NULL),(80,26,NULL,NULL,42500.00,'Quán đã nhận đơn','unpaid','17.Ng Tân Lạc, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-05-31 08:28:45',34500,5.90,'Không hành',2500.00,0.00,NULL,'COD',NULL),(81,26,NULL,NULL,42500.00,'Quán đã nhận đơn','unpaid','17.Ng Tân Lạc, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-05-31 08:32:02',39000,6.80,NULL,2500.00,0.00,NULL,'COD',NULL),(82,26,NULL,NULL,42500.00,'Quán đã nhận đơn','unpaid','17.Ng Tân Lạc, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-05-31 08:34:13',33500,5.70,NULL,2500.00,0.00,NULL,'COD',NULL),(83,27,NULL,NULL,42500.00,'Quán đã nhận đơn','unpaid','12 Bạch Mai, Phường Hàng Mã, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 08:47:25',21000,3.20,NULL,2500.00,0.00,NULL,'COD',NULL),(84,27,NULL,NULL,42500.00,'Quán đã nhận đơn','unpaid','12 Bạch Mai, Phường Hàng Mã, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 08:49:30',39000,6.80,NULL,2500.00,0.00,NULL,'COD',NULL),(85,27,NULL,NULL,42500.00,'Quán đã nhận đơn','unpaid','12 Bạch Mai, Phường Hàng Mã, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 08:50:51',15000,2.00,NULL,2500.00,0.00,NULL,'COD',NULL),(86,27,NULL,NULL,42500.00,'Quán đã nhận đơn','unpaid','12 Bạch Mai, Phường Hàng Mã, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 08:52:39',18000,2.60,NULL,2500.00,0.00,NULL,'COD',NULL),(87,27,NULL,NULL,42500.00,'Quán đã nhận đơn','unpaid','12 Bạch Mai, Phường Hàng Mã, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 08:53:53',41500,7.30,NULL,2500.00,0.00,NULL,'COD',NULL),(88,27,NULL,NULL,42500.00,'Quán đã nhận đơn','unpaid','12 Bạch Mai, Phường Hàng Mã, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 08:54:07',41000,7.20,NULL,2500.00,0.00,NULL,'COD',NULL),(89,27,NULL,NULL,42500.00,'Quán đã nhận đơn','unpaid','12 Bạch Mai, Phường Hàng Mã, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 08:56:02',30500,5.10,NULL,2500.00,0.00,NULL,'COD',NULL),(90,27,NULL,NULL,42500.00,'Quán đã nhận đơn','unpaid','12 Bạch Mai, Phường Hàng Mã, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 08:57:58',21000,3.20,NULL,2500.00,0.00,NULL,'COD',NULL),(91,27,NULL,NULL,42500.00,'Quán đã nhận đơn','unpaid','12 Bạch Mai, Phường Hàng Mã, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 08:59:20',36500,6.30,NULL,2500.00,0.00,NULL,'COD',NULL),(92,27,NULL,NULL,42500.00,'Quán đã nhận đơn','unpaid','12 Bạch Mai, Phường Hàng Mã, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 09:05:34',38000,6.60,NULL,2500.00,0.00,NULL,'COD',NULL),(93,27,NULL,NULL,42500.00,'Quán đã nhận đơn','unpaid','12 Bạch Mai, Phường Hàng Mã, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 09:07:15',30000,5.00,NULL,2500.00,0.00,NULL,'COD',NULL),(94,27,NULL,NULL,42500.00,'Đang giao hàng','unpaid','12 Bạch Mai, Phường Hàng Mã, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 09:12:45',26000,4.20,NULL,2500.00,0.00,NULL,'COD',NULL),(95,25,NULL,NULL,42500.00,'Đang giao hàng','unpaid','919191d, Phường Hàng Buồm, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 12:07:26',36500,6.30,NULL,2500.00,0.00,NULL,'COD',NULL),(96,25,NULL,NULL,42500.00,'Quán đã nhận đơn','unpaid','919191d, Phường Hàng Buồm, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 12:08:53',24500,3.90,NULL,2500.00,0.00,NULL,'COD',NULL),(97,25,NULL,NULL,42500.00,'Đang giao hàng','unpaid','919191d, Phường Hàng Buồm, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 12:12:30',22000,3.40,NULL,2500.00,0.00,NULL,'COD',NULL),(98,25,NULL,NULL,42500.00,'completed','unpaid','919191d, Phường Hàng Buồm, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 12:15:06',41000,7.20,NULL,2500.00,0.00,NULL,'COD',NULL),(99,25,NULL,NULL,42500.00,'completed','unpaid','919191d, Phường Hàng Buồm, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 12:21:37',42500,7.50,NULL,2500.00,0.00,NULL,'COD',NULL),(100,25,NULL,NULL,42500.00,'completed','unpaid','919191d, Phường Hàng Buồm, Quận Hoàn Kiếm, Thành phố Hà Nội',NULL,'2026-05-31 12:24:04',23000,3.60,NULL,2500.00,0.00,NULL,'COD',NULL),(102,26,NULL,NULL,1338730.00,'Quán đã nhận đơn','unpaid','55 Đường Giải Phóng, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-05-31 13:10:09',39500,6.90,NULL,0.00,0.00,NULL,'COD',NULL),(103,25,NULL,NULL,37066.00,'Quán đã nhận đơn','unpaid','Ngách 94 Ngõ Tự Do, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-05-31 14:04:06',37000,6.40,NULL,2006.00,0.00,NULL,'COD',NULL),(104,25,NULL,NULL,37066.00,'Quán đã nhận đơn','unpaid','Ngách 94 Ngõ Tự Do, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-05-31 14:08:29',15000,2.00,NULL,2006.00,0.00,NULL,'COD',NULL),(105,25,NULL,NULL,37066.00,'Quán đã nhận đơn','unpaid','Ngách 94 Ngõ Tự Do, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-05-31 14:10:01',22500,3.50,NULL,2006.00,0.00,NULL,'COD',NULL),(106,25,NULL,24,37066.00,'completed','unpaid','Ngách 94 Ngõ Tự Do, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-05-31 14:15:45',40500,7.10,NULL,2006.00,0.00,NULL,'COD',NULL),(107,25,37,24,39444.20,'completed','unpaid','Ngõ 76 Phố Hồng Mai, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-05-31 14:22:53',15000,1.90,NULL,2222.20,0.00,NULL,'COD',NULL),(108,25,37,24,39444.20,'completed','unpaid','Ngõ 76 Phố Hồng Mai, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-05-31 14:23:36',15000,1.90,NULL,2222.20,0.00,NULL,'COD',NULL),(109,25,37,24,39444.20,'Quán đã nhận đơn','unpaid','Ngõ 76 Phố Hồng Mai, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-05-31 14:27:47',15000,1.90,NULL,2222.20,0.00,NULL,'COD',NULL),(110,25,37,NULL,39444.20,'Quán đã nhận đơn','unpaid','Ngõ 76 Phố Hồng Mai, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-06-01 01:33:09',15000,1.90,NULL,2222.20,0.00,NULL,'COD',NULL),(111,25,37,NULL,43444.20,'pending','unpaid','Đường Vành đai 2, Phường Tương Mai, Quận Hoàng Mai, Thành phố Hà Nội',NULL,'2026-06-01 01:39:40',19000,2.00,NULL,2222.20,0.00,NULL,'COD',NULL),(112,25,37,NULL,43444.20,'Quán đã nhận đơn','unpaid','Đường Vành đai 2, Phường Tương Mai, Quận Hoàng Mai, Thành phố Hà Nội',NULL,'2026-06-01 01:40:37',19000,2.00,NULL,2222.20,0.00,NULL,'COD',NULL),(113,25,37,24,43444.20,'completed','unpaid','Đường Vành đai 2, Phường Tương Mai, Quận Hoàng Mai, Thành phố Hà Nội',NULL,'2026-06-01 01:51:04',19000,2.00,NULL,2222.20,0.00,NULL,'COD',NULL),(114,25,37,24,43444.20,'completed','unpaid','Đường Vành đai 2, Phường Tương Mai, Quận Hoàng Mai, Thành phố Hà Nội',NULL,'2026-06-01 02:05:12',19000,2.00,NULL,2222.20,0.00,NULL,'COD',NULL),(115,23,21,NULL,50000.00,'Quán đã nhận đơn','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-06-01 05:02:11',31000,5.00,'ít cay',0.00,0.00,NULL,'COD',NULL),(116,23,21,NULL,40000.00,'Quán đã nhận đơn','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-06-01 05:06:44',25800,3.70,'k hành',0.00,0.00,NULL,'COD',NULL),(117,23,21,25,40000.00,'completed','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-06-01 05:07:58',29000,4.50,NULL,0.00,0.00,'http://192.168.1.31:3000/uploads/1780290565775-757924684.jpg','COD',NULL),(118,23,21,NULL,60000.00,'Đơn đã bị hủy','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-06-01 05:41:15',15000,NULL,'giao cổng sau',0.00,0.00,NULL,'COD',NULL),(119,23,21,NULL,40000.00,'Quán đã nhận đơn','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',1,'2026-06-01 06:01:47',34200,5.80,'ko hành\n',0.00,0.00,NULL,'COD',NULL),(120,23,21,NULL,40000.00,'Quán đã nhận đơn','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',1,'2026-06-01 06:31:18',37400,6.60,'ít cay',0.00,0.00,NULL,'pocket',NULL),(121,23,21,25,40000.00,'completed','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',1,'2026-06-01 06:32:03',25800,3.70,'ít cay',0.00,0.00,'http://192.168.1.31:3000/uploads/1780295729822-399059829.jpg','COD',NULL),(122,23,21,NULL,40000.00,'Quán đã nhận đơn','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',1,'2026-06-01 07:21:13',38600,6.90,'k hành',0.00,0.00,NULL,'BankTransfer',NULL),(123,23,21,NULL,40000.00,'cancelled','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',1,'2026-06-01 07:23:20',38600,6.90,'k hành',0.00,0.00,NULL,'COD',NULL),(124,23,21,25,20000.00,'completed','paid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',1,'2026-06-01 07:33:44',39000,7.00,'k hành',0.00,0.00,'http://192.168.1.31:3000/uploads/1780299342475-316940755.jpg','BankTransfer',1),(125,23,21,NULL,20000.00,'cancelled','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',1,'2026-06-01 07:35:53',39000,7.00,'k hành',0.00,0.00,NULL,'COD',NULL),(126,23,21,NULL,40000.00,'pending','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-06-01 08:04:09',15000,NULL,'k hành',0.00,0.00,NULL,'vnpay',1),(127,23,21,NULL,40000.00,'pending','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-06-01 08:04:22',15000,NULL,'k hành',0.00,0.00,NULL,'vnpay',1),(128,23,21,NULL,40000.00,'pending','paid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-06-01 08:07:26',15000,NULL,'k hành',0.00,0.00,NULL,'BankTransfer',1),(129,23,21,NULL,40000.00,'cancelled','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-06-01 08:23:03',15000,NULL,'k hành',0.00,0.00,NULL,'COD',NULL),(130,23,21,NULL,40000.00,'pending','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-06-01 08:25:59',15000,NULL,'k hành',0.00,0.00,NULL,'vnpay',1),(131,23,21,NULL,40000.00,'pending','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-06-01 08:37:16',15000,NULL,'kco j',0.00,0.00,NULL,'vnpay',1),(132,23,21,NULL,40000.00,'cancelled','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-06-01 08:52:31',15000,NULL,NULL,0.00,0.00,NULL,'vnpay',1),(133,23,21,NULL,40000.00,'pending','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-06-01 09:11:05',15000,NULL,'ô',0.00,0.00,NULL,'vnpay',1),(134,23,21,NULL,40000.00,'Quán đã nhận đơn','unpaid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-06-01 09:25:16',29000,4.50,NULL,0.00,0.00,NULL,'vnpay',1),(135,23,21,25,40000.00,'completed','paid','2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',NULL,'2026-06-01 09:27:12',20600,2.40,NULL,0.00,0.00,'http://192.168.1.31:3000/uploads/1780306094575-574393685.jpg','vnpay',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,128,'BankTransfer','completed','2026-06-01 08:07:46');
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
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (38,19,'Cơm',4,'http://192.168.1.6:3000/uploads/1780059533399-335069949.jpeg',30000.00,'',1,'2026-05-29 12:58:56'),(39,1,'cơm chiên',4,'',36000.00,'ngon',1,'2026-05-30 15:30:59'),(41,1,'cơm cháy',4,'',1000.00,'húp',1,'2026-05-30 15:55:43'),(42,21,'gà rán',1,'http://outbreak-lethargy-pucker.ngrok-free.dev/uploads/1780156508271-769919453.jpg',45000.00,'gà rán thơm ngon',1,'2026-05-30 15:57:39'),(46,37,'8888888',9,'',22222.00,'',1,'2026-05-31 14:22:40');
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
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `reviews_chk_1` CHECK (`rating` >= 1 and `rating` <= 5)
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipper_wallets`
--

/*!40000 ALTER TABLE `shipper_wallets` DISABLE KEYS */;
INSERT INTO `shipper_wallets` VALUES (1,25,47680.00,'2026-06-01 09:28:14');
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
  `status` enum('pending','idle','delivering','offline','blocked') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `rating` float DEFAULT 0,
  `rating_count` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `shippers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shippers`
--

/*!40000 ALTER TABLE `shippers` DISABLE KEYS */;
INSERT INTO `shippers` VALUES (1,1,'1234658','Wave, 29siwiie','offline','2026-05-24 15:03:19','2026-05-28 07:43:05',NULL,NULL,0,0),(6,9,'3','6','idle','2026-05-25 17:30:33','2026-05-25 17:31:29',NULL,NULL,0,0),(7,12,'123456','wave ghẻ','idle','2026-05-26 02:49:14','2026-05-26 02:49:14',NULL,NULL,0,0),(16,13,'1234658','Wave, 29siwiie','offline','2026-05-27 09:05:16','2026-05-28 07:35:01',NULL,NULL,0,0),(17,14,'222','T, 6','offline','2026-05-28 10:13:24','2026-05-28 10:13:29',NULL,NULL,0,0),(18,21,'0999399393','Wave, 29H1-123.45','offline','2026-05-29 13:04:55','2026-05-29 13:04:58',NULL,NULL,0,0),(24,26,'38383046','Wave, 1288384','idle','2026-05-31 14:05:27','2026-06-01 02:32:05',20.9978355,105.8472118,0,0),(25,23,'0123456789','abc, 35x1 - 123.67','offline','2026-06-01 05:03:53','2026-06-01 09:29:35',20.993476900614002,105.84737785458314,4,2);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_vouchers`
--

/*!40000 ALTER TABLE `store_vouchers` DISABLE KEYS */;
INSERT INTO `store_vouchers` VALUES (1,21,'EMHAI','fixed',20000.00,1000.00,0.00,1000,10,NULL,'2026-12-31 00:00:00','active','2026-06-01 07:08:20','2026-06-01 09:27:12');
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
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `balance` decimal(15,2) DEFAULT 0.00,
  `rating` float DEFAULT 0,
  `rating_count` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_stores_owner` (`owner_id`),
  CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (1,'co ba','35 dai la',2,NULL,NULL,'pending',0,'2026-05-21 08:25:22','2026-05-25 12:05:00',NULL,NULL,0.00,0,0),(2,'Ko ok','123 phá đại lô',1,'123465679',NULL,'active',1,'2026-05-25 15:31:12','2026-05-26 01:09:24',NULL,NULL,0.00,0,0),(3,'Mì tôm húp','57 phỏng dé',4,NULL,NULL,'active',1,'2026-05-25 15:48:13','2026-05-25 15:48:13',NULL,NULL,0.00,0,0),(4,'Quán Này Ngon','12 Phố đại la',6,NULL,NULL,'active',1,'2026-05-25 16:07:18','2026-05-25 16:07:18',NULL,NULL,0.00,0,0),(5,'Quán Này Không Ngon','12 giải phóng',7,NULL,NULL,'active',1,'2026-05-25 16:18:40','2026-05-25 16:18:40',NULL,NULL,0.00,0,0),(6,'Quán Này ko ngon','12 giải phóng',8,NULL,NULL,'active',1,'2026-05-25 16:40:16','2026-05-25 16:40:16',NULL,NULL,0.00,0,0),(7,'Ok','123 dai laa',9,'123465679',NULL,'active',1,'2026-05-25 17:09:18','2026-05-25 17:10:03',NULL,NULL,0.00,0,0),(17,'1234','12345',11,NULL,NULL,'active',1,'2026-05-26 02:49:28','2026-05-26 02:49:33',NULL,NULL,0.00,0,0),(18,'Quán Này tạm','55 phải gióng',14,NULL,NULL,'active',1,'2026-05-27 09:34:26','2026-05-27 09:34:30',NULL,NULL,0.00,0,0),(19,'Ok','Okk',13,NULL,NULL,'active',1,'2026-05-28 07:51:11','2026-05-28 07:51:17',NULL,NULL,0.00,0,0),(21,'em hai','55 giải phóng',23,NULL,NULL,'active',1,'2026-05-30 15:51:57','2026-06-01 09:29:35',21.0032382,105.8432675,40000.00,3.5,2),(36,'Cửa hàng mới','Chưa cập nhật địa chỉ',26,NULL,NULL,'active',1,'2026-05-31 13:35:51','2026-05-31 13:35:51',NULL,NULL,0.00,0,0),(37,'Cơm gà Lương Sơn','55 Đường Giải Phóng, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',25,'131338679',NULL,'active',1,'2026-05-31 14:20:29','2026-05-31 14:22:15',21.003219732221087,105.8428699589606,0.00,0,0);
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
  `title` varchar(255) DEFAULT 'Địa chỉ',
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
INSERT INTO `user_address` VALUES (1,13,'55555 phỏng dé',0,'Địa chỉ',NULL,NULL),(2,10,'55 giải phóng ',0,'Địa chỉ',NULL,NULL),(3,14,'Ok',0,'Địa chỉ',NULL,NULL),(4,13,'Đình làng khê khẩu, Xã Kim Bình, Thành phố Phủ Lý, Tỉnh Hà Nam',1,'Địa chỉ',NULL,NULL),(5,22,'1696, Phường Dịch Vọng, Quận Cầu Giấy, Thành phố Hà Nội',0,'Địa chỉ',NULL,NULL),(6,23,'2/5 đại la, Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội',1,'Địa chỉ',NULL,NULL),(7,26,'17.Ng Tân Lạc, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',0,'Địa chỉ',NULL,NULL),(8,27,'12 Bạch Mai, Phường Hàng Mã, Quận Hoàn Kiếm, Thành phố Hà Nội',1,' Nhà riêng',NULL,NULL),(9,25,'919191d, Phường Hàng Buồm, Quận Hoàn Kiếm, Thành phố Hà Nội',0,'Địa chỉ',NULL,NULL),(10,26,'55 Đường Giải Phóng, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',0,'Trường học',NULL,NULL),(11,26,'55 Đường Giải Phóng, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',1,'Địa chỉ',NULL,NULL),(12,25,'Ngách 94 Ngõ Tự Do, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',0,'Địa chỉ',NULL,NULL),(13,25,'Ngõ 76 Phố Hồng Mai, Phường Bạch Mai, Quận Hai Bà Trưng, Thành phố Hà Nội',0,'Địa chỉ',20.997945853183978,105.85182610867868),(14,25,'Đường Vành đai 2, Phường Tương Mai, Quận Hoàng Mai, Thành phố Hà Nội',1,'Địa chỉ',20.995403196970056,105.85486508169822);
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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin',NULL,'123465679','admin@example.com','$2b$10$p59/0EXdt47ETFDSOYZAV.f/1PUI7tvtYSvc1Sp3CdZBHG51.cKGq','admin',1,1,'active',0,'2026-05-21 08:25:22'),(2,'hoai',NULL,'0123456789','hoai@gmail.com','$2b$10$C0a8FGROkaxC8VETzOaIhuqfNE9RaDMUv/ll0CpiOsGHHJHC4qq9y','user',1,1,'active',0,'2026-05-21 08:26:13'),(3,'TanDuck',NULL,'0986753421','ducky05@gmail.com','$2b$10$qm./n2asr1Gm69t65X90E.RH4a0.1bXYClxCzWXXUU5XBz93JlasO','user',0,0,'active',0,'2026-05-25 15:11:29'),(4,'Tanduckk',NULL,'0111222333','Duck1234@gmail.com','$2b$10$8Fy5O03.LxLF/FkLMUh42uY908W99v8o2K.M1jGG6dWVuv2jQ2zNy','user',1,0,'active',0,'2026-05-25 15:26:38'),(5,'Tày',NULL,'0999666333','abc098@gmail.com','$2b$10$WClopTcpAP8shYcIcIrpuetyOjhgI3HeXhNEZO84GjF.A2m2qv9Wm','user',0,0,'active',0,'2026-05-25 15:29:19'),(6,'Deo',NULL,'0909090909','deo12@gmail.com','$2b$10$6fgVLY4oHzm6Z8n.iHBFU.LyoSzjWXPGajGoUoEVYtrWqsJYjQ.mi','user',1,0,'active',0,'2026-05-25 16:06:42'),(7,'deo123',NULL,'13313113','deo123@gmail.com','$2b$10$3NSv555gJPQVywHYW36xpePz/5YRhyEu6yqahzxWMK/RSPdsq8QVK','user',1,0,'active',0,'2026-05-25 16:18:02'),(8,'Dcm',NULL,'123466999','dcm1@gmail.com','$2b$10$cXbRZRF3Z/9P4AfhyxFCPuidqeHjc44dANsdkIfnV/kazsFQW97eS','user',1,0,'active',0,'2026-05-25 16:39:43'),(9,'Dcm2',NULL,'123465679','dcm2@gmail.com','$2b$10$NRRNjhQw1t.UM2DUkeIG9O5WkEDaqTciUD2VclsUSYiwro1uwMOs.','user',1,1,'active',0,'2026-05-25 17:08:50'),(10,'Duckkkk',NULL,'097676767','test1@gmail.com','$2b$10$Bwk1J1/pk8wKjO34z2AgcuO6md/ItyOZJFsnyimhIZehN9Fco8JSG','user',1,0,'active',0,'2026-05-26 00:43:08'),(11,'0 biết',NULL,'1234666999','test2@gmail.com','$2b$10$fwaVAEbjcuO4ZG0ltFjrqe6mzP1CnFpBcas5C7iKLeliVj6LKrgiK','user',1,0,'active',0,'2026-05-26 00:52:18'),(12,'okkkk',NULL,'123464976','test3@gmail.com','$2b$10$H8mTHGAlQkqXLaOyVo8u4OggjIAp7rhu8Ws60bXK/Xs3vTplVWEkG','user',0,1,'active',0,'2026-05-26 02:48:34'),(13,'Tân Việt',NULL,'234567','test4@gmail.com','$2b$10$Z5GQeB18yLyHM6Urj0/YVOAHaOK5FyWjU0PGoPvuZki5KsCuQU5qW','user',1,1,'active',0,'2026-05-27 07:17:51'),(14,'Dau1',NULL,'0976431629','test5@gmail.com','$2b$10$XoPLzWN.iP0qUaVFOQ.mPe2v3ecB0204qLv9ZR80NQO3tpvO6VJzG','user',1,1,'active',0,'2026-05-27 09:33:57'),(15,'Okla',NULL,'12464646','test6@gmail.com','$2b$10$/9ZN/abbQDo0XHDu1zMIJO0JQ0ZPJaEqnhFc/ZawL/CWZN3uivJOa','user',0,0,'active',0,'2026-05-28 09:01:37'),(16,'Oklo',NULL,'1234567890','test7@gmail.com','$2b$10$oDV.KmJsnoL1LLPDrfvclOdGj7u5mtz/0sBQrs4404bMviwv66mXm','user',0,0,'active',0,'2026-05-28 09:03:49'),(17,'Oklo',NULL,'1234567890','test8@gmail.com','$2b$10$xyEGepU/sn59/4g1HjkWQOwMUzytXr5lAbpjO7P8MHBBZUMIUE7Rq','user',0,0,'active',0,'2026-05-28 09:05:32'),(18,'Khong ok',NULL,'0987123987','test10@gmail.com','$2b$10$pMriLMxiZ.XkPurJgHIZ1u77nJ/6C09aXM9UUjD4V.oapWNHHCXAy','user',0,0,'active',0,'2026-05-29 12:47:05'),(19,'Adu',NULL,'131313131','test9@gmail.com','$2b$10$JHIahKqIsWmkkEpVrXe1Eu/B2hbj.cCVt/VYIWwjWmIUBeDtuGJAS','user',0,0,'active',0,'2026-05-29 12:48:48'),(20,'Khong ok',NULL,'0987123987','test11@gmail.com','$2b$10$E5yPSZ7B79YniItZJMUItOtwHZa3FYFwdouDnfyzEppqO3s79i0km','user',0,0,'active',0,'2026-05-29 12:49:18'),(21,'Tan Viet',NULL,'098282183','test12@gmail.com','$2b$10$RO1OWj2Dzr8lMvALOf4EOOhT/XQcXYS6wv4yorjFGMMYkDD6oOwqe','user',0,1,'active',0,'2026-05-29 13:01:24'),(22,'Tminz',NULL,'0346411601','Tminz21e@gmail.com','$2b$10$OXVEgtz1LBR/MTwFXj3j6.SpYe1oOfJqmDgY1YE.hD5VUcS/rjxvO','user',0,0,'active',0,'2026-05-30 15:19:03'),(23,'nvc',NULL,'02345678910','nvc@gmail.com','$2b$10$i7mY56C42SUdo/PjLjTliu4XzvH2WMmtBm2LXdD9L7RtDSUJcFjd6','user',1,1,'active',0,'2026-05-30 15:40:46'),(24,'testbug',NULL,'1234567890','testbug@gmail.com','$2b$10$Q0LVYxIGI3A9jS1AvzDXPe.5Sc.yYlvYWg.uarq6ZnxzcTG8BM6O.','user',0,0,'active',0,'2026-05-31 06:47:17'),(25,'Test sốp',NULL,'123456','testshop@gmail.com','$2b$10$UX0stogyH26PpJDxpC9Nwul6palowYKCR4l/0478a4GBXzKvoUq6m','user',1,0,'active',0,'2026-05-31 08:06:56'),(26,'Test ship',NULL,'123456798','testship@gmail.com','$2b$10$PTWUWuHonEWe2aAREd9kZO5BKIM6g9IhdXEMExu1Gb42Hjt4LPoLu','user',0,1,'active',0,'2026-05-31 08:07:23'),(27,' testuser',NULL,'0999399193','testuser@gmail.com','$2b$10$ZbiE3rTNouAacyYxjegUu.6xVrp/Cq50yYqWeZSEk4xveolqU0FoS','user',0,0,'active',0,'2026-05-31 08:38:58');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voucher_usages`
--

/*!40000 ALTER TABLE `voucher_usages` DISABLE KEYS */;
INSERT INTO `voucher_usages` VALUES (1,23,1,'2026-06-01 06:01:47'),(2,23,1,'2026-06-01 06:31:18'),(3,23,1,'2026-06-01 06:32:03'),(4,23,1,'2026-06-01 07:21:13'),(5,23,1,'2026-06-01 07:23:20'),(6,23,1,'2026-06-01 07:33:44'),(7,23,1,'2026-06-01 07:35:53');
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
INSERT INTO `vouchers` VALUES (1,'WELCOME10',0,20000.00,1000.00,1000,7,'0000-00-00 00:00:00',1,'2026-05-21 08:25:22'),(2,'FOODIE20',20,0.00,200000.00,50,0,'2025-12-31 23:59:59',1,'2026-05-21 08:25:22'),(3,'SAVE50K',0,50000.00,300000.00,30,0,'2025-12-31 23:59:59',1,'2026-05-21 08:25:22'),(4,'FREESHIP',0,30000.00,150000.00,200,0,'2025-12-31 23:59:59',1,'2026-05-21 08:25:22');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallet_transactions`
--

/*!40000 ALTER TABLE `wallet_transactions` DISABLE KEYS */;
INSERT INTO `wallet_transactions` VALUES (1,25,31200.00,'order_revenue','Thu nhập giao đơn #124','2026-06-01 07:35:42'),(2,25,16480.00,'order_revenue','Thu nhập giao đơn #135','2026-06-01 09:28:14');
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

-- Dump completed on 2026-06-01 17:29:53
