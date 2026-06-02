
import { Router } from "express";
import { getDetail } from "../controllers/detail_controller";

const detailRoute = Router();

detailRoute.post('/getDetail', getDetail); 

export default detailRoute;