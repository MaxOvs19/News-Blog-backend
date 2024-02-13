import { Router } from "express";
import postController from "../controllers/postController.js";

const router = Router();

router.post("/", postController.create);
router.get("/", postController.getAll);
router.get("/user", postController.getPostsByUser);
router.get("/:id", postController.getOne);
router.delete("/:id", postController.delete);

export default router;
