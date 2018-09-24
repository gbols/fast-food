'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var postOrder = async function postOrder(req, res) {
  var schema = {
    quantity: _joi2.default.number().required(),
    description: _joi2.default.string().required(),
    price: _joi2.default.number().required()
  };

  var _Joi$validate = _joi2.default.validate(req.body, schema),
      error = _Joi$validate.error;

  if (error) return res.status(400).send({ success: false, message: error.message });
  var decoded = void 0;
  try {
    decoded = _jsonwebtoken2.default.verify(req.token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
  try {
    var client = await _pool2.default.connect();

    var _ref = await client.query('INSERT INTO orders (userid,quantity,description,price,orderat,status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [decoded.user.userid, req.body.quantity, req.body.description, req.body.price, Date.now(), 'new']),
        rows = _ref.rows;

    res.status(200).send({ success: true, message: 'order was succesfully created', order: rows[0] });
  } catch (poolErr) {
    console.log(poolErr);
  }
};

exports.default = postOrder;