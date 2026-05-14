import { Router } from 'express';
import { getMessages, saveMessage } from '../controllers/chat_controller';

const router = Router();

router.post('/save', saveMessage);
router.get('/list/:roomId', getMessages);

export default router;