/** Mars University app */

const express = require('express');
const nunjucks = require('nunjucks');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('tiny'));

nunjucks.configure('templates', {
  autoescape: true,
  express: app
});

/** routes */

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
const facultyRoutes = require('./routes/faculty');

app.use('/', authRoutes);
app.use('/students', studentRoutes);
app.use('/courses', courseRoutes);
app.use('/faculty', facultyRoutes);

/** 404 handler */

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

module.exports = app;
