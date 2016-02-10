'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuizSchema = new Schema({

    qname: String,

    genre: String,


});

module.exports = mongoose.model('quiz', QuizSchema);