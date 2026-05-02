const pool = require('./db');
const { properties } = require('../src/data.js'); // Use the dummy data we created earlier

async function seed() {
    try {
        console.log("Seeding properties...");
        const conn = await pool.getConnection();
        for (const prop of properties) {
            await conn.query(`INSERT INTO properties 
                (title, location, price, pricePerSqFt, area, image, type, tags, verified, aiEstimate, postedBy, postedAgo) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                [prop.title, prop.location, prop.price, prop.pricePerSqFt, prop.area, prop.image, 'Buy', JSON.stringify(prop.tags || []), prop.verified, prop.aiEstimate, prop.postedBy, prop.postedAgo]
            );
        }
        conn.release();
        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
}

seed();
