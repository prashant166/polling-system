const express = require('express');
const { getLeaderboard } = require('../controllers/leaderboardController');
const router = express.Router();

/**
 * @swagger
 * /api/leaderboard:
 *   get:
 *     summary: Get leaderboard
 *     description: Retrieve the leaderboard with the latest poll results.
 *     responses:
 *       200:
 *         description: Leaderboard fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 leaderboard:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       poll_id:
 *                         type: integer
 *                       option_text:
 *                         type: string
 *                       votes_count:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       Poll:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *       500:
 *         description: Error fetching leaderboard
 */
router.get('/', getLeaderboard);

module.exports = router;
