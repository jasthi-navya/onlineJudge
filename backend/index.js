require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const problemRoutes = require('./routes/problem');
const cors = require('cors');
const { v4: uuid } = require('uuid');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const secretCode = process.env.SECRET_CODE;

app.get('/secret-code', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ secretCode });
});

(async () => {
  try {
    await mongoose.connect('', { useNewUrlParser: true });
    console.log('Database connected successfully');
  } catch (error) {
    console.log('Error while connecting with the database ', error.message);
  }
})();


app.use(userRoutes);
app.use(problemRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

