const express = require('express');
const router = express.Router();

const { getCaptainRideHistory } = require('../controllers/rideHistory.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// 🔐 Only logged-in captain can view ride history
router.get('/captain', authMiddleware.authCaptain, getCaptainRideHistory);

module.exports = router;
