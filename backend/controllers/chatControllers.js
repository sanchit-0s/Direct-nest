
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const jwt = require("jsonwebtoken");

// Create or get existing chat between two users
const createOrGetChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.userId;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "Cannot create chat with yourself" });
    }

    // Check if chat already exists between these users
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate('participants', 'username email');

    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: [senderId, receiverId]
      });
      await chat.save();
      chat = await Chat.findById(chat._id).populate('participants', 'username email');
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Error creating/getting chat", error: err.message });
  }
};

const getUserChats = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No userId in request" });
    }

    const chats = await Chat.find({
      participants: userId
    })
    .populate('participants', 'username email')
    .sort({ lastMessageTime: -1 }); // or use updatedAt if lastMessageTime doesn't exist

    res.status(200).json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ message: "Error fetching chats", error: err.message });
  }
};


// Send a message
const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const senderId = req.userId;

    // Verify chat exists and user is participant
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(senderId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const message = new Message({
      chatId,
      senderId,
      content
    });

    await message.save();

    // Update chat's last message
    chat.lastMessage = content;
    chat.lastMessageTime = new Date();
    await chat.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'username email');

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ message: "Error sending message", error: err.message });
  }
};

// Get messages for a chat
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;

    // Verify user is participant in this chat
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const messages = await Message.find({ chatId })
      .populate('senderId', 'username email')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err.message });
  }
};

module.exports = {
  createOrGetChat,
  getUserChats,
  sendMessage,
  getChatMessages
};
