/*
  A Mini Comment web application db config part with mongodb,
  made by devseed(https://github.com/YuriSizuku/MiniComment)
*/

const mongoose = require('mongoose');
const fs = require('fs');

var SECRET_FILE = "./secret/SECRET_DB.TXT";
var SECRET_URL = ""; //'mongodb://username:password@host:port/database?authSource=admin'

if(SECRET_FILE != ""){
    var SECRET_URL = fs.readFileSync(SECRET_FILE, encodeing="utf8").replace("\r", "").replace("\n", "");
}

mongoose.connect(SECRET_URL, {useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection.on('error', console.error.bind(console, 'mongodb connection error:'));
mongoose.connection.once("open",function(){console.log("mongodb connected!");});
mongoose.connection.once("close",function(){console.log("mongodb db closed");});