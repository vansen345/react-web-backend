import { Router } from "express";
import { getListComment, insertComment } from "../controllers/comment_controller";

const commentRoute = Router();

commentRoute.post('/insertComment',insertComment);
commentRoute.get('/listComment/:PP300', getListComment);

export default commentRoute;