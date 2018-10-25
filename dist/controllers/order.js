'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrderHistory = exports.postOrder = undefined;

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
var checkValidOrder = async function checkValidOrder(orders) {
  var client = await _pool2.default.connect();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = orders[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var order = _step.value;

      var _ref = await client.query('SELECT * FROM menus WHERE menuid = $1', [order.menuid]),
          rows = _ref.rows;

      if (!rows[0]) return order;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return 'valid';
};

var postOrder = async function postOrder(req, res) {
  var orderSchema = {
    menuid: _joi2.default.number().required(),
    quantity: _joi2.default.number().required()
  };
  var ordersSchema = {
    myOrders: _joi2.default.array().min(1).items(_joi2.default.object(orderSchema)).required()
  };

  var _Joi$validate = _joi2.default.validate(req.body, ordersSchema),
      error = _Joi$validate.error,
      myOrders = _Joi$validate.value.myOrders;

  if (error) return res.status(400).send({ success: false, message: error.message });
  var decoded = void 0;
  try {
    decoded = _jsonwebtoken2.default.verify(req.token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(400).send({ success: false, message: err.message });
  }
  var result = await checkValidOrder(myOrders);
  if (result !== 'valid') return res.status(400).send({ success: false, message: 'the menuid of the given ' + JSON.stringify(result) + ' order does not exit' });
  var client = void 0;
  try {
    client = await _pool2.default.connect();

    var _ref2 = await client.query('INSERT INTO orders (userid,orderat,status,info) VALUES ($1, $2, $3, $4) RETURNING *', [decoded.user.userid, Date.now(), 'new', JSON.stringify(myOrders)]),
        rows = _ref2.rows;

    res.status(200).send({ success: true, message: 'order was succesfully created', data: rows[0] });
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
var getOrderHistory = async function getOrderHistory(req, res) {
  var userId = Number(req.params.id);
  var result = Number.isInteger(userId);
  if (!result) {
    return res.status(400).send({ success: false, message: 'orderId must be an integer' });
  }
  var decoded = void 0;
  try {
    decoded = _jsonwebtoken2.default.verify(req.token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
  if (userId !== decoded.user.userid) {
    return res.status(409).send({ success: false, message: 'valid credentials needed to access route!.' });
  }
  var client = void 0;
  try {
    client = await _pool2.default.connect();

    var _ref3 = await client.query('SELECT * FROM orders WHERE userid = $1', [userId]),
        rows = _ref3.rows;

    if (rows.length === 0) {
      return res.status(404).send({ success: false, message: 'you havent place any order on the platform' });
    }
    res.status(200).send({ success: true, message: 'orders was successfully returned! ....', orders: rows });
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

exports.postOrder = postOrder;
exports.getOrderHistory = getOrderHistory;