'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuizSchema = new Schema({

    qname: String,
    key: String,
    myDate: Date,
    timeHour: Number,
    timeMin: Number,
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
        selected: Boolean,
    }],
    members: [{
        user: [{
            question: String,
            answer: String,
            result: Boolean,
            points: Number,
            time: Date,
            used: Boolean
        }]
    }],
    genre: String,
    used: Boolean,


});

module.exports = mongoose.model('quiz', QuizSchema);