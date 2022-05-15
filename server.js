const express = require('express');
var bodyParser = require('body-parser');  // must use body-paser to get post payload
const {api_comment_router} = require('./api_comment');
console.log(api_comment_router)
const args = require('minimist')(process.argv.slice(2));
var PORT = args.port || 3003;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', api_comment_router);

var server = app.listen(PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("comment server at http://%s:%s", host, port);
  })