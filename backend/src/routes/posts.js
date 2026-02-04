const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * GET ALL POSTS
 */
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

/**
 * CREATE POST (AUTH REQUIRED)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text, image } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Post text required" });
    }

    const post = new Post({
      text,
      image: image || "",
      user: req.user.id,
    });

    await post.save();

    const populatedPost = await post.populate("user", "name");

    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post" });
  }
});

/**
 * DELETE POST (AUTH + OWNER ONLY)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 🔐 OWNER CHECK
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
});

module.exports = router;
