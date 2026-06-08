import { Router } from "express";
import { getPostByUser, getProfile } from "../controllers/user_controller";

const userRouter = Router();

userRouter.post('/getInforUser', getProfile);
userRouter.post('/listPostByUser', getPostByUser);

export default userRouter;