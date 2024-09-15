-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 28, 2024 at 08:05 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30
SET
  SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET
  time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;

/*!40101 SET NAMES utf8mb4 */
;

--
-- Database: `masari`
--
-- --------------------------------------------------------
--
-- Table structure for table `grouplevels`
--
CREATE TABLE `grouplevels` (
  `groupId` int(11) NOT NULL,
  `levelIndex` int(11) NOT NULL,
  `commissionPercentage` int(11) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- Indexes for dumped tables
--
--
-- Indexes for table `grouplevels`
--
ALTER TABLE
  `grouplevels`
ADD
  PRIMARY KEY (`groupId`, `levelIndex`);

--
-- Constraints for dumped tables
--
--
-- Constraints for table `grouplevels`
--
ALTER TABLE
  `grouplevels`
ADD
  CONSTRAINT `grouplevels_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;