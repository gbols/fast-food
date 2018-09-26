import Router from 'express-promise-router';
import {
  signUp, login, signOut, verifyToken, getAllMenu, catchAllRoutes,
} from '../controllers/user';
import { getAnOrder, postOrder } from '../controllers/order';
import { adminLogin, adminSignUp, postMenu } from '../controllers/admin';

const router = new Router();


router.post('/auth/signup', signUp);
router.post('/order', verifyToken, postOrder);
router.post('/auth/login', login);

router.post('/auth/adminlogin', adminLogin);
router.post('/auth/adminsignup', adminSignUp);
router.post('/menu', verifyToken, postMenu);

router.get('/signout', signOut);
router.get('/users/:id/orders', verifyToken, getAnOrder);
router.get('/menu', getAllMenu);
router.all('*', catchAllRoutes);

export default router;
