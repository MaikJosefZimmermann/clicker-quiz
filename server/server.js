/**
 * Created by maikzimmermann on 03.11.15.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');


app.use(bodyParser());
app.use(cors());
app.use('/api', require('./app/routes/index'));
app.use('/api/users',require('./app/routes/user'));
mongoose.connect('mongodb://localhost:27018/users');

var port = process.env.PORT || 8080; //wenn preocess.env gesetzt ist, nimm ihn, sonst Port 8080

app.listen(port);
console.log('Magic happens on Port: ' + port);
