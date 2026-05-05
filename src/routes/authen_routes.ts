import { Router } from 'express';
import { getInfoLogin, loginUser, registerUser } from '../controllers/authen_controller';


const router = Router();


router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);
router.post('/getInfoUserLogin', getInfoLogin);


export default router;