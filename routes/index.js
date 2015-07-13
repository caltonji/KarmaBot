var express = require('express');
var router = express.Router();

var botService = require('../services/botService.js');
var applicationService = require('../services/applicationService.js');
var bot_path = '../public/javascripts/bot.js';

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({home: "of the brave"});
});

router.post('/m/:bot_id', function(req, res, next) {
    if (req.body.sender_type != 'bot') {
        var bot_id = req.params.bot_id;
//        botService.getApplication(bot_id, function(application) {
//            var ThisBot = require(application.bot_path);
//            var thisBot = new ThisBot(bot_id);
//
//            thisBot.receive(req.body);
//        });
        var ThisBot = require(bot_path);
        var thisBot = new ThisBot(bot_id);

        thisBot.receive(req.body);

        res.json({home: "of the m" + bot_id});
    }
});

router.get('/a/:bot_id', function(req, res, next) {
    var bot_id = req.params.bot_id;
    console.log("bot_id: " + bot_id);
    console.log("bot_path: " + bot_path);
    var ThisBot = require(bot_path);
    console.log("ThisBot: " + ThisBot);
    var thisBot = new ThisBot(bot_id);
    console.log("thisBot: " + thisBot);

    thisBot.botCreated();
    res.json({home: "of the a: " + bot_id});
});


module.exports = router;

