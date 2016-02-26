'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuizSchema = new Schema({

    qname: String,
    key: String,
    myDate: Date,
    verifiedStart: Boolean,
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


    user: [{
        id: String,
        fullName: String,
        socketId: String,
        question: String,
        answer: String,
        result: Boolean,
        // redundant?
        points: Number,
        time: Date,
        //
        delete: Boolean
    }],

    genre: String,
    used: Boolean


});

module.exports = mongoose.model('quiz', QuizSchema);