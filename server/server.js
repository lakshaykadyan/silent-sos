const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const alertRoutes = require('./routes/alertRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const errorHandler = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(cors());

app.use(
  express.json({
    limit: '100kb'
  })
);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Silent SOS API is running'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Silent SOS server running on port ${PORT}`);
  });
};

startServer();