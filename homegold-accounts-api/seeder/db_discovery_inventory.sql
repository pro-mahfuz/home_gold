-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 24, 2025 at 05:02 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_discovery_inventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `parties`
--

CREATE TABLE `parties` (
  `id` int NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countryCode` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phoneCode` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phoneNumber` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationalId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tradeLicense` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `openingBalance` float DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `parties`
--

INSERT INTO `parties` (`id`, `type`, `name`, `company`, `email`, `countryCode`, `phoneCode`, `phoneNumber`, `address`, `city`, `country`, `nationalId`, `tradeLicense`, `openingBalance`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'supplier', 'Supplier One', 'ABC Company Ltd', 'abc@gmail.com', 'AE', '+971', '568163016', 'abc road, dubai, uae', 'Dubai', 'UAE', '', '', 0, 1, '2025-07-23 17:21:05', '2025-07-23 17:21:05');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `action`, `createdAt`, `updatedAt`) VALUES
(1, NULL, 'manage_roles', '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(2, NULL, 'manage_permissions', '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(3, NULL, 'manage_users', '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(4, NULL, 'create_users', '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(5, NULL, 'edit_users', '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(6, NULL, 'view_users', '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(7, NULL, 'delete_users', '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(8, NULL, 'manage_profile', '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(9, NULL, 'edit_profile', '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(10, NULL, 'view_profile', '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(11, NULL, 'manage_party', '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(12, NULL, 'create_party', '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(13, NULL, 'edit_party', '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(14, NULL, 'view_party', '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(15, NULL, 'delete_party', '2025-07-23 13:25:43', '2025-07-23 13:25:43');

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `id` int NOT NULL,
  `fullName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birthDate` datetime DEFAULT NULL,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactEmail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countryCode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneCode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneNumber` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postalCode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profilePicture` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`id`, `fullName`, `birthDate`, `gender`, `nationality`, `contactEmail`, `countryCode`, `phoneCode`, `phoneNumber`, `address`, `city`, `country`, `postalCode`, `profilePicture`, `userId`, `createdAt`, `updatedAt`) VALUES
(1, 'Md Mahfuzul Islam', '1990-04-13 00:00:00', 'male', 'Bangladeshi', 'abc@gmail.com', 'AE', '+971', '568163016', 'Dubai International City', 'Dubai', 'UAE', '17653', '/uploads/profiles/DiscoveryLogo-1753277171285.png', 1, '2025-07-23 13:26:11', '2025-07-23 13:26:11');

-- --------------------------------------------------------

--
-- Table structure for table `rolepermissions`
--

CREATE TABLE `rolepermissions` (
  `roleId` int NOT NULL,
  `permissionId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rolepermissions`
--

INSERT INTO `rolepermissions` (`roleId`, `permissionId`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(2, 8),
(3, 8),
(4, 8),
(1, 9),
(2, 9),
(3, 9),
(4, 9),
(1, 10),
(2, 10),
(3, 10),
(4, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `action`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', NULL, 0, '2025-07-23 13:25:41', '2025-07-23 13:25:41'),
(2, 'manager', NULL, 0, '2025-07-23 13:25:41', '2025-07-23 13:25:41'),
(3, 'sales', NULL, 0, '2025-07-23 13:25:41', '2025-07-23 13:25:41'),
(4, 'purchase', NULL, 0, '2025-07-23 13:25:41', '2025-07-23 13:25:41');

-- --------------------------------------------------------

--
-- Table structure for table `tokenstores`
--

CREATE TABLE `tokenstores` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tokenstores`
--

INSERT INTO `tokenstores` (`id`, `userId`, `token`, `expiresAt`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTMyNzcxNjMsImV4cCI6MTc1Mzg4MTk2M30.e05unAobPp95_DfPn_poxeYrtEahh_MG4c75fecqfMA', '2025-07-30 13:26:03', '2025-07-23 13:26:03', '2025-07-23 13:26:03'),
(2, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTMyNzgzNDYsImV4cCI6MTc1Mzg4MzE0Nn0.NzOY0FSfBZ0sfQeh1nhvjXppMX-YiZU49qVFHlepQO4', '2025-07-30 13:45:46', '2025-07-23 13:45:46', '2025-07-23 13:45:46'),
(3, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTMyODAwMTEsImV4cCI6MTc1Mzg4NDgxMX0.0gUqHKU_ogDAhQoOnbHRRjL4NYIci5m1rjkaou4ZS94', '2025-07-30 14:13:31', '2025-07-23 14:13:31', '2025-07-23 14:13:31'),
(4, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTMyODkzOTgsImV4cCI6MTc1Mzg5NDE5OH0.32Ed7NxLs9yUX4UuYryaKVcveWutF46SKblLocg2T6E', '2025-07-30 16:49:58', '2025-07-23 16:49:58', '2025-07-23 16:49:58'),
(5, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTMyOTAwNzQsImV4cCI6MTc1Mzg5NDg3NH0.01l7qBDWv4XdWzAOD2-st-aeM15F7lAyqU6eMgtvq9o', '2025-07-30 17:01:14', '2025-07-23 17:01:14', '2025-07-23 17:01:14'),
(6, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTMyOTA3MDIsImV4cCI6MTc1Mzg5NTUwMn0.7zPXucAUnT_ifZIsy7cg2nlitCG2GQr7Pi_AohePXLM', '2025-07-30 17:11:42', '2025-07-23 17:11:42', '2025-07-23 17:11:42'),
(7, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTMyOTA5MzksImV4cCI6MTc1Mzg5NTczOX0.S63PRmUWUu1381G0tlPQO1qKVtTlgJt_zpREckVFdb8', '2025-07-30 17:15:39', '2025-07-23 17:15:39', '2025-07-23 17:15:39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countryCode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneCode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneNumber` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `countryCode`, `phoneCode`, `phoneNumber`, `password`, `roleId`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'Mahfuz', 'admin@gmail.com', NULL, NULL, NULL, '$2b$10$iFcUmu9v8kENfo8Txgra/.2b8jc74cYQtSRTxMMIhfjiNqiAKAFfS', 1, 1, '2025-07-23 13:25:41', '2025-07-23 13:25:41'),
(2, 'Luke Baumbach', 'Carley78@yahoo.com', NULL, NULL, NULL, '$2b$10$8PVcmYkp84jqZl.xpt05C.Ju9hbJUdO8hd6AUZKkH5AdMc7Dj12zW', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(3, 'Jeffery Simonis', 'Brittany_Becker@yahoo.com', NULL, NULL, NULL, '$2b$10$bKx7mokhUXCc1G2ag3Lw8OWiwmeidoiXzDk7Z0BoEYtIjpCTxjrqS', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(4, 'Jamie Hahn', 'Maci_Mosciski@gmail.com', NULL, NULL, NULL, '$2b$10$maC1XZ4ZCKZrtMiIiVLPyu7zcYYuQHmxMvev4H5OKOkKQev2kYeca', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(5, 'Gwen Nolan Sr.', 'Korey_Connelly@hotmail.com', NULL, NULL, NULL, '$2b$10$0.dAF2mE8ukIoUU4nLhr6OnoWtO5ax1XFuvHjBWfMa37Q60nfb8A6', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(6, 'Casey Nader', 'Chelsea.Lebsack@hotmail.com', NULL, NULL, NULL, '$2b$10$4Qf4P3zt1tidk5nJa0Cj7Ob1h1D4cMbqW7mjPttuHqaJSsS0nLM5q', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(7, 'Miriam Stark', 'Brandyn36@yahoo.com', NULL, NULL, NULL, '$2b$10$TvNmVNCKUrv6XkQ.J/UbYOvOyHtzw8KWmBqVJNL6ZB10239J63aMS', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(8, 'Elias Jacobi', 'Candelario_Becker@yahoo.com', NULL, NULL, NULL, '$2b$10$feKNr7QdW2Oog/Wfc9tPr.DZ9Do2kGK8kdg4Z1Aq1gzm4QR6DSDne', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(9, 'Julio Hackett I', 'Bennie.Pfeffer@gmail.com', NULL, NULL, NULL, '$2b$10$tLGUfY9ZHcUiEwdsmmZ9B.NKcmh/OP3kYop0UWLhJGx4zO8pY2wT.', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(10, 'Sarah Leuschke', 'Elroy.McCullough@hotmail.com', NULL, NULL, NULL, '$2b$10$KOr7XigEXlAhxABLSrkYFOqyi42Q6wG1JbqmR/enmI0BOrYzqFIcC', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(11, 'Mabel Hane DVM', 'Lincoln_Stoltenberg@gmail.com', NULL, NULL, NULL, '$2b$10$FxQ2dAJ3lu6NY3HpO2rY9eK/x5FQXW1dMGKwJd.ZKLqxQWgVhoNey', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(12, 'Melvin Green', 'Arely_Murazik@yahoo.com', NULL, NULL, NULL, '$2b$10$dXWJOK4kp6wQBZhZ.IBHjuvGMfvObyKLijbAwpqsM7wBPBR6FN1gi', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(13, 'Preston Carter', 'Everardo99@yahoo.com', NULL, NULL, NULL, '$2b$10$P3qqZPB2O9i/nN7hVATyEuz3m1Q4rgMkC8/KzQwbbFg1ovIFdLimi', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(14, 'Percy Hickle', 'Foster87@yahoo.com', NULL, NULL, NULL, '$2b$10$BuluvAA2Lb.l/4Evw3FCRevhrPVxQLOg7Y1oFwQboai2c5RxldOXW', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(15, 'Christie Johnston', 'Lina.Conroy8@hotmail.com', NULL, NULL, NULL, '$2b$10$o0FBMgNdcHM6IyNZBkRkN.2YMAOb1UBxEW4ckin5Lt02xdsHU8Aku', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(16, 'Melanie Robel', 'Devan53@gmail.com', NULL, NULL, NULL, '$2b$10$KbhrT25qUnKVs2IjMCSpQudhDs0wPFUGifKXPzBLC/WGfB6iBYGd.', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(17, 'Stuart Prosacco', 'Lamar.Jones@yahoo.com', NULL, NULL, NULL, '$2b$10$juTDnKeTAO9sP/VaaCoTHOZ6uKd/zjDHDcE0BSfz5yFaBLmGdmhoW', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(18, 'Ethel Parker', 'Jaron76@hotmail.com', NULL, NULL, NULL, '$2b$10$9FkQ64cbgCDXavP42OVOruveRQGRqR59MqZN0Uh7CXVVcC4f1dHo.', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(19, 'Chris Kreiger-Zemlak', 'Buford.Hirthe@yahoo.com', NULL, NULL, NULL, '$2b$10$lZJ.HV2i5vb6bNFse36jh.2A6GDw1rEfuUNcq5ARlMtrVnhE1H2cO', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(20, 'Eddie Mitchell', 'Davonte_Mitchell@hotmail.com', NULL, NULL, NULL, '$2b$10$dp46wiYajKdFS26yDmBYtecVZQ7gllXID7rhOOBnes/UDDdt0aj1S', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43'),
(21, 'Andres Schuppe', 'Laurianne.Stokes@hotmail.com', NULL, NULL, NULL, '$2b$10$CfFpZR9Elwex48PsW9eMAOH.zWiuhuMky1.U9X3lV11p5EoJHeIAq', 3, 1, '2025-07-23 13:25:43', '2025-07-23 13:25:43');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `parties`
--
ALTER TABLE `parties`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- Indexes for table `rolepermissions`
--
ALTER TABLE `rolepermissions`
  ADD PRIMARY KEY (`roleId`,`permissionId`),
  ADD UNIQUE KEY `RolePermissions_permissionId_roleId_unique` (`roleId`,`permissionId`),
  ADD UNIQUE KEY `role_permissions_role_id_permission_id` (`roleId`,`permissionId`),
  ADD KEY `permissionId` (`permissionId`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tokenstores`
--
ALTER TABLE `tokenstores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roleId` (`roleId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `parties`
--
ALTER TABLE `parties`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tokenstores`
--
ALTER TABLE `tokenstores`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_10` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_11` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_12` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_14` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_15` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_16` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_17` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_18` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_20` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_21` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_22` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_6` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_8` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `profiles_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `rolepermissions`
--
ALTER TABLE `rolepermissions`
  ADD CONSTRAINT `rolepermissions_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rolepermissions_ibfk_2` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tokenstores`
--
ALTER TABLE `tokenstores`
  ADD CONSTRAINT `tokenstores_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_10` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_11` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_12` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_14` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_15` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_16` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_17` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_18` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_20` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_21` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_6` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_8` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tokenstores_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_10` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_11` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_12` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_13` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_14` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_15` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_16` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_17` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_18` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_19` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_20` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_21` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_22` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_23` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_24` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_25` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_26` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_27` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_28` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_4` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_5` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_6` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_7` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_8` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_9` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
