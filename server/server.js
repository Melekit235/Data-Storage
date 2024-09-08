require('dotenv').config();

const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const apiRoutes = require('./routes/api');

const cookieParser = require('cookie-parser');
const cors = require('cors');

// Настройка для хранения файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/uploads/');
  },
  filename: function (req, file, cb) {
    const now = new Date();
    const dateString = now.toISOString().replace(/T/, '_').replace(/\..+/, '');

    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.static('client')); // Обслуживание статических файлов
app.use(cookieParser());

// Маршруты API
app.use('/api', apiRoutes(upload));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
