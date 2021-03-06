/**
 * Created by AltonjiC on 7/12/15.
 */
var mongoose = require('mongoose');

var Bot = mongoose.model('Bot');
var applicationService = require('./applicationService.js');
module.exports = {
    getApplication: function (bot_id, callback) {

        Bot.findOne({'bot_id': bot_id}, function (err, doc) {
            var retVal = false;
            if (err) {
                console.log("error in finding bot");
                callback(false);
            }
            if (!doc) {
                console.log("this bot is not in db: " + bot_id);
                callback(false);
            } else {
                console.log("found");
                applicationService.get(doc.application, function(app) {
                    callback(app);
                });
            }
        });
    },
    add: function(bot_id, group_id, application, callback) {
        var newBot = new Bot({bot_id : bot_id, group_id : group_id, application : application});
        newBot.save(function (err) {
            if (err) {
                console.log("error in saving bot");
                callback(false)
            }
            callback(true);
        });

    },
    /* If False, then the code will add a bot so default to true to never have repeats */
    checkForBot: function(application, group_id, callback) {
        var query = {'group_id' : group_id, 'application' : application};

        Bot.findOne(query, function (err, doc) {
            if (err) {
                console.log("error in finding bot");
                callback(true);
            }
            console.log(doc);
            if (!doc) {
                callback(false);
            } else {
                callback(doc);
            }
        });
    }
}