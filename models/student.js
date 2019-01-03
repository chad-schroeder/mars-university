const db = require('../db');
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_ROUNDS } = require('../config');

/** Related functions for students. */

class Student {
  constructor({ id, first_name, middle_name, last_name, avatar }) {
    this.id = id;
    this.first_name = first_name;
    this.middle_name = middle_name;
    this.last_name = last_name;
    this.avatar = avatar;
  }

  /** authenticate student */

  static async authenticate(data) {
    const result = await db.query(
      `SELECT username,
        password
        FROM students
        WHERE username = $1
    `,
      [data.username]
    );

    const student = result.rows[0];

    if (student) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(data.password, student.password);
      if (isValid) {
        return student;
      }
    }

    const invalidPass = new Error('Invalid Username or Password');
    invalidPass.status = 401;
    throw invalidPass;
  }

  /** find all students. */

  static async all() {
    const result = await db.query(`
      SELECT s.id,
        first_name,
        middle_name,
        last_name,
        avatar,
        sp.name AS "species"
      FROM students s
      JOIN species sp ON sp.id = s.species_id
      ORDER BY s.id`);

    return result.rows;
  }

  /** find a student by id. */

  static async get(username) {
    const result = await db.query(
      `SELECT s.id,
          first_name as "first name", 
          middle_name as "middle name",
          last_name as "last name",
          sp.name AS "species"
        FROM students s
        JOIN species sp ON s.species_id = sp.id
        WHERE s.username = $1`,
      [username]
    );

    // if no student found...
    if (!result.rows.length) {
      const err = new Error(`No student found with username: ${username}`);
      err.status = 404;
      throw err;
    }

    // else...
    return result.rows[0];
  }

  /** update a student by id. */

  static async update(username, data) {
    console.log(data);

    if (data.password) {
      // create a hashed password if password changed
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_ROUNDS);
    }

    const result = await db.query(
      `UPDATE students 
        SET password = $2, first_name = $3, middle_name = $4, last_name = $5, species_id = $6
        WHERE username = $1
        RETURNING id, username, first_name, middle_name, last_name, species_id`,
      [
        username,
        data.password,
        data.first_name,
        data.middle_name,
        data.last_name,
        data.species_id
      ]
    );

    const user = result.rows[0];

    if (!user) {
      let notFound = new Error(`No student found with username: ${username}`);
      notFound.status = 404;
      throw notFound;
    }

    return user;
  }
}

module.exports = Student;
