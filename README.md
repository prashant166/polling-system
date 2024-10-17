# Polling System with Real-Time Leaderboard

This is a **Polling System** built using **Node.js**, **PostgreSQL**, **Kafka**, and **WebSocket**. It features real-time updates to a leaderboard that shows the poll results as users cast their votes.

## Features

- Create polls with multiple options.
- Vote for your preferred option in a poll.
- Real-time leaderboard updates using WebSockets.
- Polling data is sent via Kafka for processing.
- PostgreSQL database for storing polls, options, and votes.

---

## Prerequisites

Before running the project, ensure you have the following installed on your system:

- **Node.js** (version 14.x or higher)
- **PostgreSQL** (version 12.x or higher)
- **Kafka** (with Zookeeper setup)
- **Git** (optional for cloning)

---

## Project Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd polling-system

# Clone the Repository
git clone <repository-url>
cd polling-system

# 2. Install Dependencies
npm install

# 3. Database Setup (PostgreSQL)

# Access PostgreSQL CLI
psql -U postgres

# Create a database in PostgreSQL
CREATE DATABASE poll_db;

# Ensure the .env file contains the correct database configuration:
cat > .env <<EOL
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=poll_db
DB_PORT=5432
KAFKA_HOST=localhost:9092
EOL

# Sync the database schema by running Sequelize sync
npm run start

# 4. Kafka Setup

# Start Zookeeper
zookeeper-server-start.sh /usr/local/etc/kafka/zookeeper.properties

# Start Kafka broker
kafka-server-start.sh /usr/local/etc/kafka/server.properties

# Create a Kafka topic for poll votes
kafka-topics.sh --create --topic virat-kohli-centuries-poll --partitions 3 --replication-factor 1 --bootstrap-server localhost:9092

# 5. WebSocket Server is integrated with the Express server and will start automatically.

# 6. Starting the Express Server and Kafka Consumer
npm run start

# The Express server will run on port 3001, and WebSocket connections will run on the same instance.

# API Documentation
http://localhost:3001/api-docs

# Create Poll (POST)
curl -X POST http://localhost:3001/api/polls \
-H "Content-Type: application/json" \
-d '{
  "title": "How many centuries will Virat Kohli score?",
  "description": "A poll for the number of centuries Kohli will score.",
  "options": ["0", "1", "2", "3+"]
}'

# Vote for a Poll Option (POST)
curl -X POST http://localhost:3001/api/polls/1/vote \
-H "Content-Type: application/json" \
-d '{
  "option": "1"
}'

# Get Leaderboard (GET)
curl http://localhost:3001/api/leaderboard


# Project Structure Overview:
polling-system/
│
├── config/
│   └── db.js                 # Database connection setup
│
├── controllers/
│   ├── pollController.js      # Controller for Poll creation and voting
│   └── leaderboardController.js # Controller for leaderboard
│
├── kafka/
│   ├── producer.js            # Kafka producer for sending votes
│   └── consumer.js            # Kafka consumer for receiving votes
│
├── models/
│   ├── poll.js                # Poll model
│   └── pollOption.js          # PollOption model
│
├── public/
│   └── leaderboard.html       # Frontend for real-time leaderboard
│
├── routes/
│   ├── pollRoute.js           # Routes for Poll API
│   └── leaderboardRoute.js    # Routes for Leaderboard API
│
├── websockets/
│   └── socket.js              # WebSocket broadcast logic
│
├── .env                       # Environment variables
├── index.js                   # Entry point for the Express server
├── README.md                  # Project documentation
└── package.json               # Project dependencies
