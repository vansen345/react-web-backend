import { Router } from 'express';
import { upload } from '../configs/upload_media_configs';
import { createPost, getList2, uploadImg } from '../controllers/home_controller';


const homeRoute = Router();

homeRoute.get('/getListHome', getList2);
homeRoute.post('/createPost', createPost);
homeRoute.post('/uploadImg', upload.array('image'), uploadImg);


export default homeRoute;