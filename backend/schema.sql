CREATE DATABASE IF NOT EXISTS realestate_db;
USE realestate_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price VARCHAR(100) NOT NULL,
    pricePerSqFt VARCHAR(100),
    area VARCHAR(100),
    image VARCHAR(500),
    type VARCHAR(100), -- 'Buy', 'Rent', 'Commercial', 'Plots'
    tags JSON, -- Stores array of tags like ["Ready To Move", "Sale"]
    verified BOOLEAN DEFAULT FALSE,
    aiEstimate VARCHAR(100),
    postedBy VARCHAR(100),
    postedAgo VARCHAR(100) DEFAULT '1d ago',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Insert a default admin user (password is 'admin123' if using bcrypt, you'll need to sign up to hash it properly)
-- This is just structural. Best to sign up via API and change role manually or have a script.
