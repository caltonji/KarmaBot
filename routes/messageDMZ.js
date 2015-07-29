/**
 * Created by AltonjiC on 7/23/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Messsage = mongoose.model('Message');

var botService = require('../services/botService.js');
var pendingBotMessageService = require('../services/pendingBotMessageService.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({Home: "of the messageDMZ"});
});

router.post('/m/:bot_id', function(req, res, next) {
    if (req.body.sender_type != 'bot') {
        var bot_id = req.params.bot_id;
        pendingBotMessageService.add(bot_id, req.body, function (savedDoc) {
            if (savedDoc) {
                res.json(savedDoc);
            } else {
                console.log("mesasge not added");
                res.json({error : "message not added"});
            }
        });
    }
});


router.get('/messages/:bot_id', function(req, res, next) {
    var bot_id = req.params.bot_id;
    pendingBotMessageService.getAllMessagesForId(bot_id, function(messages) {
        res.json({messages: messages});
    });
});


module.exports = router;

