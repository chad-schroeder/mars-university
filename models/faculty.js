const db = require('../db');

/** Related functions for faculty. */

class Faculty {
  constructor({ id, first_name, middle_name, last_name, species_id, avatar }) {
    this.id = id;
    this.first_name = first_name;
    this.middle_name = middle_name;
    this.last_name = last_name;
    this.species_id = species_id;
    this.avatar = avatar;
  }

  /** Get all faculty members. */

  static async all() {
    let results = await db.query(`SELECT * FROM faculty ORDER BY first_name`);
    return results.rows;
  }

  /** Find a faculty member. */

  static async get(id) {
    let result = await db.query(`SELECT * FROM faculty WHERE id=$1`, [id]);
    return result.rows[0];
  }
}

module.exports = Faculty;
