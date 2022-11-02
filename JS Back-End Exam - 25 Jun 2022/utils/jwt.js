let jwt = require('jsonwebtoken');
let { promisify } = require('util');

exports.sign = promisify(jwt.sign);
exports.verify = promisify(jwt.verify);