import express from 'express';
import { getCategories, getTickets } from '../controllers/zendeskController';

const router = express.Router();

// Define routes
router.get('/categories', getCategories);
router.get('/tickets', getTickets);

export default router;