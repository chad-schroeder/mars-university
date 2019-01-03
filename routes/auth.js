/** Routes for authentication. */

const Router = require('express').Router;
const createToken = require('../helpers/createToken');
const Student = require('../models/student');

const router = new Router();

/** Homepage */

router.get('/', async (req, res, next) => {
  return res.render('../templates/home.html');
});

/** GET: Login */

router.get('/login', async (req, res, next) => {
  return res.render('../templates/login.html');
});

/** POST: Login */

router.post('/login', async (req, res, next) => {
  try {
    const student = await Student.authenticate(req.body);
    console.log(student);
    const token = createToken(student);
    return res.json({ token });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
