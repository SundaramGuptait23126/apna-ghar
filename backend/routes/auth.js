const express = require('express');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const usersController = require('../controllers/usersController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

// Note: Using the exact same logic from usersController
// to keep backward compatibility with frontend making requests to /api/signup

router.post('/signup', usersController.registerUser);
router.post('/login', usersController.loginUser);

// GET /users - Admin only
router.get('/users', verifyToken, verifyAdmin, usersController.getAllUsers);

module.exports = router;
