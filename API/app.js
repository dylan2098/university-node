const express = require('express');

require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const morgan = require('morgan');
const session = require("express-session");
const { teacherAuth, adminAuth, studentAuth } = require('./middlewares/auth.mdw');
const passport = require("passport");

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use(passport.initialize());
app.use(session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: process.env.MAX_AGE_COOKIE * 24 * 60 * 60 * 1000
    }
}));


app.use(cors());

global.env = require("./config/env-config.json");
global.status = require("./utils/status");


app.get('/', function (req, res) {
    res.json({
        message: 'Welcome from API Online Courses!'
    });
})

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/user', require('./routes/user.route'));
app.use('/api/category', require('./routes/category.route'));
app.use('/api/feedback', require('./routes/feedback.route'));
app.use('/api/course', require('./routes/course.route'));
app.use('/api/favourite', require('./routes/favourite.route'));
app.use('/api/storage', require('./routes/storage.route'));


app.use((req, res, next) => {
    return status.error(res, env.status.e_404);
})

app.use((err, req, res, next) => {
    return status.errorSystem(res, err);
})


app.listen(process.env.PORT, () => {
    console.log(`API is running at http://localhost:${process.env.PORT}`);
});