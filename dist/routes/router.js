'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _model = require('../model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('', function (req, res) {
  res.send('hello world');
});

router.get('/orders', function (req, res) {
  res.status(200).json(_model2.default);
});

router.get('/orders/:id', function (req, res) {
  var orderId = Number(req.params.id);
  var theOrder = _model2.default.find(function (order) {
    return order.id === orderId;
  });
  if (!theOrder) {
    return res.status(404).send({
      success: false,
      message: 'The given order cant be found in the database'
    });
  }
  res.status(200).send({
    success: true,
    message: 'order was successfully found',
    order: theOrder
  });
});

exports.default = router;