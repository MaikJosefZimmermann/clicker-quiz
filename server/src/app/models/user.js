var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({

    firstName: String,
    lastName: String,
    kuerzel: String,
    role: String,

});

module.exports = mongoose.model('User', UserSchema);