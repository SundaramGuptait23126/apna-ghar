const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '23126',
    database: process.env.DB_NAME || 'realestateDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function initDb() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '23126'
        });
        
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'realestateDB'}\`;`);
        await connection.end();

        const conn = await pool.getConnection();
        
        // Users table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255),
                role VARCHAR(50) DEFAULT 'user'
            );
        `);
        
        // Properties table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS properties (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                price VARCHAR(100) NOT NULL,
                pricePerSqFt VARCHAR(100),
                area VARCHAR(100),
                image VARCHAR(500),
                type VARCHAR(100),
                tags JSON,
                verified BOOLEAN DEFAULT FALSE,
                aiEstimate VARCHAR(100),
                postedBy VARCHAR(100),
                postedAgo VARCHAR(100) DEFAULT '1d ago',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_location (location),
                INDEX idx_type (type)
            );
        `);
        
        conn.release();
        console.log('Database and tables initialized successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

initDb();

module.exports = pool;
