require("./config/settings.js");
var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var userFingerPrint = new Schema({
  userId : Number,
  fpIndex : Number,
  minutiae : String,
  updated_at : {type:Date, default: Date.toUTCString}
});

var logs = new Schema({
  reqQuest : Object,
  FPNum: Number,
  reqBody : Object,
  reqPath : String,
  resBody : Object,
  resTime : Number,
  eventTime: {type:Date, default: Date.toUTCString}
});
logs.index({'$**': 'text'});

var flogs = new Schema({
  reqFunc: String,
  FPNum: Number,
  reqBody: Object,
  resTime: Number,
  resCode: Number,
  eventTime: {type:Date, default: Date.toUTCString}
})

mongoose.model( 'userFingerPrint', userFingerPrint );
mongoose.model( 'logs', logs );
mongoose.model( 'flogs', flogs );
mongoose.connect( DBCONNECTION , function(err){
  var admin = new mongoose.mongo.Admin(mongoose.connection.db);
  admin.buildInfo(function (err, info) {
    //console.log(info.version);
    MONGOVERSION = info.version;
  });
});
