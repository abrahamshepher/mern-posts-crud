import express from "express";
import {
  createPost,
  getPosts,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
} from "../controllers/postController.js";
import {
  protect,
  authorize,
  verifyOwnership,
} from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import {
  createPostSchema,
  updatePostSchema,
} from "../validations/postValidation.js";
import postModel from "../models/postModel.js";

const router = express.Router();

// Public routes
router.get("/", getPosts);
// Protected route for admin/author to get all posts
router.get("/all", protect, authorize("admin", "author"), getAllPosts);
router.get("/:id", getPost);

// Protected routes
router.post(
  "/",
  protect,
  authorize("author", "admin"),
  validate(createPostSchema),
  createPost
);

router.put(
  "/:id",
  protect,
  authorize("author", "admin"),
  verifyOwnership(postModel),
  validate(updatePostSchema),
  updatePost
);

router.delete(
  "/:id",
  protect,
  authorize("author", "admin"),
  verifyOwnership(postModel),
  deletePost
);

router.put("/:id/like", protect, toggleLike);

export default router;
