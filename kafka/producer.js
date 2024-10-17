const kafka = require('kafka-node');
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new Producer(client);

producer.on('ready', () => {
  console.log('Kafka Producer is connected and ready.');
});

producer.on('error', (err) => {
  console.error('Producer error:', err);
});

// Function to send a vote to Kafka
const sendVoteToKafka = (voteData) => {
  const payloads = [
    { topic: 'virat-kohli-centuries-poll', messages: JSON.stringify(voteData) }
  ];

  producer.send(payloads, (err, data) => {
    if (err) {
      console.error('Error sending vote to Kafka:', err);
    } else {
      console.log('Vote successfully sent to Kafka:', data);
    }
  });
};

module.exports = { sendVoteToKafka };
