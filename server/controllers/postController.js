import postModel from "../models/postModel.js";
import {
  createPostSchema,
  updatePostSchema,
} from "../validations/postValidation.js";
import slugify from "slugify";

// @desc    Create a post
// @route   POST /api/posts
// @access  Private (Author, Admin)
export const createPost = async (req, res) => {
  try {
    const postData = createPostSchema.parse(req.body);

    // Create slug from title
    const slug = slugify(postData.title, {
      lower: true,
      strict: true,
    });

    // Calculate read time (assuming average reading speed of 200 words per minute)
    const wordCount = postData.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const post = await postModel.create({
      ...postData,
      slug,
      readTime,
      author: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    // Only filter by published status for non-admin/author users
    if (
      !req.user ||
      (req.user.role !== "admin" && req.user.role !== "author")
    ) {
      query.status = "published";
    }

    // Add search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
        { category: searchRegex },
      ];
    }

    // Add category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Add tag filter
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    const posts = await postModel
      .find(query)
      .populate("author", "name bio")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await postModel.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req, res) => {
  try {
    const post = await postModel
      .findById(req.params.id)
      .populate("author", "name bio")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name bio",
        },
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Author, Admin)
export const updatePost = async (req, res) => {
  try {
    const updates = updatePostSchema.parse(req.body);

    // If title is being updated, update the slug
    if (updates.title) {
      updates.slug = slugify(updates.title, {
        lower: true,
        strict: true,
      });
    }

    // If content is being updated, update read time
    if (updates.content) {
      const wordCount = updates.content.split(/\s+/).length;
      updates.readTime = Math.ceil(wordCount / 200);
    }

    const post = await postModel.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Author, Admin)
export const deletePost = async (req, res) => {
  try {
    const post = await postModel.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const likeIndex = post.likes.indexOf(req.user._id);

    if (likeIndex === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all posts (admin/author)
// @route   GET /api/posts/all
// @access  Private (Admin, Author)
export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    // Add search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    // Add category filter
    if (req.query.category) {
      query.category = req.query.category;
    }
    // Add tag filter
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    const posts = await postModel
      .find(query)
      .populate("author", "name bio")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await postModel.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
