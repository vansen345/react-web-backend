import { Router } from 'express';
import { getListUserMessages, getMessages, saveMessage } from '../controllers/chat_controller';

const router = Router();

router.post('/save', saveMessage);
router.get('/list/:roomId', getMessages);
router.get('/listUserChat', getListUserMessages);

export default router;