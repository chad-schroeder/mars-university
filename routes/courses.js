/** Routes for students. */

const Router = require('express').Router;
const Course = require('../models/course');

const router = new Router();

/** GET / get all courses. */

router.get('/', async (req, res, next) => {
  try {
    const courses = await Course.all();
    return res.render('../templates/courses/index.html', { courses });
  } catch (error) {
    return next(error);
  }
});

/** GET /:id => {course: course} */

router.get('/:id', async (req, res, next) => {
  try {
    const course = await Course.get(req.params.id);
    return res.json({ course });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
