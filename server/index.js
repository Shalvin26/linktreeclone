const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const linkRoutes = require('./routes/links');
const analyticsRoutes = require('./routes/analytics');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/analytics', analyticsRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected'))
  .catch((err) => console.log('DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));