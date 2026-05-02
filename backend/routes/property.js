const express = require('express');
const db = require('../db');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Public route to get all properties
router.get('/', async (req, res) => {
    try {
        const [properties] = await db.query('SELECT * FROM properties');
        res.json(properties);
    } catch (error) {
        console.error('Get properties error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Protected route to add a property (only logged-in users, ideally admin)
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { title, location, price, pricePerSqFt, area, type, tags, verified, aiEstimate, postedBy } = req.body;
        let imagePath = null;
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            imagePath = req.body.image; // fallback to URL if provided
        }
        
        let formattedTags = tags;
        if (typeof tags === 'string') {
            try {
                // Check if it's already a stringified JSON array, otherwise convert it
                if (tags.startsWith('[')) {
                    JSON.parse(tags);
                    formattedTags = tags;
                } else {
                    formattedTags = JSON.stringify(tags.split(',').map(t => t.trim()));
                }
            } catch (e) {
                formattedTags = JSON.stringify([]);
            }
        }
        
        await db.query(
            `INSERT INTO properties (title, location, price, pricePerSqFt, area, image, type, tags, verified, aiEstimate, postedBy) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [title, location, price, pricePerSqFt, area, imagePath, type, formattedTags, verified === 'true' || verified === true, aiEstimate, postedBy]
        );
        res.status(201).json({ message: 'Property created successfully' });
    } catch (error) {
        console.error('Add property error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin route to delete a property
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM properties WHERE id = ?', [id]);
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Delete property error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
