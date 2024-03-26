const express = require('express');
const createUser = require('../controllers/auth/createUser');

const router = express.Router();

router.post('/signup', createUser);

module.exports = router;
