import { Router } from "express";
import userController from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", userController.login);
router.post("/registration", userController.registration);

router.put("/", userController.update);

router.get("/auth", authMiddleware, userController.check);
router.get("/page", userController.getOneUser);

export default router;
