var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuizSchema = new Schema({

    question: String,
    answer1: String,
    answer2: String,
    answer3: String

});

module.exports = mongoose.model('quiz', QuizSchema);