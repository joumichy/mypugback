import { Router } from "express";
import userRouter from "./userRoutes";
import pugRouter from "./pugRoutes";
import conversationRouter from "./conversationRoute";
import signalRouter from "./signalRoutes";
import competition from "./competitionRoute";

const router = Router();

router.use("/user", userRouter);
router.use("/pug", pugRouter);
router.use("/conversation", conversationRouter);
router.use("/signal", signalRouter);
router.use("/competition", competition);

export default router;
