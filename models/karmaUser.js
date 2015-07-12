/**
 * Created by AltonjiC on 7/12/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var KarmaUserSchema = new Schema({
    user_id: String,
    group_id: String,
    bot_id: String,
    karma: Number
})

module.exports = mongoose.model('KarmaUser', KarmaUserSchema);
