const express = require('express');
const app = express();
const apiRoutes = require('./api');
const authRoutes = require('./auth');

// Middleware
app.use(express.json());

// Routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
