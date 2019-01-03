/** Routes for faculty. */

const Router = require('express').Router;
const Faculty = require('../models/faculty');

const router = new Router();

/** GET / get all faculty members. */

router.get('/', async (req, res, next) => {
  try {
    let faculty = await Faculty.all();
    return res.json({ faculty });
  } catch (error) {
    return next(error);
  }
});

/** GET /:id => { faculty } */

router.get('/:id', async (req, res, next) => {
  try {
    let faculty = await Faculty.get(req.params.id);
    return res.json({ faculty });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
