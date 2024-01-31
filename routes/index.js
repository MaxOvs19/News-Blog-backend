import { Router } from "express";
import userRouter from "./userRouter.js";
import postRouter from "./postRouter.js";

const router = Router();

router.use("/user", userRouter);
router.use("/post", postRouter);

export default router;
