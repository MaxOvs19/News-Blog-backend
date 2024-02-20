import { Router } from "express";
import likeController from "../controllers/likeController.js";

const router = Router();

router.post("/", likeController.setLike);
router.delete("/", likeController.removeLike);

export default router;
