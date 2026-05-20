-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2026 at 03:45 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `food_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`) VALUES
(1, 1, '2026-05-04 00:52:00'),
(2, 4, '2026-05-11 10:24:16'),
(3, 8, '2026-05-17 14:34:59');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1 CHECK (`quantity` > 0),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES
(1, 'Snacks', '2026-05-04 00:17:22'),
(2, 'Fast Food', '2026-05-04 00:17:22'),
(3, 'Drinks', '2026-05-04 00:17:22');

-- --------------------------------------------------------

--
-- Table structure for table `favorite`
--

CREATE TABLE `favorite` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `related_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `shipper_id` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','delivering','completed','cancelled') DEFAULT 'pending',
  `payment_status` enum('unpaid','paid') DEFAULT 'unpaid',
  `address` text DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `voucher_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `store_id`, `shipper_id`, `total_price`, `status`, `payment_status`, `address`, `latitude`, `longitude`, `voucher_id`, `created_at`) VALUES
(1, 4, NULL, 2, 80000.00, 'completed', 'paid', 'Ký túc xá Đại học Xây Dựng, Hà Nội', NULL, NULL, NULL, '2026-05-11 10:45:43'),
(2, 8, NULL, NULL, 20000.00, 'pending', 'unpaid', '1/2 đại la', NULL, NULL, NULL, '2026-05-17 14:37:34'),
(3, 8, NULL, NULL, 20000.00, 'pending', 'unpaid', '1/2', NULL, NULL, NULL, '2026-05-18 10:16:28'),
(4, 8, NULL, NULL, 20000.00, 'pending', 'unpaid', '1/2', NULL, NULL, NULL, '2026-05-18 10:24:05'),
(5, 8, NULL, NULL, 20000.00, 'delivering', 'unpaid', '1/2', NULL, NULL, NULL, '2026-05-18 10:24:20'),
(6, 8, NULL, NULL, 20000.00, 'completed', 'unpaid', '1-2', NULL, NULL, NULL, '2026-05-18 10:47:17'),
(7, 8, NULL, NULL, 20000.00, 'completed', 'paid', '1/2', NULL, NULL, NULL, '2026-05-18 11:34:08'),
(8, 8, NULL, NULL, 20000.00, 'completed', 'paid', '1-2', NULL, NULL, NULL, '2026-05-18 13:36:15'),
(9, 8, NULL, NULL, 45000.00, 'completed', 'paid', '2/3', NULL, NULL, NULL, '2026-05-18 13:51:51'),
(10, 8, NULL, NULL, 25000.00, 'cancelled', 'unpaid', '3/5', NULL, NULL, NULL, '2026-05-18 13:53:30'),
(11, 8, NULL, NULL, 25000.00, 'pending', 'unpaid', '3/5', NULL, NULL, NULL, '2026-05-18 13:53:57'),
(12, 8, NULL, NULL, 20000.00, 'pending', 'unpaid', '1/2', NULL, NULL, NULL, '2026-05-18 15:47:21'),
(13, 8, NULL, NULL, 15000.00, 'pending', 'unpaid', '1/2', NULL, NULL, NULL, '2026-05-18 16:04:28'),
(14, 8, NULL, NULL, 40000.00, 'cancelled', 'unpaid', '1/2', NULL, NULL, NULL, '2026-05-18 16:21:35'),
(15, 8, NULL, NULL, 55000.00, 'pending', 'unpaid', '1/2', NULL, NULL, NULL, '2026-05-18 16:24:27'),
(16, 8, NULL, NULL, 30000.00, 'pending', 'unpaid', '33', NULL, NULL, NULL, '2026-05-19 01:15:06'),
(17, 1, NULL, NULL, 25000.00, 'cancelled', 'unpaid', '3-2', NULL, NULL, NULL, '2026-05-19 02:18:29'),
(18, 1, NULL, NULL, 30000.00, 'pending', 'unpaid', 'nnnd', NULL, NULL, NULL, '2026-05-19 02:21:33'),
(19, 8, NULL, NULL, 35000.00, 'pending', 'unpaid', '33', NULL, NULL, NULL, '2026-05-19 02:24:38'),
(21, 1, 1, NULL, 95000.00, 'pending', 'unpaid', 'Sảnh H3, Đại học Xây Dựng HUCE', NULL, NULL, NULL, '2026-05-19 02:30:33'),
(22, 8, NULL, NULL, 45000.00, 'pending', 'unpaid', 'ndhf', NULL, NULL, NULL, '2026-05-19 02:36:03'),
(23, 1, NULL, NULL, 15000.00, 'pending', 'unpaid', '55', NULL, NULL, NULL, '2026-05-19 03:28:24'),
(24, 8, NULL, NULL, 25000.00, 'pending', 'unpaid', 'ndndnd', NULL, NULL, NULL, '2026-05-19 03:30:08');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 4, 20000.00),
(2, 2, 1, 1, 20000.00),
(3, 3, 1, 1, 20000.00),
(4, 4, 1, 1, 20000.00),
(5, 5, 1, 1, 20000.00),
(6, 6, 1, 1, 20000.00),
(7, 7, 1, 1, 20000.00),
(8, 8, 1, 1, 20000.00),
(9, 9, 12, 1, 45000.00),
(10, 10, 2, 1, 25000.00),
(11, 11, 2, 1, 25000.00),
(12, 12, 2, 1, 25000.00),
(13, 13, 8, 1, 20000.00),
(14, 14, 2, 1, 25000.00),
(15, 15, 6, 1, 40000.00),
(16, 16, 2, 1, 25000.00),
(17, 17, 1, 1, 20000.00),
(18, 18, 2, 1, 25000.00),
(19, 19, 6, 1, 40000.00),
(20, 21, 6, 1, 40000.00),
(21, 21, 14, 1, 55000.00),
(22, 22, 6, 1, 40000.00),
(23, 23, 1, 1, 20000.00),
(24, 24, 1, 1, 20000.00);

