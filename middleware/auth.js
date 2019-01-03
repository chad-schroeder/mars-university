/** Convenience middleware to handle common auth cases in routes. */

const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');
const APIError = require('../helpers/APIError');

/** Middleware to use when they must provide a valid token.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If not, raises Unauthorized.
 *
 */

function authRequired(req, res, next) {
  try {
    const tokenStr = req.body.token || req.query.token;

    let token = jwt.verify(tokenStr, SECRET);
    req.username = token.username;
    return next();
  } catch (err) {
    return next(new APIError(401, 'You must authenticate first'));
  }
}

/** Middleware to use when they must provide a valid token that is an admin token.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If not, raises Unauthorized.
 *
 */

function adminRequired(req, res, next) {
  try {
    const tokenStr = req.body.token;

    let token = jwt.verify(tokenStr, SECRET);
    req.username = token.username;

    if (token.is_admin) {
      return next();
    }

    // throw an error, so we catch it in our catch, below
    throw new Error();
  } catch (err) {
    return next(new APIError(401, 'You must be an admin to access'));
  }
}

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If not, raises Unauthorized.
 *
 */
function ensureCorrectUser(req, res, next) {
  try {
    const token = req.body.token;
    const payload = jwt.verify(token, SECRET);

    if (payload.username === req.params.username) {
      // put username on request as a convenience for routes
      req.username = payload.username;
      return next();
    } else {
      throw new Error();
    }
  } catch (error) {
    return next(new APIError(401, 'Unauthorized'));
  }
}

module.exports = {
  authRequired,
  adminRequired,
  ensureCorrectUser
};
