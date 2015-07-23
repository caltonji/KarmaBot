/**
 * Created by AltonjiC on 7/11/15.
 */
/*
    TODO: instantiate group data like members and create internal functions
    for acessing that data that belong to the bot.  All data should go in
    mongo but methods for accessing them are here even though most of there functionality
    is actually in the services and elsewhere
 */
var Bot = function (botId) {
    console.log("new bot!");
    this.bot_id = botId;
};

Bot.prototype.botCreated = function() {
    this.send("hey, I'm your new Default bot! You can call me " + this.bot_id);
};

Bot.prototype.receive = function(body) {
    this.send(body.text);
};


Bot.prototype.send = function (message) {
    var botResponse, options, body, botReq, botId;

    var HTTPS = require('https');

    botResponse = message;
    botId = this.bot_id;

    options = {
        hostname: 'api.groupme.com',
        path: '/v3/bots/post',
        method: 'POST'
    };

    body = {
        "bot_id": botId,
        "text": botResponse
    };

    console.log('sending ' + botResponse + ' to ' + botId);

    botReq = HTTPS.request(options, function (res) {
        if (res.statusCode == 202) {
            //neat
        } else {
            console.log('rejecting bad status code ' + res.statusCode);
        }
    });

    botReq.on('error', function (err) {
        console.log('error posting message ' + JSON.stringify(err));
    });
    botReq.on('timeout', function (err) {
        console.log('timeout posting message ' + JSON.stringify(err));
    });
    botReq.end(JSON.stringify(body));
};

module.exports = Bot;