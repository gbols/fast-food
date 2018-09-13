import express from 'express';
import db from '../model';

const router = express.Router();

router.get('', (req, res) => {
  res.send('hello world');
});

router.get('/orders', (req, res) => {
  res.status(200).json(db);
});
export default router;
