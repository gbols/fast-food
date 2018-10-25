'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.welcomeMessage = exports.updateOrderStatus = exports.getAllOrders = exports.getAnOrder = exports.postMenu = undefined;

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

var postMenu = async function postMenu(req, res) {
  var schema = {
    menutitle: _joi2.default.string().required(),
    description: _joi2.default.string().required(),
    price: _joi2.default.number().required(),
    imageurl: _joi2.default.string().required()
  };

  var _Joi$validate = _joi2.default.validate(req.body, schema),
      error = _Joi$validate.error;

  if (error) return res.status(400).send({ success: false, message: error.message });
  var decoded = void 0;
  try {
    decoded = _jsonwebtoken2.default.verify(req.token, process.env.JWT_SECRET_ADMIN);
  } catch (err) {
    res.status(403).send({ success: false, message: 'You do not have access to view this route' });
  }
  var client = void 0;
  try {
    client = await _pool2.default.connect();

    var _ref = await client.query('INSERT INTO menus (userid,description,price,menutitle,imageurl) VALUES ($1, $2, $3, $4, $5) RETURNING *', [decoded.user.userid, req.body.description, req.body.price, req.body.menutitle, req.body.imageurl]),
        rows = _ref.rows;

    res.status(200).send({ success: true, message: 'menu was succesfully created', menu: rows[0] });
  } catch (poolErr) {
    throw poolErr;
  } finally {
    client.release();
  }
};

/**
 * @param {*} req
 * @param {*} res
 * @returns
 */
var getAnOrder = async function getAnOrder(req, res) {
  var orderId = Number(req.params.id);
  var result = Number.isInteger(orderId);
  if (!result) {
    return res.status(400).send({ success: false, message: 'The order ID must be an integer!...' });
  }
  try {
    _jsonwebtoken2.default.verify(req.token, process.env.JWT_SECRET_ADMIN);
  } catch (err) {
    return res.status(401).send({ success: false, message: 'You do not have access to view this route' });
  }
  var client = void 0;
  try {
    client = await _pool2.default.connect();

    var _ref2 = await client.query('SELECT * FROM orders WHERE orderid = $1', [orderId]),
        rows = _ref2.rows;

    if (rows.length === 0) {
      return res.status(404).send({ success: false, message: 'the given order does\'t exits' });
    }
    res.status(200).send({ success: true, message: 'orders successfully returned!...', order: rows[0] });
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
var getAllOrders = async function getAllOrders(req, res) {
  try {
    _jsonwebtoken2.default.verify(req.token, process.env.JWT_SECRET_ADMIN);
  } catch (err) {
    return res.status(401).send({ success: false, message: 'You do not have access to view this route' });
  }
  var client = void 0;
  try {
    client = await _pool2.default.connect();

    var _ref3 = await client.query('SELECT * FROM orders'),
        rows = _ref3.rows;

    if (rows.length === 0) {
      return res.status(200).send({ success: false, message: 'there are no orders yet' });
    }
    res.status(200).send({ success: true, message: 'orders successfully returned!...', orders: rows });
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
var updateOrderStatus = async function updateOrderStatus(req, res) {
  var orderId = Number(req.params.id);
  var result = Number.isInteger(orderId);
  if (!result) {
    return res.status(400).send({ success: false, message: 'The order ID must be an integer!...' });
  }
  var schema = {
    status: _joi2.default.any().valid(['new', 'processing', 'completed', 'cancelled']).required()
  };

  var _Joi$validate2 = _joi2.default.validate(req.body, schema),
      error = _Joi$validate2.error;

  if (error) return res.status(400).send({ success: false, message: 'You do not have access to view this route' });
  try {
    _jsonwebtoken2.default.verify(req.token, process.env.JWT_SECRET_ADMIN);
  } catch (err) {
    return res.status(401).send({ success: false, message: 'You do not have access to view this route' });
  }
  var client = void 0;
  try {
    client = await _pool2.default.connect();

    var _ref4 = await client.query('UPDATE orders SET status = $1 WHERE orderid = $2 RETURNING *', [req.body.status, orderId]),
        rows = _ref4.rows;

    if (!rows[0]) {
      return res.status(404).send({ success: false, message: 'The given order doesn\'t exist in the database' });
    }
    res.status(200).send({ success: true, message: 'order status was successfully updated', order: rows[0] });
  } catch (poolErr) {
    throw poolErr;
  } finally {
    client.release();
  }
};

/**
 * @param  {} req
 * @param  {} res
 * @returns {}
 */
var welcomeMessage = function welcomeMessage(req, res) {
  res.status(200).send({ success: true, message: 'welcome to fast food fast a platform to order and enjoy intercontinental delicacies' });
};
exports.postMenu = postMenu;
exports.getAnOrder = getAnOrder;
exports.getAllOrders = getAllOrders;
exports.updateOrderStatus = updateOrderStatus;
exports.welcomeMessage = welcomeMessage;