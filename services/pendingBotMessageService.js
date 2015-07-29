/**
 * Created by AltonjiC on 7/23/15.
 */
var mongoose = require('mongoose');
var async = require("async");
var PendingBotMessage = mongoose.model('PendingBotMessage');
var messageService = require('./messageService');
var Message = mongoose.model('Message');

module.exports = {
    add: function(bot_id, body, callback) {
        messageService.add(body, function(doc) {
            if (!doc) {
                callback(false);
            } else {
                var pendingBotMessage = new PendingBotMessage({bot_id : bot_id, message : doc});
                pendingBotMessage.save(function(err, doc2) {
                    if (err) {
                        console.log("there was an error in saving this incoming message: " + err);
                        callback(false);
                    } else {
                        callback(doc2);
                    }
                });
            }
        });
    },
    getAllMessagesForId: function(bot_id, callback) {
        PendingBotMessage.find({bot_id : bot_id}, function(err, pendingBotMessages) {
            if (err) {
                callback(false);
            } else {
                var messages = [];
                // 1st para in async.each() is the array of items
                async.each(pendingBotMessages,
                    // 2nd param is the function that each item is passed to
                    function(item, asyncCallback){
                        // Call an asynchronous function, often a save() to DB
                        messageService.get(pendingBotMessage.message, function(anotherMessage) {
                            if (anotherMessage) {
                                messages.push(anotherMessage);
                            }
                            asyncCallback();
                        });
                    },
                    // 3rd param is the function to call when everything's done
                    function(err){
                        // All tasks are done now
                        console.log(messages);
                        callback(messages);
                    }
                );
            }
        });
    }
}