/** Shared config for application; can be req'd many places. */

const SECRET = process.env.SECRET_KEY || 'shhhh!';
const BCRYPT_WORK_ROUNDS = 10;

const PORT = +process.env.PORT || 3000;

// database is:
//
// - in testing, 'mars-university-test'
// - else: 'mars-university'

let DB_URI;

if (process.env.NODE_ENV === 'test') {
  DB_URI = 'mars-university-test';
} else {
  DB_URI = process.env.DATABASE_URL || 'mars-university';
}

module.exports = {
  SECRET,
  PORT,
  DB_URI,
  BCRYPT_WORK_ROUNDS
};
