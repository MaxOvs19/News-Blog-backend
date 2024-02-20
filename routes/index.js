import { Router } from "express";
import userRouter from "./userRouter.js";
import postRouter from "./postRouter.js";
import typeNewsRouter from "./typeNewsRouter.js";
import likeRouter from "./likeRouter.js";

const router = Router();

router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/type", typeNewsRouter);
router.use("/like", likeRouter);

export default router;
