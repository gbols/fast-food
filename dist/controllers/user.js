'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signOut = exports.verifyToken = exports.errorHanlder = exports.catchAllRoutes = exports.getAllMenu = exports.login = exports.signUp = undefined;

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _pool = require('../config/pool');

var _pool2 = _interopRequireDefault(_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
/**
 * @param  {} req
 * @param  {} res
 * @returns {}
 */
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
    return res.status(400).send({ success: false, message: error.message });
  }
  var client = await _pool2.default.connect();
  try {
    var _ref = await client.query('SELECT * FROM users WHERE username = $1', [req.body.username]),
        rows = _ref.rows;

    if (rows[0]) {
      return res.status(409).send({ success: false, message: 'user with credentials already exits' });
    }

    var hash = _bcrypt2.default.hashSync(req.body.password, 1);
    var result = await client.query('INSERT INTO users  (username,email,address,password,phone) VALUES ($1, $2, $3, $4, $5) RETURNING *', [req.body.username, req.body.email, req.body.address, hash, req.body.phone]);
    var user = {
      username: result.rows[0].username,
      email: result.rows[0].email,
      address: result.rows[0].address,
      phone: result.rows[0].phone
    };
    var token = _jsonwebtoken2.default.sign({ user: user }, process.env.JWT_SECRET);
    res.status(200).send({
      success: true, message: 'user account successfully created!....', token: token
    });
  } catch (err) {
    throw err.stack;
  } finally {
    client.release();
  }
};

/**
 * @param  {} req
 * @param  {} res
 * @returns {}
 */
var login = async function login(req, res) {
  var schema = {
    username: _joi2.default.string().required(),
    password: _joi2.default.string().required()
  };

  var _Joi$validate2 = _joi2.default.validate(req.body, schema),
      error = _Joi$validate2.error;

  if (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
  var client = await _pool2.default.connect();
  try {
    var _ref2 = await client.query('SELECT * FROM users WHERE username = $1', [req.body.username]),
        rows = _ref2.rows;

    if (!rows[0]) {
      return res.status(404).send({ success: false, message: 'Invalid username or password' });
    }
    var correctPassword = _bcrypt2.default.compareSync(req.body.password, rows[0].password);
    if (!correctPassword) {
      return res.status(401).send({ success: false, message: 'Invalid username or password' });
    }
    var user = {
      username: rows[0].username,
      email: rows[0].email,
      address: rows[0].address,
      phone: rows[0].phone
    };
    var token = _jsonwebtoken2.default.sign({ user: user }, process.env.JWT_SECRET);
    res.status(200).send({
      success: true, message: 'user successfully logged In!....', token: token
    });
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};
/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @returns {}
 */
var verifyToken = function verifyToken(req, res, next) {
  var bearerHeader = req.headers.authorization;
  if (!bearerHeader) return res.status(403).send({ success: false, message: 'Forbidden!,valid token needed to access route' });
  var bearer = bearerHeader.split(' ');
  var bearerToken = bearer[1];
  req.token = bearerToken;
  next();
};

/**
 * @param  {} req
 * @param  {} res
 * @returns {}
 */
var signOut = function signOut(req, res) {
  res.status(200).send({ success: true, message: 'you have successfully signed out' });
};

/**
 * @param  {} req
 * @param  {} res
 * @returns {}
 */
var getAllMenu = async function getAllMenu(req, res) {
  var client = void 0;
  try {
    client = await _pool2.default.connect();

    var _ref3 = await client.query('SELECT * FROM menus'),
        rows = _ref3.rows;

    if (rows.length === 0) {
      return res.status(200).send({ success: false, message: 'there are no menu items yet' });
    }
    res.status(200).send({ success: true, message: 'menu items successfully returned!...', menus: rows });
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

/**
 * @param  {} req
 * @param  {} res
 * @returns {}
 */
var catchAllRoutes = function catchAllRoutes(req, res) {
  res.status(404).send({ success: false, message: 'the requested route can\'t be found' });
};

/**
 * @param  {} req
 * @param  {} res
 * @returns {}
 */
var errorHanlder = function errorHanlder(err, req, res, next) {
  res.status(500).send({ success: false, message: 'Something broke when processing request!' });
  throw err.stack;
};
exports.signUp = signUp;
exports.login = login;
exports.getAllMenu = getAllMenu;
exports.catchAllRoutes = catchAllRoutes;
exports.errorHanlder = errorHanlder;
exports.verifyToken = verifyToken;
exports.signOut = signOut;