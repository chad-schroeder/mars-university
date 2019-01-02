/** Routes for authentication. */

const Router = require('express').Router;
const createToken = require('../helpers/createToken');

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
    const user = await user.authenticate(req.body);
    const token = createToken(user);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
