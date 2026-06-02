import { Router } from 'express';
import { getListUserMessagesNew, getMessagesNew, saveMessageNew } from '../controllers/chat_controller';

const messageRoute = Router();

messageRoute.post('/save', saveMessageNew);
messageRoute.get('/list/:conversationId', getMessagesNew);

messageRoute.get('/listUserChat', getListUserMessagesNew);


// router.get('/list/:conversationId', getMessagesNew);
// router.get('/listUserChat', getListUserMessagesNew);
// router.post('/saveChat', saveMessageNew);

export default messageRoute;