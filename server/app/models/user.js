var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({

    firstName: String,
    lastName: String,
    imageUrl: String,
    text: String,
});

module.exports = mongoose.model('User', UserSchema);