'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _swaggerUiExpress = require('swagger-ui-express');

var _swaggerUiExpress2 = _interopRequireDefault(_swaggerUiExpress);

var _route = require('./routes/route');

var _route2 = _interopRequireDefault(_route);

var _swagger = require('../swagger.json');

var _swagger2 = _interopRequireDefault(_swagger);

var _user = require('./controllers/user');

var _admin = require('./controllers/admin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.PORT || 3000;

app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: false }));
app.use((0, _cors2.default)());

app.use('/api-docs', _swaggerUiExpress2.default.serve, _swaggerUiExpress2.default.setup(_swagger2.default));
app.get('/', _admin.welcomeMessage);

app.use('/api/v1', _route2.default);
app.use(_user.errorHanlder);

app.listen(port, function () {
  return console.log('listening on port ' + port);
});

exports.default = app;