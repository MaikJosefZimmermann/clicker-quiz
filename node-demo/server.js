var express = require('express');
var app = express();
var cors = require('cors');

// enable cors:
app.use(cors());


// demo response to all get requests
app.get('/', function (req, res) {
    res.jsonp({
        text: 'Hello World! (from nodeJS)'
    });
});


// start server:

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Our demo app is running at http://localhost:%s', port);
});