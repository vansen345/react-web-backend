import { Router } from 'express';
import { createPost, getList2 } from '../controllers/home_controller';


const router = Router();

router.get('/getListHome', getList2);
router.post('/createPost', createPost);


export default router;