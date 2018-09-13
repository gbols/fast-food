import express from 'express';
import db from '../model';

const router = express.Router();

router.get('', (req, res) => {
  res.send('hello world');
});

router.get('/orders', (req, res) => {
  res.status(200).json(db);
});

router.get('/orders/:id', (req, res) => {
  const orderId = Number(req.params.id);
  const theOrder = db.find(order => order.id === orderId);
  if (!theOrder) {
    return res.status(404).send({
      success: false,
      message: 'The given order cant be found in the database',
    });
  }
  res.status(200).send({
    success: true,
    message: 'order was successfully found',
    order: theOrder,
  });
});

export default router;
