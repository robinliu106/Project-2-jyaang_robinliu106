var express = require('express');
var router = express.Router();

//Render Index Page
router.get('/', function(req, res){
  res.render('index', {
    title: 'Boston Map'
  });
});

//Render About Page
router.get('/about', function(req, res){
  res.render('about', {
    title: 'About Page'
  });
});


module.exports = router;
