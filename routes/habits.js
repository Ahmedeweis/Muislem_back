import express from 'express';
import { getDailyHabits, updateDailyHabits, getHabitsHistory } from '../controllers/habitController.js';

const router = express.Router();

router.get('/history', getHabitsHistory);
router.get('/', getDailyHabits);
router.post('/', updateDailyHabits);

export default router;
