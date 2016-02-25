/**
 * Created by maikzimmermann on 25.02.16.
 */
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnswerSchema = new Schema({
    type: mongoose.Schema.Types.ObjectId,
    question: String,
    answer: String,
    result: Boolean,
    userId: String,
    kurzel: String,
    quizId: String,
    points: Number,
    delete: Boolean,
    time: Date
});


module.exports = mongoose.model('Answer', AnswerSchema);