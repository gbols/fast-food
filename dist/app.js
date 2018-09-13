'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _router = require('./routes/router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.PORT || 3000;

app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: false }));

app.use('/api/v1', _router2.default);

app.listen(port, function () {
  return console.log('listening on port 3000');
});

exports.default = app;