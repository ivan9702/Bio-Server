
require( './db' );

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mung = require('express-mung');

var mongoose = require('mongoose');
var eventLogs = mongoose.model('logs');

var frontView = require('./routes/index');
var api = require('./routes/api');

var cors = require('cors');

var app = express();

//app.locals.host = "http://localhost:3000";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(mung.json(
    function transform(body, req, res){
      res.on('finish', function(){
        if(req.baseUrl == '/api' && (req.path !== '/' && req.path !== '/remove' && req.path.substring(0,7) !== '/getLog' && req.path.substring(0,7) !== '/getErr')){
          var reqQuest = (Object.keys(req.query).length > 0) ? req.query : null;
          var reqBody = (Object.keys(req.body).length > 0) ? req.body : null;
          var reqPath = req.path;
          var resTime = (req._startAt && res._startAt) ? ((res._startAt[0] - req._startAt[0]) * 1e3 + (res._startAt[1] - req._startAt[1]) * 1e-6).toFixed(3) : null;
          var resBody = body;
          var eventTime = new Date();
          /*var resDate = { year: eventTime.getFullYear(), month: eventTime.getMonth + 1, day: eventTime.getDate};*/
          var eventLogsIns = new eventLogs({reqQuest: reqQuest, FPNum: BioserverData.totalFPAmount, reqBody: reqBody, reqPath: reqPath, resBody: resBody, resTime: resTime, eventTime: eventTime.toUTCString()});
          eventLogsIns.save(function(err){
            if(err)
              console.log(err);
            if(eventTime.yyyymmdd() != BioserverData.today){
              updateStatistics();
              console.log('not the same');
            }
            else{
              BioserverData.totalAPICallAmount++;
              BioserverData.todayAPICallAmount++;
              BioserverData.sevenDaySum++;
              BioserverData.todayAPICallTime += parseFloat(resBody.resTime);
              BioserverData.recentAPICallTime = parseFloat(resBody.resTime);
              switch(resBody.code){
                case 200:
                  BioserverData.today200Amount++;
                  break;
                case 403:
                  BioserverData.today403Amount++;
                  BioserverData.totalErrCallAmount++;
                  BioserverData.todayErrCallAmount++;
                  BioserverData.sevenDayError[0]++;
                  break;
                case 404:
                  BioserverData.today404Amount++;
                  BioserverData.totalErrCallAmount++;
                  BioserverData.todayErrCallAmount++;
                  BioserverData.sevenDayError[0]++;
                  break;
                case 406:
                  BioserverData.today406Amount++;
                  BioserverData.totalErrCallAmount++;
                  BioserverData.todayErrCallAmount++;
                  BioserverData.sevenDayError[0]++;
                  break;
                case 501:
                  BioserverData.today501Amount++;
                  BioserverData.totalErrCallAmount++;
                  BioserverData.todayErrCallAmount++;
                  BioserverData.sevenDayError[0]++;
                  break;
              }
              switch(reqPath){
                case "/addFP":
                  BioserverData.sevenDayAdd[0]++;
                  if(resBody.code == 200)
                    BioserverData.totalFPAmount++;
                  BioserverData.totalAddAmount++;
                  break;
                case "/deleteFP":
                  BioserverData.sevenDayDelete[0]++;
                  if(resBody.code == 200)
                    BioserverData.totalFPAmount--;
                  BioserverData.totalDeleteAmount++;
                  break;
                case "/searchFP":
                  BioserverData.sevenDaySearch[0]++;
                  BioserverData.totalSearchAmount++;
                  break;
                case "/verifyFP":
                  BioserverData.sevenDayVerify[0]++;
                  BioserverData.totalVerifyAmount++;
                  break;
                case "/identifyFP":
                  BioserverData.totalIdentifyAmount++;
                  BioserverData.sevenDayIdentify[0]++;
                  break;
              }
              //console.log(BioserverData);
            }


          });
        }
        else{
          return;
        }
      });
    }
  ));

app.use(cors());
app.use('/', frontView);
app.use('/api', api);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.on('listening', function () {
  console.log('demo');
});

module.exports = app;
