import Router from 'express-promise-router';
import {
  signUp, login, signOut,
} from '../controllers/user';

const router = new Router();


router.post('/auth/signup', signUp);
router.post('/auth/login', login);
router.get('/signout', signOut);

export default router;
