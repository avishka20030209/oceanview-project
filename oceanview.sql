-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 06, 2026 at 10:59 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `oceanview`
--

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `guest_name` varchar(100) NOT NULL,
  `guest_email` varchar(255) DEFAULT NULL,
  `room_id` int(11) NOT NULL,
  `room_name` varchar(100) DEFAULT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `status` varchar(30) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `paid` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `guest_name`, `guest_email`, `room_id`, `room_name`, `check_in`, `check_out`, `status`, `amount`, `paid`) VALUES
(1, 1, 'W.W.R de Silva', NULL, 1, 'Deluxe Room', '2026-01-28', '2026-01-29', 'CHECKED_OUT', 130000, 1),
(3, 1, 'W.W.R de Silva', NULL, 2, 'King Ocean', '2026-01-15', '2026-01-30', 'PENDING', 3000000, 1),
(4, 1, 'W.W.R de Silva', NULL, 1, 'Deluxe Room', '2026-02-07', '2026-02-14', 'Booked', 910000, 1),
(5, 1, 'W.W.R de Silva', NULL, 1, 'Deluxe Room', '2026-03-04', '2026-03-05', 'Booked', 130000, 0),
(6, 2, 'Admin', NULL, 1, 'Deluxe Room', '2026-04-16', '2026-04-16', 'PENDING', 120000, 0),
(7, 1, 'W.W.R de Silva', NULL, 1, 'Deluxe Room', '2026-04-09', '2026-04-11', 'CHECKED_OUT', 260000, 1),
(12, 3, 'staff', NULL, 1, 'Deluxe Room', '2025-12-30', '2026-01-01', 'CHECKED_OUT', 260000, 1),
(14, 3, 'staff', NULL, 1, 'Deluxe Room', '2026-06-18', '2026-06-20', 'CONFIRMED', 260000, 0),
(15, 1, 'W.W.R de Silva', NULL, 1, 'Deluxe Room', '2025-11-14', '2025-11-20', 'CONFIRMED', 1012440, 0),
(20, 3, 'staff', NULL, 1, 'Deluxe Room', '2025-11-06', '2025-11-08', 'CONFIRMED', 260000, 0),
(21, 3, 'staff', NULL, 1, 'Deluxe Room', '2025-09-04', '2025-09-05', 'CONFIRMED', 162500, 0),
(25, 1, 'W.W.R de Silva', NULL, 4, 'Test Room 02', '2026-01-22', '2026-02-05', 'CONFIRMED', 545160, 0),
(26, 3, 'staff', NULL, 4, 'Test Room 02', '2026-01-01', '2026-01-02', 'CONFIRMED', 37500, 0),
(28, 1, 'W.W.R de Silva', NULL, 4, 'Test Room 02', '2025-11-22', '2025-11-30', 'CONFIRMED', 311520, 0),
(30, 1, 'W.W.R de Silva', NULL, 4, 'Test Room 02', '2026-01-16', '2026-01-17', 'CONFIRMED', 38940, 1),
(31, 1, 'W.W.R de Silva', NULL, 1, 'Deluxe Room', '2026-02-18', '2026-02-19', 'CONFIRMED', 168740, 0),
(32, 1, 'W.W.R de Silva', NULL, 1, 'Deluxe Room', '2026-02-27', '2026-02-28', 'CONFIRMED', 168740, 0),
(33, 1, 'W.W.R de Silva', 'rehandesilva373@gmail.com', 4, 'Test Room 02', '2026-02-12', '2026-02-20', 'CONFIRMED', 311520, 1),
(34, 3, 'staff', 'staff@oceanview.com', 3, 'test Room', '2026-02-05', '2026-02-13', 'CONFIRMED', 1500000, 0),
(35, 1, 'Guest', 'rehandesilva373@gmail.com', 4, 'Test Room 02', '2026-02-08', '2026-02-09', 'CONFIRMED', 38940, 0),
(36, 1, 'W.W.R de Silva', 'rehandesilva373@gmail.com', 4, 'Test Room 02', '2026-02-06', '2026-02-07', 'CHECKED_IN', 38940, 0),
(37, 3, 'Avishka Lakshan ', 'avishka@ocean.com', 3, 'test Room', '2026-02-20', '2026-02-21', 'CHECKED_IN', 187500, 1),
(38, 3, 'Wijayamuni Wishwa Rehan de Silva', 'rehandesilva373@gmail.com', 3, 'test Room', '2026-02-21', '2026-02-21', 'CONFIRMED', 0, 0),
(39, 1, 'W.W.R de Silva', 'rehandesilva373@gmail.com', 2, 'King Ocean', '2026-03-18', '2026-03-20', 'CONFIRMED', 519200, 0);

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` double DEFAULT NULL,
  `available` tinyint(1) DEFAULT 1,
  `max_guests` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `amenities` text DEFAULT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'Standard'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `name`, `price`, `available`, `max_guests`, `image_url`, `description`, `amenities`, `type`) VALUES
(1, 'Deluxe Room', 130000, 1, 10, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'test descripton updated', 'Wifi,Car Parking,Hotn Water', 'Deluxe'),
(2, 'King Ocean', 200000, 1, 2, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'test des 02', 'Wifi, Hot water', 'Standard'),
(3, 'test Room', 150000, 1, 1, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'testdes03', 'Wi Fi,Hot Water', 'Standard'),
(4, 'Test Room 02', 30000, 1, 7, 'https://www.travelandleisure.com/thmb/JIoqZXurmgjBU-aRjKthU7oKu8A=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/1-71d7208a004a48b7bc1617a7e77183ea.jpg', 'test room 02', 'WiFi,Car Parking,Hot Water,Gas,Play Arena', 'Deluxe');

-- --------------------------------------------------------

--
-- Table structure for table `system_logs`
--

CREATE TABLE `system_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  `ip_address` varchar(50) DEFAULT NULL,
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(20) NOT NULL,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `phone`) VALUES
(1, 'W.W.R de Silva', 'rehandesilva373@gmail.com', '091e606752615c91da70540d9951464cd898f7c2a420fc7181b4f6793772e723', 'CUSTOMER', '+94768164113'),
(2, 'Admin', 'admin@oceanview.com', '091e606752615c91da70540d9951464cd898f7c2a420fc7181b4f6793772e723', 'ADMIN', '+123456780'),
(3, 'staff', 'staff@oceanview.com', '091e606752615c91da70540d9951464cd898f7c2a420fc7181b4f6793772e723', 'STAFF', '0234567892'),
(5, 'wishwa  r', 'wish@example.com', '8aa7aa042a075ab2c93aab95aaf005a87f53c3bba4029a6ebd20be09e6109cc1', 'CUSTOMER', '234567');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`user_id`),
  ADD KEY `fk_room` (`room_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `system_logs`
--
ALTER TABLE `system_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `system_logs`
--
ALTER TABLE `system_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `fk_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `system_logs`
--
ALTER TABLE `system_logs`
  ADD CONSTRAINT `system_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
