const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Database Connected'))

mongoose.connection.on('error', err => console.log(`Database connection error: ${err.message}`))

const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');

app.use(express.json());
app.use(morgan('dev'));
app.use(expressValidator());

app.use('/', postRoutes);
app.use('/', authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));