/**
 * Created by maikzimmermann on 03.11.15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    lastName: String,
    firstName: String,
    text: String,
    imgUrl: String

});

module.exports = mongoose.model('User', UserSchema);