/** Create a token for authorized routes. */

const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

/** return signed JWT from student data. */

function createToken(student) {
  let payload = {
    username: student.username
  };

  return jwt.sign(payload, SECRET);
}

module.exports = createToken;
