const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the task
 *         title:
 *           type: string
 *           description: The title of your task
 *         description:
 *           type: string
 *           description: Task details
 *         completed:
 *           type: boolean
 *           description: Completion status
 *         dueDate:
 *           type: string
 *           description: Due date string
 *         category:
 *           type: string
 *           description: Task category
 *       example:
 *         id: 1
 *         title: Complete Interview Practical
 *         description: Create a Node.js REST API
 *         completed: false
 *         dueDate: 2026-04-10
 *         category: Work
 */

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: The tasks managing API
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Returns the list of all the tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: The list of the tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get('/', taskController.getTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get the task by id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The task id
 *     responses:
 *       200:
 *         description: The task description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: The task was not found
 */
router.get('/:id', taskController.getTaskById);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: The task was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation Error
 */
router.post('/', taskController.createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update the task by the id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The task id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: The task was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: The task was not found
 */
router.put('/:id', taskController.updateTask);

/**
 * @swagger
 * /api/tasks/{id}/complete:
 *   patch:
 *     summary: Mark a task as complete
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The task id
 *     responses:
 *       200:
 *         description: The task marked as complete
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Already completed or error
 *       404:
 *         description: Task not found
 */
router.patch('/:id/complete', taskController.completeTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Remove the task by id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The task id
 *     responses:
 *       204:
 *         description: The task was deleted
 *       404:
 *         description: The task was not found
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router;
