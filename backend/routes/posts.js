
const express = require("express");
const { createPost, getUserPosts, getAllPosts, getPostById, verifyToken } = require("../controllers/postControllers");

const router = express.Router();

// Create a new post (protected route)
router.post("/", verifyToken, createPost);

// Get all posts by logged-in user (protected route)
router.get("/user", verifyToken, getUserPosts);

// Get all posts (public route)
router.get("/", getAllPosts);

// Get single post by ID (public route)
router.get("/:id", getPostById);

module.exports = router;
