/**
 * Created by AltonjiC on 7/20/15.
 */
var express = require('express');
var http = require('http');
var https = require('https');
var jQuery = require('jquery');

var botEndpoint = "http://altonji.com/:8081/m"
var groupMeApiBase = "api.groupme.com";
var botService = require('../services/botService.js');
var applicationService = require('../services/applicationService.js');


var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.query.access_token) {
        var options = {
            hostname: groupMeApiBase,
            port: 443,
            path: '/v3/groups?per_page=100&token=' + req.query.access_token,
            method: 'GET'
        };

        var groupsReq = https.request(options, function(groupsRes) {
            console.log('STATUS: ' + groupsRes.statusCode);
            console.log('HEADERS: ' + JSON.stringify(groupsRes.headers));

            var str = '';
            //another chunk of data has been recieved, so append it to `str`
            groupsRes.on('data', function (chunk) {
                str += chunk;
            });
            //the whole response has been recieved, so we just print it out here
            groupsRes.on('end', function () {
                var groups = JSON.parse(str).response;
                var groupJson = {};
                for (var key in groups) {
                    var group = groups[key];
                    groupJson[group.group_id] = group.name;
                }
                console.log(groups);
                applicationService.getAllNames(function(app_names) {
                    console.log(app_names);
                    res.render('../views/add', {"groups" : groups, "app_names" : app_names, "token" : req.query.access_token});
                });
            });
        })
        groupsReq.end();

        groupsReq.on('error', function(e) {
            console.error(e);
        });
    }
});

router.post('/bot', function(req, res, next) {
    if (req.body.app_name && req.body.group_id) {
        var app_name = req.body.app_name;
        var group_id = req.body.group_id;
        var token = req.body.token;

        applicationService.getByName(app_name, function(app) {
            botService.checkForBot(app, group_id, function(existingBot) {
                if (existingBot) {
                    if (typeof existingBot === Object) {
                        console.log("existing bot: " + existingBot);
                        //this bot already exists
                        //TODO: Handle this by making sure that bot still exists in groupme
                    } else {
                        //error
                        console.log("error of some type");
                    }
                } else {
                    //bot is not yet in database, add one
                    createBot(app, group_id, token, function(info) {
                        if (info) {
                            console.log("success!");
                            console.log(info);
                            botService.add(info.bot.bot_id, info.bot.group_id, app, function(success) {
                                if (success) {
                                    console.log("added bot: " + info.bot.bot_id + " to db.");
                                    var ThisBot = require(app.bot_path);
                                    var thisBot = new ThisBot(info.bot.bot_id);

                                    thisBot.botCreated();
                                } else {
                                    console.log("failed to add bot to db.");
                                    //TODO: delete this bot from groupme and handle error
                                }
                            });
                        }
                    });
                }
            })
        });
    }

});

var createBot = function(app, group_id, token, callback) {

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

var checkBotCallbackUpdated = function(bot_info, token, callback) {
    var options = {
        hostname: groupMeApiBase,
        port: 443,
        path: '/v3/bots?per_page=100&token=' + token,
        method: 'GET'
    };

    console.log(options);
    var req = https.request(options, function(res) {
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
    })
    req.end();
}

var updateBotCallbackUrl = function(bot_info, token, callback) {

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
            checkBotCallbackUpdated(bot_info, token, function(success) {
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


module.exports = router;