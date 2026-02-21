import express from 'express';
import { getTestData, createTestData } from '../controllers/testController.js';

const router = express.Router();

router.get('/', getTestData);
router.post('/', createTestData);

export default router;
