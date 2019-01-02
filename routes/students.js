/** Routes for students. */

const Router = require('express').Router;
const env = require('../config');
// const createToken = require('../helpers/createToken');
const Student = require('../models/student');

const router = new Router();

/** GET / get list of students.
 * => {student: [{id, username, first_name, last_name, avatar, last_login_at}, ...]}
 **/

router.get('/students', async (req, res, next) => {
  try {
    const results = await Student.all();
    return res.json(results);
    // return res.render('../templates/students.html');
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
