CREATE TABLE `users` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(255) UNIQUE NOT NULL,
  `username` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `dob` varchar(10) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT 0,
  `md5Id` varchar(32) NOT NULL,
  `createdAt` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;