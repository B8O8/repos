CREATE TABLE `relationships` (
  `id` int(11) NOT NULL,
  `downlineId` int(11) DEFAULT NULL,
  `uplineId` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `commissionPercentage` int(11)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;