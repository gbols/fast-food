import Router from 'express-promise-router';
import {
  signUp, signOut,
} from '../controllers/user';

const router = new Router();


router.post('/auth/signup', signUp);
router.get('/signout', signOut);

export default router;
