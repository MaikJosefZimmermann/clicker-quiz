var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    port = process.env.PORT || 9000;

mongoose.connect('mongodb://localhost:27018/quiz');


app.use(bodyParser.json());
app.use(cors());
app.use('/api/quizes', require('./app/routes/quiz'));
app.listen(port);

console.log('Magic happens on port ' + port);