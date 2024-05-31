const express = require('express');
const { getProposals, createProposal, voteOnProposal } = require('../controllers/daoController');
const router = express.Router();

router.get('/proposals', getProposals);
router.post('/create', createProposal);
router.post('/vote', voteOnProposal);

module.exports = router;
