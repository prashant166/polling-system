const PollOption = require('../models/pollOption');
const Poll = require('../models/poll');

// Controller for getting leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await PollOption.findAll({
      include: {
        model: Poll,
        attributes: ['title'], 
      },
      attributes: ['option_text', 'votes_count'],
      order: [['votes_count', 'DESC']], 
    });

    // Format response
    const formattedLeaderboard = leaderboard.map(option => ({
      option_text: option.option_text,
      votes_count: option.votes_count,
      poll_title: option.Poll.title,
    }));

    res.status(200).json({ leaderboard: formattedLeaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Error fetching leaderboard.' });
  }
};

module.exports = { getLeaderboard };
