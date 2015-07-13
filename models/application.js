/**
 * Created by AltonjiC on 6/20/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
    connection_string: String,
    name: String,
    bot_path: String
})

module.exports = mongoose.model('Application', ApplicationSchema);
