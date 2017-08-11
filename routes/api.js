var express = require('express');
var api = express.Router();
var mongoose = require('mongoose');
var FP = mongoose.model('userFingerPrint');
var log = mongoose.model('logs');
var flog = mongoose.model('flogs');
var ref = require('ref');

api.get('/', function(req, res) {
  res.json({code: 200, message: 'Hello there.'});
});

api.get('/remove', function(req, res) {
  log.remove({FPNum: 0}, function(err){
    if(err)
      res.json({code: 501, message: err, resTime: 0});
    else
      res.json({code: 200, message: 'Removed', resTime: 0});
  });
});

api.get('/getLog/:page*?', function(req, res){
  if(req.params.page)
    var pageNumber = req.params.page;
  else
    var pageNumber = 1;
  var skipNumber = 30 * (pageNumber - 1);
  var resultArray = [];
  var getFunction = function(request){
    switch(request){
      case '/addFP':
        return 'BioServer_AddFP';
        break;
      case '/deleteFP':
        return 'BioServer_DeleteFP';
        break;
      case '/searchFP':
        return 'BioServer_FPSearchEx';
        break;
      case '/identifyFP':
        return 'BioServer_Identify';
        break;
      case '/verifyFP':
        return 'BioServer_Verify';
        break;
    }
  };
  var searchFilter = {};
  if(req.query.code)
    searchFilter["resBody.code"] = parseInt(req.query.code);
  if(req.query.query)
    searchFilter["$text"] = {$search: req.query.query};
  //console.log(searchFilter);
  log.find(searchFilter, null, {skip: skipNumber, limit: 30, sort: {eventTime: -1}}, function(err, apiLogs){
    //console.log(apiLogs);
    if(err)
      res.json({code: 501, message: 'May be Some Error on Input or Server', resTime: 0});
    else{
      apiLogs.forEach(function(apiLog){
        resultArray.push({
          request: apiLog.reqPath,
          req1: apiLog.reqBody && apiLog.reqBody.userId ? apiLog.reqBody.userId : 0,
          req2: apiLog.reqBody && apiLog.reqBody.fpIndex ? apiLog.reqBody.fpIndex : 1,
          req3: apiLog.reqBody && apiLog.reqBody.minutiae ? apiLog.reqBody.minutiae : '',
          responseCode: apiLog.resBody && apiLog.resBody.code ? apiLog.resBody.code : 0,
          res1: apiLog.resBody && apiLog.resBody.message ? apiLog.resBody.message : '',
          res2: apiLog.resBody && apiLog.resBody.data ? JSON.stringify(apiLog.resBody.data) : '',
          function: getFunction(apiLog.reqPath),
          FPNum: apiLog.FPNum ? apiLog.FPNum : 0,
          resCode: apiLog.resBody && apiLog.resBody.resCode ? apiLog.resBody.resCode : 0,
          resTime: apiLog.resBody && apiLog.resBody.resTime ? apiLog.resBody.resTime : 0
        });
      });
      res.json(resultArray);
    }
  });
});

api.get('/getErr/:page*?', function(req, res){
  if(req.params.page)
    var pageNumber = req.params.page;
  else
    var pageNumber = 1;
  var skipNumber = 30 * (pageNumber - 1);
  var resultArray = [];
  var getFunction = function(request){
    switch(request){
      case 'BioServer_AddFP':
        return '/addFP';
        break;
      case 'BioServer_DeleteFP':
        return '/deleteFP';
        break;
      case 'BioServer_FPSearchEx':
        return '/searchFP';
        break;
      case 'BioServer_Identify':
        return '/identifyFP';
        break;
      case 'BioServer_Verify':
        return '/verifyFP';
        break;
    }
  };
  var js_yyyy_mm_dd_hh_mm_ss = function(now) {
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  };
  flog.find({}, null, {skip: skipNumber, limit: 30, sort: {eventTime: -1}}, function(err, apiLogs){
    //console.log(apiLogs);
    if(err)
      res.json({code: 501, message: 'May be Some Error on Input or Server', resTime: 0});
    else{
      apiLogs.forEach(function(apiLog){
        resultArray.push({
          request: apiLog.reqFunc ? getFunction(apiLog.reqFunc) : '',
          function: apiLog.reqFunc ? apiLog.reqFunc : '',
          FPNum: apiLog.FPNum ? apiLog.FPNum : 0,
          reqBody: apiLog.reqBody ? JSON.stringify(apiLog.reqBody) : '',
          resCode: apiLog.resCode ? apiLog.resCode : 0,
          eventTime: apiLog.eventTime ? js_yyyy_mm_dd_hh_mm_ss(apiLog.eventTime) : ''
        });
      });
      res.json(resultArray);
    }
  });
});

