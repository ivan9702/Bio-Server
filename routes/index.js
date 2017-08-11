var express = require('express');
var frontView = express.Router();
var mongoose = require('mongoose');
var FP = mongoose.model('userFingerPrint');
var path = require('path');
var log = mongoose.model('logs');

frontView.get('/', function(req, res) {
  var sum = [0,0,0,0,0,0,0];
  for(var i=0; i<BioserverData.sevenDayAdd.length; ++i)
    sum[i] = BioserverData.sevenDayAdd[i] + BioserverData.sevenDayDelete[i] + BioserverData.sevenDaySearch[i];
  //console.log(sum);
  //console.log(SETTINGSPOSITION);
  res.render('index', {
    title: '主機現況',
    current: 0,
    currentSub: 0,
    totalAPICallAmount: numberWithCommas(BioserverData.totalAPICallAmount),
    todayAPICallAmount: numberWithCommas(BioserverData.todayAPICallAmount),
    totalVerifyAmount: numberWithCommas(BioserverData.totalVerifyAmount),
    totalVerifyAmountChart: BioserverData.totalVerifyAmount,
    totalAddAmountChart: BioserverData.totalAddAmount,
    totalDeleteAmountChart: BioserverData.totalDeleteAmount,
    totalSearchAmountChart: BioserverData.totalSearchAmount,
    totalIdentifyAmount: numberWithCommas(BioserverData.totalIdentifyAmount),
    totalIdentifyAmountChart: BioserverData.totalIdentifyAmount,
    todayAPICallPercent: BioserverData.totalAPICallAmount === 0 ? 0 : Math.round((BioserverData.todayAPICallAmount / BioserverData.totalAPICallAmount)*1000) / 10,
    todayAPICallTimeAvg: Math.round((BioserverData.todayAPICallTime / BioserverData.totalAPICallAmount)*1000)/1000,
    recentAPICallTime: BioserverData.recentAPICallTime,
    totalFPAmount: numberWithCommas(BioserverData.totalFPAmount),
    totalFPAmountPercent: Math.round(BioserverData.totalFPAmount / 120) / 10,
    databaseLink: BioserverData.databaseLink,
    totalErrCallAmount: numberWithCommas(BioserverData.totalErrCallAmount),
    todayErrCallAmount: numberWithCommas(BioserverData.todayErrCallAmount),
    todayErrCallPercent: BioserverData.todayErrCallAmount === 0 ? 0 : Math.round((BioserverData.todayErrCallAmount / BioserverData.totalErrCallAmount)*1000) / 10,
    today200Percent: BioserverData.today200Amount === 0 ? 0 : Math.round((BioserverData.today200Amount / BioserverData.todayAPICallAmount)*10000) / 100,
    today403Percent: BioserverData.today403Amount === 0 ? 0 : Math.round((BioserverData.today403Amount / BioserverData.todayAPICallAmount)*10000) / 100,
    today404Percent: BioserverData.today404Amount === 0 ? 0 : Math.round((BioserverData.today404Amount / BioserverData.todayAPICallAmount)*10000) / 100,
    today406Percent: BioserverData.today406Amount === 0 ? 0 : Math.round((BioserverData.today406Amount / BioserverData.todayAPICallAmount)*10000) / 100,
    today501Percent: BioserverData.today501Amount === 0 ? 0 : Math.round((BioserverData.today501Amount / BioserverData.todayAPICallAmount)*10000) / 100,
    totalIdentifyPercent: BioserverData.totalIdentifyAmount === 0 ? 0 : Math.round((BioserverData.totalIdentifyAmount / BioserverData.totalAPICallAmount)*1000) / 10,
    totalVerifyPercent: BioserverData.totalVerifyAmount === 0 ? 0 : Math.round((BioserverData.totalVerifyAmount / BioserverData.totalAPICallAmount)*1000) / 10,
    totalAddPercent: BioserverData.totalAddAmount === 0 ? 0 : Math.round((BioserverData.totalAddAmount / BioserverData.totalAPICallAmount)*1000) / 10,
    totalDeletePercent: BioserverData.totalDeleteAmount === 0 ? 0 : Math.round((BioserverData.totalDeleteAmount / BioserverData.totalAPICallAmount)*1000) / 10,
    totalSearchPercent: BioserverData.totalSearchAmount === 0 ? 0 : Math.round((BioserverData.totalSearchAmount / BioserverData.totalAPICallAmount)*1000) / 10,
    sevenDays: BioserverData.sevenDays,
    sevenDayError: BioserverData.sevenDayError,
    sevenDayVerify: BioserverData.sevenDayVerify,
    sevenDaySum: BioserverData.sevenDaySum,
    sevenDaySearch: BioserverData.sevenDaySearch,
    sevenDayIdentify: BioserverData.sevenDayIdentify,
    sevenDayDelete: BioserverData.sevenDayDelete,
    sevenDayAdd: BioserverData.sevenDayAdd,
    sum: sum,
    settingsPosition: SETTINGSPOSITION,
    nodeVersion: NODEVERSION,
    dllPosition: DLLPOSITION,
    mongoVersion: MONGOVERSION,
    ffiVersion: FFIVERSION,
    serverOS: SERVEROS,
    dllLastDateTime: DLLLASTDATETIME
  });
});

frontView.get('/demo/enroll', function(req, res) {
  res.render('demoEnroll', { title: '指紋建檔', current: 1, currentSub: 1});
});

