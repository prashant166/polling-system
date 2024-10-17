const express = require('express');
const { createPoll, votePoll } = require('../controllers/pollController');
const router = express.Router();

/**
 * @swagger
 * /api/polls:
 *   post:
 *     summary: Create a new poll
 *     description: Create a new poll with options.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Favorite programming language?"
 *               description:
 *                 type: string
 *                 example: "Choose your favorite programming language"
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "Python", "Java", "C++"]
 *     responses:
 *       201:
 *         description: Poll created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 poll:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           option_text:
 *                             type: string
 *                           votes_count:
 *                             type: integer
 *       400:
 *         description: Bad request, invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/', createPoll);

/**
 * @swagger
 * /api/polls/{id}/vote:
 *   post:
 *     summary: Vote for a poll option
 *     description: Cast a vote for a specific option in a poll.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Poll ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               option:
 *                 type: string
 *                 example: "JavaScript"
 *     responses:
 *       200:
 *         description: Vote received successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid option or missing parameters
 *       404:
 *         description: Poll not found
 *       500:
 *         description: Internal server error
 */
router.post('/:id/vote', votePoll);

module.exports = router;
