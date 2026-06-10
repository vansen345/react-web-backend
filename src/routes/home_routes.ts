import { Router } from 'express';
import { upload } from '../configs/upload_media_configs';
import { createPost, deletePost, getList2, updatePost, uploadImg } from '../controllers/home_controller';


const homeRoute = Router();

homeRoute.get('/getListHome', getList2);
homeRoute.post('/createPost', createPost);
homeRoute.post('/uploadImg', upload.array('image'), uploadImg);
homeRoute.post('/deletePost', deletePost);
homeRoute.post('/updatePostUser', updatePost);


export default homeRoute;