var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var app = express();

//var MongoClient = require('mongodb').MongoClient, assert = require('assert');
// lets require/import the mongodb native drivers
var mongodb = require('mongodb');

// We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection to url
var url = 'mongodb://localhost:27017/repo';
var hospital_coord = [];
var school_coord = [];
var dayCamp_coord = [];

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  if (err) {
    console.log('Unable to connect to the  mongoDB server. Error:', err);
  } else {
    //assert.equal(null, err);
    console.log("Connected successfully to server at: ", url);

    // do some work here with the database.
    var hospital = db.collection('jyaang_robinliu106.hospital');

    hospital.find().toArray(function(err, result) {
      if(err) {
        console.log(err);
      } else if (result.length) {
        //hospital_coord=result;
        console.log('Found:', result);
      } else {
        console.log('No document(s) found with defined "find" criteria!');
      }
      //console.log(hospital_coord);
    })

    var school = db.collection('jyaang_robinliu106.school');

    school.find().toArray(function(err,result) {
      if(err) {
        console.log(err);
      } else if (result.length) {
        //school_coord=result;
        console.log('Found:', result);
      } else {
        console.log('No document(s) found with defined "find" criteria!');
      }
      //console.log(school_coord);
    })

    var dayCamp = db.collection('jyaang_robinliu106.dayCamp');

    dayCamp.find().toArray(function(err, result) {
      if(err) {
        console.log(err);
      } else if (result.length) {
        //dayCamp_coord=result;
        console.log('Found:', result);
      } else {
        console.log('No document(s) found with defined "find" criteria!');
      }
      //console.log(dayCamp_coord);
      //console.log(coord);

      // Close connection
      db.close();
    });
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var port = 8000;
var listening = app.listen(port);

if (listening) {
    console.log('\n App is now running on port: ' + port);
}
