const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Database Connected'))

mongoose.connection.on('error', err => console.log(`Database connection error: ${err.message}`))

const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use(morgan('dev'));
app.use(expressValidator());
app.use(cors());

app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);

// apiDocs
app.get('/', (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            })
        }
        const docs = JSON.parse(data);
        res.json(docs);
    })
})

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized' });
    }
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));