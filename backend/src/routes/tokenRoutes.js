const express = require('express');
const { getBalance, mintTokens } = require('../controllers/tokenController');
const router = express.Router();

router.get('/balance/:address', getBalance);
router.post('/mint', mintTokens);

module.exports = router;
