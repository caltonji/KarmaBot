/**
 * Created by AltonjiC on 6/20/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BotSchema = new Schema({
    bot_id: String,
    group_id: String,
    application: {type: mongoose.Schema.Types.ObjectId, ref: 'Application'}
})

module.exports = mongoose.model('Bot', BotSchema);
