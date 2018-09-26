'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _expressPromiseRouter = require('express-promise-router');

var _expressPromiseRouter2 = _interopRequireDefault(_expressPromiseRouter);

var _user = require('../controllers/user');

var _order = require('../controllers/order');

var _admin = require('../controllers/admin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _expressPromiseRouter2.default();

router.post('/auth/signup', _user.signUp);
router.post('/order', _user.verifyToken, _order.postOrder);
router.post('/auth/login', _user.login);

router.post('/auth/adminlogin', _admin.adminLogin);
router.post('/auth/adminsignup', _admin.adminSignUp);
router.post('/menu', _user.verifyToken, _admin.postMenu);
router.get('/orders', _user.verifyToken, _admin.getAllOrders);
router.put('/orders/:id', _user.verifyToken, _admin.updateOrderStatus);

router.get('/signout', _user.signOut);
router.get('/users/:id/orders', _user.verifyToken, _order.getOrderHistory);
router.get('/orders/:id', _user.verifyToken, _admin.getAnOrder);
router.get('/menu', _user.getAllMenu);
router.all('*', _user.catchAllRoutes);

exports.default = router;