api.post('/addFP', function(req, res){
  //console.log(req.body);
  if(req.body.userId && req.body.minutiae && req.body.fpIndex){
    if(req.body.minutiae.length != 1024){
      res.json({code: 406, message: 'Minutiae Code Length Not Satisfied.'});
      return;
    }
    var userMinutiae = new FP({userId: req.body.userId, fpIndex: req.body.fpIndex, minutiae: req.body.minutiae, updated_at: new Date().toUTCString()});
    userMinutiae.save(function(err){
      if(err)
        res.json({code: 501, message: 'May be Some Error on Input or Server', resTime: 0});
      else{
        var userFP = new Buffer(req.body.minutiae, 'hex');
        var beginTime = process.hrtime();
        var FPIdxProcess = dllBioServer.BioServer_AddFP(req.body.userId, req.body.fpIndex, userFP, 512, null, 0, 0);
        var endTime = process.hrtime();
        var resTime = parseFloat(((endTime[0] - beginTime[0])* 1e3 + (endTime[1] - beginTime[1])* 1e-6).toFixed(3));
        if(FPIdxProcess >= 0){
          res.json({code: 200, message: 'User Minutiae Has Been Saved.', resTime: resTime, resCode: FPIdxProcess});
          //console.log(FPIdxProcess);
        }
        else{
          var functionLog = new flog({
            reqFunc: 'BioServer_AddFP',
            FPNum: BioserverData.totalFPAmount,
            reqBody: {
              id: req.body.userId,
              fp_index: req.body.fpIndex,
              minu_code: req.body.minutiae,
              minu_len: 512,
              fp_idxCode: null,
              idx_len: 0,
              dupliChk: 0
            },
            resTime: resTime,
            resCode: FPIdxProcess,
            eventTime: new Date().toUTCString()
          });
          functionLog.save(function(err){
            if(err)
              console.log(err);
            else
              res.json({code: 501, message: 'May be Some Error on Input or Server', resTime: resTime, resCode: FPIdxProcess});
          });
        }
      }
    });
  }
  else
    res.json({code: 406, message: 'Required Columns Not Fullfilled.'});
});

api.post('/deleteFP', function(req, res){
  console.log(req.body);
  if(req.body.userId && req.body.fpIndex){
    FP.findOneAndRemove({userId: req.body.userId, fpIndex: req.body.fpIndex}, function(err){
      if(err)
        res.json({code: 501, message: err});
      else{
        var beginTime = process.hrtime();
        var delAmount = dllBioServer.BioServer_DeleteFP(req.body.userId, req.body.fpIndex);
        var endTime = process.hrtime();
        var resTime = parseFloat(((endTime[0] - beginTime[0])* 1e3 + (endTime[1] - beginTime[1])* 1e-6).toFixed(3));
        if(delAmount > 0){
          res.json({code: 200, message: 'User ' + req.body.userId +'\'s Minutiae With Index '+req.body.fpIndex+' Has Been Deleted.', resTime: resTime, resCode: delAmount});
          console.log('Deleted:'+delAmount);
        }
        else if(delAmount === 0){
          res.json({code: 404, message: 'The Specified User Id and FP Index Number Does Not Exist in BioServer', resTime: resTime, resCode: delAmount});
        }
        else{
          var functionLog = new flog({
            reqFunc: 'BioServer_DeleteFP',
            FPNum: BioserverData.totalFPAmount,
            reqBody: {
              id: req.body.userId,
              fp_index: req.body.fpIndex
            },
            resTime: resTime,
            resCode: delAmount,
            eventTime: new Date().toUTCString()
          });
          functionLog.save(function(err){
            if(err)
              console.log(err);
            else
              res.json({code: 501, message: 'May be Some Error on Input or Server: '+delAmount, resTime: resTime, resCode: delAmount});
          });

        }

      }
    });
  }
  else
    res.json({code: 406, message: 'Required Columns Not Fullfilled.'});
});

