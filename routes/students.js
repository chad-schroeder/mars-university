/** Routes for students. */

const Router = require('express').Router;
const APIError = require('../helpers/APIError');
// const createToken = require('../helpers/createToken');
const Student = require('../models/student');

const router = new Router();

/** GET /
 * => {students: [{id, first_name, last_name, avatar, last_login_at}, ...]} */

router.get('/', async (req, res, next) => {
  try {
    const students = await Student.all();
    return res.json({ students });
  } catch (error) {
    return next(error);
  }
});

/** GET /:id => {student} */

router.get('/:id', async (req, res, next) => {
  try {
    const student = await Student.get(req.params.id);
    return res.json({ student });
  } catch (error) {
    return next(error);
  }
});

/** PATCH /:id => {student} */

router.patch('/:id', async (req, res, next) => {
  try {
    // throw error if attempting to change id
    if ('id' in req.body || 'avatar' in req.body) {
      return next(
        new APIError(
          400,
          'You are not allowed to change the id or avatar properties.'
        )
      );
    }
    const student = await Student.update(req.params.id, req.body);
    return res.json({ student });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