frontView.get('/demo/delete', function(req, res) {
  res.render('demoDelete', { title: '刪除使用者', current: 1, currentSub: 2});
});

frontView.get('/demo/search', function(req, res) {
  res.render('demoSearch', { title: '搜尋使用者', current: 1, currentSub: 3});
});

frontView.get('/demo/verify', function(req, res) {
  res.render('demoVerify', { title: '指紋驗證', current: 1, currentSub: 4});
});

frontView.get('/demo/identify', function(req, res) {
  res.render('demoIdentify', { title: '指紋識別', current: 1, currentSub: 5});
});

frontView.get('/spec', function(req, res) {
  res.render('spec', { title: '開發文件', current: 2, currentSub: 0});
});

frontView.get('/news', function(req, res) {
  res.render('issueNews', { title: '最新訊息', current: 3, currentSub: 0});
});

frontView.get('/function/enroll', function(req, res) {
  res.render('functionEnroll', { title: '指紋建檔', current: 4, currentSub: 6});
});

frontView.get('/function/delete', function(req, res) {
  res.render('functionDelete', { title: '刪除使用者', current: 4, currentSub: 7});
});

frontView.get('/function/search', function(req, res) {
  res.render('functionSearch', { title: '搜尋使用者', current: 4, currentSub: 8});
});

frontView.get('/function/verify', function(req, res) {
  res.render('functionVerify', { title: '指紋驗證', current: 4, currentSub: 9});
});

frontView.get('/function/identify', function(req, res) {
  res.render('functionIdentify', { title: '指紋識別', current: 4, currentSub: 10});
});

frontView.get('/log/restful-api', function(req, res) {
  res.render('logRESTfulAPI', { title: '運行紀錄查詢', current: 5, currentSub: 0});
});

frontView.get('/log/function-call', function(req, res) {
  res.render('logFunctionCall', { title: 'Function Call', current: 5, currentSub: 12});
});

frontView.get('/monthly-report/:month*?', function(req, res) {
  if(req.params.month)
    var thisMonth = req.params.month;
  else
    var thisMonth = BioserverData.allMonths[0];
  var targetYear = parseInt(thisMonth.substring(0, 4));
  //console.log(targetYear);
  var targetMonth = parseInt(thisMonth.substring(5, 7));
  //console.log(targetMonth);
  var targetDateBegin = new Date(targetYear, targetMonth - 1, 1, 0, 0, 0, 0);
  var targetDateEnd = new Date(targetYear, targetMonth, 1, 0, 0, 0, 0);
  var monthAddFP = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    monthDeleteFP = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    monthIdentifyFP = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    monthVerifyFP = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    monthSearchFP = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  var monthAdd,monthDelete,monthIdentify,monthVerify,monthIdentify,monthFPLength,monthTimeLength;
  var monthFP = [];
  var monthTime = [];
  //console.log(targetDateBegin);
  log.find({eventTime: {$gte: targetDateBegin, $lt: targetDateEnd}}, null, {sort: {eventTime: 1}}, function(err, apiLogs){
    //console.log(apiLogs);
    apiLogs.forEach(function(apiLog){
      monthFP.push(apiLog.FPNum);
      monthTime.push(apiLog.resBody.resTime);
      var targetDate = apiLog.eventTime.getDate() - 1;
      switch(apiLog.reqPath){
        case "/addFP":
          monthAddFP[targetDate]++;
          break;
        case "/deleteFP":
          monthDeleteFP[targetDate]++;
          break;
        case "/searchFP":
          monthSearchFP[targetDate]++;
          break;
        case "/verifyFP":
          monthVerifyFP[targetDate]++;
          break;
        case "/identifyFP":
          monthIdentifyFP[targetDate]++;
          break;
      }
    });
    //console.log(monthAddFP);
    monthFPLength = monthFP.length;
    monthTimeLength = monthTime.length;
    var cos = [];
    for (var i = 0; i < monthTimeLength; i++) {
      cos.push({x: i, y: monthTime[i]});
    }
    var sin = [];
    for (var i = 0; i < monthFPLength; i++) {
      sin.push({x: i, y: monthFP[i]});
    }
    monthAdd = monthAddFP.reduce(function(pv, cv) { return pv + cv; }, 0);
    monthDelete = monthDeleteFP.reduce(function(pv, cv) { return pv + cv; }, 0);
    monthSearch = monthSearchFP.reduce(function(pv, cv) { return pv + cv; }, 0);
    monthVerify = monthVerifyFP.reduce(function(pv, cv) { return pv + cv; }, 0);
    monthIdentify = monthIdentifyFP.reduce(function(pv, cv) { return pv + cv; }, 0);
    res.render('monthlyReport', {
      title: thisMonth,
      current: 6,
      currentSub: 0,
      monthAddFP: monthAddFP,
      monthDeleteFP: monthDeleteFP,
      monthSearchFP: monthSearchFP,
      monthVerifyFP: monthVerifyFP,
      monthIdentifyFP: monthIdentifyFP,
      monthAdd: monthAdd,
      monthDelete: monthDelete,
      monthSearch: monthSearch,
      monthVerify: monthVerify,
      monthIdentify: monthIdentify,
      allMonths: BioserverData.allMonths,
      cos: JSON.stringify(cos),
      sin: JSON.stringify(sin)
    });
  });
});

frontView.get('/error-analytics', function(req, res) {
  res.render('errorAnalytics', { title: '2016/10', current: 7, currentSub: 0});
});

module.exports = frontView;
