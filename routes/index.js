var express = require('express');
var router = express.Router();

const {pool} = require('../dbConnection')

/* GET home page. */
router.get('/', function(req, res, next) {
  pool .query("SELECT NOW()", (err, res) => {
    console.log(err, res);
    pool.end();
  });
  res.render('index', { title: 'Express' });
});

module.exports = router;
