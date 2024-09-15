CREATE TABLE groupsTable (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  totalCommission DECIMAL(10, 2) DEFAULT 0.00,
  dispensedCommission DECIMAL(10, 2) DEFAULT 0.00
  createdAt date NOT NULL DEFAULT current_timestamp()

);