-- --------------------------------------------------------

--
-- Table structure for table `order_tracking`
--

CREATE TABLE `order_tracking` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `image_proof` varchar(255) DEFAULT NULL,
  `status` enum('pending','confirmed','delivering','completed','cancelled') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `method` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `paid_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `method`, `status`, `paid_at`) VALUES
(1, 1, 'cash', 'completed', '2026-05-11 15:55:00');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `available` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `store_id`, `name`, `category_id`, `image`, `price`, `description`, `created_at`, `available`) VALUES
(1, 1, 'Khoai lang kén', 1, 'https://cdn.tgdd.vn/Files/2020/08/26/1284970/cach-lam-khoai-lang-ken-202008261116040688.jpg', 20000.00, 'Khoai lang chiên giòn, ngọt nhẹ.', '2026-05-04 00:17:22', 1),
(2, 1, 'Bánh tráng nướng', 1, 'https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/banh-trang-nuong-thumbnail.jpg', 25000.00, 'Bánh tráng nướng giòn, topping đầy đủ.', '2026-05-04 00:17:22', 1),
(3, 1, 'Chả cá viên chiên', 1, 'https://cdn.tgdd.vn/Files/2020/09/21/1295317/cach-lam-ca-vien-chien.jpg', 22000.00, 'Cá viên dai ngon, chiên vàng giòn.', '2026-05-04 00:17:22', 1),
(4, 1, 'Đậu phộng rang muối', 1, 'https://cdn.tgdd.vn/Files/2021/06/23/1363475/cach-rang-dau-phong.jpg', 15000.00, 'Đậu phộng rang giòn, mặn nhẹ.', '2026-05-04 00:17:22', 1),
(5, 1, 'Bắp xào bơ', 1, 'https://cdn.tgdd.vn/2020/07/CookRecipe/Avatar/bap-xao-thumbnail.jpg', 25000.00, 'Bắp xào bơ thơm béo, thêm hành phi.', '2026-05-04 00:17:22', 1),
(6, 1, 'Khô bò miếng', 1, 'https://cdn.tgdd.vn/Files/2021/12/02/1402570/kho-bo-mieng.jpg', 40000.00, 'Khô bò cay nhẹ, dai ngon.', '2026-05-04 00:17:22', 1),
(7, 1, 'Bánh flan', 1, 'https://cdn.tgdd.vn/2021/05/CookProductThumb/banh-flan.jpg', 15000.00, 'Flan mềm mịn, béo ngậy caramel.', '2026-05-04 00:17:22', 1),
(8, 1, 'Rong biển sấy', 1, 'https://cdn.tgdd.vn/Files/2021/07/12/1368428/rong-bien-say.jpg', 20000.00, 'Rong biển giòn tan, vị mặn nhẹ.', '2026-05-04 00:17:22', 1),
(9, 1, 'Cơm chiên dương châu', 2, 'https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/com-chien-duong-chau.jpg', 45000.00, 'Cơm chiên đầy đủ topping, đậm đà.', '2026-05-04 00:17:22', 1),
(10, 1, 'Hủ tiếu Nam Vang', 2, 'https://cdn.tgdd.vn/2021/08/CookRecipe/Avatar/hu-tieu-nam-vang.jpg', 50000.00, 'Hủ tiếu nước trong, topping phong phú.', '2026-05-04 00:17:22', 1),
(11, 1, 'Bánh mì thịt nướng', 2, 'https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/banh-mi-thit-nuong.jpg', 30000.00, 'Bánh mì giòn, thịt nướng thơm lừng.', '2026-05-04 00:17:22', 1),
(12, 1, 'Bún thịt nướng', 2, 'https://cdn.tgdd.vn/2021/07/CookRecipe/Avatar/bun-thit-nuong.jpg', 45000.00, 'Bún tươi ăn kèm thịt nướng và rau.', '2026-05-04 00:17:22', 1),
(13, 1, 'Cơm bò lúc lắc', 2, 'https://cdn.tgdd.vn/2021/10/CookRecipe/Avatar/com-bo-luc-lac.jpg', 65000.00, 'Bò mềm, xào đậm vị, ăn với cơm nóng.', '2026-05-04 00:17:22', 1),
(14, 1, 'Mì cay Hàn Quốc', 2, 'https://cdn.tgdd.vn/2021/07/CookRecipe/Avatar/mi-cay.jpg', 55000.00, 'Mì cay cấp độ, topping đa dạng.', '2026-05-04 00:17:22', 1),
(15, 1, 'Cơm gà nướng', 2, 'https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/com-ga-nuong.jpg', 55000.00, 'Gà nướng thơm, da giòn, cơm nóng.', '2026-05-04 00:17:22', 1),
(16, 1, 'Bún riêu cua', 2, 'https://cdn.tgdd.vn/2021/08/CookRecipe/Avatar/bun-rieu.jpg', 40000.00, 'Bún riêu chua nhẹ, đậm đà.', '2026-05-04 00:17:22', 1),
(17, 1, 'Trà tắc', 3, 'https://cdn.tgdd.vn/2020/07/CookProductThumb/tra-tac.jpg', 15000.00, 'Trà tắc chua ngọt, giải khát.', '2026-05-04 00:17:22', 1),
(18, 1, 'Sữa chua đá', 3, 'https://cdn.tgdd.vn/2021/05/CookProductThumb/sua-chua-da.jpg', 20000.00, 'Sữa chua mát lạnh, tốt cho tiêu hóa.', '2026-05-04 00:17:22', 1),
(19, 1, 'Sinh tố dâu', 3, 'https://cdn.tgdd.vn/2020/07/CookProductThumb/sinh-to-dau.jpg', 30000.00, 'Sinh tố dâu chua ngọt, thơm ngon.', '2026-05-04 00:17:22', 1),
(20, 1, 'Nước ép táo', 3, 'https://cdn.tgdd.vn/2020/07/CookProductThumb/nuoc-ep-tao.jpg', 30000.00, 'Nước ép táo tươi, giàu vitamin.', '2026-05-04 00:17:22', 1),
(21, 1, 'Cacao đá', 3, 'https://cdn.tgdd.vn/2021/05/CookProductThumb/cacao-da.jpg', 30000.00, 'Cacao đá béo, đậm vị socola.', '2026-05-04 00:17:22', 1),
(22, 1, 'Trà vải', 3, 'https://cdn.tgdd.vn/2020/07/CookProductThumb/tra-vai.jpg', 30000.00, 'Trà vải thơm, ngọt nhẹ.', '2026-05-04 00:17:22', 1),
(23, 1, 'Soda chanh', 3, 'https://cdn.tgdd.vn/2020/07/CookProductThumb/soda-chanh.jpg', 25000.00, 'Soda chanh mát lạnh, sảng khoái.', '2026-05-04 00:17:22', 1),
(24, 1, 'Nước ép dứa', 3, 'https://cdn.tgdd.vn/2020/07/CookProductThumb/nuoc-ep-dua.jpg', 30000.00, 'Nước ép dứa chua ngọt tự nhiên.', '2026-05-04 00:17:22', 1);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reward_history`
--

