'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var dbConfiguration = {
  development: {
    user: process.env.MAN,
    host: process.env.HOST,
    database: process.env.DATABASE_DEVELOPMENT,
    password: process.env.PASSWORD,
    port: process.env.PORTER
  },

  testing: {
    user: process.env.MAN,
    host: process.env.HOST,
    database: process.env.DATABASE_TEST,
    password: process.env.PASSWORD,
    port: process.env.PORTER

  },

  heroku: {
    connectionString: process.env.TEST_DATABASE_URL
  }
};

exports.default = dbConfiguration;