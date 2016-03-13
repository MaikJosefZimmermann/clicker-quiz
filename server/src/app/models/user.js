var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({

    username: String,
    firstName: String,
    lastName: String,
    role: String,
    password: String


});

module.exports = mongoose.model('User', UserSchema);