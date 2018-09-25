import Router from 'express-promise-router';
import {
  signUp, login, signOut, verifyToken, getAllMenu, notFound, catchAll,
} from '../controllers/user';
import { getAnOrder, postOrder } from '../controllers/order';

const router = new Router();


router.post('/auth/signup', signUp);
router.post('/order', verifyToken, postOrder);
router.post('/auth/login', login);

router.get('/signout', signOut);
router.get('/users/:id/orders', verifyToken, getAnOrder);
router.get('/menu', getAllMenu);
router.all('*', notFound);

export default router;
