import { Router } from 'express';
import { getInfoLogin, loginUser, registerUser } from '../controllers/authen_controller';


const authenRoute = Router();


authenRoute.post('/registerUser', registerUser);
authenRoute.post('/loginUser', loginUser);
authenRoute.post('/getInfoUserLogin', getInfoLogin);


export default authenRoute;