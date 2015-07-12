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
    }
});

router.post('/a/:bot_id', function(req, res, next) {
    var bot_id = req.params.bot_id;
    var ThisBot = require(bot_path);
    var thisBot = new ThisBot(bot_id);


    thisBot.botCreated();
});


module.exports = router;

