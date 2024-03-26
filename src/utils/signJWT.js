const jwt = require('jsonwebtoken');

// authenticate user token
const jwtToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOEKN_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

module.exports = jwtToken;
