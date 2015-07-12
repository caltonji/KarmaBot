///**
// * Created by AltonjiC on 6/21/15.
// */
//var Bot = require('bot.js');
//
//var karmaUserService = require('../../services/karmaUserService.js');
//var botId = null;
//
//
//
//
//module.exports = {
//    receive: function (body, bot_id, util) {
//        botId = bot_id;
//        if (req.body.attachments) {
//            console.log(req.body);
//            var message = req.body.text;
//            req.body.attachments.forEach(function(attachment) {
//                if (attachment.type == "mentions") {
//                    var i;
//                    for (i = 0; i < attachment.user_ids.length; i++) {
//                        var user_id = attachment.user_ids[i];
//                        var loc = attachment.loci[i];
//                        checkMentionForKarmaChange(message, user_id, loc, body);
//                    }
//                }
//            });
//        }
//    },
//    botCreated: function(util) {
//        util.send("I've been created");
//    }
//};
//
//var checkMentionForKarmaChange = function(message, user_id, loc, body) {
//    var name = message.substring(loc[0], loc[0] + loc[1]);
//    console.log("mentions " + user_id + " or " + name + "  at " + loc);
//    var j;
//    // start after the last letter in mention and parse for increment or decrement
//    for (j = (loc[0] + loc[1]); j < message.length; j++) {
//        var c = message[j];
//        if (c == '+') {
//            if ((j + 1) < message.length) {
//                var nextc = message[j + 1];
//                if (nextc == '+') {
//                    console.log("add");
//                    changeKarma(user_id, name, 1, body)
//                    return;
//                }
//            }
//        } else if (c == '-') {
//            if ((j + 1) < message.length) {
//                var nextc = message[j + 1];
//                if (nextc == '-') {
//                    changeKarma(user_id, name, -1, body)
//                    return;
//                }
//            }
//        } else {
//            var patt = /\s/g;
//            if (!patt.test(c)) {
//                console.log("something else");
//                return;
//            }
//        }
//    }
//    console.log("nothing");
//};
//
//var changeKarma = function(user_id, name, diff, body) {
//    karmaUserService.updateKarma(user_id,body,)
//}