api.post('/searchFP', function(req, res){
  if(req.body.minutiae){
    if(req.body.minutiae.length != 1024){
      res.json({code: 406, message: 'Minutiae Code Length Not Satisfied.'});
      return;
    };
    var resultUserId = new Buffer(4*MAXRESULT);
    resultUserId.fill(0);
    var resultFPNum = new Buffer(1*MAXRESULT);
    resultFPNum.fill(0);
    var resultScore = new Buffer(4*MAXRESULT);
    resultScore.fill(0);
    var userFP = new Buffer(req.body.minutiae, 'hex');
    var actualResult = new Buffer(1);
    actualResult.fill(0);
    var actualResultPointer = actualResult.ref();
    var beginTime = process.hrtime();
    var searchStatus = dllBioServer.BioServer_FPSearchEx(userFP, 512, null, 0, SPEEDFLAG, SECURITY, ROTATIONTH, MAXRESULT, actualResultPointer, resultUserId, resultFPNum, resultScore);
    var endTime = process.hrtime();
    var resTime = parseFloat(((endTime[0] - beginTime[0])* 1e3 + (endTime[1] - beginTime[1])* 1e-6).toFixed(3));
    if(searchStatus === 0){
      res.json({code: 404, message: 'No Matched Minutiae Found.', resTime: resTime, resCode: searchStatus});
    }
    else if(searchStatus > 0){
      var resultUserIdArray = resultUserId.toString('hex').match(/.{1,8}/g);
      var resultFPNumArray = resultFPNum.toString('hex').match(/.{1,2}/g);
      var resultScoreArray = resultScore.toString('hex').match(/.{1,8}/g);
      var resultArray = [];
      for(var i=0;i<searchStatus;i++){
        resultArray.push({
          userId: parseInt(resultUserIdArray[i].match(/.{1,2}/g).reverse().join(""), 16),
          fpIndex: parseInt(resultFPNumArray[i], 16),
          score: parseInt(resultScoreArray[i].match(/.{1,2}/g).reverse().join(""), 16),
        });
      }
      res.json({code: 200, message: 'User Minutiae Found: '+searchStatus, data: resultArray, resTime: resTime, resCode: searchStatus});
    }
    else{
      var functionLog = new flog({
        reqFunc: 'BioServer_FPSearchEx',
        FPNum: BioserverData.totalFPAmount,
        reqBody: {
          minu_code: req.body.minutiae,
          minu_len: 512,
          fp_idxCode: null,
          idx_len: 0,
          speed_flag: SPEEDFLAG,
          security: SECURITY,
          rotation_th: ROTATIONTH,
          max_result: MAXRESULT,
          actual_result: 'pointer',
          rtn_id: 'pointer',
          rtn_fp_num: 'pointer',
          rtn_score: 'pointer'
        },
        resTime: resTime,
        resCode: searchStatus,
        eventTime: new Date().toUTCString()
      });
      functionLog.save(function(err){
        if(err)
          console.log(err);
        else
          res.json({code: 501, message: 'May be Some Error on Input or Server', resTime: resTime, resCode: searchStatus});
      });

    }

  }
  else
    res.json({code: 406, message: 'Required Columns Not Fullfilled.'});
});

