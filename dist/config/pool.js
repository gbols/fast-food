'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pg = require('pg');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pool = void 0;
_dotenv2.default.config();
if (process.env.NODE_ENV === 'test') {
  pool = new _pg.Pool(_config2.default.heroku);
} else {
  process.env.NODE_ENV = 'localdevelopment';
  pool = new _pg.Pool(_config2.default.production);
}

var poolConnect = pool;
exports.default = poolConnect;