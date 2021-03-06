'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema;
QuestionSchema = new Schema({


    question: String,
    answer1: String,
    answer2: String,
    answer3: String,
    answer4: String,
    points: Number,
    time: Number,
    subject: String,
    tags: String,
    selected: Boolean,
    creator: String

});

module.exports = mongoose.model('question', QuestionSchema);