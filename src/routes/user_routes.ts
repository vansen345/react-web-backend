import { Router } from "express";
import { getPostByUser, getProfile, updateProfile } from "../controllers/user_controller";

const userRouter = Router();

userRouter.post('/getInforUser', getProfile);
userRouter.post('/listPostByUser', getPostByUser);
userRouter.post('/editProfile', updateProfile);

export default userRouter;