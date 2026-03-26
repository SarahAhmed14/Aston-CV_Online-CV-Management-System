require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// import routes
const authRoutes = require('./routes/authRoutes');
const cvRoutes = require('./routes/cvRoutes');

const app = express();

// enable CORS and middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// register API routes
app.use('/api', authRoutes);
app.use('/api', cvRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Server error';
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;
// start server
app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
