const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '23126',
    database: 'realestateDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
pool.getConnection()
    .then((connection) => {
        console.log('Successfully connected to MySQL database');
        connection.release();
    })
    .catch((err) => {
        console.error('Error connecting to MySQL database:', err.message);
    });

module.exports = pool;
