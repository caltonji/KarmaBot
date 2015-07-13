/**
 * Created by AltonjiC on 7/12/15.
 */
var mongoose = require('mongoose');

var Bot = mongoose.model('Bot');

module.exports = {

    getApplication: function (bot_id, callback) {

        var query = {'bot_id': bot_id};

        Bot.findOne(query, function (err, doc) {
            var retVal = false;
            if (err) {
                console.log("error in finding bot");
                callback(false);
            }
            console.log(doc);
            if (!doc) {
                console.log("this bot_id is not in the db: " + bot_id);
                callback(false);
            } else {
                callback(doc.application);
            }
        });
    },
    add: function(bot_id, application, callback) {
        var newBot = new Bot({bot_id : bot_id, application : application});
        newBot.save(function (err) {
            if (err) {
                console.log("error in saving bot");
                callback(false)
            }
            callback(true);
        });

    }
}