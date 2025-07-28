const Post = require("../models/Post");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Create a new post
const createPost = async (req, res) => {
  try {
    const {
      title, price, address, description, city, bedroom, bathroom,
      latitude, longitude, type, property, utilities, pet, income,
      size, school, bus, restaurant
    } = req.body;

    console.log("Received images:", req.body.images);

    const newPost = new Post({
      title,
      price,
      address,
      description,
      city,
      bedroom,
      bathroom,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      type,
      property,
      utilities,
      pet,
      income,
      size,
      school,
      bus,
      restaurant,
      userId: req.userId,
      images: req.body.images || []
    });

    await newPost.save();
    console.log("Saved post with images:", newPost.images);
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    res.status(500).json({ message: "Error creating post", error: err.message });
  }
};

// Get all posts by logged-in user
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.userId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    console.log("Found user posts:", posts.length);
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ message: "Error fetching posts", error: err.message });
  }
};

// Get all posts (for listing page)
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    console.log("Found all posts:", posts.length);
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching all posts:", err);
    res.status(500).json({ message: "Error fetching posts", error: err.message });
  }
};

// Get single post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'username');
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post", error: err.message });
  }
};

module.exports = { createPost, getUserPosts, getAllPosts, getPostById, verifyToken };