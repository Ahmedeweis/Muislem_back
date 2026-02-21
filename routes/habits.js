import express from 'express';
import { getDailyHabits, updateDailyHabits, getHabitsHistory } from '../controllers/habitController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Habits
 *   description: إدارة العادات اليومية
 */

/**
 * @swagger
 * /api/habits:
 *   get:
 *     summary: جلب العادات اليومية لتاريخ معين
 *     tags: [Habits]
 *     parameters:
 *       - in: query
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           example: "2026-02-21"
 *     responses:
 *       200:
 *         description: بيانات العادات اليومية
 */
router.get('/', getDailyHabits);

/**
 * @swagger
 * /api/habits:
 *   post:
 *     summary: تحديث أو إنشاء سجل العادات اليومية
 *     tags: [Habits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupId:
 *                 type: integer
 *               memberId:
 *                 type: integer
 *               date:
 *                 type: string
 *               habitData:
 *                 type: object
 *     responses:
 *       200:
 *         description: تم التحديث بنجاح
 */
router.post('/', updateDailyHabits);

/**
 * @swagger
 * /api/habits/history:
 *   get:
 *     summary: جلب تاريخ العادات
 *     tags: [Habits]
 *     parameters:
 *       - in: query
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: memberId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: تاريخ العادات
 */
router.get('/history', getHabitsHistory);

export default router;
