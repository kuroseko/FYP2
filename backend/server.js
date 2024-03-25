const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const campaignUpdatesRouter = require('./routes/campaignUpdates');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/updates', campaignUpdatesRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Listen on port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
