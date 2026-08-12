const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validateChatInput = require('../middlewares/validateChatInput.middleware');

// POST /api/chat - Kirim pesan AI & simpan riwayat jika saveHistory: true
router.post('/', authMiddleware, validateChatInput, chatController.sendMessage);

// GET /api/chat/history - Ambil riwayat percakapan user
router.get('/history', authMiddleware, chatController.getChatHistory);

module.exports = router;