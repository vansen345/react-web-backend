import { Router } from 'express';
import { createPost, deletePost, getList2, updatePost } from '../controllers/home_controller';


const homeRoute = Router();

homeRoute.get('/getListHome', getList2);
homeRoute.post('/createPost', createPost);
// homeRoute.post('/uploadImg', upload.array('image'), uploadImg);
homeRoute.post('/deletePost', deletePost);
homeRoute.post('/updatePostUser', updatePost);


export default homeRoute;