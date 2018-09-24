'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _expressPromiseRouter = require('express-promise-router');

var _expressPromiseRouter2 = _interopRequireDefault(_expressPromiseRouter);

var _user = require('../controllers/user');

var _order = require('../controllers/order');

var _order2 = _interopRequireDefault(_order);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _expressPromiseRouter2.default();

router.post('/auth/signup', _user.signUp);
router.post('/order', _user.verifyToken, _order2.default);
router.post('/auth/login', _user.login);
router.get('/signout', _user.signOut);

exports.default = router;