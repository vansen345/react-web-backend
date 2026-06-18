import { Router } from 'express';
import { checkReadedMess, getListUserMessagesNew, getMessagesNew, saveMessageNew } from '../controllers/chat_controller';

const messageRoute = Router();

messageRoute.post('/save', saveMessageNew);
messageRoute.get('/list/:conversationId', getMessagesNew);
messageRoute.get('/listUserChat', getListUserMessagesNew);
messageRoute.post('/checkReadMess', checkReadedMess);


// router.get('/list/:conversationId', getMessagesNew);
// router.get('/listUserChat', getListUserMessagesNew);
// router.post('/saveChat', saveMessageNew);

export default messageRoute;