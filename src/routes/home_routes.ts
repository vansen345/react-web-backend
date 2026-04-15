import { Router } from 'express';
import { createPost, getDetail, getList2 } from '../controllers/home_controller';
1

const router = Router();

router.get('/getListHome', getList2);  
router.post('/createPost', createPost);
router.post('/getDetail', getDetail); 

export default router;