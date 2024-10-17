const { sendVoteToKafka } = require('../kafka/producer');
const Poll = require('../models/poll');
const PollOption = require('../models/pollOption');

// Controller for creating a new poll
const createPoll = async (req, res) => {
  const { title, options, description } = req.body;

  if (!title || !options || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ error: 'Poll must have a title and at least two options.' });
  }

  try {
    const poll = await Poll.create({ title, description });
    const pollOptions = options.map(option => ({
      poll_id: poll.id,
      option_text: option,
    }));

    await PollOption.bulkCreate(pollOptions);

    const createdPoll = await Poll.findByPk(poll.id, {
      include: [{ model: PollOption, as: 'PollOptions' }]
    });

    res.status(201).json({ message: 'Poll created successfully', poll: createdPoll });
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ error: 'Error creating poll.' });
  }
};

// Controller for handling votes
const votePoll = (broadcastUpdate) => async (req, res) => {
  const { option } = req.body;
  const pollId = parseInt(req.params.id, 10);

  if (!option) {
    return res.status(400).json({ error: 'Option is required.' });
  }

  try {
    const poll = await Poll.findByPk(pollId, {
      include: [{ model: PollOption, as: 'PollOptions' }]
    });

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found.' });
    }

    const pollOption = poll.PollOptions.find(o => o.option_text === option);

    if (!pollOption) {
      return res.status(400).json({ error: 'Invalid option.' });
    }

    // Increment vote count
    pollOption.votes_count += 1;
    await pollOption.save();

    // Prepare vote data for Kafka
    const voteData = { pollId, option };
    sendVoteToKafka(voteData);

    // Broadcast update through WebSocket
    broadcastUpdate(poll);

    res.status(200).json({ message: 'Vote received and leaderboard updated.' });
  } catch (error) {
    console.error('Error processing vote:', error);
    res.status(500).json({ error: 'Error processing vote.' });
  }
};

module.exports = { createPoll, votePoll };
