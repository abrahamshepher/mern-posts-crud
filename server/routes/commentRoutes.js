import express from "express";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  toggleLike,
} from "../controllers/commentController.js";
import { protect, verifyOwnership } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { commentSchema } from "../validations/postValidation.js";
import commentModel from "../models/commentModel.js";

const router = express.Router({ mergeParams: true });

// Public routes
router.get("/", getComments);

// Protected routes
router.post("/", protect, validate(commentSchema), createComment);

router.put(
  "/:id",
  protect,
  verifyOwnership(commentModel),
  validate(commentSchema),
  updateComment
);

router.delete("/:id", protect, verifyOwnership(commentModel), deleteComment);

router.put("/:id/like", protect, toggleLike);

export default router;
