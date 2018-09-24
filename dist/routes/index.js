'use strict';

var Router = require('express-promise-router');
var db = require('../db');

var router = new Router();

router.get('/', async function () {
  try {
    var _ref = await db.query('SELECT * FROM users'),
        rows = _ref.rows;

    console.log(rows);
  } catch (err) {
    console.log(err.stack);
  }
});

module.exports = router;