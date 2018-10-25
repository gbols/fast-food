import Router from 'express-promise-router';
import {
  signUp, login, signOut, verifyToken, getAllMenu, catchAllRoutes,
} from '../controllers/user';
import { getOrderHistory, postOrder } from '../controllers/order';
import {
  postMenu, getAnOrder, getAllOrders, updateOrderStatus,
} from '../controllers/admin';

const router = new Router();

router.post('/auth/signup', signUp);
router.post('/orders', verifyToken, postOrder);
router.post('/auth/login', login);

// router.post('/auth/adminlogin', adminLogin);
// router.post('/auth/adminsignup', adminSignUp);
router.post('/menu', verifyToken, postMenu);
router.get('/orders', verifyToken, getAllOrders);
router.put('/orders/:id', verifyToken, updateOrderStatus);

router.get('/signout', signOut);
router.get('/users/:id/orders', verifyToken, getOrderHistory);
router.get('/orders/:id', verifyToken, getAnOrder);
router.get('/menu', getAllMenu);
router.all('*', catchAllRoutes);

export default router;
