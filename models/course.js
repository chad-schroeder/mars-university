const db = require('../db');

/** Related functions for courses. */

class Course {
  constructor({ id, title, description, section_code, credits }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.section_code = section_code;
    this.credits = credits;
  }

  /** find all courses. */

  static async all() {
    let results = await db.query(`SELECT * FROM courses`);
    return results.rows;
  }

  /** find a course. */

  static async get(id) {
    let result = await db.query(`SELECT * FROM courses WHERE id=$1`, [id]);

    // if no course found...
    if (!result.rows.length) {
      const err = new Error(`No course found with id: ${id}`);
      err.status = 404;
      throw err;
    }

    // else...
    return result.rows[0];
  }
}

module.exports = Course;
