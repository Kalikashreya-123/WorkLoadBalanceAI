cCREATE DATABASE WorkBalanceAI;

USE WorkBalanceAI;

CREATE TABLE Employee (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Employee', 'Manager', 'Admin') NOT NULL,
    department VARCHAR(100),
    experience_years DECIMAL(3,1),
    working_hours_per_day INT DEFAULT 8,
    availability_status ENUM('Available', 'Busy', 'On Leave') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);