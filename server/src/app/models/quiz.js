'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuizSchema = new Schema({

    qname: String,
    key: String,
    questions: [{
        question: String,
        answer1: String,
        answer2: String,
        answer3: String,
        answer4: String,
        points: Number,
        time: Number,
        subject: String,
        tags: String,
        selected: Boolean
    }],
    genre: String,


});

module.exports = mongoose.model('quiz', QuizSchema);