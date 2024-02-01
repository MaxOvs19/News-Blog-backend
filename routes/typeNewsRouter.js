import { Router } from "express";
import typeNewsController from "../controllers/typeNewsController.js";

const router = Router();

router.post("/", typeNewsController.create);
// router.get("/", postController.getAll);
// router.get("/user", postController.getPostsByUser);
// router.get("/:id", postController.getOne);

export default router;
