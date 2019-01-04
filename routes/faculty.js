/** Routes for faculty. */

const Router = require('express').Router;
const Faculty = require('../models/faculty');

const router = new Router();

/** GET / get all faculty members. */

router.get('/', async (req, res, next) => {
  try {
    const faculty = await Faculty.all();
    return res.render('../templates/faculty/index.html', { faculty });
  } catch (error) {
    return next(error);
  }
});

/** GET /:id => { faculty } */

router.get('/:username', async (req, res, next) => {
  try {
    const faculty = await Faculty.get(req.params.username);
    return res.json({ faculty });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
