/** Routes for students. */

const Router = require('express').Router;
const env = require('../config');
// const createToken = require('../helpers/createToken');
const Student = require('../models/student');

const router = new Router();

/** GET / get list of students.
 * => {student: [{id, username, first_name, last_name, avatar, last_login_at}, ...]}
 **/

router.get('/', async (req, res, next) => {
  try {
    const students = await Student.findAll();
    return res.json({ students });
  } catch (error) {
    return next(error);
  }
});

/** GET /[username] => {student: student} */

router.get('/:username', async (req, res, next) => {
  try {
    const student = await Student.findOne(req.params.username);
    return res.json({ student });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
