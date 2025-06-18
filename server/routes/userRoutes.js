import express from "express";
import { getMe, updateUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { updateUserSchema } from "../validations/userValidation.js";

const router = express.Router();

// Protected routes
router.get("/me", protect, getMe);
router.put("/me", protect, validate(updateUserSchema), updateUser);

export default router;
