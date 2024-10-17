const express = require('express');
const sequelize = require('./config/db');
const pollRoutes = require('./routes/pollRoute');
const leaderboardRoute = require('./routes/leaderboardRoute');
const path = require('path');
const WebSocket = require('ws');
const kafkaConsumer = require('./kafka/consumer'); 
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(express.json());

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Polling API',
      version: '1.0.0',
      description: 'API documentation for the polling system',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'],  
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Add Swagger middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Routes
app.use('/api/polls', pollRoutes);
app.use('/api/leaderboard', leaderboardRoute);

app.use((req, res, next) => {
  res.status(404).send('404: This page could not be found.');
});

// Sync database models
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Start Express server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});


// Setup WebSocket server on the same Express server
const wss = new WebSocket.Server({ server }, () => {
  console.log('WebSocket server is running');
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log('Received from client:', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Function to broadcast updated poll data to all connected clients
const broadcastUpdate = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'leaderboardUpdate',
        data,
      }));
    }
  });
};

kafkaConsumer(broadcastUpdate);
