import { Router } from 'express';
import { chatController } from '../controllers/chatController';

const router = Router();

router.post('/chat', chatController);

export default router;