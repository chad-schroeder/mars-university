const db = require('../db');
const bcrypt = require('bcrypt');

const BCRYPT_WORK_FACTOR = 10;

/** Related functions for students. */

class Student {
  static async authenticate(data) {const db = require('../db');
  const bcrypt = require('bcrypt');
  
  const BCRYPT_WORK_FACTOR = 10;
  
  /** Related functions for students. */
  
  class Student {
    static async authenticate(data) {
      // try to find the student first
      const result = await db.query(
        `SELECT username, 
                password
          FROM students 
          WHERE username = $1`,
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
  
      const invalidPass = new Error('Invalid username or password');
      invalidPass.status = 401;
      throw invalidPass;
    }
  
    static async register(data) {
      // check if user already exists in database
      const duplicateCheck = await db.query(
        `SELECT username 
          FROM users
          WHERE username = $1`,
        [data.username]
      );
  
      if (duplicateCheck.rows[0]) {
        const err = new Error(
          `There already exists a user with the username ${data.username}`;
        );
        err.status = 409;
        throw err;
      }
  
      // create a hashed password for new user
      const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
  
      const result = await db.query(
        `INSERT INTO users (
            username, 
            password, 
            first_name, 
            avatar_url, 
            last_login_at)
          VALUES ($1, $2, $3, $4, current_timestamp)
          RETURNING username, password, first_name, avatar_url`,
        [ data.username, 
          hashedPassword, 
          data.first_name, 
          avatar_url || null
        ]
      );
  
      return result.rows[0];
    }
  
    static async all() {
      const results = await db.query(`SELECT * from users`);
      return results.rows;
    }
  }
  
    // try to find the student first
    const result = await db.query(
      `SELECT username, 
              password
        FROM students 
        WHERE username = $1`,
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

    const invalidPass = new Error('Invalid username or password');
    invalidPass.status = 401;
    throw invalidPass;
  }

  static async register(data) {
    // check if user already exists in database
    const duplicateCheck = await db.query(
      `SELECT username 
        FROM users
        WHERE username = $1`,
      [data.username]
    );

    if (duplicateCheck.rows[0]) {
      const err = new Error(
        `There already exists a user with the username ${data.username}`;
      );
      err.status = 409;
      throw err;
    }

    // create a hashed password for new user
    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users (
          username, 
          password, 
          first_name, 
          avatar_url, 
          last_login_at)
        VALUES ($1, $2, $3, $4, current_timestamp)
        RETURNING username, password, first_name, avatar_url`,
      [ data.username, 
        hashedPassword, 
        data.first_name, 
        avatar_url || null
      ]
    );

    return result.rows[0];
  }

  static async all() {
    const results = await db.query(`SELECT * from users`);
    return results.rows;
  }
}
