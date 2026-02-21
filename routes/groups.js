import express from 'express';
import { getAllGroups, createGroup, verifyGroup, getGroupDetails, addMember, toggleProgress } from '../controllers/groupController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: إدارة المجموعات
 */

/**
 * @swagger
 * /api/groups/all:
 *   get:
 *     summary: جلب كل المجموعات
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: قائمة بكل المجموعات
 */
router.get('/all', getAllGroups);

/**
 * @swagger
 * /api/groups/create:
 *   post:
 *     summary: إنشاء مجموعة جديدة
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: تم إنشاء المجموعة بنجاح
 */
router.post('/create', createGroup);

/**
 * @swagger
 * /api/groups/verify:
 *   post:
 *     summary: التحقق من باسورد المجموعة
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupId:
 *                 type: integer
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: نتيجة التحقق
 */
router.post('/verify', verifyGroup);

/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: جلب تفاصيل مجموعة معينة
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: تفاصيل المجموعة
 */
router.get('/:id', getGroupDetails);

/**
 * @swagger
 * /api/groups/add-member:
 *   post:
 *     summary: إضافة عضو للمجموعة
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupId:
 *                 type: integer
 *               memberName:
 *                 type: string
 *     responses:
 *       201:
 *         description: تم إضافة العضو
 */
router.post('/add-member', addMember);

/**
 * @swagger
 * /api/groups/toggle-progress:
 *   post:
 *     summary: تبديل حالة إنجاز عادة لعضو
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: integer
 *               habitKey:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: تم تحديث الحالة
 */
router.post('/toggle-progress', toggleProgress);

export default router;
