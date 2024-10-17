const kafka = require('kafka-node');
const Poll = require('../models/poll');
const PollOption = require('../models/pollOption');

const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({
  kafkaHost: 'localhost:9092', 
  requestTimeout: 90000 
});

const consumer = (broadcastUpdate) => {
  const consumerInstance = new Consumer(
    client,
    [{ topic: 'virat-kohli-centuries-poll', partition: 0 }],
    { autoCommit: true }
  );

  consumerInstance.on('message', async (message) => {
    try {
      const voteData = JSON.parse(message.value);
      const { pollId, option } = voteData;

      console.log('New vote received from Kafka:', voteData);

      const pollOption = await PollOption.findOne({
        where: { poll_id: pollId, option_text: option }
      });

      if (!pollOption) {
        console.error('Invalid vote option received:', voteData);
        return;
      }

      // Increment the vote count
      pollOption.votes_count += 1;
      await pollOption.save();

      const updatedPoll = await Poll.findByPk(pollId, {
        include: [{ model: PollOption, as: 'PollOptions' }]
      });

      // Broadcast the updated poll via WebSocket
      broadcastUpdate(updatedPoll);
    } catch (error) {
      console.error('Error processing vote from Kafka:', error);
    }
  });

  consumerInstance.on('error', (err) => {
    console.error('Consumer error:', err);
  });
};

module.exports = consumer;
