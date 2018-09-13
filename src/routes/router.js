import express from 'express';
import Joi from 'joi';
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

router.post('/orders', (req, res) => {
  const schema = {
    quantity: Joi.number().required(),
    price: Joi.number().required(),
    desc: Joi.string().required(),
  };

  const { error, value } = Joi.validate(req.body, schema);
  if (value) {
    const { quantity, desc, price } = req.body;

    const order = {
      id: db.length + 1,
      quantity,
      desc,
      createdAt: new Date(),
      price,
      status: false,
      completed: false,
    };
    db.unshift(order);
    res.status(200).send({
      success: true,
      message: 'order was successfully posted',
      order,
    });
  } else {
    return res.status(403).send({
      success: false,
      message: error.message,
    });
  }
});

export default router;
