const express = require('express');
const createUser = require('../controllers/auth/createUser');
const verifyEmail = require('../controllers/verification/emailVerificationController');

const router = express.Router();

router.post('/signup', createUser);

// auth verification routes
router.post('/verify-email/:verificationToken', verifyEmail);

module.exports = router;