CREATE TABLE `reward_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `points` int(11) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shippers`
--

CREATE TABLE `shippers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `vehicle` varchar(100) DEFAULT NULL,
  `status` enum('idle','delivering','offline') DEFAULT 'idle',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shippers`
--

INSERT INTO `shippers` (`id`, `user_id`, `phone`, `vehicle`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, '0988888888', 'Honda Wave 29A1', 'idle', '2026-05-11 15:59:02', '2026-05-11 15:59:02'),
(2, 6, '0988888888', 'Honda Wave 29A1', 'idle', '2026-05-11 16:06:01', '2026-05-11 16:12:36');

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `owner_id` int(11) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','active','blocked') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_open` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `name`, `address`, `owner_id`, `phone`, `description`, `status`, `created_at`, `updated_at`, `is_open`) VALUES
(1, 'Kênh Cửa Hàng InOrder', 'Hà Nội', 13, NULL, NULL, 'active', '2026-05-04 00:17:22', '2026-05-19 03:48:44', 1);

-- --------------------------------------------------------

--
-- Table structure for table `store_vouchers`
--

CREATE TABLE `store_vouchers` (
  `id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_type` varchar(20) DEFAULT 'percent',
  `discount_value` int(11) DEFAULT 0,
  `min_order_amount` int(11) DEFAULT 0,
  `end_date` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `status` enum('open','processing','resolved') DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_logs`
--

CREATE TABLE `system_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','admin','shipper') DEFAULT 'customer',
  `reward_points` int(11) DEFAULT 0,
  `refresh_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `avatar`, `phone`, `email`, `password`, `role`, `reward_points`, `refresh_token`, `created_at`) VALUES
(1, 'Admin Quán', NULL, NULL, 'admin@foodapp.com', '123456', 'admin', 0, NULL, '2026-05-04 00:17:22'),
(2, 'Hoài', NULL, NULL, 'hoai@gmail.com', '$2b$10$zk28UA9h3fyLTc.qpEdR7eTO57HOcBj9pLWMFUGD5gUCPEf8YYKWm', 'customer', 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzc3ODU1OTA0LCJleHAiOjE3ODA0NDc5MDR9.C-O10d-5RwB4juyiODcZ4nxEztsH19MGT5fx1-lZLa8', '2026-05-04 00:51:35'),
(3, 'việt', NULL, NULL, 'viet@gmail.com', '$2b$10$cuAH9nDqgr0WCH9PFRcCY.1JUdZVd6eZXT9Tzco0VV6J9zY/czJ2G', 'customer', 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc3ODU5OTMxLCJleHAiOjE3ODA0NTE5MzF9.xj3K2MSx0e46tSWPJcSNzXaqqL7HPbczlyJxQ_PCdms', '2026-05-04 01:08:20'),
(4, 'Việt InOrder', NULL, '0987654321', 'viet.inorder@gmail.com', '$2b$10$LI8YmQJfXVjzAftxziWFQeaeqhPznzhQCAB5Rk7P1dvhITzXrXZ86', 'customer', 0, NULL, '2026-05-11 10:05:56'),
(6, 'Anh Shipper', NULL, '0988888888', 'shipper@foodapp.com', '$2b$10$bREEp5HqtnmSQT6WDKTtmuFq1TAprt8Yu/MXFsLOClD2u8LkGXlm.', 'shipper', 0, NULL, '2026-05-11 16:05:03'),
(7, 'Hoài', NULL, '0123456789', 'hoai.inorder@gmail.com', '$2b$10$NhS0YWv.zdQh/sIQ6ytKP.sV1fP0jjhcXX67PRJUYvyZjarsqBcfa', 'customer', 0, NULL, '2026-05-12 03:49:25'),
(8, 'An', NULL, '0345678910', 'an33@gmail.com', '$2b$10$BKeD0tAtzgJVVWO80d165e9/hI7fY1QinBdD8nqflVHorqnjGVjO6', 'customer', 0, NULL, '2026-05-17 13:35:12'),
(9, 'nhan', NULL, '023456959', 'nhan@gmail.com', '$2b$10$KIsXy3xqek41YONgnSewie/MugQt7V3RguH5bZpuILQW0/eZbjvFe', 'customer', 0, NULL, '2026-05-19 03:33:15'),
(10, 'Nguyễn Thị Thu Hoài', NULL, '0987654321', 'hoaimerchant@gmail.com', 'hoai1234', 'customer', 0, NULL, '2026-05-19 03:40:16'),
(13, 'hoài', NULL, '0987654321', 'hoaiowner@gmail.com', '$2b$10$QsrZ/tCOCF7gdyjb9sIhFO7XcCYsNZP.5g5oyed/s4/LhOkfuiPCC', 'customer', 0, NULL, '2026-05-19 03:48:35');

-- --------------------------------------------------------

--
-- Table structure for table `user_address`
--

CREATE TABLE `user_address` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `address` text DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `expired_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `voucher_usages`
--

CREATE TABLE `voucher_usages` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `voucher_id` int(11) DEFAULT NULL,
  `used_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cart_id` (`cart_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `favorite`
--
ALTER TABLE `favorite`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `voucher_id` (`voucher_id`),
  ADD KEY `store_id` (`store_id`),
  ADD KEY `shipper_id` (`shipper_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `order_tracking`
--
ALTER TABLE `order_tracking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `store_id` (`store_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `reward_history`
--
ALTER TABLE `reward_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `shippers`
--
ALTER TABLE `shippers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `owner_id` (`owner_id`);

--
-- Indexes for table `store_vouchers`
--
ALTER TABLE `store_vouchers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `system_logs`
--
ALTER TABLE `system_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_address`
--
ALTER TABLE `user_address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `voucher_usages`
--
ALTER TABLE `voucher_usages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `voucher_id` (`voucher_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `favorite`
--
ALTER TABLE `favorite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `order_tracking`
--
ALTER TABLE `order_tracking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reward_history`
--
ALTER TABLE `reward_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shippers`
--
ALTER TABLE `shippers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `store_vouchers`
--
ALTER TABLE `store_vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_logs`
--
ALTER TABLE `system_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `user_address`
--
ALTER TABLE `user_address`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `voucher_usages`
--
ALTER TABLE `voucher_usages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `favorite`
--
ALTER TABLE `favorite`
  ADD CONSTRAINT `favorite_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorite_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  ADD CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`shipper_id`) REFERENCES `shippers` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `order_tracking`
--
ALTER TABLE `order_tracking`
  ADD CONSTRAINT `order_tracking_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `reward_history`
--
ALTER TABLE `reward_history`
  ADD CONSTRAINT `reward_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `shippers`
--
ALTER TABLE `shippers`
  ADD CONSTRAINT `shippers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stores`
--
ALTER TABLE `stores`
  ADD CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD CONSTRAINT `support_tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `support_tickets_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `user_address`
--
ALTER TABLE `user_address`
  ADD CONSTRAINT `user_address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `voucher_usages`
--
ALTER TABLE `voucher_usages`
  ADD CONSTRAINT `voucher_usages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `voucher_usages_ibfk_2` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
