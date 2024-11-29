var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '24-2 WSD assignment 3' ,ip:req.ip});
  console.log('Client IP:', req.ip);
});

module.exports = router;
