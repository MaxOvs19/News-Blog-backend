import { Router } from "express";
import userController from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", userController.login);
router.post("/registration", userController.registration);

router.get("/auth", authMiddleware, userController.check);

export default router;
