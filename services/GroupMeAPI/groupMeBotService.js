/**
 * Created by AltonjiC on 7/29/15.
 */
var https = require('https');


var botEndpoint = "http://altonji.com:8081/m";
var groupMeApiBase = "api.groupme.com";
var botService = require('../botService.js');
var service = {};

var createBot = function (app, group_id, token, callback) {
    var postData = JSON.stringify({
        "bot": {
            "name": app.name,
            "group_id": group_id
        }
    });

    var options = {
        hostname: groupMeApiBase,
        port: 443,
        path: '/v3/bots?token=' + token,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    console.log(options);
    var req = https.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        var str = '';
        //another chunk of data has been recieved, so append it to `str`
        res.on('data', function (chunk) {
            str += chunk;
        });
        //the whole response has been recieved
        res.on('end', function () {
            var botInfo = JSON.parse(str).response;
            updateBotCallbackUrl(botInfo, token, function (newBotInfo) {
                if (newBotInfo) {
                    callback(newBotInfo);
                } else {
                    callback(null);
                }
            });
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(postData);
    req.end();
}

var checkBotCallbackUpdated =  function (bot_info, token, callback) {
    var options = {
        hostname: groupMeApiBase,
        port: 443,
        path: '/v3/bots?per_page=100&token=' + token,
        method: 'GET'
    };

    console.log(options);
    var req = https.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        var str = '';
        //another chunk of data has been recieved, so append it to `str`
        res.on('data', function (chunk) {
            str += chunk;
        });
        //the whole response has been recieved, so we just print it out here
        res.on('end', function () {
            var bots = JSON.parse(str).response;
            for (var key in bots) {
                var bot = bots[key];
                if (bot.bot_id === bot_info.bot.bot_id) {
                    if (bot.callback_url === bot_info.bot.callback_url) {
                        callback(true);
                    }
                }
            }
            callback(false);
        });
    });
    req.end();
}

var updateBotCallbackUrl = function (bot_info, token, callback) {

    bot_info.bot['callback_url'] = botEndpoint + '/' + bot_info.bot['bot_id'];
    var postData = JSON.stringify(bot_info);

    var options = {
        hostname: groupMeApiBase,
        port: 443,
        path: '/v3/bots/' + bot_info.bot['bot_id'] + '?token=' + token,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    console.log(options);
    var req = https.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        var str = '';
        //another chunk of data has been recieved, so append it to `str`
        res.on('data', function (chunk) {
            str += chunk;
        });
        //the whole response has been recieved, should not exist
        res.on('end', function () {
            checkBotCallbackUpdated(bot_info, token, function (success) {
                if (success) {
                    callback(bot_info);
                } else {
                    callback(false);
                }
            });
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        callback(false);
    });

    // write data to request body
    req.write(postData);
    req.end();
}

module.exports = {createBot : createBot};