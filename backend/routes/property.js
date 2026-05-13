const express = require('express');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const propertyController = require('../controllers/propertyController');
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

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Property management APIs
 */

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Retrieve a list of all properties with pagination and filtering
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by type (e.g. Rent, Buy)
 *     responses:
 *       200:
 *         description: A list of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *       500:
 *         description: Server error
 */
router.get('/', propertyController.getAllProperties);

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               price:
 *                 type: string
 *               pricePerSqFt:
 *                 type: string
 *               area:
 *                 type: string
 *               type:
 *                 type: string
 *               tags:
 *                 type: string
 *               verified:
 *                 type: boolean
 *               aiEstimate:
 *                 type: string
 *               postedBy:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Property created successfully
 *       500:
 *         description: Server error
 */
router.post('/', verifyToken, upload.single('image'), propertyController.createProperty);

/**
 * @swagger
 * /properties/{id}:
 *   put:
 *     summary: Update an existing property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: string
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       500:
 *         description: Server error
 */
router.put('/:id', verifyToken, verifyAdmin, propertyController.updateProperty);

/**
 * @swagger
 * /properties/{id}:
 *   delete:
 *     summary: Delete a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/:id', verifyToken, verifyAdmin, propertyController.deleteProperty);

module.exports = router;
