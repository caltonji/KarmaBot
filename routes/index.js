var express = require('express');
var router = express.Router();

var botService = require('../services/botService.js');
var applicationService = require('../services/applicationService.js');
var mongoose = require('mongoose');

var Bot = mongoose.model('Bot');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({home: "of the brave"});
});

router.post('/m/:bot_id', function(req, res, next) {
    if (req.body.sender_type != 'bot') {
        var bot_id = req.params.bot_id;
        console.log("received: " + bot_id);
        botService.getApplication(bot_id, function(application) {
            console.log("checking for everything: ");
            console.log(application);
            var ThisBot = require(application.bot_path);
            var thisBot = new ThisBot(bot_id);
            thisBot.receive(req.body);
        });
    }
});

router.get('/new_boring_bot/:bot_id', function(req, res, next) {
    var bot_id = req.params.bot_id;
    applicationService.getByName("BoringBot", function (application) {
        botService.add(bot_id, application, function(added) {
            if (added) {
                res.json({home: "of the BoringBot: " + bot_id});
            } else {
                res.json({error: "yeah something went wrong"});
            }
        });

    });

});


module.exports = router;

