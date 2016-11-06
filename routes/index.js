var express = require('express');
var router = express.Router();
//add google api
var google = require('googleapis');






//Render pages
router.get('/', function(req, res){
  res.render('index', {
    title: 'Boston Map'
  });
});


module.exports = router;
