'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _route = require('./routes/route');

var _route2 = _interopRequireDefault(_route);

var _user = require('./controllers/user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.PORT || 3000;

app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: false }));

app.use('/api/v1', _route2.default);
app.use(_user.errorHanlder);

app.listen(port, function () {
  return console.log('listening on port ' + port);
});

exports.default = app;