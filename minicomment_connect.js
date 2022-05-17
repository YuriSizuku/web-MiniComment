/*
A Mini Comment web application db config part with mongodb,
  v0.9, developed by devseed (https://github.com/YuriSizuku/MiniComment)
*/

// load util libraries
const mongoose = require('mongoose');
const fs = require('fs');
const args = require('minimist')(process.argv.slice(2));

// prepare secret to coonect
var SECRET_URL = process.env.secret_url || "";
var SECRET_FILE = args.secret_file || "./secret/SECRET_DB.TXT";
if(SECRET_URL=="")
{
  SECRET_URL = args.secret_url || ""; //'mongodb://username:password@host:port/database?authSource=admin'
  if(SECRET_URL=="")
  {
    SECRET_URL = fs.readFileSync(SECRET_FILE, 
        encodeing="utf8").replace("\r", "").replace("\n", "");
  }
}

// prepare connect cache
let cached = global.mongoose
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

// async connect mongodb function
async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(SECRET_URL, 
      {useUnifiedTopology: true, useNewUrlParser: true })
      .then((mongoose) => {return mongoose});
    mongoose.connection.on('error', 
      console.error.bind(console, 'mongodb connection error:'));
    mongoose.connection.once("open",
      function(){console.log("mongodb connected!");});
    mongoose.connection.once("close",
      function(){console.log("mongodb db closed");});
  }
  cached.conn = await cached.promise
  return cached.conn
}

module.exports = dbConnect;