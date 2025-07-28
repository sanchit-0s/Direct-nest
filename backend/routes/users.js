
const express = require("express");
const { updateProfile, toggleSavePost, getSavedPosts, verifyToken } = require("../controllers/userControllers");

const router = express.Router();

// Update profile
router.put("/profile", verifyToken, updateProfile);

// Toggle save post
router.post("/save/:postId", verifyToken, toggleSavePost);

// Get saved posts
router.get("/saved", verifyToken, getSavedPosts);

module.exports = router;
