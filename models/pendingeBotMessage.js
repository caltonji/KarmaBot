/**
 * Created by AltonjiC on 7/23/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PendingBotMessageSchema = new Schema({
    bot_id: String,
    createdAt: { type: Date, expires: 300, default: Date.now },
    message: {type: mongoose.Schema.Types.ObjectId, ref: 'Message'}
})

module.exports = mongoose.model('PendingBotMessage', PendingBotMessageSchema);
