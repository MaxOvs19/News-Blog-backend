import { Router } from "express";
import postController from "../controllers/postController.js";

const router = Router();

router.post("/create", postController.create);
router.get("/getAll", postController.getAll);

export default router;
