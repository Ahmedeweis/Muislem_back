import express from 'express';
import { getAllGroups, createGroup, verifyGroup, getGroupDetails, addMember, toggleProgress } from '../controllers/groupController.js';

const router = express.Router();

router.get('/all', getAllGroups);
router.post('/create', createGroup);
router.post('/verify', verifyGroup); // Check password
router.get('/:id', getGroupDetails);
router.post('/add-member', addMember);
router.post('/toggle-progress', toggleProgress);

export default router;
