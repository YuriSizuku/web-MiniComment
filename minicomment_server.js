/* 
to start server and bind router
  v0.9, developed by devseed
*/

// load util libraries
const express = require('express');
const bodyParser = require('body-parser');  // must use body-paser to get post payload
const args = require('minimist')(process.argv.slice(2));

// load mini comment libraries
const {Router} = require('./minicomment_api');

// bind routers
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', Router);

// start minicomment server
var PORT = args.port || 3003;
var server = app.listen(PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("comment server at http://%s:%s", host, port);
})