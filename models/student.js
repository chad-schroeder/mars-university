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

  /** find all students. */

  static async all() {
    let result = await db.query(`
      SELECT 
        s.id,
        first_name,
        middle_name,
        last_name,
        sp.name AS "species"
      FROM students s
      JOIN species sp ON sp.id = s.species_id
      ORDER BY s.id`);

    return result.rows;
  }

  /** find a student by id. */

  static async get(id) {
    let result = await db.query(
      `SELECT 
          s.id,
          first_name as "first name", 
          middle_name as "middle name",
          last_name as "last name",
          sp.name AS "species"
        FROM students s
        JOIN species sp ON s.species_id = sp.id
        WHERE s.id=$1`,
      [id]
    );

    // if no student found...
    if (!result.rows.length) {
      const err = new Error(`No student found with id: ${id}`);
      err.status = 404;
      throw err;
    }

    // else...
    return result.rows[0];
  }

  /** update a student by id. */

  static async update(id, data) {
    if (data.password) {
      // create a hashed password if password changed
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_ROUNDS);
    }

    const result = await db.query(
      `UPDATE students 
        SET password=$2, first_name=$3, middle_name=$4, last_name=$5, species_id=$6
        WHERE id=$1
        RETURNING id, first_name, middle_name, last_name, species_id`,
      [
        id,
        data.password,
        data.first_name,
        data.middle_name,
        data.last_name,
        data.species_id
      ]
    );

    const user = result.rows[0];

    if (!user) {
      let notFound = new Error(`No student found for ${id}`);
      notFound.status = 404;
      throw notFound;
    }

    return user;
  }
}

module.exports = Student;