api.post('/verifyFP', function(req, res){
  if(req.body.userId && req.body.minutiae){
    if(req.body.minutiae.length != 1024){
      res.json({code: 406, message: 'Minutiae Code Length Not Satisfied.'});
      return;
    }
    var resultFPNum = new Buffer(1);
    resultFPNum.fill(0);
    var resultScore = new Buffer(4);
    resultScore.fill(0);
    var userFP = new Buffer(req.body.minutiae, 'hex');
    var beginTime = process.hrtime();
    var verifyStatus = dllBioServer.BioServer_Verify(req.body.userId, userFP, 512, null, 0, SPEEDFLAG, SECURITY, ROTATIONTH, resultFPNum, resultScore);
    var endTime = process.hrtime();
    var resTime = parseFloat(((endTime[0] - beginTime[0])* 1e3 + (endTime[1] - beginTime[1])* 1e-6).toFixed(3));
    if(verifyStatus === 0)
      res.json({code: 200, message: 'User ' + req.body.userId + ' Verified.', data: {score: parseInt(resultScore.toString('hex').match(/.{1,2}/g).reverse().join(""), 16), fpIndex : parseInt(resultFPNum.toString('hex'))}, resTime: resTime, resCode: verifyStatus});
    else{
      var functionLog = new flog({
        reqFunc: 'BioServer_Verify',
        FPNum: BioserverData.totalFPAmount,
        reqBody: {
          id: req.body.userId,
          minu_code: req.body.minutiae,
          minu_len: 512,
          fp_idxCode: null,
          idx_len: 0,
          speed_flag: SPEEDFLAG,
          security: SECURITY,
          rotation_th: ROTATIONTH,
          resultFPNum: 'pointer',
          resultScore: 'pointer'
        },
        resTime: resTime,
        resCode: verifyStatus,
        eventTime: new Date().toUTCString()
      });
      functionLog.save(function(err){
        if(err)
          console.log(err);
        else
          res.json({code: 403, message: 'Minutiae is Not Matched with ' + req.body.userId, resTime: resTime, resCode: verifyStatus});
      });
    }
  }
  else
    res.json({code: 406, message: 'Required Columns Not Fullfilled.'});
});

api.post('/identifyFP', function(req, res){
  if(req.body.minutiae){
    if(req.body.minutiae.length != 1024){
      res.json({code: 406, message: 'Minutiae Code Length Not Satisfied.('+req.body.minutiae.length+')'});
      return;
    }
    var resultFPNum = new Buffer(1);
    resultFPNum.fill(0);
    var resultScore = new Buffer(4);
    resultScore.fill(0);
    var resultID = new Buffer(4);
    resultID.fill(0);
    var userFP = new Buffer(req.body.minutiae, 'hex');
    var beginTime = process.hrtime();
    var identifyStatus = dllBioServer.BioServer_Identify(userFP, 512, null, 0, SPEEDFLAG, SECURITY, ROTATIONTH, resultID, resultFPNum, resultScore);
    var endTime = process.hrtime();
    var resTime = parseFloat(((endTime[0] - beginTime[0])* 1e3 + (endTime[1] - beginTime[1])* 1e-6).toFixed(3));
    if(identifyStatus >= 0){
      res.json({code: 200, message: 'Minutiae Identified', data: {userId: parseInt(resultID.toString('hex').match(/.{1,2}/g).reverse().join(""), 16), fpIndex: parseInt(resultFPNum.toString('hex')), score: parseInt(resultScore.toString('hex').match(/.{1,2}/g).reverse().join(""), 16)}, resTime: resTime, resCode: identifyStatus});
    }
    else{
      var functionLog = new flog({
        reqFunc: 'BioServer_Identify',
        FPNum: BioserverData.totalFPAmount,
        reqBody: {
          minu_code: req.body.minutiae,
          minu_len: 512,
          fp_idxCode: null,
          idx_len: 0,
          speed_flag: SPEEDFLAG,
          security: SECURITY,
          rotation_th: ROTATIONTH,
          resultId: 'pointer',
          resultFPNum: 'pointer',
          resultScore: 'pointer'
        },
        resTime: resTime,
        resCode: identifyStatus,
        eventTime: new Date().toUTCString()
      });
      functionLog.save(function(err){
        if(err)
          console.log(err);
        else
          res.json({code: 404, message: 'No User Identified with The Give Minutiae', resTime: resTime, resCode: identifyStatus});
      });
    }
  }
  else
    res.json({code: 406, message: 'Required Columns Not Fullfilled.'});
});

module.exports = api;
