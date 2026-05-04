const express = require('express');
const router = express.Router();

const { captainChat } = require('../controllers/captainChat.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// 🔐 Only logged-in captain can use chatbot
router.post('/chat', authMiddleware.authCaptain, captainChat);

module.exports = router;
