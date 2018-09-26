import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import Joi from 'joi';
import pool from '../config/pool';

dotenv.config();

const adminSignUp = async (req, res) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(4).max(30)
      .required(),
    email: Joi.string().email({ minDomainAtoms: 1 }).required(),
    password: Joi.string().required(),
  });
  const { error } = Joi.validate(req.body, schema);
  if (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT * FROM admins WHERE username = $1', [req.body.username]);
    if (rows[0]) {
      return res.status(409).send({ success: false, message: 'admin with credentials already exits' });
    }

    const hash = bcrypt.hashSync(req.body.password, 1);
    const result = await client.query('INSERT INTO admins  (username,email,password) VALUES ($1, $2, $3) RETURNING *', [req.body.username, req.body.email, hash]);
    const token = Jwt.sign({ admin: result.rows[0] }, process.env.JWT_SECRET_ADMIN);
    res.status(200).send({
      success: true, message: 'admin account successfully created!....', details: result.rows[0], token,
    });
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
};

const adminLogin = async (req, res) => {
  const schema = {
    username: Joi.string().required(),
    password: Joi.string().required(),
  };
  const { error } = Joi.validate(req.body, schema);
  if (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT * FROM admins WHERE username = $1', [req.body.username]);
    if (!rows[0]) {
      return res.status(404).send({ success: false, message: 'admin with credentails doesnt exits in the database!....' });
    }
    const correctPassword = bcrypt.compareSync(req.body.password, rows[0].password);
    if (!correctPassword) {
      return res.status(401).send({ success: false, message: 'the password dooesnt match the supplied username!...' });
    }
    const token = Jwt.sign({ admin: rows[0] }, process.env.JWT_SECRET_ADMIN);
    res.status(200).send({
      success: true, message: 'admin successfully logged In!....', details: rows[0], token,
    });
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
};

const postMenu = async (req, res) => {
  const schema = {
    menutitle: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    imageurl: Joi.string().required(),
  };
  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send({ success: false, message: error.message });
  let decoded;
  try {
    decoded = Jwt.verify(req.token, process.env.JWT_SECRET_ADMIN);
  } catch (err) {
    res.status(403).send({ success: false, message: err.message });
  }
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query('INSERT INTO menus (adminid,description,price,menutitle,imageurl) VALUES ($1, $2, $3, $4, $5) RETURNING *', [decoded.admin.adminid, req.body.description, req.body.price, req.body.menutitle, req.body.imageurl]);
    res.status(200).send({ success: true, message: 'menu was succesfully created', menu: rows[0] });
  } catch (poolErr) {
    console.log(poolErr);
  } finally {
    client.release();
  }
};

const getAllOrders = async (req, res) => {
  try {
    Jwt.verify(req.token, process.env.JWT_SECRET_ADMIN);
  } catch (err) {
    return res.status(401).send({ success: false, message: err.message });
  }
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM orders');
    if (rows.length === 0) {
      return res.status(200).send({ success: false, message: 'there are no orders yet' });
    }
    res.status(200).send({ success: true, message: 'orders successfully returned!...', orders: rows });
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};

export {
  postMenu, adminSignUp, adminLogin, getAllOrders,
};
