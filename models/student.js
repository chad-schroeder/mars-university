const db = require('../db');
// const bcrypt = require('bcrypt');

// const BCRYPT_WORK_FACTOR = 10;

/** Related functions for students. */

class Student {
  static async findAll() {
    let result = await db.query(`
      SELECT 
        id,
        username,
        first_name,
        last_name,
        avatar
      FROM students`);
    return result.rows;
  }

  static async findOne(username) {
    let result = await db.query(
      `SELECT id, username, first_name, last_name, avatar
        FROM students
        WHERE username = $1`,
      [username]
    );
    return result.rows[0];
  }
}

module.exports = Student;
