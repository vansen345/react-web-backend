import { Router } from 'express';
import { registerUser } from '../controllers/authen_controller';


const router = Router();


router.post('/registerUser', registerUser);


export default router;