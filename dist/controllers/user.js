'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signOut = exports.verifyToken = exports.signUp = undefined;

var _pg = require('pg');

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pool = void 0;
_dotenv2.default.config();

if (process.env.NODE_ENV === 'test') {
  pool = new _pg.Pool(_config2.default.heroku);
} else {
  process.env.NODE_ENV = 'development';
  pool = new _pg.Pool(_config2.default.development);
}

console.log(process.env.NODE_ENV);
var signUp = async function signUp(req, res) {
  var schema = _joi2.default.object().keys({
    username: _joi2.default.string().alphanum().min(4).max(30).required(),
    email: _joi2.default.string().email({ minDomainAtoms: 1 }).required(),
    address: _joi2.default.string().required(),
    password: _joi2.default.string().required(),
    phone: _joi2.default.string().required()
  });

  var _Joi$validate = _joi2.default.validate(req.body, schema),
      error = _Joi$validate.error;

  if (error) {
    return res.status(403).send({ success: false, message: error.message });
  }
  var client = await pool.connect();
  try {
    var _ref = await client.query('SELECT * FROM users WHERE username = $1', [req.body.username]),
        rows = _ref.rows;

    if (rows[0]) {
      return res.status(409).send({ success: false, message: 'user with credentials already exits' });
    }

    var hash = _bcrypt2.default.hashSync(req.body.password, 1);
    var result = await client.query('INSERT INTO users  (username,email,address,password,phone) VALUES ($1, $2, $3, $4, $5) RETURNING *', [req.body.username, req.body.email, req.body.address, hash, req.body.phone]);
    var token = _jsonwebtoken2.default.sign({ user: result.rows[0] }, process.env.JWT_SECRET);
    res.status(200).send({
      success: true, message: 'user account successfully created!....', details: result.rows[0], token: token
    });
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
};

// const login = async (req, res) => {
//   const schema = {
//     username: Joi.string().required(),
//     password: Joi.string().required(),
//   };
//   const { error } = Joi.validate(req.body, schema);
//   if (error) {
//     return res.status(403).send({ success: false, message: error.message });
//   }
//   const client = await pool.connect();
//   try {
//     const { rows } = await client.query('SELECT * FROM users WHERE username = $1', [req.body.username]);
//     if (!rows[0]) {
//       return res.status(404).send({ success: false, message: 'user with credentails doesnt exits in the database!....' });
//     }
//     const correctPassword = bcrypt.compareSync(req.body.password, rows[0].password);
//     if (!correctPassword) {
//       return res.status(401).send({ success: false, message: 'the password dooesnt match the supplied username!...' });
//     }
//     const token = Jwt.sign({ user: rows[0] }, process.env.JWT_SECRET);
//     res.status(200).send({
//       success: true, message: 'user successfully logged In!....', details: rows[0], token,
//     });
//   } catch (err) {
//     console.log(err.stack);
//   } finally {
//     client.release();
//   }
// };

var verifyToken = function verifyToken(req, res, next) {
  var bearerHeader = req.headers.authorization;
  if (!bearerHeader) return res.status(403).send('Forbidden! ....');
  var bearer = bearerHeader.split(' ');
  var bearerToken = bearer[1];
  req.token = bearerToken;
  next();
};

var signOut = function signOut(req, res) {
  res.status(200).send({ success: true, message: 'you have successfully signed out' });
};

exports.signUp = signUp;
exports.verifyToken = verifyToken;
exports.signOut = signOut;