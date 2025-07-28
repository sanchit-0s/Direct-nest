
const User = require("../models/User");
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

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { username, email, profile, bankDetails } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (profile) user.profile = { ...user.profile, ...profile };
    if (bankDetails) user.bankDetails = { ...user.bankDetails, ...bankDetails };

    await user.save();
    
    // Return user without password
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ 
      message: "Profile updated successfully", 
      user: userWithoutPassword 
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};

// Save/unsave a post
const toggleSavePost = async (req, res) => {
    console.log("toggleSavePost called with postId:", req.params.postId, "userId:", req.userId);
  try {
    const { postId } = req.params;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isSaved = user.savedPosts.includes(postId);
    
    if (isSaved) {
      // Remove from saved posts
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
    } else {
      // Add to saved posts
      user.savedPosts.push(postId);
    }

    await user.save();
    
    res.status(200).json({ 
      message: isSaved ? "Post removed from saved list" : "Post saved successfully",
      isSaved: !isSaved
    });
  } catch (err) {
    res.status(500).json({ message: "Error saving post", error: err.message });
  }
};

// Get user's saved posts
const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate({
        path: 'savedPosts',
        populate: {
          path: 'userId',
          select: 'username'
        }
      });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.savedPosts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching saved posts", error: err.message });
  }
};

module.exports = { updateProfile, toggleSavePost, getSavedPosts, verifyToken };
