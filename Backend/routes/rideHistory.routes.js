const express = require('express');
const router = express.Router();

const { getCaptainRideHistory, getUserRideHistory } = require('../controllers/rideHistory.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// 🔐 Only logged-in captain can view ride history
router.get('/captain', authMiddleware.authCaptain, getCaptainRideHistory);

// 🔐 Only logged-in user can view ride history
router.get('/user', authMiddleware.authUser, getUserRideHistory);

module.exports = router;
