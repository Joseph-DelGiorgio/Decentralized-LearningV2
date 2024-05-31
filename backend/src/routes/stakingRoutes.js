const express = require('express');
const { stakeTokens, unstakeTokens, claimRewards } = require('../controllers/stakingController');
const router = express.Router();

router.post('/stake', stakeTokens);
router.post('/unstake', unstakeTokens);
router.post('/claim', claimRewards);

module.exports = router;
