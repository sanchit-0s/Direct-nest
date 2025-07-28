
const express = require("express");
const {
  createOrGetChat,
  getUserChats,
  sendMessage,
  getChatMessages
} = require("../controllers/chatControllers");
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Create or get chat
router.post("/create", authenticate, createOrGetChat);

// Get user's chats
router.get("/", authenticate, getUserChats);

// Send message
router.post("/message", authenticate, sendMessage);

// Get chat messages
router.get("/:chatId/messages", authenticate, getChatMessages);

module.exports = router;
