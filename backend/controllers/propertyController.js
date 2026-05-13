const db = require('../db');

exports.getAllProperties = async (req, res) => {
    try {
        // Phase 2: Pagination & Filtering
        let { page = 1, limit = 10, location, type } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM properties';
        let queryParams = [];
        let countQuery = 'SELECT COUNT(*) as total FROM properties';
        let countParams = [];

        let conditions = [];

        if (location) {
            conditions.push('location LIKE ?');
            queryParams.push(`%${location}%`);
            countParams.push(`%${location}%`);
        }
        
        if (type) {
            conditions.push('type = ?');
            queryParams.push(type);
            countParams.push(type);
        }

        if (conditions.length > 0) {
            let whereClause = ' WHERE ' + conditions.join(' AND ');
            query += whereClause;
            countQuery += whereClause;
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        queryParams.push(limit, offset);

        const [properties] = await db.query(query, queryParams);
        const [totalRows] = await db.query(countQuery, countParams);
        const total = totalRows[0].total;

        res.json({
            data: properties,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get properties error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createProperty = async (req, res) => {
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
};

exports.updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, price } = req.body;
        await db.query('UPDATE properties SET title = ?, price = ? WHERE id = ?', [title, price, id]);
        res.json({ message: 'Property updated successfully' });
    } catch (error) {
        console.error('Update property error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM properties WHERE id = ?', [id]);
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Delete property error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
